import nodemailer, { type Transporter } from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** Reply-To header — used by the contact form so replies reach the sender. */
  replyTo?: string;
}

let cached: Transporter | undefined;

const getTransporter = (): Transporter => {
  if (cached) return cached;
  // A single reused transport keeps one pooled connection instead of opening a
  // fresh TCP+TLS handshake per recipient (a 4-member team sends 6 messages).
  // The timeouts bound how long an unresponsive SMTP host can hold the request.
  cached = nodemailer.createTransport({
    pool: true,
    maxConnections: 3,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return cached;
};

export async function sendEmail({ to, subject, html, text, replyTo }: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || "A2Z Academy <noreply@a2zacademy.co.in>";
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
    });
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // Only the message is surfaced — never SMTP credentials or stack traces.
    console.error("Email sending failed:", (error as Error)?.message || error);
    return {
      success: false,
      error: (error as Error)?.message || "Unknown email error",
    };
  }
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
