
import { WhatsAppIcon } from "@/components/icons/Brand";
import { usePortalContent } from "@/contexts/PortalContentContext";

/**
 * Site-wide notice band. The pulsing icon and hover states are pure CSS.
 */
export default function ImportantNotice() {
  const { whatsappUrl } = usePortalContent();
  const whatsAppUrl = whatsappUrl || "#";

  return (
    <section className="w-full border-y border-brand-green/25 bg-brand-green-soft py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 text-center md:flex-row md:gap-4 md:py-8">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 animate-pulse-slow items-center justify-center text-brand-green-ink">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.27 2 11.5c0 2.12.84 4.02 2.2 5.4L3 21h3.2l1.5 2h9l1.5-2H21l-1.2-4.6C21.16 15.52 22 13.62 22 11.5 22 6.27 17.52 2 12 2zm-1 14.5c-.55 0-1-.45-1-1V12c0-.55.45-1 1-1s1 .45 1 1v3.5c0 .55-.45 1-1 1zm0-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
            </svg>
          </span>
          <p className="text-sm font-medium text-brand-ink">
            <span className="font-semibold text-brand-green-ink">Registration is the entry path</span>{" "}
            to the A2Z Academy Hackathon. After registering, join the official WhatsApp group for all updates.
          </p>
        </div>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-brand-ink-strong shadow-brand transition-transform hover:scale-105 active:scale-95"
        >
            <WhatsAppIcon className="h-4 w-4" />
          Join Official WhatsApp Group
        </a>
      </div>
    </section>
  );
}
