import Image from "next/image";
import Link from "next/link";
import Reveal, { Counter } from "@/components/Reveal";
import QuoteForm from "@/components/QuoteForm";
import { WhatsAppButton } from "@/components/WhatsApp";
import { ArrowRight, CheckIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui";
import { company, locations, waMessages } from "@/lib/site";
import { stockCount, stockItems, stockRanges, type StockRange } from "@/lib/stock";
import {
  catalogue,
  certifications,
  globalSupply,
  manufacturing,
  qcSteps,
  supplyCapabilities,
  type Placeholder,
} from "@/lib/content";

/* ── Headings ──────────────────────────────────────────────────────────── */

export function Head({
  eyebrow,
  title,
  lead,
  action,
  center,
  stack,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
  center?: boolean;
  /** keep the action under the text even on wide screens */
  stack?: boolean;
}) {
  return (
    <Reveal
      className={`flex flex-col gap-6 ${center ? "items-center text-center" : stack ? "items-start" : "lg:flex-row lg:items-end lg:justify-between"}`}
    >
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        <p className="eyebrow">
          <span className="h-px w-8 bg-current opacity-70" />
          {eyebrow}
        </p>
        <h2 className="h2 mt-4 text-balance">{title}</h2>
        {lead && <p className="lead mt-4">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/** Outline button that works on both light and dark sections */
export function LinkButton({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`btn group ${light ? "border border-ink-300 text-ink-900 hover:border-ink-900" : "border border-ink-600 text-ink-100 hover:border-ink-300 hover:text-white"}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ── Placeholder card: shown until SBA supplies verified details ─────────── */

export function PlaceholderCard({ item, light, index }: { item: Placeholder; light?: boolean; index?: number }) {
  return (
    <div
      className={`flex h-full flex-col rounded-lg border border-dashed p-5 ${
        light ? "border-ink-300 bg-white/60" : "border-ink-700 bg-ink-900/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {index !== undefined && (
          <span className={`font-display text-sm font-bold ${light ? "text-ink-400" : "text-ink-500"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className={`ml-auto rounded px-2 py-0.5 text-[11px] font-semibold ${light ? "bg-ink-100 text-ink-500" : "bg-ink-800 text-ink-400"}`}>
          To be confirmed
        </span>
      </div>
      <h3 className={`mt-3 font-display text-base font-bold ${light ? "text-ink-900" : "text-white"}`}>{item.title}</h3>
      <p className={`mt-1.5 text-sm leading-relaxed ${light ? "text-ink-500" : "text-ink-400"}`}>
        Details to be published.
      </p>
      {/* What SBA must supply is kept in the HTML for the site owner, hidden from visitors */}
      <span className="sr-only" data-needs={item.needs} />
    </div>
  );
}

/* ── Figures (verified only) ───────────────────────────────────────────── */

export function Figures({ light }: { light?: boolean }) {
  const figures = [
    { to: company.yearsInBusiness, suffix: "+", label: `Years in business, since ${company.established}` },
    { to: company.salesCentres, suffix: "", label: "Sales centres in Karachi and Lahore" },
    { to: stockItems.length, suffix: "+", label: "Part numbers listed online" },
    { to: stockRanges.length, suffix: "", label: "Product ranges in the Part Finder" },
  ];
  return (
    <dl className={`grid grid-cols-2 lg:grid-cols-4 ${light ? "divide-ink-200" : "divide-white/10"}`}>
      {figures.map((f, i) => (
        <div
          key={f.label}
          className={`py-6 pr-4 ${i % 2 ? "border-l pl-5" : ""} ${i === 2 ? "lg:border-l lg:pl-5" : ""} ${
            light ? "border-ink-200" : "border-white/10"
          } ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
        >
          <dt className="sr-only">{f.label}</dt>
          <dd>
            <Counter to={f.to} suffix={f.suffix} className={`font-display text-4xl font-bold tracking-tight sm:text-5xl ${light ? "text-ink-950" : "text-white"}`} />
            <p className={`mt-1.5 text-sm ${light ? "text-ink-500" : "text-ink-300"}`}>{f.label}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Product ranges ────────────────────────────────────────────────────── */

export function RangeGrid() {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
      {stockRanges.map((r, i) => (
        <RangeTile key={r.slug} range={r} wide={i === 0} delay={(i % 4) * 60} />
      ))}
    </div>
  );
}

function RangeTile({ range, wide, delay }: { range: StockRange; wide?: boolean; delay: number }) {
  const count = stockCount(range.slug);
  const samples = range.groups.flatMap((g) => g.parts.slice(0, wide ? 2 : 3)).slice(0, wide ? 6 : 3);
  const href = range.pending ? `/stock#${range.slug}` : `/stock?range=${range.slug}#${range.slug}`;
  return (
    <Reveal delay={delay} className={`bg-white ${wide ? "sm:col-span-2" : ""}`}>
      <div className="group flex h-full flex-col p-5 transition-colors hover:bg-ink-50">
        <Link href={href} className={`relative block overflow-hidden ${wide ? "aspect-[2/1]" : "aspect-[4/3]"}`} aria-label={range.name}>
          <Image
            src={range.image}
            alt=""
            fill
            sizes={wide ? "(max-width:1024px) 100vw, 50vw" : "(max-width:640px) 100vw, 25vw"}
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </Link>
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-ink-100 pt-4">
          <h3 className="h3">
            <Link href={href} className="hover:text-brand-700">{range.name}</Link>
          </h3>
          {!range.pending && <span className="shrink-0 font-display text-base font-bold text-brand-700">{count}</span>}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{range.blurb}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px] text-ink-700">
          {samples.map((s) => (
            <li key={s} className="rounded-sm bg-ink-100 px-1.5 py-0.5">{s}</li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-4 pt-5 text-sm font-semibold">
          <Link href={href} className="inline-flex items-center gap-1.5 text-ink-900 hover:text-brand-700">
            {range.pending ? "Series held" : `View ${count} parts`}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href={`/quote?part=${encodeURIComponent(range.name)}`} className="ml-auto text-ink-500 hover:text-brand-700">
            Quote
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Supply capabilities ───────────────────────────────────────────────── */

export function SupplyCapabilities() {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
      {supplyCapabilities.map((c, i) => (
        <Reveal key={c.title} delay={(i % 2) * 80} className="bg-ink-950 p-7">
          <CheckIcon className="h-6 w-6 text-brand-400" />
          <h3 className="mt-4 font-display text-lg font-bold text-white">{c.title}</h3>
          <p className="mt-2 leading-relaxed text-ink-400">{c.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function GlobalSupplyGrid({ light }: { light?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {globalSupply.map((g, i) => (
        <Reveal key={g.title} delay={i * 60}>
          <PlaceholderCard item={g} light={light} />
        </Reveal>
      ))}
    </div>
  );
}

/* ── Quality ───────────────────────────────────────────────────────────── */

export function Certifications({ light }: { light?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {certifications.map((c, i) => (
        <Reveal key={c.title} delay={i * 70}>
          <PlaceholderCard item={c} light={light} />
        </Reveal>
      ))}
    </div>
  );
}

export function QcProcess({ light }: { light?: boolean }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {qcSteps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 70}>
          <PlaceholderCard item={s} light={light} index={i} />
        </Reveal>
      ))}
    </ol>
  );
}

export function ManufacturingNote({ light }: { light?: boolean }) {
  return <PlaceholderCard item={manufacturing} light={light} />;
}

/* ── Catalogue download band ───────────────────────────────────────────── */

export function CatalogueBand() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-ink-900">
      <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[auto_1fr_auto] lg:gap-14">
        <Reveal className="relative mx-auto h-44 w-36 shrink-0 lg:mx-0">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm bg-ink-700" />
          <div className="absolute inset-0 flex flex-col rounded-sm bg-white p-3 shadow-lift">
            <div className="h-2 w-full rounded-[1px] bg-ink-900" />
            <p className="mt-3 font-display text-[11px] font-bold leading-tight text-ink-950">Stock catalogue</p>
            <div className="relative mt-2 flex-1">
              <Image src="/images/render/deep-groove-pair.jpg" alt="" fill sizes="120px" className="object-contain" />
            </div>
            <p className="text-[8px] text-ink-500">Sind Bearing Agency</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="eyebrow"><span className="h-px w-8 bg-current opacity-70" />Downloads</p>
          <h2 className="h2 mt-3">Download the stock catalogue</h2>
          <p className="lead mt-3 max-w-2xl">
            Every part number in the Part Finder, grouped by range, with standard dimensions.
            PDF, 16 pages, about 0.5 MB.
          </p>
        </Reveal>
        <Reveal delay={140} className="flex flex-wrap gap-3">
          <a href={catalogue.href} download className="btn-primary">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
            Download PDF
          </a>
          <LinkButton href="/downloads">All downloads</LinkButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Request a quote ───────────────────────────────────────────────────── */

export function QuoteSection({ initialPart = "" }: { initialPart?: string }) {
  const head = locations[0];
  return (
    <section id="quote" className="bg-ink-950 py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow"><span className="h-px w-8 bg-current opacity-70" />Request a quote</p>
          <h2 className="h2 mt-4 text-balance">Tell us what you need. We reply with price and availability.</h2>
          <p className="lead mt-5">
            List the part numbers and quantities. Distributors, workshops and plant buyers are all welcome, in Pakistan and abroad.
          </p>
          <ul className="mt-9 space-y-5">
            <li className="flex gap-4">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
              <div>
                <p className="text-sm text-ink-400">WhatsApp and phone</p>
                <a href={`tel:+${company.whatsapp}`} className="font-semibold text-white hover:text-brand-300">{company.whatsappDisplay}</a>
              </div>
            </li>
            <li className="flex gap-4">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
              <div>
                <p className="text-sm text-ink-400">Email</p>
                <a href={`mailto:${company.email}`} className="font-semibold text-white hover:text-brand-300">{company.email}</a>
              </div>
            </li>
            <li className="flex gap-4">
              <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
              <div>
                <p className="text-sm text-ink-400">Head office</p>
                <p className="font-semibold text-white">{head.address}</p>
                <p className="mt-0.5 text-sm text-ink-400">{head.hours}</p>
              </div>
            </li>
          </ul>
          <WhatsAppButton message={waMessages.quote} className="mt-9">Quick enquiry on WhatsApp</WhatsAppButton>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-lg border border-ink-800 bg-ink-900 p-6 sm:p-8">
            <QuoteForm initialPart={initialPart} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
