import { getTeamTypeLabel } from "../../src/types";
import { escapeHtml } from "./nodemailer";

const WHATSAPP_URL = process.env.WHATSAPP_GROUP_URL || process.env.VITE_WHATSAPP_GROUP_URL || "#";

/**
 * Shared email chrome, themed to match a2zacademy.co.in: white cards on the
 * brand surface (#f7f7f7), navy ink, green primary, pill buttons and the A2Z
 * logo. Layout is table-based with inline styles, because mail clients strip
 * <style> blocks and support neither flexbox nor CSS variables.
 */

// Brand palette (mirrors the site's design tokens).
const GREEN = "#71bf43";
const GREEN_SOFT = "#eaf6e1";
const GREEN_INK = "#417a1e";
const NAVY = "#1a335a";
const NAVY_DEEP = "#0f2340";
const INK = "#333333";
const INK_STRONG = "#1a1a1a";
const MUTED = "#666666";
const SURFACE = "#f7f7f7";
const BORDER = "#e5e5e5";

/**
 * The mark is referenced over HTTPS from the public site, which is the only
 * host guaranteed to be reachable from a recipient's inbox. Only `logo.jpeg`
 * is served there — the `.png` marks fall through to the SPA shell.
 */
const LOGO_URL = "https://www.a2zacademy.co.in/logo/logo.jpeg";

const FONT_STACK = "'Puvi', 'Zoho Puvi', 'Segoe UI', system-ui, -apple-system, sans-serif";

type ButtonVariant = "primary" | "navy" | "outline";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: `background:${GREEN}; color:${INK_STRONG};`,
  navy: `background:${NAVY}; color:#ffffff;`,
  outline: `background:#ffffff; color:${INK}; border:2px solid ${GREEN};`,
};

/** Pill button. Padding lives on the <a> so the whole shape is clickable. */
function button(href: string, label: string, variant: ButtonVariant = "primary"): string {
  return `<a href="${escapeHtml(href)}"
      style="display:inline-block; ${BUTTON_STYLES[variant]}
             padding:14px 32px; border-radius:9999px; text-decoration:none;
             font-weight:700; font-size:15px;">${label}</a>`;
}

function whatsappButton(url: string): string {
  return `
    <div style="text-align:center; margin: 32px 0;">
      ${button(url, "Join Official WhatsApp Group &rarr;", "primary")}
    </div>
  `;
}

/** Centered logo + wordmark used at the top of every email. */
function brandHeader(tagline: string): string {
  return `
      <div style="text-align:center; padding-bottom:24px; border-bottom:1px solid ${BORDER}; margin-bottom:24px;">
        <img src="${LOGO_URL}" alt="A2Z Academy" width="72" height="72"
             style="display:block; margin:0 auto 12px; width:72px; height:72px;
                    border-radius:14px; border:0; outline:none; text-decoration:none;" />
        <div style="font-size:22px; font-weight:700; color:${NAVY_DEEP}; letter-spacing:-0.2px;">
          <span style="font-weight:400;">A2Z</span> Academy
        </div>
        <div style="font-size:12px; color:${GREEN_INK}; letter-spacing:1.5px;
                    text-transform:uppercase; font-weight:600; margin-top:4px;">
          ${tagline}
        </div>
      </div>
  `;
}

function footer(): string {
  return `
      <div style="text-align:center; margin-top:32px; padding-top:20px; border-top:1px solid ${BORDER};">
        <div style="font-size:12px; color:${MUTED}; line-height:1.6;">
          A2Z Academy &mdash; Empowering Institutes with Tech-Based Training
        </div>
        <div style="font-size:12px; color:${MUTED}; margin-top:6px;">
          <a href="https://www.a2zacademy.co.in" style="color:${GREEN_INK}; text-decoration:none;">www.a2zacademy.co.in</a>
        </div>
      </div>
  `;
}

/**
 * Wraps template body content in the shared chrome. `tagline` replaces the
 * default "Tech-Based Hackathon" line for non-hackathon mail (e.g. contact
 * form messages).
 */
