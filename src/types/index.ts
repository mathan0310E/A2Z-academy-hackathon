export type TeamType = "duo" | "tri" | "squad";

export type TeamTypeConfig = {
  value: TeamType;
  label: string;
  members: number;
};

export const TEAM_TYPES: TeamTypeConfig[] = [
  { value: "duo", label: "Duo — 2 members", members: 2 },
  { value: "tri", label: "Tri — 3 members", members: 3 },
  { value: "squad", label: "Squad — 4 members", members: 4 },
];

export const TEAM_TYPE_OPTIONS = TEAM_TYPES.map((t) => ({
  value: t.value,
  label: t.label,
  members: t.members,
}));

export function getMemberCount(teamType: TeamType): number {
  return TEAM_TYPES.find((t) => t.value === teamType)?.members ?? 2;
}

export function getTeamTypeLabel(teamType: TeamType): string {
  return TEAM_TYPES.find((t) => t.value === teamType)?.label ?? teamType;
}

export type Member = {
  memberId: string;
  name: string;
  phone: string;
  email: string;
  college: string;
  department: string;
  year: string;
  isLeader: boolean;
};

export type Registration = {
  registrationId: string;
  teamName: string;
  teamType: TeamType;
  leaderMemberId: string;
  leaderName: string;
  leaderEmail: string;
  status: "REGISTERED" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  members: Member[];
};

export type ProblemStatement = {
  problemId: string;
  title: string;
  domain: string;
  description: string;
  requirements: string;
  additionalInfo: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export type EmailLog = {
  emailLogId: string;
  registrationId: string;
  recipient: string;
  recipientType: "leader" | "member" | "organizer";
  emailType: "leader_confirmation" | "member_confirmation" | "organizer_notification";
  status: "sent" | "failed" | "pending";
  errorMessage?: string;
  attemptedAt: string;
  sentAt?: string;
};
