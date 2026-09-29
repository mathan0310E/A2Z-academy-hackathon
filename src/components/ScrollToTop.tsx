import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SPA navigations keep the scroll position by default, unlike Next.js which
 * resets it per route. This restores the Next behaviour.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
