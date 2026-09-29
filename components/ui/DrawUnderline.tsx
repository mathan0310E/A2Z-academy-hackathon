"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Section-title underline that draws in from the left the first time it scrolls
 * into view. Kept as its own client component so `SectionTitle` can stay a
 * Server Component and the animation works even outside a reveal group.
 */
export default function DrawUnderline({ centered }: { centered?: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "underline-draw mt-4 block h-1 w-16 rounded-full bg-brand-green",
        centered && "mx-auto",
        drawn && "underline-draw-active"
      )}
    />
  );
}
