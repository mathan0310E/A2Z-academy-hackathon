import { ReactNode } from "react";

/**
 * Per-navigation page transition. `template.tsx` remounts on every route change,
 * so this gives each page a CSS fade-up entrance without an animation runtime.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
