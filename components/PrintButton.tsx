"use client";

/** Prints the page; the print stylesheet turns part pages into a datasheet. */
export default function PrintButton({ label = "Print datasheet", className = "" }: { label?: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={`no-print btn-ghost ${className}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z" />
      </svg>
      {label}
    </button>
  );
}
