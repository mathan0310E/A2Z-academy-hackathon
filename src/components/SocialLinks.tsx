import { InstagramIcon, LinkedinIcon, WhatsAppIcon } from "@/components/icons/Brand";
import { usePortalContent } from "@/contexts/PortalContentContext";
import { siteConfig } from "@/lib/content";

const ICONS: Record<string, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsAppIcon,
};

/**
 * Renders the official social channels declared in `siteConfig.social`.
 *
 * The WhatsApp entry uses the literal href `whatsapp` because its real URL is
 * resolved at runtime from the portal content API; every other entry carries a
 * fixed destination. Entries whose URL cannot be resolved are dropped rather
 * than rendered as dead links.
 */
export default function SocialLinks({ className = "" }: { className?: string }) {
  const { whatsappUrl } = usePortalContent();

  const links = siteConfig.social
    .map(({ platform, label, href }) => ({
      platform,
      label,
      href: href === "whatsapp" ? whatsappUrl : href,
    }))
    .filter((link) => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()} data-testid="social-links">
      {links.map(({ platform, label, href }) => {
        const Icon = ICONS[platform] ?? WhatsAppIcon;
        return (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D0D0D0] text-[#222222] transition-colors hover:bg-brand-green"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
