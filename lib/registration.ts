import { getAdminDb } from "@/lib/firebase-admin";
import { Timestamp, Transaction } from "firebase-admin/firestore";

const REGISTRATIONS_COLLECTION = "registrations";

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Generate a unique registration ID: AZZ-{YEAR}-{00001}
 * Uses a Firestore counter document to ensure sequential, unique IDs
 * even under concurrent requests.
 */
export async function generateRegistrationId(): Promise<string> {
  const db = getAdminDb();
  const counterRef = db.collection("_counters").doc("registrations");

  // Use a transaction to atomically increment the counter
  const registrationId = await db.runTransaction(async (transaction: Transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let seq = 1;
    if (counterDoc.exists) {
      const data = counterDoc.data();
      const storedYear = data?.year ?? CURRENT_YEAR;
      // Reset sequence if year changed
      if (storedYear !== CURRENT_YEAR) {
        seq = 1;
      } else {
        seq = (data?.seq ?? 0) + 1;
      }
    }
    transaction.set(
      counterRef,
      { seq, year: CURRENT_YEAR, updatedAt: Timestamp.now() },
      { merge: true }
    );
    return padSequence(seq);
  });

  return `AZZ-${CURRENT_YEAR}-${registrationId}`;
}

function padSequence(seq: number): string {
  const padded = String(seq).padStart(5, "0");
  return padded;
}

/**
 * Check for duplicate registration based on team leader email
 * or team name to prevent obvious duplicate submissions.
 */
export async function checkDuplicateRegistration(
  teamName: string,
  leaderEmail: string,
  memberEmails: string[]
): Promise<{ isDuplicate: boolean; reason?: string }> {
  const db = getAdminDb();

  // Check if a registration exists with the same leader email
  const leaderSnapshot = await db
    .collection(REGISTRATIONS_COLLECTION)
    .where("leaderEmail", "==", leaderEmail.toLowerCase().trim())
    .limit(1)
    .get();

  if (!leaderSnapshot.empty) {
    return {
      isDuplicate: true,
      reason: `A team with leader email ${leaderEmail} is already registered`,
    };
  }

  // Check if any member email is already registered
  const allEmails = [leaderEmail, ...memberEmails]
    .map((e) => e.toLowerCase().trim())
    .filter(Boolean);

  for (const email of allEmails) {
    const memberSnapshot = await db
      .collection(REGISTRATIONS_COLLECTION)
      .where("memberEmails", "array-contains", email)
      .limit(1)
      .get();

    if (!memberSnapshot.empty) {
      return {
        isDuplicate: true,
        reason: `An account with email ${email} is already registered as part of a team`,
      };
    }
  }

  // Check for exact team name match
  const nameSnapshot = await db
    .collection(REGISTRATIONS_COLLECTION)
    .where("teamName", "==", teamName.trim())
    .limit(1)
    .get();

  if (!nameSnapshot.empty) {
    return {
      isDuplicate: true,
      reason: `A team with the name "${teamName}" is already registered`,
    };
  }

  return { isDuplicate: false };
}

/**
 * Save a registration to Firestore with subcollections for members.
 */
export async function saveRegistration(registration: {
  registrationId: string;
  teamName: string;
  teamType: string;
  leaderMemberId: string;
  leaderName: string;
  leaderEmail: string;
  status: string;
  createdAt: string;
  members: Array<{
    memberId: string;
    name: string;
    phone: string;
    email: string;
    college: string;
    department: string;
    year: string;
    isLeader: boolean;
  }>;
}): Promise<void> {
  const db = getAdminDb();

  const regRef = db
    .collection(REGISTRATIONS_COLLECTION)
    .doc(registration.registrationId);

  const memberEmails = registration.members.map((m) => m.email);

  // Save the registration document
  await regRef.set({
    registrationId: registration.registrationId,
    teamName: registration.teamName,
    teamType: registration.teamType,
    leaderMemberId: registration.leaderMemberId,
    leaderName: registration.leaderName,
    leaderEmail: registration.leaderEmail,
    status: registration.status,
    createdAt: registration.createdAt,
    memberEmails: memberEmails, // for duplicate checking
    memberCount: registration.members.length,
  });

  // Save each member as a subcollection document
  const membersCollection = regRef.collection("members");
  const batch = db.batch();
  for (const member of registration.members) {
    const memberRef = membersCollection.doc(member.memberId);
    batch.set(memberRef, member);
  }
  await batch.commit();
}

/**
 * Save an email log entry to Firestore.
 */
export async function saveEmailLog(log: {
  registrationId: string;
  recipient: string;
  recipientType: "leader" | "member" | "organizer";
  emailType: string;
  status: string;
  errorMessage?: string;
  attemptedAt: string;
  sentAt?: string;
}): Promise<void> {
  const db = getAdminDb();
  const emailLogRef = db.collection("emailLogs").doc();
  const logId = emailLogRef.id;
  const now = new Date().toISOString();
  await emailLogRef.set({
    emailLogId: logId,
    ...log,
    attemptedAt: log.attemptedAt ?? now,
  });
}
