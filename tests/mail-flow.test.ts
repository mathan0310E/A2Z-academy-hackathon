/**
 * Mail-flow contract tests.
 *
 * These exercise the real template builders and the real `sendEmail` transport
 * wrapper — no mocks of the modules under test. The SMTP connection is pointed
 * at a closed port so the transport fails fast, which is exactly the failure
 * mode the registration route is required to survive.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLeaderConfirmationEmail } from "../server/lib/email-templates";
import { sendEmail } from "../server/lib/nodemailer";

const REG = {
  registrationId: "A2Z-2025-ABC123",
  teamName: "Team <script>alert(1)</script>",
  teamType: "DUO",
  leaderName: "Ada \"The Lead\" Lovelace",
  leaderEmail: "ada@example.com",
  members: [
    {
      name: "Ada \"The Lead\" Lovelace",
      email: "ada@example.com",
      phone: "+91 90000 00001",
      college: "Govt College",
      department: "CSE",
      year: "3",
      isLeader: true,
    },
    {
      name: "Grace Hopper",
      email: "grace@example.com",
      phone: "+91 90000 00002",
      college: "Govt College",
      department: "IT",
      year: "2",
      isLeader: false,
    },
  ],
  createdAt: new Date("2025-01-01T00:00:00.000Z").toISOString(),
};

test("leader confirmation escapes user-supplied HTML", () => {
  const { html, subject, text } = buildLeaderConfirmationEmail(REG);

  assert.ok(!html.includes("<script>"), "raw <script> must not survive into the email HTML");
  assert.ok(html.includes("&lt;script&gt;"), "the payload should appear escaped instead");
  // The leader's name contains quotes and must be escaped, not injected.
  assert.ok(!html.includes('Ada "The Lead" Lovelace'));
  assert.ok(subject.includes(REG.registrationId), "subject should carry the registration ID");
  assert.ok(text.length > 0, "a plain-text alternative must be provided");
});

test("sendEmail reports failure without throwing when SMTP is unreachable", async () => {
  process.env.SMTP_HOST = "127.0.0.1";
  process.env.SMTP_PORT = "1"; // closed port → immediate connection refusal
  process.env.SMTP_SECURE = "false";
  process.env.SMTP_USER = "test@example.com";
  process.env.SMTP_PASSWORD = "not-a-real-password";

  const mail = buildLeaderConfirmationEmail(REG);
  const result = await sendEmail({ to: REG.leaderEmail, ...mail });

  assert.equal(result.success, false, "an unreachable SMTP host must yield success:false");
  assert.ok(result.error, "the failure reason should be surfaced for the email log");
});
