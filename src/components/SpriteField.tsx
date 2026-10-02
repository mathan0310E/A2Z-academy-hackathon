import { CircuitTrace, HexFrame, OrbitRings, SparkBurst } from "@/components/icons/Decor";

type Sprite = {
  /** Which motif to draw. */
  Comp: typeof CircuitTrace;
  /** Position and size, expressed as utility classes. */
  className: string;
  /** Drift animation and timing. */
  anim: string;
};

/**
 * Fixed sprite layout. Positions are hard-coded rather than randomised so the
 * decoration is identical on every render — important because the marketing
 * pages are prerendered to static HTML.
 */
const SPRITES: Sprite[] = [
  { Comp: CircuitTrace, className: "left-[6%] top-[14%] h-16 w-16", anim: "animate-float-slow" },
  { Comp: HexFrame, className: "left-[18%] bottom-[12%] h-12 w-12", anim: "animate-orbit" },
  { Comp: OrbitRings, className: "right-[8%] top-[18%] h-20 w-20", anim: "animate-orbit-reverse" },
  { Comp: SparkBurst, className: "right-[22%] bottom-[16%] h-14 w-14", anim: "animate-float" },
  { Comp: HexFrame, className: "left-[46%] top-[8%] h-10 w-10", anim: "animate-float" },
  { Comp: SparkBurst, className: "left-[38%] bottom-[8%] h-10 w-10", anim: "animate-float-slow" },
];

/**
 * Decorative field of drifting SVG sprites. Sits behind page content as a
 * texture layer; it is inert to pointers and hidden from assistive tech, and
 * every animation stops under `prefers-reduced-motion` (see globals.css).
 */
export default function SpriteField({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`.trim()}>
      {SPRITES.map(({ Comp, className: pos, anim }, i) => (
        <Comp key={i} className={`absolute text-brand-green-ink/15 ${pos} ${anim}`} />
      ))}
    </div>
  );
}
