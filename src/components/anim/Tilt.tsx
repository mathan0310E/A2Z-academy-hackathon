import { useRef, type ReactNode } from "react";

type TiltProps = {
  children: ReactNode;
  /** Maximum rotation in degrees at the edges. */
  max?: number;
  /** Perspective distance in px; smaller is more dramatic. */
  perspective?: number;
  className?: string;
};

/**
 * Tilts its children toward the pointer for a light 3D feel.
 *
 * Updates are written straight to the element's transform inside a
 * requestAnimationFrame, so pointer moves never trigger a React re-render. The
 * whole effect is skipped when the visitor prefers reduced motion.
 */
export function Tilt({ children, max = 8, perspective = 900, className = "" }: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  const reduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced()) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
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
      className={`tilt ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
