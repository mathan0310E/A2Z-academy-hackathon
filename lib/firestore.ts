import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreError,
} from "firebase/firestore";
import { getDb } from "@/firebase/client";
import type { ProblemStatement } from "@/types";

const PUBLIC_CONTENT_COLLECTION = "publicContent";
const PROBLEM_STATEMENTS_COLLECTION = "problemStatements";

export async function fetchPublishedProblemStatements(): Promise<ProblemStatement[]> {
  try {
    const db = getDb();
    const q = query(
      collection(db, PROBLEM_STATEMENTS_COLLECTION),
      where("status", "==", "published")
    );
    const snapshot = await getDocs(q);
    const problems: ProblemStatement[] = [];
    snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
      problems.push({
        problemId: docSnap.id,
        ...(docSnap.data() as Omit<ProblemStatement, "problemId">),
      });
    });
    return problems.sort((a, b) => {
      if (a.problemId < b.problemId) return -1;
      if (a.problemId > b.problemId) return 1;
      return 0;
    });
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Firestore error fetching problems:", error.message);
    } else {
      console.error("Error fetching problems:", error);
    }
    return [];
  }
}

export async function fetchProblemStatement(problemId: string): Promise<ProblemStatement | null> {
  try {
    const db = getDb();
    const docSnap = await getDoc(doc(db, PROBLEM_STATEMENTS_COLLECTION, problemId));
    if (!docSnap.exists()) {
      return null;
    }
    const data = docSnap.data();
    if (data.status !== "published") {
      return null;
    }
    return {
      problemId: docSnap.id,
      ...(data as Omit<ProblemStatement, "problemId">),
    };
  } catch (error) {
    console.error("Error fetching problem statement:", error);
    return null;
  }
}

export interface PublicContent {
  about?: {
    whoWeAre: string;
    mission: string;
    vision: string;
  };
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
  rounds?: Array<{
    title: string;
    format: string;
    shortlisting: string;
    description: string;
  }>;
  guidelines?: {
    content: string;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export async function fetchPublicContent(): Promise<PublicContent> {
  try {
    const db = getDb();
    const q = query(
      collection(db, PUBLIC_CONTENT_COLLECTION),
      where("published", "==", true)
    );
    const snapshot = await getDocs(q);
    const content: PublicContent = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const key = docSnap.id as keyof PublicContent;
      if (key in content) {
        (content as Record<string, unknown>)[key] = data.value ?? data;
      } else {
        (content as Record<string, unknown>)[key] = data.value ?? data;
      }
    });
    return content;
  } catch (error) {
    console.error("Error fetching public content:", error);
    return {};
  }
}

export async function fetchFaqs(): Promise<Array<{ id: string; question: string; answer: string }>> {
  try {
    const db = getDb();
    const q = query(
      collection(db, PUBLIC_CONTENT_COLLECTION, "content", "faqs"),
      where("published", "==", true)
    );
    const snapshot = await getDocs(q);
    const items: Array<{ id: string; question: string; answer: string }> = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as { question: string; answer: string }),
      });
    });
    return items;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}
