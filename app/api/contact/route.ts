import { NextRequest, NextResponse } from "next/server";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { logContactEmail, saveContactMessage } from "@/lib/contact";
import { sendEmail } from "@/lib/nodemailer";
import {
  buildContactAcknowledgementEmail,
  buildContactNotificationEmail,
} from "@/lib/email-templates";

/** Human-readable reference for a contact message: MSG-2026-A1B2C3. */
function buildReferenceId(): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `MSG-${year}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ---- 1. Validate with Zod (server-side) ----
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.errors },
        { status: 400 }
      );
    }

    const data: ContactFormData = parsed.data;
    const referenceId = buildReferenceId();
    const submittedAt = new Date().toISOString();
    const registrationId = data.registrationId?.trim() || undefined;

    const emailData = {
      referenceId,
      name: data.name,
      email: data.email,
      topic: data.topic,
      message: data.message,
      registrationId,
      submittedAt,
    };

    // ---- 2. Notify the organisers (best effort) ----
    const adminEmail = process.env.ADMIN_EMAIL;
    let organizerNotified = false;

    if (adminEmail) {
      const notification = buildContactNotificationEmail(emailData);
      const notificationResult = await sendEmail({
        to: adminEmail,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
        replyTo: data.email,
      });
      organizerNotified = notificationResult.success;

      await logContactEmail({
        contactMessageId: referenceId,
        recipient: adminEmail,
        recipientType: "organizer",
        emailType: "contact_notification",
        status: notificationResult.success ? "sent" : "failed",
        errorMessage: notificationResult.error,
        attemptedAt: submittedAt,
        sentAt: notificationResult.success ? submittedAt : undefined,
      }).catch((logError) =>
        console.warn("Contact email log failed:", logError?.message || logError)
      );
    } else {
      console.warn("ADMIN_EMAIL not configured — contact notification skipped");
    }

    // ---- 3. Acknowledge the sender (best effort) ----
    const acknowledgement = buildContactAcknowledgementEmail(emailData);
    const acknowledgementResult = await sendEmail({
      to: data.email,
      subject: acknowledgement.subject,
      html: acknowledgement.html,
      text: acknowledgement.text,
    });

    await logContactEmail({
      contactMessageId: referenceId,
      recipient: data.email,
      recipientType: "participant",
      emailType: "contact_acknowledgement",
      status: acknowledgementResult.success ? "sent" : "failed",
      errorMessage: acknowledgementResult.error,
      attemptedAt: submittedAt,
      sentAt: acknowledgementResult.success ? submittedAt : undefined,
    }).catch((logError) => console.warn("Contact email log failed:", logError?.message || logError));

    // ---- 4. Persist the message (best effort, but at least one path must succeed) ----
    let stored = false;
    try {
      await saveContactMessage({
        contactMessageId: referenceId,
        name: data.name,
        email: data.email,
        topic: data.topic,
        message: data.message,
        registrationId,
        submittedAt,
        status: "NEW",
        organizerNotified,
      });
      stored = true;
    } catch (dbError: any) {
      console.error("Failed to store contact message:", dbError);
    }

    if (!stored && !organizerNotified) {
      return NextResponse.json(
        {
          success: false,
          referenceId,
          error: `We could not record your message right now. Please email ${process.env.SMTP_USER || "hello@a2zacademy.co.in"} directly.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceId,
      stored,
      organizerNotified,
      acknowledgementSent: acknowledgementResult.success,
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "A2Z Academy Contact API" });
}
