import type { ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Paints a slow-moving green-to-navy gradient across the text.
 *
 * The gradient itself is the text fill, so the effect is invisible to screen
 * readers and degrades to a solid colour if the background clip is unsupported.
 */
export function GradientText({ children, className = "" }: GradientTextProps) {
  return <span className={`gradient-text ${className}`.trim()}>{children}</span>;
}
