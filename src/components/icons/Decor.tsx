/**
 * Decorative SVG motifs.
 *
 * These are purely presentational: every component is `aria-hidden` and
 * inherits `currentColor`, so callers control colour and opacity through
 * `className`. They are drawn on a 24x24 grid to match the icon set, except the
 * background patterns which use a larger tile so they repeat cleanly.
 */
import type { SVGProps } from "react";

type MotifProps = SVGProps<SVGSVGElement>;

const outline = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Faint dot grid for section backdrops. Tile it with `bg-repeat`. */
export function DotGridPattern({ className, ...props }: MotifProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <pattern id="a2z-dot-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="24" height="24" fill="url(#a2z-dot-grid)" />
    </svg>
  );
}

/** Diagonal hatch used to texture cards and callouts. */
export function HatchPattern({ className, ...props }: MotifProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <pattern id="a2z-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="24" height="24" fill="url(#a2z-hatch)" />
    </svg>
  );
}

/** Circuit-trace accent: a board-style run with nodes. */
export function CircuitTrace({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <path d="M3 6h5l3 3h4" />
        <path d="M15 9h6" />
        <path d="M3 18h4l4-4" />
        <path d="M11 14h6l3-3" />
        <circle cx="3" cy="6" r="1.4" />
        <circle cx="3" cy="18" r="1.4" />
        <circle cx="21" cy="9" r="1.4" />
        <circle cx="21" cy="11" r="1.4" />
      </g>
    </svg>
  );
}

/** Concentric orbit rings with a satellite node. */
export function OrbitRings({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" />
        <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(35 12 12)" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="20.5" cy="10.2" r="1.2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/** Radiating spark burst for highlights and "new" accents. */
export function SparkBurst({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <path d="M6.2 6.2l2.6 2.6M15.2 15.2l2.6 2.6M17.8 6.2l-2.6 2.6M8.8 15.2l-2.6 2.6" />
        <circle cx="12" cy="12" r="2.2" />
      </g>
    </svg>
  );
}

/** Hexagon frame, useful behind numbered steps and badges. */
export function HexFrame({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <path d="M12 2.5 20.2 7v10L12 21.5 3.8 17V7L12 2.5Z" />
        <path d="M12 7.5 16.5 10v4L12 16.5 7.5 14v-4L12 7.5Z" />
      </g>
    </svg>
  );
}

/** Corner brackets for framing panels and media. */
export function CornerFrame({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <path d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8" />
        <path d="M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8" />
        <path d="M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16" />
        <path d="M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16" />
      </g>
    </svg>
  );
}

/** Shielded padlock used to signal security topics. */
export function ShieldedLock({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <path d="M12 2.5 20 5.5v6c0 4.6-3.2 8.4-8 10-4.8-1.6-8-5.4-8-10v-6l8-3Z" />
        <rect x="9" y="11" width="6" height="5" rx="1" />
        <path d="M10.5 11V9.8a1.5 1.5 0 0 1 3 0V11" />
      </g>
    </svg>
  );
}

/** Stacked layers used for "levels"/"rounds" concepts. */
export function LayerStack({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" />
        <path d="M3 12l9 4.5 9-4.5" />
        <path d="M3 16.5 12 21l9-4.5" />
      </g>
    </svg>
  );
}

/** Terminal prompt motif for developer-facing sections. */
export function TerminalPrompt({ className, ...props }: MotifProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <g {...outline}>
        <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
        <path d="M2.5 8h19" />
        <path d="M6.5 12l2.5 2.5-2.5 2.5" />
        <path d="M12 17h5" />
        <circle cx="5.5" cy="6" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="7.8" cy="6" r="0.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
