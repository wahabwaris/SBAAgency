"use client";

import { useState } from "react";

/** Accessible accordion: buttons with aria-expanded, one panel open at a time. */
export default function Faq({
  items,
  tone = "light",
}: {
  items: { q: string; a: string }[];
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const dark = tone === "dark";
  return (
    <div className={`divide-y border-y ${dark ? "divide-ink-800 border-ink-800" : "divide-ink-200 border-ink-200"}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[17px] font-semibold transition-colors ${
                  dark ? "text-white hover:text-brand-300" : "text-ink-950 hover:text-brand-700"
                }`}
              >
                {it.q}
                <span
                  aria-hidden
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                    dark ? "border-ink-700" : "border-ink-300"
                  } ${isOpen ? "rotate-45" : ""}`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
            </h3>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className={`max-w-3xl pb-6 leading-relaxed ${dark ? "text-ink-300" : "text-ink-600"}`}>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
