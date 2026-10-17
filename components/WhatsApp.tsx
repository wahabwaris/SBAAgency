"use client";

import { useEffect, useRef, useState } from "react";
import { company, quickReplies, waMessages, whatsappUrl } from "@/lib/site";

/**
 * The official WhatsApp glyph, drawn as a single path so it stays crisp at any
 * size and always looks like the real icon.
 */
export function WhatsAppGlyph({
  className = "h-6 w-6",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/* ── Floating widget — mounted once in the root layout, so it is on every page ── */

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // A single gentle nudge after a few seconds, only if they have not opened it
  useEffect(() => {
    const t = window.setTimeout(() => setNudge(true), 5200);
    const t2 = window.setTimeout(() => setNudge(false), 14000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  // Close on Escape or on a click outside the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const go = (message: string) => {
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with SBA on WhatsApp"
          className="w-[min(92vw,360px)] origin-bottom-right animate-pop-in overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-lift"
        >
          {/* header */}
          <div className="flex items-center gap-3 bg-whatsapp-deep px-4 py-3.5">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
              <WhatsAppGlyph className="h-6 w-6" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-whatsapp-deep bg-whatsapp" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                {company.whatsappName}
              </p>
              <p className="text-xs text-white/70">
                Typically replies within business hours
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* body */}
          <div className="hatch max-h-[52vh] overflow-y-auto bg-ink-950 px-4 py-5">
            <div className="animate-bubble-in max-w-[88%] rounded-2xl rounded-tl-sm bg-ink-800 px-4 py-3 text-sm leading-relaxed text-ink-200">
              <p className="font-semibold text-white">
                Assalam-o-Alaikum, welcome to {company.name}.
              </p>
              <p className="mt-1.5">
                Importers and stockists of Japanese bearings since{" "}
                {company.established}. How can we help you today?
              </p>
            </div>

            <p className="mt-5 text-[11px] font-bold text-ink-500">
              Choose a topic
            </p>
            <div className="mt-2.5 space-y-2">
              {quickReplies.map((q, i) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => go(q.message)}
                  style={{ animationDelay: `${90 + i * 55}ms` }}
                  className="animate-bubble-in flex w-full items-center justify-between gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-left text-sm font-medium text-ink-200 transition hover:-translate-y-0.5 hover:border-whatsapp/70 hover:text-white"
                >
                  {q.label}
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-whatsapp" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* footer */}
          <div className="border-t border-ink-800 bg-ink-900 p-3">
            <button
              type="button"
              onClick={() => go(waMessages.general)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-sm font-bold text-white transition hover:bg-whatsapp-dark active:scale-[.98]"
            >
              <WhatsAppGlyph className="h-5 w-5" />
              Start chat · {company.whatsappDisplay}
            </button>
          </div>
        </div>
      )}

      {/* Nudge bubble */}
      {!open && nudge && (
        <div className="animate-pop-in mr-1 max-w-[240px] rounded-2xl rounded-br-sm border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-ink-200 shadow-lift">
          <p className="font-semibold text-white">Need a part number?</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-400">
            Chat with us on WhatsApp — we will check stock across all four sales
            centres.
          </p>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setNudge(false);
        }}
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 hover:scale-110 active:scale-95 sm:h-16 sm:w-16"
      >
        {!open && (
          <span
            aria-hidden
            className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp"
          />
        )}
        <span className="relative">
          {open ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <WhatsAppGlyph className="h-7 w-7 sm:h-8 sm:w-8" />
          )}
        </span>
      </button>
    </div>
  );
}

/* ── Inline button, for use inside page content ── */

export function WhatsAppButton({
  message,
  children,
  className = "",
  size = "md",
}: {
  message: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn bg-whatsapp text-white hover:bg-whatsapp-dark ${
        size === "sm" ? "!px-4 !py-2.5 text-xs" : ""
      } ${className}`}
    >
      <WhatsAppGlyph className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      {children ?? "WhatsApp us"}
    </a>
  );
}
