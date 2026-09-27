import { getAdminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const CONTACT_COLLECTION = "contactMessages";
const EMAIL_LOGS_COLLECTION = "emailLogs";

export type ContactMessageRecord = {
  /** Human-readable reference shown to the sender (MSG-YYYY-XXXXXX). */
  contactMessageId: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  registrationId?: string;
  submittedAt: string;
  status: "NEW";
  /** Whether the organiser notification email reached the inbox. */
  organizerNotified: boolean;
};

/** Persist a contact message submitted from the public contact form. */
export async function saveContactMessage(record: ContactMessageRecord): Promise<void> {
  const db = getAdminDb();
  await db
    .collection(CONTACT_COLLECTION)
    .doc(record.contactMessageId)
    .set({ ...record, createdAt: Timestamp.now() });
}

/** Persist the outcome of a contact-form email so failures are auditable. */
export async function logContactEmail(log: {
  contactMessageId: string;
  recipient: string;
  recipientType: "participant" | "organizer";
  emailType: "contact_acknowledgement" | "contact_notification";
  status: "sent" | "failed";
  errorMessage?: string;
  attemptedAt: string;
  sentAt?: string;
}): Promise<void> {
  const db = getAdminDb();
  const ref = db.collection(EMAIL_LOGS_COLLECTION).doc();
  await ref.set({ emailLogId: ref.id, ...log });
}
