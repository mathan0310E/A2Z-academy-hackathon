import type { Registration } from "@/types";
import { getTeamTypeLabel } from "@/types";
import { escapeHtml } from "@/lib/nodemailer";

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "#";

function whatsappButton(url: string) {
  return `
    <div style="text-align:center; margin: 32px 0;">
      <a href="${escapeHtml(url)}" 
         style="display:inline-flex; align-items:center; gap:8px; 
                background:linear-gradient(135deg, #06b6d4, #3b82f6); 
                color:#ffffff; 
                padding:14px 28px; 
                border-radius:8px; 
                text-decoration:none; 
                font-weight:600; 
                font-size:16px;
                box-shadow:0 4px 14px rgba(6,172,212,0.3);">
        JOIN OFFICIAL WHATSAPP GROUP →
      </a>
    </div>
  `;
}

type MemberInfo = {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  isLeader: boolean;
};

type RegEmailData = {
  registrationId: string;
  teamName: string;
  teamType: string;
  leaderName: string;
  leaderEmail: string;
  members: MemberInfo[];
  createdAt: string;
  memberName?: string;
};

function buildMemberInfoRows(members: MemberInfo[]): string {
  return members
    .map(
      (m) => `
      <tr>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${escapeHtml(m.name)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${escapeHtml(m.email)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${escapeHtml(m.phone)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${escapeHtml(m.college)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${escapeHtml(m.department)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${escapeHtml(m.year)}</td>
      </tr>`
    )
    .join("");
}

export function buildLeaderConfirmationEmail(reg: RegEmailData): { subject: string; html: string; text: string } {
  const membersRows = buildMemberInfoRows(reg.members);
  const teamTypeLabel = getTeamTypeLabel(reg.teamType as any);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hackathon Registration Confirmation</title>
</head>
<body style="margin:0; padding:0; background:#0a0f24; font-family:'Inter', system-ui, sans-serif; color:#e2e8f0;">
  <div style="max-width:640px; margin:0 auto; padding:40px 20px;">
    <div style="background:rgba(15,23,42,0.7); border-radius:16px; padding:40px; border:1px solid rgba(255,255,255,0.08);">
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="color:#ffffff; font-size:28px; margin:0;">A2Z Academy</h1>
        <p style="color:#06b6d4; font-size:14px; margin:4px 0 0; letter-spacing:1px;">Tech-Based Hackathon</p>
      </div>
      
      <h2 style="color:#ffffff; font-size:22px; margin:0 0 16px;">Registration Confirmation</h2>
      
      <p style="color:#cbd5e1; font-size:16px; line-height:1.6; margin:0 0 8px;">Dear ${escapeHtml(reg.leaderName)},</p>
      
      <p style="color:#cbd5e1; font-size:16px; line-height:1.6; margin:0 0 24px;">
        Your team has successfully registered for the 
        <strong style="color:#3b82f6;">A2Z Academy Tech-Based Hackathon</strong>.
      </p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr>
          <td style="padding:12px; border-bottom:1px solid #1e293b;"><strong style="color:#06b6d4;">Registration ID:</strong></td>
          <td style="padding:12px; border-bottom:1px solid #1e293b; color:#ffffff;">${escapeHtml(reg.registrationId)}</td>
        </tr>
        <tr>
          <td style="padding:12px; border-bottom:1px solid #1e293b;"><strong style="color:#06b6d4;">Team Name:</strong></td>
          <td style="padding:12px; border-bottom:1px solid #1e293b; color:#ffffff;">${escapeHtml(reg.teamName)}</td>
        </tr>
        <tr>
          <td style="padding:12px;"><strong style="color:#06b6d4;">Team Type:</strong></td>
          <td style="padding:12px; color:#ffffff;">${escapeHtml(teamTypeLabel)}</td>
        </tr>
      </table>

      <h3 style="color:#ffffff; font-size:16px; margin:0 0 12px;">Team Members</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:8px; font-size:14px;">
        <thead>
          <tr>
            <th style="padding:10px; text-align:left; color:#94a3b8; border-bottom:1px solid #1e293b;">Name</th>
            <th style="padding:10px; text-align:left; color:#94a3b8; border-bottom:1px solid #1e293b;">Email</th>
            <th style="padding:10px; text-align:left; color:#94a3b8; border-bottom:1px solid #1e293b;">Phone</th>
            <th style="padding:10px; text-align:left; color:#94a3b8; border-bottom:1px solid #1e293b;">College</th>
            <th style="padding:10px; text-align:left; color:#94a3b8; border-bottom:1px solid #e2e8f8;">Department</th>
            <th style="padding:10px; text-align:left; color:#94a3b8; border-bottom:1px solid #1e293b;">Year</th>
          </tr>
        </thead>
        <tbody>${membersRows}</tbody>
      </table>

      <div style="background:rgba(6,172,212,0.1); border:1px solid rgba(6,172,212,0.3); border-radius:8px; padding:16px; margin:24px 0;">
        <p style="margin:0; color:#ffffff; font-weight:600; font-size:14px;">
          &#9888; Save your Registration ID (${escapeHtml(reg.registrationId)}) for future communication.
        </p>
      </div>

      <p style="color:#cbd5e1; font-size:14px; line-height:1.6; margin:0 0 12px;">
        All Round 1, Round 2, and Round 3 dates, timings, instructions, 
        shortlisting announcements, and further updates will be communicated 
        exclusively through the official WhatsApp group.
      </p>

      ${whatsappButton(WHATSAPP_URL)}

      <p style="color:#94a3b8; font-size:12px; text-align:center; margin-top:32px;">
        A2Z Academy — Empowering Institutes with Tech-Based Training
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `
A2Z Academy Tech-Based Hackathon — Registration Confirmation

Dear ${reg.leaderName},

Your team has successfully registered for the A2Z Academy Tech-Based Hackathon.

Registration ID: ${reg.registrationId}
Team Name: ${reg.teamName}
Team Type: ${teamTypeLabel}

Team Members:
${reg.members.map((m) => `- ${m.name} (${m.email}) — ${m.college}, ${m.department}, ${m.year}`).join("\n")}

⚠️ Save your Registration ID: ${reg.registrationId}

All further hackathon updates will be communicated through the official WhatsApp group.
JOIN: ${WHATSAPP_URL}

Regards,
A2Z Academy
Empowering Institutes with Tech-Based Training
`;

    return {
    subject: `A2Z Academy Hackathon — Registration Confirmation | ${reg.registrationId}`,
    html,
    text,
  };
}

