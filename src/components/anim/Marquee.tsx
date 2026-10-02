import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full pass. Slower reads better for long lists. */
  speed?: number;
  /** Direction of travel. */
  reverse?: boolean;
  className?: string;
};

/**
 * Continuously scrolling strip, typically used for the domain/keyword list.
 *
 * The children are rendered twice so the loop is seamless: the track translates
 * by exactly -50%, at which point the duplicate sits where the original began.
 * The duplicate is hidden from assistive tech so the words are announced once.
 */
export function Marquee({ children, speed = 30, reverse = false, className = "" }: MarqueeProps) {
  return (
    <div className={`marquee ${className}`.trim()}>
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
