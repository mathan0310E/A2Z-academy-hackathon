"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ImportantNotice() {
  const whatsAppUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "#";

  return (
    <section className="w-full border-y border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-cyan-900/20 py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-3 px-4 text-center md:flex-row md:gap-4 md:py-8">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="h-5 w-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.27 2 11.5c0 2.12.84 4.02 2.2 5.4L3 21h3.2l1.5 2h9l1.5-2H21l-1.2-4.6C21.16 15.52 22 13.62 22 11.5 22 6.27 17.52 2 12 2zm-1 14.5c-.55 0-1-.45-1-1V12c0-.55.45-1 1-1s1 .45 1 1v3.5c0 .55-.45 1-1 1zm0-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
            </svg>
          </motion.div>
          <p className="text-sm font-medium text-cyan-200">
            <span className="font-semibold text-cyan-300">Registration is the entry path</span>{" "}
            to the A2Z Academy Hackathon. After registering, join the official WhatsApp group for all updates.
          </p>
        </div>
        <Link href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-500/25"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.38 0 .01 5.17.01 11.51c0 2.02.53 3.95 1.5 5.67L0 24l7-2.11a11.94 11.94 0 004.99 1.08h.01c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.48-8.51zm-3.03 13.42c-.19.47-1.13.91-1.55.96-.36.05-.82.1-1.46-.27-.5-.23-1.12-.5-1.65-.52-.53-.02-.94-.08-1.5-.47-.55-.39-1.3-.77-1.35-.78C7.9 15.67 7.85 15.55 7.2 14.9c-.66-.66-.68-.94-.7-.96-.03-.02-.7-.1-1.34.5-.56.53-1.1 1.1-1.12 1.67-.03.6.14 1.27.66 1.64.5.36 1.07 1.18 2.15 1.4c.97.2 1.24.15 1.45.13.2-.02.65-.25 1.24-.8.57-.53.73-.83.98-1.3.2-.47.1-.68.05-.7-.05-.03-.17-.26-.17-.6 0-.34-.1-.22-.4-.32-.28-.1-.59-.17-.6-1 0-.83.2-1.27.5-1.68-.05-1.6 1.29-2.43 1.44-2.46.19-.02.6-.13 1.07.63.27.43 1 1.08 1.07 1.28.03.2 0 .47-.01.7v.01c-.02.47-.45 1.15-.67 1.38-.21.22-.45.44-.27.85.17.41 1.44 2.24 2.29 2.72.27.15.8.24 1.34.1.5-.13.1.1.5.3.46.13 1.86 1.04 2.12 1.15.26.11.1.27 1.04-.51 0 0 .73-.47.96-.9.02-.04.4-.2.68-1.23.01-.38 0-.94.01-1.57-.04-1.01 0-2 0-2.03z" />
            </svg>
            Join Official WhatsApp Group
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

