import { socials } from "@/lib/site";

/* Brand glyphs, drawn as single paths so they stay crisp at any size. */

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Z" />
      <path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
      <circle cx="18.41" cy="5.59" r="1.44" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.6 0h-3.3v16.2c0 1.62-1.3 2.94-2.9 2.94-1.6 0-2.9-1.32-2.9-2.94 0-1.6 1.28-2.9 2.86-2.94.24 0 .48.02.7.08V9.94a6.6 6.6 0 0 0-.7-.04C6.5 9.9 3.9 12.52 3.9 15.75S6.5 21.6 9.7 21.6c3.2 0 5.8-2.62 5.8-5.85V7.32a8.4 8.4 0 0 0 4.9 1.58V5.6a5.1 5.1 0 0 1-2.9-.94A5.16 5.16 0 0 1 16.6 0Z" />
    </svg>
  );
}

export function WhatsAppGlyphIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.02 0C5.4 0 .05 5.35.05 11.97c0 2.11.55 4.17 1.6 6L0 24l6.2-1.62a11.9 11.9 0 0 0 5.82 1.48h.01c6.61 0 11.97-5.35 11.97-11.97C24 5.35 18.65 0 12.02 0Zm0 21.9a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.68.97.98-3.59-.24-.37a9.9 9.9 0 0 1-1.51-5.35c0-5.47 4.45-9.92 9.92-9.92a9.87 9.87 0 0 1 9.92 9.92c0 5.47-4.45 9.93-9.98 9.93Zm5.44-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

const ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  whatsapp: WhatsAppGlyphIcon,
} as const;

/**
 * Social row. Hrefs are placeholders ("#") until the accounts go live — the
 * links are marked aria-disabled so screen readers don't promise a destination
 * that isn't there yet.
 */
export default function SocialLinks({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const glyph = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {socials.map((s) => {
        const Icon = ICONS[s.icon];
        const placeholder = s.href === "#";
        const isWhatsApp = s.icon === "whatsapp";
        return (
          <a
            key={s.name}
            href={s.href}
            aria-label={`${s.name}: ${s.handle}`}
            title={placeholder ? `${s.name} (coming soon)` : `${s.name}: ${s.handle}`}
            {...(placeholder
              ? { "aria-disabled": true }
              : { target: "_blank", rel: "noopener noreferrer" })}
            className={`${box} inline-flex items-center justify-center rounded-md border border-ink-700 bg-ink-900 text-ink-300 transition-colors duration-300 ${
              isWhatsApp
                ? "hover:border-whatsapp/70 hover:text-whatsapp"
                : "hover:border-brand-500/70 hover:text-brand-400"
            }`}
          >
            <Icon className={glyph} />
          </a>
        );
      })}
    </div>
  );
}

/** Icon + name + handle, for the footer and contact page. */
export function SocialList({ className = "" }: { className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {socials.map((s) => {
        const Icon = ICONS[s.icon];
        return (
          <li key={s.name}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-3 text-sm text-ink-300 transition-colors ${
                s.icon === "whatsapp" ? "hover:text-whatsapp" : "hover:text-brand-400"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink-700 bg-ink-900">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs text-ink-500">{s.name}</span>
                <span className="font-semibold">{s.handle}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
