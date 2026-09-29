import type { ProblemStatement } from "@/types";

const PUBLIC_CONTENT_COLLECTION = "publicContent";
const PROBLEM_STATEMENTS_COLLECTION = "problemStatements";

/**
 * Published problem statements live in Firestore (managed by the admin portal).
 * The `firebase/firestore` SDK is ~200 kB, so it is imported on demand — the
 * module only loads when this page is actually visited. Every failure path
 * (unconfigured Firebase, offline, permissions) resolves to an empty list so
 * the UI degrades to a friendly empty state instead of an error.
 */
export async function fetchPublishedProblemStatements(): Promise<ProblemStatement[]> {
  try {
    const [{ collection, query, where, getDocs }, { getDb }] = await Promise.all([
      import("firebase/firestore"),
      import("@/lib/firebase"),
    ]);
    const db = await getDb();
    const q = query(
      collection(db, PROBLEM_STATEMENTS_COLLECTION),
      where("status", "==", "published")
    );
    const snapshot = await getDocs(q);
    const problems: ProblemStatement[] = snapshot.docs.map((docSnap) => ({
      problemId: docSnap.id,
      ...(docSnap.data() as Omit<ProblemStatement, "problemId">),
    }));
    return problems.sort((a, b) => (a.problemId < b.problemId ? -1 : a.problemId > b.problemId ? 1 : 0));
  } catch (error) {
    console.error("Problem statements unavailable:", error);
    return [];
  }
}

export async function fetchProblemStatement(problemId: string): Promise<ProblemStatement | null> {
  try {
    const [{ doc, getDoc }, { getDb }] = await Promise.all([
      import("firebase/firestore"),
      import("@/lib/firebase"),
    ]);
    const db = await getDb();
    const docSnap = await getDoc(doc(db, PROBLEM_STATEMENTS_COLLECTION, problemId));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    if (data.status !== "published") return null;
    return { problemId: docSnap.id, ...(data as Omit<ProblemStatement, "problemId">) };
  } catch (error) {
    console.error("Error fetching problem statement:", error);
    return null;
  }
}

export interface PublicContent {
  about?: { whoWeAre: string; mission: string; vision: string };
  hackathon?: {
    title: string;
    description: string;
    organizer: string;
    teamSize: string;
    teamTypes: string;
    rounds: string;
    round3Venue: string;
    round3Fee: string;
    whatsappUrl: string;
  };
  rounds?: Array<{ title: string; format: string; shortlisting: string; description: string }>;
  guidelines?: { content: string };
  faq?: Array<{ question: string; answer: string }>;
}

export async function fetchPublicContent(): Promise<PublicContent> {
  try {
    const [{ collection, query, where, getDocs }, { getDb }] = await Promise.all([
      import("firebase/firestore"),
      import("@/lib/firebase"),
    ]);
    const db = await getDb();
    const q = query(collection(db, PUBLIC_CONTENT_COLLECTION), where("published", "==", true));
    const snapshot = await getDocs(q);
    const content: Record<string, unknown> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      content[docSnap.id] = data.value ?? data;
    });
    return content as PublicContent;
  } catch (error) {
    console.error("Error fetching public content:", error);
    return {};
  }
}

export async function fetchFaqs(): Promise<Array<{ id: string; question: string; answer: string }>> {
  try {
    const [{ collection, query, where, getDocs }, { getDb }] = await Promise.all([
      import("firebase/firestore"),
      import("@/lib/firebase"),
    ]);
    const db = await getDb();
    const q = query(
      collection(db, PUBLIC_CONTENT_COLLECTION, "content", "faqs"),
      where("published", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as { question: string; answer: string }),
    }));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}