function emailShell(title: string, inner: string, tagline = "Tech-Based Hackathon"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0; padding:0; background:${SURFACE}; font-family:${FONT_STACK}; color:${INK};">
  <div style="max-width:640px; margin:0 auto; padding:32px 16px;">
    <div style="background:#ffffff; border-radius:16px; padding:32px;
                border:1px solid ${BORDER}; box-shadow:0 2px 12px rgba(26,51,90,0.06);">
      ${brandHeader(tagline)}
      ${inner}
      ${footer()}
    </div>
  </div>
</body>
</html>`;
}

/** A two-column label/value row inside a details table. */
function detailRow(label: string, value: string, last = false): string {
  const border = last ? "" : `border-bottom:1px solid ${BORDER};`;
  return `
        <tr>
          <td style="padding:12px 0; ${border} color:${MUTED}; font-size:14px; width:42%;"><strong style="color:${NAVY};">${label}</strong></td>
          <td style="padding:12px 0; ${border} color:${INK_STRONG}; font-size:14px; font-weight:600;">${value}</td>
        </tr>`;
}

function heading(text: string): string {
  return `<h2 style="color:${NAVY_DEEP}; font-size:22px; font-weight:700; margin:0 0 16px;">${text}</h2>`;
}

function paragraph(text: string, margin = "0 0 16px"): string {
  return `<p style="color:${INK}; font-size:15px; line-height:1.6; margin:${margin};">${text}</p>`;
}

/** Highlighted callout, e.g. "save your registration ID". */
function callout(text: string): string {
  return `
      <div style="background:${GREEN_SOFT}; border-left:4px solid ${GREEN};
                  border-radius:10px; padding:14px 16px; margin:24px 0;">
        <p style="margin:0; color:${NAVY_DEEP}; font-weight:600; font-size:14px;">${text}</p>
      </div>`;
}

function memberTable(headers: string[], rows: string, headColor: string): string {
  const head = headers
    .map(
      (h) =>
        `<th style="padding:10px; text-align:left; background:${headColor}; color:#ffffff; font-size:13px;">${h}</th>`
    )
    .join("");
  return `
      <table style="width:100%; border-collapse:collapse; margin-bottom:8px; font-size:13px;">
        <thead><tr>${head}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
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

const MEMBER_HEADERS = ["Name", "Email", "Phone", "College", "Department", "Year"];

function buildMemberInfoRows(members: MemberInfo[]): string {
  return members
    .map(
      (m) => `
      <tr>
        <td style="padding:8px 12px; border-bottom:1px solid ${BORDER};">${escapeHtml(m.name)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid ${BORDER};">${escapeHtml(m.email)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid ${BORDER};">${escapeHtml(m.phone)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid ${BORDER};">${escapeHtml(m.college)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid ${BORDER};">${escapeHtml(m.department)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid ${BORDER};">${escapeHtml(m.year)}</td>
      </tr>`
    )
    .join("");
}

export function buildLeaderConfirmationEmail(reg: RegEmailData): { subject: string; html: string; text: string } {
  const membersRows = buildMemberInfoRows(reg.members);
  const teamTypeLabel = getTeamTypeLabel(reg.teamType as any);

  const html = emailShell(
    "Hackathon Registration Confirmation",
    `
      ${heading("Registration Confirmation")}

      ${paragraph(`Dear ${escapeHtml(reg.leaderName)},`, "0 0 8px")}

      ${paragraph(
        `Your team has successfully registered for the <strong style="color:${GREEN_INK};">A2Z Academy Tech-Based Hackathon</strong>.`
      )}

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        ${detailRow("Registration ID", escapeHtml(reg.registrationId))}
        ${detailRow("Team Name", escapeHtml(reg.teamName))}
        ${detailRow("Team Type", escapeHtml(teamTypeLabel), true)}
      </table>

      <h3 style="color:${NAVY_DEEP}; font-size:16px; margin:0 0 12px;">Team Members</h3>
      ${memberTable(MEMBER_HEADERS, membersRows, NAVY)}

      ${callout(
        `&#9888; Save your Registration ID (${escapeHtml(reg.registrationId)}) for future communication.`
      )}

      ${paragraph(
        `All Round 1, Round 2, and Round 3 dates, timings, instructions,
        shortlisting announcements, and further updates will be communicated
        exclusively through the official WhatsApp group.`,
        "0 0 12px"
      )}

      ${whatsappButton(WHATSAPP_URL)}
    `
  );

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

  const html = emailShell(
    "Team Registration Confirmed",
    `
      ${heading("Team Registration Confirmed")}

      ${paragraph(`Hi ${escapeHtml(memberName)},`, "0 0 8px")}

      ${paragraph(
        `Your team has successfully registered for the <strong style="color:${GREEN_INK};">A2Z Academy Tech-Based Hackathon</strong>.`
      )}

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        ${detailRow("Registration ID", escapeHtml(reg.registrationId))}
        ${detailRow("Team Name", escapeHtml(reg.teamName))}
        ${detailRow("Team Type", escapeHtml(teamTypeLabel))}
        ${detailRow("Team Leader", escapeHtml(reg.leaderName))}
        ${detailRow("Leader Email", escapeHtml(reg.leaderEmail), true)}
      </table>

      ${paragraph("You are registered as a team member.", "0 0 24px")}

      ${paragraph(
        "All future hackathon updates will be communicated through the official WhatsApp group.",
        "0 0 12px"
      )}

      ${whatsappButton(WHATSAPP_URL)}
    `
  );

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

  const html = emailShell(
    "New Hackathon Registration",
    `
      ${heading("New Hackathon Registration")}

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        ${detailRow("Registration ID", escapeHtml(reg.registrationId))}
        ${detailRow("Team Name", escapeHtml(reg.teamName))}
        ${detailRow("Team Type", escapeHtml(teamTypeLabel))}
        ${detailRow("Team Leader", `${escapeHtml(reg.leaderName)} (${escapeHtml(reg.leaderEmail)})`)}
        ${detailRow("Registration Date", escapeHtml(new Date(reg.createdAt).toLocaleString()), true)}
      </table>

      <h3 style="color:${NAVY_DEEP}; font-size:15px; margin:0 0 12px;">Team Members</h3>
      ${memberTable(MEMBER_HEADERS, membersRows, GREEN)}

      ${paragraph("This is an automated notification. View full details in the admin panel.", "0")}
    `,
    "Organiser Notification"
  );

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
    ? detailRow("Registration ID", escapeHtml(data.registrationId))
    : "";

  const html = emailShell(
    "We received your message",
    `
      ${heading("We received your message")}

      ${paragraph(`Hi ${escapeHtml(data.name)},`)}
      ${paragraph(
        `Thanks for reaching out to A2Z Academy. Your message has been recorded and the organising
        team will reply to this email address. Please quote your reference in any follow-up.`
      )}

      <table style="width:100%; border-collapse:collapse; margin:24px 0;">
        ${detailRow("Reference", escapeHtml(data.referenceId))}
        ${detailRow("Topic", escapeHtml(data.topic))}
        ${registrationRow}
        ${detailRow("Submitted", escapeHtml(new Date(data.submittedAt).toLocaleString()), true)}
      </table>

      <h3 style="color:${NAVY_DEEP}; font-size:15px; margin:0 0 8px;">Your message</h3>
      <p style="font-size:14px; line-height:1.6; white-space:pre-line; background:${SURFACE};
                border-left:4px solid ${GREEN}; border-radius:8px; padding:12px 16px; margin:0;">
        ${escapeHtml(data.message)}
      </p>

      ${paragraph(
        `Reminder: all round instructions, PPT submission details, and shortlisting announcements are
        shared through the official WhatsApp group.`,
        "24px 0 0"
      )}

      ${whatsappButton(WHATSAPP_URL)}

      ${paragraph("This is an automated acknowledgement — replies reach the organisers.", "0")}
    `,
    "Contact Form"
  );

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
  const html = emailShell(
    "New contact message",
    `
      ${heading("New contact message")}

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        ${detailRow("Reference", escapeHtml(data.referenceId))}
        ${detailRow("From", `${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;`)}
        ${detailRow("Topic", escapeHtml(data.topic))}
        ${detailRow("Registration ID", escapeHtml(data.registrationId || "—"))}
        ${detailRow("Submitted", escapeHtml(new Date(data.submittedAt).toLocaleString()), true)}
      </table>

      <h3 style="color:${NAVY_DEEP}; font-size:15px; margin:0 0 8px;">Message</h3>
      <p style="font-size:14px; line-height:1.6; white-space:pre-line; background:${SURFACE};
                border-left:4px solid ${GREEN}; border-radius:8px; padding:12px 16px; margin:0;">
        ${escapeHtml(data.message)}
      </p>

      ${paragraph(
        `Reply directly to this email to answer ${escapeHtml(data.name)} — the Reply-To header points at
        the sender.`,
        "24px 0 0"
      )}
    `,
    "Organiser Notification"
  );

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
