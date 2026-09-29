import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** Reply-To header — used by the contact form so replies reach the sender. */
  replyTo?: string;
}

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
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
  } catch (error: any) {
    console.error("Email sending failed:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Unknown email error",
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
