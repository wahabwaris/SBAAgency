import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/lib/products";
import Reveal from "@/components/Reveal";

/* ── Section shell ───────────────────────────────────────────────────────── */

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  const center = align === "center";
  return (
    <Reveal
      className={`flex flex-col gap-5 ${
        center
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="eyebrow">
            <span className="h-px w-7 bg-brand-500" />
            {eyebrow}
          </p>
        )}
        <h2 className="h2 mt-3 text-balance">{title}</h2>
        {description && <p className="lead mt-4">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/* ── Page banner ─────────────────────────────────────────────────────────── */

export function PageBanner({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs: { href?: string; label: string }[];
}) {
  return (
    <div className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
      <Image
        src="/images/banner-bearings.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="kenburns object-cover object-[75%_60%] opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/30"
      />
      <div className="container-x relative py-14 sm:py-20">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-7 bg-brand-500" />
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[3.25rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-400 sm:text-lg">
              {description}
            </p>
          )}
        </Reveal>
        <Reveal delay={120} as="nav" className="mt-7">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            {crumbs.map((it, i) => (
              <li key={it.label} className="flex items-center gap-1.5">
                {it.href ? (
                  <Link href={it.href} className="transition hover:text-brand-400">
                    {it.label}
                  </Link>
                ) : (
                  <span className="font-medium text-ink-200">{it.label}</span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
}

/* ── Product card ────────────────────────────────────────────────────────── */

export function ProductCard({
  product,
  delay = 0,
}: {
  product: Product;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/products/${product.slug}`}
        className="card card-hover group flex h-full flex-col overflow-hidden p-3"
      >
        <div className="product-tile aspect-square">
          <Image
            src={product.image}
            alt={`${product.designation} ${product.name}`}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <span className="absolute left-2.5 top-2.5 rounded-md bg-ink-950/90 px-2 py-1 text-[11px] font-bold tracking-wide text-brand-400">
            {product.designation}
          </span>
        </div>
        <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
          <h3 className="text-base font-bold leading-snug text-white transition-colors group-hover:text-brand-400">
            {product.name}
          </h3>
          <p className="mt-1.5 font-mono text-xs text-ink-500">
            ⌀{product.bore} × {product.od} × {product.width} mm
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="chip">{product.cage} cage</span>
            {product.seal !== "N/A" && <span className="chip">{product.seal}</span>}
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-500">
            View details
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/* ── Category card ───────────────────────────────────────────────────────── */

export function CategoryCard({
  category,
  count,
  delay = 0,
}: {
  category: Category;
  count: number;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/products?category=${category.slug}`}
        className="card card-hover group flex h-full flex-col overflow-hidden p-3"
      >
        <div className="product-tile aspect-[4/3]">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="h3 transition-colors group-hover:text-brand-400">
              {category.name}
            </h3>
            <span className="mt-0.5 shrink-0 rounded-full border border-brand-500/40 bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-400">
              {count}
            </span>
          </div>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-400">
            {category.blurb}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-500">
            Browse range
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

type I = React.SVGProps<SVGSVGElement>;
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRight(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function CheckIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.5} {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
export function PinIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
export function ClockIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
export function MailIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}
export function PhoneIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.8a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
export function SearchIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
export function ShipIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M3 17c1.6 0 1.6 1.4 3.2 1.4S7.8 17 9.4 17s1.6 1.4 3.2 1.4S14.2 17 15.8 17s1.6 1.4 3.2 1.4S20.6 17 22 17" />
      <path d="M4 14.5 5.5 9h13L20 14.5" />
      <path d="M12 9V5M9 5h6" />
    </svg>
  );
}
export function ShieldIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M12 2.5 20 6v6c0 5-3.4 8.6-8 9.5-4.6-.9-8-4.5-8-9.5V6l8-3.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
export function BoltIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}
export function LayersIcon(p: I) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  );
}
