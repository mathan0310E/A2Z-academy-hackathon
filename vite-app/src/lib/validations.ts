import { z } from "zod";
import { TEAM_TYPES } from "@/types";

export const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-]?\(?\d{3,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,9}$/;
export const indianPhoneRegex = /^(\+?91[\s\-]?)?[0]?(9[1-9]\d{1}|[6-9]\d{1})\d{7}$/;

export const memberSchema = z.object({
  memberId: z.string().optional(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .transform((val) => val.trim()),
  phone: z
    .string()
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Enter a valid phone number")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Enter a valid email address")
    .toLowerCase()
    .transform((val) => val.trim().toLowerCase()),
  college: z
    .string()
    .min(2, "College name is required")
    .max(200, "College name is too long")
    .transform((val) => val.trim()),
  department: z
    .string()
    .min(2, "Department is required")
    .max(100, "Department is too long")
    .transform((val) => val.trim()),
  year: z.string().min(1, "Year is required"),
  isLeader: z.boolean().optional().default(false),
});

export const registrationSchema = z
  .object({
    teamName: z
      .string()
      .min(3, "Team name must be at least 3 characters")
      .max(100, "Team name must be at most 100 characters")
      .transform((val) => val.trim()),
    teamType: z.enum(["duo", "tri", "squad"], {
      errorMap: () => ({ message: "Please select a team type" }),
    }),
    members: z.array(memberSchema).min(2, "At least 2 members required"),
    leaderMemberId: z.string().min(1, "Please select a team leader"),
  })
  .superRefine((data, ctx) => {
    const expected = TEAM_TYPES.find((t) => t.value === data.teamType)?.members;
    if (expected !== undefined && data.members.length !== expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `This team type requires exactly ${expected} members`,
        path: ["members"],
      });
    }
    if (
      !data.members.some((m) => m.memberId === data.leaderMemberId) &&
      !data.members.some((m) => m.isLeader)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select one of the team members as leader",
        path: ["leaderMemberId"],
      });
    }
    // Duplicate email check
    const emails = data.members.map((m) => m.email);
    const unique = new Set(emails).size;
    if (unique !== emails.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each team member must have a unique email",
        path: ["members"],
      });
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const memberFormSchema = memberSchema.omit({
  memberId: true,
  isLeader: true,
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
  "Other",
];

/* ============================ Contact form ============================ */

export const CONTACT_TOPICS = [
  "Registration & team changes",
  "Rounds, dates & schedule",
  "Institutional / bulk participation",
  "Website or technical issue",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
  // Optional: participants usually quote their Registration ID (AZZ-YYYY-00001).
  registrationId: z
    .string()
    .trim()
    .max(40, "Registration ID is too long")
    .optional(),
  topic: z.enum(CONTACT_TOPICS, {
    errorMap: () => ({ message: "Please choose a topic" }),
  }),
  message: z
    .string()
    .min(20, "Please describe your question in at least 20 characters")
    .max(2000, "Message must be at most 2000 characters")
    .transform((val) => val.trim()),
});

export type ContactFormData = z.infer<typeof contactSchema>;
