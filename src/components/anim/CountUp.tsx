import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Final value to land on. */
  to: number;
  /** Value to start from. */
  from?: number;
  /** Animation length in ms. */
  duration?: number;
  /** Rendered before the number, e.g. "₹". */
  prefix?: string;
  /** Rendered after the number, e.g. "+". */
  suffix?: string;
  className?: string;
};

/**
 * Counts up to `to` the first time the element scrolls into view.
 *
 * Uses requestAnimationFrame against a wall-clock start so the duration holds
 * regardless of frame rate. Falls back to rendering the final value directly
 * when the visitor prefers reduced motion.
 */
export function CountUp({ to, from = 0, duration = 1400, prefix = "", suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(from);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    let frame = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic keeps the final digits from crawling.
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(from + (to - from) * eased));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