export function buildMemberConfirmationEmail(reg: RegEmailData): { subject: string; html: string; text: string } {
  const teamTypeLabel = getTeamTypeLabel(reg.teamType as any);
  const memberName = reg.memberName || reg.members[1]?.name || "";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Registration Confirmed</title>
</head>
<body style="margin:0; padding:0; background:#0a0f24; font-family:'Inter', system-ui, sans-serif; color:#e2e8f0;">
  <div style="max-width:640px; margin:0 auto; padding:40px 20px;">
    <div style="background:rgba(15,23,42,0.7); border-radius:16px; padding:40px; border:1px solid rgba(255,255,255,0.08);">
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="color:#ffffff; font-size:28px; margin:0;">A2Z Academy</h1>
        <p style="color:#06b6d4; font-size:14px; margin:4px 0 0; letter-spacing:1px;">Tech-Based Hackathon</p>
      </div>
      <h2 style="color:#ffffff; font-size:22px; margin:0 0 16px;">Team Registration Confirmed</h2>
      <p style="color:#cbd5e1; font-size:16px; line-height:1.6; margin:0 0 8px;">Hi ${escapeHtml(memberName)},</p>
      <p style="color:#cbd5e1; font-size:16px; line-height:1.6; margin:0 0 24px;">
        Your team has successfully registered for the <strong style="color:#3b82f6;">A2Z Academy Tech-Based Hackathon</strong>.
      </p>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr><td style="padding:12px; border-bottom:1px solid #1e293b;"><strong style="color:#06b6d4;">Registration ID:</strong></td>
        <td style="padding:12px; border-bottom:1px solid #1e293b; color:#ffffff;">${escapeHtml(reg.registrationId)}</td></tr>
        <tr><td style="padding:12px; border-bottom:1px solid #1e293b;"><strong style="color:#06b6d4;">Team Name:</strong></td>
        <td style="padding:12px; border-bottom:1px solid #1e293b; color:#ffffff;">${escapeHtml(reg.teamName)}</td></tr>
        <tr><td style="padding:12px; border-bottom:1px solid #1e293b;"><strong style="color:#06b6d4;">Team Type:</strong></td>
        <td style="padding:12px; border-bottom:1px solid #1e293b; color:#ffffff;">${escapeHtml(teamTypeLabel)}</td></tr>
        <tr><td style="padding:12px; border-bottom:1px solid #1e293b;"><strong style="color:#06b6d4;">Team Leader:</strong></td>
        <td style="padding:12px; border-bottom:1px solid #1e293b; color:#ffffff;">${escapeHtml(reg.leaderName)}</td></tr>
        <tr><td style="padding:12px;"><strong style="color:#06b6d4;">Leader Email:</strong></td>
        <td style="padding:12px; color:#ffffff;">${escapeHtml(reg.leaderEmail)}</td></tr>
      </table>
      <p style="color:#cbd5e1; font-size:16px; line-height:1.6; margin:0 0 24px;">You are registered as a team member.</p>
      <p style="color:#cbd5e1; font-size:14px; line-height:1.6; margin:0 0 12px;">
        All future hackathon updates will be communicated through the official WhatsApp group.
      </p>
      ${whatsappButton(WHATSAPP_URL)}
      <p style="color:#94a3b8; font-size:12px; text-align:center; margin-top:32px;">
        A2Z Academy — Empowering Institutes with Tech-Based Training
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `A2Z Academy Hackathon — Team Registration Confirmed

Hi ${memberName},

Your team has successfully registered for the A2Z Academy Tech-Based Hackathon.

Registration ID: ${reg.registrationId}
Team Name: ${reg.teamName}
Team Type: ${teamTypeLabel}
Team Leader: ${reg.leaderName}
Leader Email: ${reg.leaderEmail}

You are registered as a team member.
All future hackathon updates will be communicated through the official WhatsApp group.
JOIN: ${WHATSAPP_URL}

Regards,
A2Z Academy`;

    return { subject: "A2Z Academy Hackathon — Team Registration Confirmed", html, text };
}

