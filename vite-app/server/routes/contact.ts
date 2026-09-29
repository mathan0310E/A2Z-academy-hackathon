import { Router, type Request, type Response } from "express";
import { contactSchema, type ContactFormData } from "../../src/lib/validations";
import { logContactEmail, saveContactMessage } from "../lib/contact";
import { sendEmail } from "../lib/nodemailer";
import {
  buildContactAcknowledgementEmail,
  buildContactNotificationEmail,
} from "../lib/email-templates";
import { randomUUID } from "node:crypto";

const router = Router();

/** Human-readable reference for a contact message: MSG-2026-A1B2C3. */
function buildReferenceId(): string {
  const year = new Date().getFullYear();
  const suffix = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `MSG-${year}-${suffix}`;
}

router.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "A2Z Academy Contact API" });
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // ---- 1. Validate with Zod (server-side) ----
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, error: "Validation failed", issues: parsed.error.errors });
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
    } catch (dbError) {
      console.error("Failed to store contact message:", dbError);
    }

    if (!stored && !organizerNotified) {
      return res.status(500).json({
        success: false,
        referenceId,
        error: `We could not record your message right now. Please email ${
          process.env.SMTP_USER || "hello@a2zacademy.co.in"
        } directly.`,
      });
    }

    return res.json({
      success: true,
      referenceId,
      stored,
      organizerNotified,
      acknowledgementSent: acknowledgementResult.success,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return res
      .status(500)
      .json({ success: false, error: "An unexpected error occurred. Please try again." });
  }
});

export default router;
