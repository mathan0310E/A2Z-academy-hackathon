import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { AppCheckProvider } from "@/contexts/AppCheckContext";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Hackathon from "@/pages/Hackathon";
import Rounds from "@/pages/Rounds";
import TeamFormation from "@/pages/TeamFormation";
import Guidelines from "@/pages/Guidelines";
import WhatWeProvide from "@/pages/WhatWeProvide";
import Faq from "@/pages/Faq";
import NotFound from "@/pages/NotFound";

/**
 * Form-heavy and data-heavy routes are code-split so their dependencies
 * (react-hook-form + zod, Firebase) never land in the home page's payload.
 */
const ProblemStatements = lazy(() => import("@/pages/ProblemStatements"));
const Contact = lazy(() => import("@/pages/Contact"));
const Register = lazy(() => import("@/pages/Register"));

export default function App() {
  const { pathname } = useLocation();

  return (
    <AppCheckProvider>
      <StructuredData />

      <div
        className="pointer-events-none fixed inset-0 z-0 grid-pattern opacity-[0.5]"
        aria-hidden="true"
      />
      <ScrollToTop />
      <div className="relative z-10 flex min-h-screen flex-col bg-white/0">
        <Navbar />
        <main className="page-enter flex-1" key={pathname}>
          <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/hackathon" element={<Hackathon />} />
              <Route path="/rounds" element={<Rounds />} />
              <Route path="/problem-statements" element={<ProblemStatements />} />
              <Route path="/team-formation" element={<TeamFormation />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/what-we-provide" element={<WhatWeProvide />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </AppCheckProvider>
  );
}
