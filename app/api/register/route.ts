import { NextRequest, NextResponse } from "next/server";
import { registrationSchema, RegistrationFormData } from "@/lib/validations";
import { generateRegistrationId, checkDuplicateRegistration, saveRegistration, saveEmailLog } from "@/lib/registration";
import { sendEmail } from "@/lib/nodemailer";
import {
  buildLeaderConfirmationEmail,
  buildMemberConfirmationEmail,
  buildOrganizerNotificationEmail,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ---- 1. Validate with Zod (server-side) ----
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: result.error.errors },
        { status: 400 }
      );
    }

    const data: RegistrationFormData = result.data;

    // ---- 2. Normalize (ensure leader is set) ----
    let normalizedMembers = data.members.map((m) => ({
      memberId: m.memberId || crypto.randomUUID(),
      name: m.name.trim(),
      phone: m.phone.trim(),
      email: m.email.trim().toLowerCase(),
      college: m.college.trim(),
      department: m.department.trim(),
      year: m.year.trim(),
      isLeader: m.email.trim().toLowerCase() === data.leaderMemberId || m.memberId === data.leaderMemberId,
    }));

    // The leaderMemberId from the client points to a member; ensure exactly one leader
    const leaderIdx = normalizedMembers.findIndex(
      (m) => m.memberId === data.leaderMemberId || m.isLeader
    );
    if (leaderIdx < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid team leader selection" },
        { status: 400 }
      );
    }

    // Set leader flags
    normalizedMembers = normalizedMembers.map((m, idx) => ({
      ...m,
      isLeader: idx === leaderIdx,
    }));

    const leader = normalizedMembers[leaderIdx];

    // ---- 3. Check for duplicates ----
    const duplicate = await checkDuplicateRegistration(
      data.teamName,
      leader.email,
      data.members.map((m) => m.email)
    );
    if (duplicate.isDuplicate) {
      return NextResponse.json(
        { success: false, error: duplicate.reason },
        { status: 409 }
      );
    }

    // ---- 4. Generate registration ID ----
    const registrationId = await generateRegistrationId();

    const now = new Date().toISOString();

    const registrationRecord = {
      registrationId,
      teamName: data.teamName.trim(),
      teamType: data.teamType,
      leaderMemberId: leader.memberId,
      leaderName: leader.name,
      leaderEmail: leader.email,
      status: "REGISTERED",
      createdAt: now,
      members: normalizedMembers,
    };

    // ---- 5. Save registration to Firestore FIRST ----
    try {
      await saveRegistration(registrationRecord);
        } catch (dbError: any) {
      console.error("Failed to save registration:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to save registration. Please try again." },
        { status: 500 }
      );
    }

    // ---- 6. Send emails (failures do NOT invalidate registration) ----
    const emailResults: { recipient: string; type: string; status: string; error?: string }[] = [];

    const emailData = {
      registrationId,
      teamName: data.teamName.trim(),
      teamType: data.teamType,
      leaderName: leader.name,
      leaderEmail: leader.email,
      members: normalizedMembers,
      createdAt: now,
    };

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn("ADMIN_EMAIL not configured — organizer notification skipped");
    }

    // a) Team leader email
    const leaderEmail = buildLeaderConfirmationEmail(emailData);
    const leaderResult = await sendEmail({ to: leader.email, subject: leaderEmail.subject, html: leaderEmail.html, text: leaderEmail.text });
    emailResults.push({ recipient: leader.email, type: "leader_confirmation", status: leaderResult.success ? "sent" : "failed", error: leaderResult.error });
    await saveEmailLog({
      registrationId, recipient: leader.email, recipientType: "leader",
      emailType: "leader_confirmation", status: leaderResult.success ? "sent" : "failed",
      errorMessage: leaderResult.error, attemptedAt: now, sentAt: leaderResult.success ? now : undefined,
    });

    // b) Team member emails (excluding leader)
    for (const member of normalizedMembers) {
      if (member.email === leader.email) continue;
      const memberEmail = buildMemberConfirmationEmail({ ...emailData, memberName: member.name });
      const memberResult = await sendEmail({
        to: member.email, subject: memberEmail.subject, html: memberEmail.html, text: memberEmail.text,
      });
      emailResults.push({ recipient: member.email, type: "member_confirmation", status: memberResult.success ? "sent" : "failed", error: memberResult.error });
      await saveEmailLog({
        registrationId, recipient: member.email, recipientType: "member",
        emailType: "member_confirmation", status: memberResult.success ? "sent" : "failed",
        errorMessage: memberResult.error, attemptedAt: now, sentAt: memberResult.success ? now : undefined,
      });
    }

    // c) Organizer notification
    if (adminEmail) {
      const orgEmail = buildOrganizerNotificationEmail(emailData);
      const orgResult = await sendEmail({
        to: adminEmail, subject: orgEmail.subject, html: orgEmail.html, text: orgEmail.text,
      });
      emailResults.push({ recipient: adminEmail, type: "organizer_notification", status: orgResult.success ? "sent" : "failed", error: orgResult.error });
      await saveEmailLog({
        registrationId, recipient: adminEmail, recipientType: "organizer",
        emailType: "organizer_notification", status: orgResult.success ? "sent" : "failed",
        errorMessage: orgResult.error, attemptedAt: now, sentAt: orgResult.success ? now : undefined,
      });
    }

    // ---- 7. Return success (registration is successful regardless of email failures) ----
    return NextResponse.json({
      success: true,
      registrationId,
      teamName: data.teamName,
      teamType: data.teamType,
      memberCount: normalizedMembers.length,
      leaderName: leader.name,
      leaderEmail: leader.email,
      status: "REGISTERED",
      emailResults,
    });
  } catch (error: any) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "A2Z Academy Registration API" });
}

