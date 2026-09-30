import { useEffect, useRef } from "react";

/**
 * Animated "matrix" rain for the hero background, built to read as continuous
 * flowing streams rather than random flicker: each column owns a persistent
 * trail of glyphs with a bright leading character, the stream slides smoothly
 * between rows, and glyphs mutate in place the way they do in the film.
 *
 * Cost and legibility are the constraints. It is a single canvas (no DOM nodes),
 * capped at 30fps, paused when the tab is hidden or the hero is off-screen, and
 * dropped to 1x pixel ratio if frames start running long. Under
 * prefers-reduced-motion it paints one static frame and never animates.
 */
const GLYPHS = "01<>{}[]()/*+-=:;ABCDEFabcdef#$%&@!?";
// The hero is a light theme, so the classic effect is inverted: the leading
// glyph is the darkest/most saturated one and the trail fades out from there.
const HEAD_COLOR = "rgba(26, 58, 10, 1)";
const GLOW_COLOR = "rgba(65, 122, 30, 0.6)";
const TRAIL_RGB = "56, 106, 24";
const FONT_STACK = "ui-monospace, SFMono-Regular, Menlo, monospace";

type Column = {
  /** Fractional row position of the leading glyph. */
  head: number;
  /** Rows travelled per second. */
  speed: number;
  /** Trail length in rows. */
  length: number;
  brightness: number;
  chars: string[];
  /** Per-cell timestamp (seconds) at which the glyph next mutates. */
  mutateAt: number[];
};

const pickGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

function makeColumn(rows: number): Column {
  const length = 12 + Math.floor(Math.random() * 22);
  return {
    // Spread heads from just above the canvas to the bottom edge so the hero is
    // already raining on first paint instead of filling in over ~15 seconds.
    head: Math.random() * rows * 1.35 - rows * 0.35,
    speed: 5 + Math.random() * 15,
    length,
    brightness: 0.62 + Math.random() * 0.38,
    chars: Array.from({ length }, pickGlyph),
    mutateAt: Array.from({ length }, () => Math.random() * 2),
  };
}

export default function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let fontSize = 15;
    let columns: Column[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fontSize = width < 640 ? 13 : width < 1100 ? 15 : 17;
      const count = Math.ceil(width / fontSize);
      const rows = Math.ceil(height / fontSize) + 2;
      // Keep existing streams across resizes so the rain never restarts.
      columns = Array.from({ length: count }, (_, i) => columns[i] ?? makeColumn(rows));

      ctx.font = `${fontSize}px ${FONT_STACK}`;
      ctx.textBaseline = "top";
    };

    const draw = (dt: number, now: number) => {
      ctx.clearRect(0, 0, width, height);
      const rows = Math.ceil(height / fontSize) + 2;

      // Pass 1 — trails. Characters hold their position and mutate on a timer,
      // which is what makes the columns read as flowing text.
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const x = i * fontSize;
        col.head += col.speed * dt;

        if ((col.head - col.length) * fontSize > height) {
          columns[i] = makeColumn(rows);
          continue;
        }

        for (let k = 1; k < col.length; k++) {
          const y = (col.head - k) * fontSize;
          if (y < -fontSize || y > height) continue;

          if (now >= col.mutateAt[k]) {
            col.chars[k] = pickGlyph();
            col.mutateAt[k] = now + 0.3 + Math.random() * 2.5;
          }

          const alpha = Math.pow(1 - k / col.length, 1.7) * col.brightness;
          ctx.fillStyle = `rgba(${TRAIL_RGB}, ${alpha.toFixed(3)})`;
          ctx.fillText(col.chars[k], x, y);
        }
      }

      // Pass 2 — leading glyphs, drawn with a soft glow so each stream has a
      // bright head the way the reference effect does.
      ctx.shadowColor = GLOW_COLOR;
      ctx.shadowBlur = 7;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const y = col.head * fontSize;
        if (y < -fontSize || y > height) continue;
        if (now >= col.mutateAt[0]) {
          col.chars[0] = pickGlyph();
          col.mutateAt[0] = now + 0.15 + Math.random() * 1.2;
        }
        ctx.fillStyle = HEAD_COLOR;
        ctx.fillText(col.chars[0], i * fontSize, y);
      }
      ctx.shadowBlur = 0;
    };

    resize();
    draw(0, 0);

    if (reduced) {
      const onResizeStatic = () => {
        resize();
        draw(0, 0);
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    let raf = 0;
    let last = 0;
    let acc = 0;
    let slowFrames = 0;
    const FRAME = 1 / 30;

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const now = ts / 1000;
      if (!last) {
        last = now;
        return;
      }
      // Clamp so a tab switch doesn't teleport every stream.
      const dt = Math.min(now - last, 0.1);
      last = now;
      acc += dt;
      if (acc < FRAME) return;
      const step = acc;
      acc = 0;

      const t0 = performance.now();
      draw(step, now);
      const cost = performance.now() - t0;

      // Back off to 1x pixel ratio if drawing consistently runs long.
      if (cost > 14) {
        slowFrames += 1;
        if (slowFrames > 45 && dpr > 1) {
          dpr = 1;
          slowFrames = 0;
          resize();
        }
      } else if (slowFrames > 0) {
        slowFrames -= 1;
      }
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) {
            last = 0;
            raf = requestAnimationFrame(loop);
          }
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
