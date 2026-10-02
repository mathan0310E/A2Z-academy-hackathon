import { useEffect, useState } from "react";

type TypewriterProps = {
  /** Phrases cycled through, one after another. */
  words: string[];
  /** ms per character while typing. */
  typeSpeed?: number;
  /** ms per character while deleting. */
  deleteSpeed?: number;
  /** ms to hold a completed phrase before deleting. */
  holdTime?: number;
  className?: string;
};

/**
 * Types and deletes each phrase in turn, looping forever.
 *
 * The cursor is a separate element so it keeps blinking while the text pauses.
 * Under reduced motion the first phrase is shown statically with no cursor.
 */
export function Typewriter({
  words,
  typeSpeed = 55,
  deleteSpeed = 30,
  holdTime = 1600,
  className = "",
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStaticMode(true);
      setText(words[0] ?? "");
    }
  }, [words]);

  useEffect(() => {
    if (staticMode || words.length === 0) return;
    const current = words[index % words.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdTime);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () => setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)),
      deleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, holdTime, staticMode]);

  return (
    <span className={className}>
      {text}
      {!staticMode && <span className="typewriter-caret" aria-hidden="true" />}
    </span>
  );
}
