
import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight scroll reveal built on IntersectionObserver + CSS transitions.
 * Replaces Framer Motion for entrance animations so pages ship no animation
 * runtime while keeping the server-rendered markup.
 */
function useInView<T extends HTMLElement>(amount = 0.15, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced-motion preferences: show immediately, skip the observer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, once]);

  return { ref, inView };
}

const OFFSETS = {
  up: "translate-y-5",
  left: "-translate-x-6",
  right: "translate-x-6",
} as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  /** offset direction; "up" fades up, "left"/"right" slide in horizontally */
  direction?: keyof typeof OFFSETS;
  className?: string;
  once?: boolean;
}

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15, once);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn(
        "reveal-root transition-all duration-500 ease-out motion-reduce:transition-none",
        inView ? "reveal-visible translate-x-0 translate-y-0 opacity-100" : cn("opacity-0", OFFSETS[direction]),
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Staggered reveal container + item pair for grids. The container toggles
 * `data-revealed`, and `.reveal-item` children animate in with per-child
 * delays declared in CSS — no JS index bookkeeping required.
 */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** retained for API compatibility; staggering is expressed in CSS */
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1, true);

  return (
    <div ref={ref} data-revealed={inView ? "true" : "false"} className={cn("reveal-group", className)}>
      {children}
    </div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("reveal-item", className)}>{children}</div>;
}