export function buildOrganizerNotificationEmail(reg: RegEmailData): { subject: string; html: string; text: string } {
  const teamTypeLabel = getTeamTypeLabel(reg.teamType as any);
  const membersRows = buildMemberInfoRows(reg.members);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Hackathon Registration</title>
</head>
<body style="margin:0; padding:0; background:#f8fafc; font-family:'Inter', system-ui, sans-serif; color:#334157;">
  <div style="max-width:700px; margin:0 auto; padding:40px 20px;">
    <div style="background:#ffffff; border-radius:12px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      <h1 style="color:#1e293b; font-size:22px; margin:0 0 8px;">New Hackathon Registration</h1>
      <p style="color:#94a3b8; font-size:13px; margin:0 0 24px;">A2Z Academy Tech-Based Hackathon</p>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:14px;">
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Registration ID</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(reg.registrationId)}</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Team Name</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(reg.teamName)}</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Team Type</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(teamTypeLabel)}</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Team Leader</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(reg.leaderName)} (${escapeHtml(reg.leaderEmail)})</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Registration Date</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(new Date(reg.createdAt).toLocaleString())}</td></tr>
      </table>
      <h3 style="color:#1e293b; font-size:15px; margin:0 0 12px;">Team Members</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:14px;">
        <thead><tr>
          <th style="padding:10px; text-align:left; background:#06b6d4; color:#ffffff;">Name</th>
          <th style="padding:10px; text-align:left; background:#06b6d4; color:#ffffff;">Email</th>
          <th style="padding:10px; text-align:left; background:#06b6d4; color:#ffffff;">Phone</th>
          <th style="padding:10px; text-align:left; background:#06b6d4; color:#ffffff;">College</th>
          <th style="padding:10px; text-align:left; background:#06b6d4; color:#ffffff;">Department</th>
          <th style="padding:10px; text-align:left; background:#06b6d4; color:#ffffff;">Year</th>
        </tr></thead>
        <tbody>${membersRows}</tbody>
      </table>
      <p style="color:#94a3b8; font-size:12px; margin:0;">This is an automated notification. View full details in the admin panel.</p>
    </div>
  </div>
</body>
</html>`;

  const text = `New Hackathon Registration — A2Z Academy Tech-Based Hackathon

Registration ID: ${reg.registrationId}
Team Name: ${reg.teamName}
Team Type: ${teamTypeLabel}
Team Leader: ${reg.leaderName} (${reg.leaderEmail})
Registration Date: ${new Date(reg.createdAt).toLocaleString()}

Team Members:
${reg.members.map((m) => `- ${m.name} (${m.email}) - ${m.phone}, ${m.college}, ${m.department}, ${m.year}`).join("\n")}`;

  return {
    subject: `New Hackathon Registration | ${reg.registrationId} | ${reg.teamName}`,
    html,
    text,
  };
}

/* ============================ Contact form emails ============================ */

export type ContactEmailData = {
  /** Reference shown to the sender (MSG-YYYY-XXXXXX). */
  referenceId: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  registrationId?: string;
  submittedAt: string;
};

/** Acknowledgement sent to the person who used the contact form. */
export function buildContactAcknowledgementEmail(data: ContactEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const registrationRow = data.registrationId
    ? `<tr><td style="padding:10px; background:#f1f5f9;"><strong>Registration ID</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(data.registrationId)}</td></tr>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>We received your message</title>
