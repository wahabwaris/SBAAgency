"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/products";
import { company, whatsappUrl } from "@/lib/site";
import { CheckIcon } from "@/components/ui";
import { WhatsAppGlyph } from "@/components/WhatsApp";

type Status = "idle" | "sending" | "sent";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("part") ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: "",
    part: prefill,
    quantity: "",
    message: "",
  });

  useEffect(() => {
    if (prefill) setForm((f) => ({ ...f, part: prefill }));
  }, [prefill]);

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const compose = () =>
    [
      `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.category && `Category: ${form.category}`,
      form.part && `Part number / designation: ${form.part}`,
      form.quantity && `Quantity: ${form.quantity}`,
      "",
      "Message:",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

  /**
   * No backend is wired up yet, so the form hands a well-structured message to
   * the visitor's mail client — or straight to WhatsApp, which most customers
   * here will prefer. Swap either for a POST to your own API route when ready.
   */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const subject = form.part
      ? `Enquiry: ${form.part}`
      : `Website enquiry from ${form.name || "a customer"}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(compose())}`;
    window.setTimeout(() => setStatus("sent"), 600);
  };

  const sendOnWhatsApp = () => {
    const text = `Hello ${company.shortName}, enquiry from your website.\n\n${compose()}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="card animate-pop-in p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="h3 mt-5 text-xl">Your enquiry is on its way</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-400">
          We have pre-filled a message with your details. Press send in the app
          that just opened and we will come back to you with availability and
          pricing.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-ghost mt-7"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Your name <span className="text-brand-500">*</span>
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={set("name")}
            className="field"
            placeholder="Ahmed Khan"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="label" htmlFor="company">
            Company
          </label>
          <input
            id="company"
            value={form.company}
            onChange={set("company")}
            className="field"
            placeholder="Optional"
            autoComplete="organization"
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email <span className="text-brand-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            className="field"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            className="field"
            placeholder="+92 300 0000000"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="label" htmlFor="category">
            Product category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={set("category")}
            className="field"
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="Other / not sure">Other / not sure</option>
          </select>
        </div>
        <div className="grid grid-cols-[1fr_104px] gap-3">
          <div>
            <label className="label" htmlFor="part">
              Part number
            </label>
            <input
              id="part"
              value={form.part}
              onChange={set("part")}
              className="field"
              placeholder="e.g. 6205-2RS"
            />
          </div>
          <div>
            <label className="label" htmlFor="quantity">
              Qty
            </label>
            <input
              id="quantity"
              value={form.quantity}
              onChange={set("quantity")}
              className="field"
              placeholder="10"
              inputMode="numeric"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="message">
            Message <span className="text-brand-500">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={set("message")}
            className="field resize-y"
            placeholder="Tell us the application, the dimensions you have measured, or the number stamped on the old bearing."
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-500">
          Your details go straight to {company.email}. We never share them.
        </p>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <button
            type="button"
            onClick={sendOnWhatsApp}
            className="btn bg-whatsapp text-white hover:bg-whatsapp-dark"
          >
            <WhatsAppGlyph className="h-5 w-5" />
            Send on WhatsApp
          </button>
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary disabled:opacity-60"
          >
            {status === "sending" ? "Preparing…" : "Send by email"}
          </button>
        </div>
      </div>
    </form>
  );
}
