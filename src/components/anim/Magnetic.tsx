import { useRef, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  /** How far the element may drift toward the pointer, in px. */
  strength?: number;
  className?: string;
};

/**
 * Nudges its children toward the pointer while hovered, then springs back.
 *
 * Movement is applied directly to the node inside a requestAnimationFrame, so
 * pointer moves do not re-render React. Disabled under reduced motion.
 */
export function Magnetic({ children, strength = 10, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `translate(${(dx * strength).toFixed(2)}px, ${(dy * strength).toFixed(2)}px)`;
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={`magnetic ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
