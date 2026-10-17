"use client";

import { useState } from "react";
import { company, whatsappUrl } from "@/lib/site";
import { WhatsAppGlyph } from "@/components/WhatsApp";

type Line = { part: string; qty: string };

/**
 * Request for quotation. The site has no server, so the enquiry is handed to
 * the buyer's WhatsApp or email app, fully written, ready to send to SBA.
 * Nothing is stored or sent anywhere else.
 */
export default function QuoteForm({
  initialPart = "",
  tone = "dark",
}: {
  initialPart?: string;
  tone?: "dark" | "light";
}) {
  const [lines, setLines] = useState<Line[]>([{ part: initialPart, qty: "" }]);
  const [f, setF] = useState({ name: "", company: "", country: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<"" | "whatsapp" | "email">("");

  const light = tone === "light";
  const field = light
    ? "w-full rounded-md border border-ink-300 bg-white px-3.5 py-2.5 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
    : "field";
  const label = `mb-1.5 block text-sm font-medium ${light ? "text-ink-700" : "text-ink-300"}`;

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const setLine = (i: number, k: keyof Line, v: string) =>
    setLines(lines.map((l, j) => (j === i ? { ...l, [k]: v } : l)));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Enter your name.";
    if (!f.country.trim()) e.country = "Enter your country.";
    if (!f.email.trim() && !f.phone.trim()) e.contact = "Give an email address or a phone / WhatsApp number so we can reply.";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "This email address does not look complete.";
    if (!lines.some((l) => l.part.trim())) e.lines = "Add at least one part number or description.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const message = () => {
    const items = lines
      .filter((l) => l.part.trim())
      .map((l, i) => `${i + 1}. ${l.part.trim()}${l.qty.trim() ? `  —  qty ${l.qty.trim()}` : ""}`)
      .join("\n");
    return [
      `Request for quotation — ${company.name}`,
      "",
      items,
      "",
      `Name: ${f.name}`,
      f.company && `Company: ${f.company}`,
      `Country: ${f.country}`,
      f.email && `Email: ${f.email}`,
      f.phone && `Phone / WhatsApp: ${f.phone}`,
      f.notes && `\nNotes: ${f.notes}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const send = (via: "whatsapp" | "email") => {
    if (!validate()) return;
    if (via === "whatsapp") {
      window.open(whatsappUrl(message()), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        `Request for quotation${f.company ? ` — ${f.company}` : ""}`
      )}&body=${encodeURIComponent(message())}`;
    }
    setSent(via);
  };

  const err = (k: string) =>
    errors[k] ? <p className="mt-1.5 text-sm text-red-500" role="alert">{errors[k]}</p> : null;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        send("whatsapp");
      }}
      className="space-y-6"
    >
      <fieldset>
        <legend className={`font-display text-base font-bold ${light ? "text-ink-950" : "text-white"}`}>Bearings required</legend>
        <div className="mt-3 space-y-2.5">
          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-[minmax(0,1fr)_88px_40px] gap-2.5">
              <label className="sr-only" htmlFor={`part-${i}`}>Part number or description, line {i + 1}</label>
              <input id={`part-${i}`} className={`${field} font-mono`} placeholder="Part number, e.g. 6205LLU" value={l.part} onChange={(e) => setLine(i, "part", e.target.value)} />
              <label className="sr-only" htmlFor={`qty-${i}`}>Quantity, line {i + 1}</label>
              <input id={`qty-${i}`} className={field} inputMode="numeric" placeholder="Qty" value={l.qty} onChange={(e) => setLine(i, "qty", e.target.value)} />
              <button
                type="button"
                onClick={() => setLines(lines.length > 1 ? lines.filter((_, j) => j !== i) : [{ part: "", qty: "" }])}
                aria-label={`Remove line ${i + 1}`}
                className={`flex items-center justify-center rounded-md border transition ${light ? "border-ink-300 text-ink-500 hover:border-ink-500 hover:text-ink-900" : "border-ink-700 text-ink-400 hover:border-ink-500 hover:text-white"}`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
          ))}
        </div>
        {err("lines")}
        <button
          type="button"
          onClick={() => setLines([...lines, { part: "", qty: "" }])}
          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${light ? "text-brand-700 hover:text-brand-600" : "text-brand-400 hover:text-brand-300"}`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add another part
        </button>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="q-name">Your name *</label>
          <input id="q-name" className={field} autoComplete="name" value={f.name} onChange={set("name")} />
          {err("name")}
        </div>
        <div>
          <label className={label} htmlFor="q-company">Company</label>
          <input id="q-company" className={field} autoComplete="organization" value={f.company} onChange={set("company")} />
        </div>
        <div>
          <label className={label} htmlFor="q-country">Country *</label>
          <input id="q-country" className={field} autoComplete="country-name" value={f.country} onChange={set("country")} />
          {err("country")}
        </div>
        <div>
          <label className={label} htmlFor="q-phone">Phone / WhatsApp</label>
          <input id="q-phone" className={field} type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="q-email">Email</label>
          <input id="q-email" className={field} type="email" autoComplete="email" value={f.email} onChange={set("email")} />
          {err("email")}
          {err("contact")}
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="q-notes">Notes</label>
          <textarea id="q-notes" rows={3} className={field} placeholder="Brand preference, delivery city or port, required date…" value={f.notes} onChange={set("notes")} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn bg-whatsapp text-white hover:bg-whatsapp-dark">
          <WhatsAppGlyph className="h-5 w-5" />
          Send on WhatsApp
        </button>
        <button type="button" onClick={() => send("email")} className={light ? "btn border border-ink-300 text-ink-900 hover:border-ink-900" : "btn-ghost"}>
          Send by email
        </button>
      </div>

      {sent ? (
        <p role="status" className={`rounded-md p-3.5 text-sm ${light ? "bg-brand-50 text-brand-900" : "bg-brand-500/10 text-brand-200"}`}>
          Your {sent === "whatsapp" ? "WhatsApp" : "email app"} has opened with the enquiry written out. Press send there to deliver it to SBA.
        </p>
      ) : (
        <p className={`text-xs ${light ? "text-ink-500" : "text-ink-500"}`}>
          Sending opens WhatsApp ({company.whatsappDisplay}) or your email app ({company.email}) with this enquiry written out. Nothing is stored on this website.
        </p>
      )}
    </form>
  );
}
