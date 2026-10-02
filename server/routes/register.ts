import { Router, type Request, type Response } from "express";
import { registrationSchema, type RegistrationFormData } from "../../src/lib/validations";
import {
  generateRegistrationId,
  checkDuplicateRegistration,
  saveRegistration,
  saveEmailLog,
} from "../lib/registration";
import { sendEmail } from "../lib/nodemailer";
import { rateLimit } from "../lib/rate-limit";
import { requireCaptcha } from "../lib/captcha";
import {
  buildLeaderConfirmationEmail,
  buildMemberConfirmationEmail,
  buildOrganizerNotificationEmail,
} from "../lib/email-templates";
import { randomUUID } from "node:crypto";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "A2Z Academy Registration API" });
});

router.post(
  "/",
  // Abuse control: a scripted client could otherwise register unlimited teams,
  // each sending several emails through our SMTP account.
  rateLimit({ scope: "register", max: 5, windowMs: 60_000 }),
  requireCaptcha(),
  async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // ---- 1. Validate with Zod (server-side) ----
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        issues: result.error.errors,
      });
    }

    const data: RegistrationFormData = result.data;

    // ---- 2. Normalize (ensure leader is set) ----
    let normalizedMembers = data.members.map((m) => ({
      memberId: m.memberId || randomUUID(),
      name: m.name.trim(),
      phone: m.phone.trim(),
      email: m.email.trim().toLowerCase(),
      college: m.college.trim(),
      department: m.department.trim(),
      year: m.year.trim(),
      isLeader: m.email.trim().toLowerCase() === data.leaderMemberId || m.memberId === data.leaderMemberId,
    }));

    const leaderIdx = normalizedMembers.findIndex(
      (m) => m.memberId === data.leaderMemberId || m.isLeader
    );
    if (leaderIdx < 0) {
      return res.status(400).json({ success: false, error: "Invalid team leader selection" });
    }

    normalizedMembers = normalizedMembers.map((m, idx) => ({ ...m, isLeader: idx === leaderIdx }));

    const leader = normalizedMembers[leaderIdx];

    // ---- 3. Check for duplicates ----
    const duplicate = await checkDuplicateRegistration(
      data.teamName,
      leader.email,
      data.members.map((m) => m.email)
    );
    if (duplicate.isDuplicate) {
      return res.status(409).json({ success: false, error: duplicate.reason });
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
    } catch (dbError) {
      console.error("Failed to save registration:", dbError);
      return res
        .status(500)
        .json({ success: false, error: "Failed to save registration. Please try again." });
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

    // Email delivery is best-effort. A transport failure — and equally a failure
    // while writing the audit log — must never turn an already-saved
    // registration into a 500 response.
    const deliver = async (
      recipient: string,
      type: string,
      recipientType: "leader" | "member" | "organizer",
      mail: { subject: string; html: string; text?: string }
    ) => {
      const result = await sendEmail({ to: recipient, ...mail });
      emailResults.push({
        recipient,
        type,
        status: result.success ? "sent" : "failed",
        error: result.error,
      });
      try {
        await saveEmailLog({
          registrationId,
          recipient,
          recipientType,
          emailType: type,
          status: result.success ? "sent" : "failed",
          errorMessage: result.error,
          attemptedAt: now,
          sentAt: result.success ? now : undefined,
        });
      } catch (logError) {
        console.warn("Email log write failed:", logError);
      }
    };

    // a) Team leader email
    const leaderEmail = buildLeaderConfirmationEmail(emailData);
    await deliver(leader.email, "leader_confirmation", "leader", leaderEmail);

    // b) Team member emails (excluding leader)
    for (const member of normalizedMembers) {
      if (member.email === leader.email) continue;
      const memberEmail = buildMemberConfirmationEmail({ ...emailData, memberName: member.name });
      await deliver(member.email, "member_confirmation", "member", memberEmail);
    }

    // c) Organizer notification
    if (adminEmail) {
      const orgEmail = buildOrganizerNotificationEmail(emailData);
      await deliver(adminEmail, "organizer_notification", "organizer", orgEmail);
    }

    // ---- 7. Return success (registration is successful regardless of email failures) ----
    return res.json({
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
  } catch (error) {
    console.error("Registration API error:", error);
    return res
      .status(500)
      .json({ success: false, error: "An unexpected error occurred. Please try again." });
  }
});

export default router;
