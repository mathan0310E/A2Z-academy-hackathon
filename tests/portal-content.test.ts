/**
 * Contract test for the admin → portal content bridge.
 *
 * The shapes here are the ones the admin panel actually writes
 * (`server/lib/content.ts` in the a2z-admin repo). If that side renames a
 * field, these tests fail rather than the published site silently falling back
 * to stale checked-in values.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mergePortalContent } from "../src/contexts/PortalContentContext";
import { siteConfig } from "../src/lib/content";
import type { PublicContent } from "../src/lib/firestore";

test("falls back to the baseline when the admin panel has published nothing", () => {
  const merged = mergePortalContent({});
  assert.deepEqual(merged.faqs, siteConfig.faqs);
  assert.deepEqual(merged.rounds, siteConfig.rounds);
  assert.deepEqual(merged.guidelines, siteConfig.guidelines);
  assert.deepEqual(merged.hackathonInfo, siteConfig.hackathonInfo);
});

test("admin hackathon values override the baseline", () => {
  const stored: PublicContent = {
    hackathon: {
      title: "A2Z Academy Hackathon",
      tagline: "CODE • CREATE • COMPETE • WIN",
      description: "Turn Your Ideas Into Innovation!",
      date: "",
      dateStatus: "COMING SOON",
      venue: "Cyber Wolf HQ, Tiruvannamalai",
      address: "No. 3A, 10th Street",
      contactNumber: "6379869678",
      website: "a2zacademy.co.in",
      organizer: "A2Z Academy",
      teamSize: "3 Members",
      teamTypes: "Duo, Tri, Squad",
      benefits: [],
      prizeInfo: "Cash Prizes",
      certificateInfo: "Certificates",
      foodInfo: "Food Provided",
      whatsappUrl: "https://chat.whatsapp.com/example",
      round3Fee: "₹300 per head",
      shortlisting: "30 teams (Round 1) → 20 teams (Round 2)",
    },
  };

  const merged = mergePortalContent(stored);
  // `venue` on the admin side is the portal's `round3Venue`.
  assert.equal(merged.hackathonInfo.round3Venue, "Cyber Wolf HQ, Tiruvannamalai");
  assert.equal(merged.hackathonInfo.round3Fee, "₹300 per head");
  assert.equal(merged.hackathonInfo.shortlisting, "30 teams (Round 1) → 20 teams (Round 2)");
  assert.equal(merged.hackathonInfo.teamSize, "3 Members");
  assert.equal(merged.whatsappUrl, "https://chat.whatsapp.com/example");
  // `communication` has no admin counterpart and must survive untouched.
  assert.equal(merged.hackathonInfo.communication, siteConfig.hackathonInfo.communication);
});

test("blank admin fields never wipe the published baseline", () => {
  const stored: PublicContent = {
    hackathon: {
      title: "",
      tagline: "",
      description: "",
      date: "",
      dateStatus: "",
      venue: "   ",
      address: "",
      contactNumber: "",
      website: "",
      organizer: "",
      teamSize: "",
      teamTypes: "",
      benefits: [],
      prizeInfo: "",
      certificateInfo: "",
      foodInfo: "",
      whatsappUrl: "",
      round3Fee: "",
      shortlisting: "",
    },
  };

  const merged = mergePortalContent(stored);
  assert.equal(merged.hackathonInfo.round3Venue, siteConfig.hackathonInfo.round3Venue);
  assert.equal(merged.hackathonInfo.round3Fee, siteConfig.hackathonInfo.round3Fee);
  assert.equal(merged.hackathonInfo.organizer, siteConfig.hackathonInfo.organizer);
});

test("rounds come from the admin panel when present, with blank ones dropped", () => {
  const stored: PublicContent = {
    rounds: [
      { roundId: "round-1", title: "Round 1 — Idea Pitch", format: "Online", shortlisting: "40 teams", description: "Submit a deck." },
      { roundId: "round-2", title: "", format: "", shortlisting: "", description: "" },
    ],
  };
  const merged = mergePortalContent(stored);
  assert.equal(merged.rounds.length, 1);
  assert.equal(merged.rounds[0].title, "Round 1 — Idea Pitch");
  assert.equal(merged.rounds[0].format, "Online");
});

test("guidelines are split into lines and fall back when empty", () => {
  const merged = mergePortalContent({ guidelines: { content: "Rule one.\n\n  Rule two.  \n" } });
  assert.deepEqual(merged.guidelines, ["Rule one.", "Rule two."]);

  const empty = mergePortalContent({ guidelines: { content: "   \n  " } });
  assert.deepEqual(empty.guidelines, siteConfig.guidelines);
});

test("faqs come from the admin document and fall back when empty", () => {
  const merged = mergePortalContent({
    faq: [
      { question: "Q1?", answer: "A1." },
      { question: "  ", answer: "dropped" },
    ],
  });
  assert.deepEqual(merged.faqs, [{ question: "Q1?", answer: "A1." }]);

  assert.deepEqual(mergePortalContent({ faq: [] }).faqs, siteConfig.faqs);
});

test("the dedicated whatsapp document is honoured when the hackathon block is empty", () => {
  const merged = mergePortalContent({ whatsapp: { url: "https://chat.whatsapp.com/standalone" } });
  assert.equal(merged.whatsappUrl, "https://chat.whatsapp.com/standalone");
});
