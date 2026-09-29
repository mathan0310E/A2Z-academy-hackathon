import { cn } from "@/lib/utils";

/**
 * Official A2Z Academy brand mark. Source artwork is the same asset the brand
 * site uses (public/logo/logo.jpeg), pre-cropped and re-encoded as WebP with a
 * PNG fallback — a ~15× smaller payload than the 1254² original.
 */
export default function BrandLogo({
  className,
  wordmarkClassName,
}: {
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-brand-navy/10">
        <picture>
          <source srcSet="/logo/logo-mark-128.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo-mark-128.png"
            alt="A2Z Academy"
            width={40}
            height={40}
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      </span>
      <span className={cn("text-xl font-extrabold tracking-tight", wordmarkClassName)}>
        A2Z <span className="text-brand-green">Academy</span>
      </span>
    </span>
  );
}