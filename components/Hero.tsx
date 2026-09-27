"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/Section";
import { GradientHeading } from "@/components/ui/Section";
import { ChevronDown, Play, ArrowRight } from "lucide-react";

const TECHNOLOGY_ICONS = [
  { label: "AI", color: "from-purple-500 to-pink-500" },
  { label: "Data", color: "from-blue-500 to-cyan-500" },
  { label: "Cybersecurity", color: "from-green-500 to-emerald-500" },
  { label: "IoT", color: "from-orange-500 to-amber-500" },
  { label: "Innovation", color: "from-fuchsia-500 to-rose-500" },
  { label: "Collaboration", color: "from-indigo-500 to-violet-500" },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-20">
      {/* Background: Radial gradient with circuit pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(1200px circle at 20% 30%, rgba(6,172,212,0.04) 0%, transparent 50%), radial-gradient(1200px circle at 80% 70%, rgba(59,130,246,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative container mx-auto px-4 md:px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl"
        >
          {/* Tech badge */}
          <motion.div variants={item} className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Tech-Based Hackathon
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={item}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            <span className="block">A2Z Academy</span>
            <span className="block text-2xl text-gray-300 sm:text-3xl">
              Empowering Institutes with Tech-Based Training
            </span>
          </motion.h1>

          <motion.div variants={item} className="my-6">
            <h2 className="text-xl font-medium text-cyan-400 md:text-2xl">
              A2Z Academy Tech-Based Hackathon
            </h2>
          </motion.div>

          <motion.p
            variants={item}
            className="mb-8 text-lg text-gray-300 sm:text-xl"
          >
            Explore technology. Solve real-world problems. Build innovative solutions.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center gap-2 rounded-lg border border-cyan-500/50 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-2xl shadow-cyan-500/25 transition-all duration-300"
              >
                Start Registration
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/hackathon">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.04] px-8 py-3.5 text-base font-medium text-gray-300 backdrop-blur hover:border-cyan-500/40 hover:text-white"
              >
                <Play className="h-4 w-4" />
                Explore Hackathon
              </motion.button>
            </Link>
          </motion.div>

          {/* Animated technology icons */}
          <motion.div variants={item} className="mb-10 flex justify-center gap-3 flex-wrap">
            {TECHNOLOGY_ICONS.map((tech) => (
              <motion.div
                key={tech.label}
                className={`flex items-center justify-center rounded-full bg-gradient-to-r ${tech.color} h-9 w-9`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                title={tech.label}
              >
                <span className="text-xs font-bold text-white">{tech.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={item}
            className="flex cursor-pointer items-center justify-center gap-1 text-sm text-gray-500"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => {
              const section = document.getElementById("about");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Scroll to explore</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
