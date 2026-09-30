import { useEffect, useRef } from "react";

/**
 * Decorative "matrix" rain for the hero background: columns of glyphs falling
 * with a brighter leading character. Pure canvas, so it costs no DOM nodes and
 * no animation runtime.
 *
 * Legibility and cost are the two constraints here. The canvas is hidden from
 * assistive tech and from pointer events, the CSS keeps it faint and masks it
 * out toward the fold (see `.matrix-canvas`), and the loop is capped to ~24fps
 * and stops entirely when the tab is hidden or the section scrolls out of view.
 */
const GLYPHS = "01<>{}[]()/*+-=ABCDEF#$%&";

export default function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let fontSize = 14;
    let columns = 0;
    let drops: number[] = [];
    let speeds: number[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Slightly larger glyphs on bigger screens; fewer, longer trails otherwise.
      fontSize = width < 640 ? 12 : 15;
      columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * (height / fontSize));
      speeds = Array.from({ length: columns }, () => 0.45 + Math.random() * 0.55);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    };

    const draw = () => {
      // Translucent wash instead of clearRect — this is what produces the trail.
      ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];

        // The leading glyph is the only high-contrast one; the rest read as a
        // dim green trail so the overall wash stays light.
        ctx.fillStyle = "rgba(65, 122, 30, 0.85)";
        ctx.fillText(glyph, x, y);
        ctx.fillStyle = "rgba(113, 191, 67, 0.35)";
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - fontSize);

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += speeds[i];
      }
    };

    resize();

    // Static first frame so the section never renders empty, then animate.
    draw();
    if (reduced) return () => undefined;

    let raf = 0;
    let last = 0;
    const interval = 1000 / 24;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < interval) return;
      last = now;
      draw();
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    // Pause while the tab is hidden or the hero is scrolled past.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(loop);
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ? `matrix-canvas ${className}` : "matrix-canvas"}
    />
  );
}