</head>
<body style="margin:0; padding:0; background:#f8fafc; font-family:'Inter', system-ui, sans-serif; color:#334157;">
  <div style="max-width:640px; margin:0 auto; padding:40px 20px;">
    <div style="background:#ffffff; border-radius:12px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      <h1 style="color:#1e293b; font-size:22px; margin:0 0 8px;">We received your message</h1>
      <p style="color:#94a3b8; font-size:13px; margin:0 0 24px;">A2Z Academy Tech-Based Hackathon</p>

      <p style="font-size:15px; line-height:1.6;">Hi ${escapeHtml(data.name)},</p>
      <p style="font-size:15px; line-height:1.6;">
        Thanks for reaching out to A2Z Academy. Your message has been recorded and the organising
        team will reply to this email address. Please quote your reference in any follow-up.
      </p>

      <table style="width:100%; border-collapse:collapse; margin:24px 0; font-size:14px;">
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Reference</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(data.referenceId)}</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Topic</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(data.topic)}</td></tr>
        ${registrationRow}
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Submitted</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(new Date(data.submittedAt).toLocaleString())}</td></tr>
      </table>

      <h3 style="color:#1e293b; font-size:15px; margin:0 0 8px;">Your message</h3>
      <p style="font-size:14px; line-height:1.6; white-space:pre-line; background:#f8fafc; border-left:3px solid #06b6d4; padding:12px 16px; margin:0;">
        ${escapeHtml(data.message)}
      </p>

      <p style="font-size:14px; line-height:1.6; margin-top:24px;">
        Reminder: all round instructions, PPT submission details, and shortlisting announcements are
        shared through the official WhatsApp group.
      </p>

      ${whatsappButton(WHATSAPP_URL)}

      <p style="font-size:12px; color:#94a3b8; margin:0;">This is an automated acknowledgement — replies reach the organisers.</p>
    </div>
  </div>
</body>
</html>`;

  const text = `We received your message — A2Z Academy Tech-Based Hackathon

Hi ${data.name},

Thanks for reaching out to A2Z Academy. Your message has been recorded and the organising team
will reply to this email address. Quote your reference in any follow-up.

Reference: ${data.referenceId}
Topic: ${data.topic}${data.registrationId ? `\nRegistration ID: ${data.registrationId}` : ""}
Submitted: ${new Date(data.submittedAt).toLocaleString()}

Your message:
${data.message}

Join the official WhatsApp group for all hackathon updates: ${WHATSAPP_URL}

Regards,
A2Z Academy`;

  return { subject: `We received your message | ${data.referenceId}`, html, text };
}

/** Internal notification sent to the organiser inbox (ADMIN_EMAIL). */
export function buildContactNotificationEmail(data: ContactEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New contact message</title>
</head>
<body style="margin:0; padding:0; background:#f8fafc; font-family:'Inter', system-ui, sans-serif; color:#334157;">
  <div style="max-width:700px; margin:0 auto; padding:40px 20px;">
    <div style="background:#ffffff; border-radius:12px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      <h1 style="color:#1e293b; font-size:22px; margin:0 0 8px;">New contact message</h1>
      <p style="color:#94a3b8; font-size:13px; margin:0 0 24px;">A2Z Academy — public website contact form</p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:14px;">
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Reference</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(data.referenceId)}</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>From</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Topic</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(data.topic)}</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Registration ID</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(data.registrationId || "—")}</td></tr>
        <tr><td style="padding:10px; background:#f1f5f9;"><strong>Submitted</strong></td><td style="padding:10px; border:1px solid #e2e8f0;">${escapeHtml(new Date(data.submittedAt).toLocaleString())}</td></tr>
      </table>

      <h3 style="color:#1e293b; font-size:15px; margin:0 0 8px;">Message</h3>
      <p style="font-size:14px; line-height:1.6; white-space:pre-line; background:#f8fafc; border-left:3px solid #06b6d4; padding:12px 16px; margin:0;">
        ${escapeHtml(data.message)}
      </p>

      <p style="font-size:14px; line-height:1.6; margin-top:24px;">
        Reply directly to this email to answer ${escapeHtml(data.name)} — the Reply-To header points at
        the sender.
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `New contact message — A2Z Academy

Reference: ${data.referenceId}
From: ${data.name} <${data.email}>
Topic: ${data.topic}
Registration ID: ${data.registrationId || "—"}
Submitted: ${new Date(data.submittedAt).toLocaleString()}

Message:
${data.message}`;

  return {
    subject: `Contact | ${data.topic} | ${data.referenceId} | ${data.name}`,
    html,
    text,
  };
}


