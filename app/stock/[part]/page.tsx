import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findItem, stockItems, stockRanges } from "@/lib/stock";
import { detailFor } from "@/lib/stockDetails";
import { company, waMessages } from "@/lib/site";
import ZoomImage, { ZoomThumb } from "@/components/ZoomImage";
import { WhatsAppButton } from "@/components/WhatsApp";
import { ArrowRight, CheckIcon } from "@/components/ui";
import PrintButton from "@/components/PrintButton";

export function generateStaticParams() {
  return stockItems.map((it) => ({ part: it.slug }));
}

export function generateMetadata({ params }: { params: { part: string } }): Metadata {
  const it = findItem(params.part);
  if (!it) return {};
  const d = detailFor(it);
  return { title: d.title, description: d.summary };
}

export default function StockPartPage({ params }: { params: { part: string } }) {
  const it = findItem(params.part);
  if (!it) notFound();
  const d = detailFor(it);
  const range = stockRanges.find((r) => r.slug === it.range)!;

  const siblings = stockItems.filter((s) => s.group === it.group && s.range === it.range);
  const at = siblings.findIndex((s) => s.slug === it.slug);
  const nearby = siblings
    .map((s, i) => ({ s, k: Math.abs(i - at) }))
    .filter((x) => x.s.slug !== it.slug)
    .sort((a, b) => a.k - b.k)
    .slice(0, 8)
    .map((x) => x.s)
    .sort((a, b) => siblings.indexOf(a) - siblings.indexOf(b));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: d.title,
    sku: it.part,
    mpn: it.part,
    category: it.rangeName,
    description: d.summary,
    image: `${company.websiteUrl}${it.image}`,
    additionalProperty: d.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="border-b border-ink-800 bg-ink-950">
        <nav aria-label="Breadcrumb" className="container-x py-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            <li><Link href="/" className="hover:text-brand-400">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/stock" className="hover:text-brand-400">Stock list</Link></li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/stock?range=${range.slug}#${range.slug}`} className="hover:text-brand-400">
                {range.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-mono font-semibold text-ink-200 [overflow-wrap:anywhere]">{it.part}</li>
          </ol>
        </nav>
      </div>

      <section className="py-10 lg:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Picture */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ZoomImage
              src={it.image}
              alt={`${it.part} ${d.title.replace(it.part, "").trim()}`}
              caption={d.title}
              priority
              className="aspect-square rounded-lg bg-white"
              imgClassName="object-contain p-4 sm:p-8"
            />
            <p className="mt-3 text-xs text-ink-500">
              Picture shows the bearing type. Markings, seal colour and cage material vary by maker and batch.
            </p>
          </div>

          {/* Summary */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-400">{it.group}</p>
            <h1 className="mt-2 font-mono text-3xl font-bold leading-tight text-white [overflow-wrap:anywhere] sm:text-4xl">
              {it.part}
            </h1>
            <p className="mt-1 font-display text-xl font-semibold text-ink-200">
              {d.title.replace(it.part, "").trim()}
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink-300">{d.summary}</p>

            <div className="no-print mt-7 flex flex-wrap gap-3">
              <Link href={`/quote?part=${encodeURIComponent(it.part)}`} className="btn-primary group">
                Request a quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <WhatsAppButton message={waMessages.part(it.part, d.title.replace(it.part, "").trim().toLowerCase())}>
                Ask on WhatsApp
              </WhatsAppButton>
              <PrintButton />
            </div>
            <p className="no-print mt-3 text-sm text-ink-500">
              We reply with price and stock across our Karachi and Lahore sales centres.
            </p>
            <p className="print-only mt-3 text-sm">
              {company.name} · WhatsApp {company.whatsappDisplay} · {company.email} · {company.website}
            </p>

            <h2 className="h3 mt-10 text-2xl">Specifications</h2>
            <dl className="mt-4 divide-y divide-ink-800 overflow-hidden rounded-lg border border-ink-800">
              {d.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 bg-ink-900 px-4 py-3 text-sm">
                  <dt className="text-ink-400">{s.label}</dt>
                  <dd className="font-medium text-white [overflow-wrap:anywhere]">{s.value}</dd>
                </div>
              ))}
            </dl>
            {d.fitment && (
              <p className="mt-3 text-xs text-ink-500">
                Vehicle list is for reference. Confirm with your model and year before fitting.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="light py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="max-w-2xl">
            <h2 className="h2 text-3xl sm:text-4xl">About this bearing</h2>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-600">
              {d.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {d.suffix && (
              <>
                <h3 className="h3 mt-10">What the number means</h3>
                <dl className="mt-4 space-y-3">
                  {d.suffix.map((s) => (
                    <div key={s.code} className="rounded-lg border border-ink-200 bg-white p-4">
                      <dt className="font-mono text-sm font-bold text-brand-700">{s.code}</dt>
                      <dd className="mt-1 text-ink-600">{s.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>

          <div>
            <h3 className="h3">Typical applications</h3>
            <ul className="mt-4 space-y-3">
              {d.applications.map((a) => (
                <li key={a} className="flex gap-3 text-ink-700">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  {a}
                </li>
              ))}
            </ul>
            {d.fitment && (
              <>
                <h3 className="h3 mt-10">Fits (reference)</h3>
                <p className="mt-3 text-ink-700">{d.fitment}</p>
              </>
            )}
            <div className="no-print mt-10 rounded-lg bg-ink-950 p-6">
              <p className="font-display text-xl font-semibold text-white">Not sure it is the right one?</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Send a photo of your old bearing and its measurements. We will match it and tell you what is in stock.
              </p>
              <WhatsAppButton message={waMessages.identify} size="sm" className="mt-4">
                Send a photo on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      {/* Same series */}
      {nearby.length > 0 && (
        <section className="no-print py-14 lg:py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="h2 text-3xl sm:text-4xl">More in {it.group}</h2>
              <Link href={`/stock?range=${range.slug}#${range.slug}`} className="btn-ghost">
                See all {siblings.length}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {nearby.map((s) => (
                <li key={s.slug} className="flex min-w-0 items-center gap-3 rounded-lg border border-ink-800 bg-ink-900 p-2.5 hover:border-ink-600">
                  <ZoomThumb src={s.image} alt={s.part} className="h-14 w-14" />
                  <Link href={`/stock/${s.slug}`} className="min-w-0 flex-1">
                    <p className="font-mono text-[15px] font-bold leading-tight text-white [overflow-wrap:anywhere]">{s.part}</p>
                    <p className="truncate text-xs text-ink-400">
                      {s.dims ? `${s.dims[0]} × ${s.dims[1]} × ${s.dims[2]} mm` : "View details"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
