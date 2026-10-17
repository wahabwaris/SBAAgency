import Image from "next/image";
import Link from "next/link";
import { company, waMessages } from "@/lib/site";
import { faqs } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import StockFinder from "@/components/StockFinder";
import SpecTables from "@/components/SpecTables";
import Faq from "@/components/Faq";
import { WhatsAppGlyph } from "@/components/WhatsApp";
import { ArrowRight, CheckIcon } from "@/components/ui";
import {
  CatalogueBand,
  Certifications,
  Figures,
  GlobalSupplyGrid,
  Head,
  LinkButton,
  ManufacturingNote,
  QcProcess,
  QuoteSection,
  RangeGrid,
  SupplyCapabilities,
} from "@/components/sections";
import { whatsappUrl } from "@/lib/site";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Hero />
      <Intro />
      <Products />
      <TechnicalData />
      <Industries />
      <Quality />
      <Supply />
      <CatalogueBand />
      <FaqSection />
      <QuoteSection />
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div className="absolute inset-0 -z-10">
        <Parallax className="absolute inset-0">
          <Image
            src="/images/banner-bearings.jpg"
            alt="Ball, roller, tapered and thrust bearings"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_70%]"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="container-x pb-10 pt-16 sm:pt-24 lg:pb-12 lg:pt-32">
        <div className="max-w-2xl">
          <p className="hero-in eyebrow" style={{ animationDelay: "60ms" }}>
            <span className="h-px w-8 bg-current opacity-70" />
            {company.legalTagline}, since {company.established}
          </p>
          <h1 className="hero-in h1 mt-6 text-balance" style={{ animationDelay: "150ms" }}>
            Japanese bearings for industry, held in stock
          </h1>
          <p className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-ink-200" style={{ animationDelay: "260ms" }}>
            Sind Bearing Agency imports and stocks ball, roller, tapered, thrust and automotive
            bearings, with sales centres in Karachi and Lahore on one computerised stock system.
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "360ms" }}>
            <Link href="/quote" className="btn-primary group">
              Request a quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/stock" className="btn-ghost">Open the Part Finder</Link>
            <a
              href={whatsappUrl(waMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-whatsapp hover:text-white"
            >
              <WhatsAppGlyph className="h-4 w-4" />
              {company.whatsappDisplay}
            </a>
          </div>

          <div className="hero-in mt-10 max-w-xl" style={{ animationDelay: "460ms" }}>
            <p className="mb-2.5 text-sm font-medium text-ink-300">Check a part number</p>
            <StockFinder mode="compact" />
          </div>
        </div>

        <div className="hero-in mt-16 border-t border-white/10" style={{ animationDelay: "560ms" }}>
          <Figures />
        </div>
      </div>
    </section>
  );
}

/* ── Company introduction ───────────────────────────────────────────────── */

function Intro() {
  const points = [
    "Direct importer, so stock is deep and the origin is known",
    "Three sales centres in Karachi, one in Lahore",
    "One computerised sale and information system across all four",
  ];
  return (
    <section className="light py-20 lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow"><span className="h-px w-8 bg-current opacity-70" />Company</p>
          <h2 className="h2 mt-4 text-balance">One of Pakistan’s largest importers and stockists of Japanese bearings</h2>
          <p className="lead mt-5">
            Sind Bearing Agency was established in {company.established} with a single focus: the top quality of
            all sorts of bearings. For over {company.yearsInBusiness} years, demanding customers and local retailers
            have chosen SBA for one reason: unwavering and uncompromising reliability.
          </p>
          <ul className="mt-8 space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-ink-700">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9"><LinkButton href="/about" light>About SBA</LinkButton></div>
        </Reveal>
        <Reveal delay={120}>
          <div className="sheen relative overflow-hidden rounded-lg border border-ink-200 bg-white p-8">
            <Image
              src="/images/render/deep-groove-open.jpg"
              alt="Open deep groove ball bearing with brass cage"
              width={1000}
              height={1000}
              sizes="(max-width:1024px) 100vw, 45vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Product categories ─────────────────────────────────────────────────── */

function Products() {
  return (
    <section className="light border-t border-ink-200 py-20 lg:py-28">
      <div className="container-x">
        <Head
          eyebrow="Products"
          title="Bearing ranges"
          lead="Every range below opens in the Part Finder, with sizes, versions and a quote button on each part."
          action={<LinkButton href="/stock" light>Open the Part Finder</LinkButton>}
        />
        <div className="mt-12"><RangeGrid /></div>
        <p className="mt-6 text-sm text-ink-500">
          Also in stock: needle, sliding, spherical plain bearings and rod ends.{" "}
          <Link href="/products" className="font-semibold text-brand-700 hover:text-brand-600">Browse the product catalogue</Link>
        </p>
      </div>
    </section>
  );
}

/* ── Technical specifications ───────────────────────────────────────────── */

function TechnicalData() {
  return (
    <section className="bg-white py-20 text-ink-600 lg:py-28 [&_.eyebrow]:text-brand-600 [&_.h2]:text-ink-950 [&_.lead]:text-ink-500">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div>
          <Head stack eyebrow="Technical data" title="Standard dimensions at a glance" lead="Boundary dimensions for the most requested series, to ISO standards. Tap a listed version to open its datasheet." />
          <Reveal delay={100} className="mt-8 space-y-3 text-sm text-ink-600">
            <p className="flex gap-3"><CheckIcon className="h-5 w-5 shrink-0 text-brand-600" />Every part page has a printable datasheet</p>
            <p className="flex gap-3"><CheckIcon className="h-5 w-5 shrink-0 text-brand-600" />Suffixes explained in plain language</p>
            <p className="flex gap-3"><CheckIcon className="h-5 w-5 shrink-0 text-brand-600" />Inch and metric series</p>
          </Reveal>
        </div>
        <Reveal delay={80}><SpecTables /></Reveal>
      </div>
    </section>
  );
}

/* ── Industries ─────────────────────────────────────────────────────────── */

function Industries() {
  const industries = [
    { t: "Automotive", d: "Wheel hub units, clutch release, gearbox and differential bearings." },
    { t: "Textile", d: "Motor, spindle-drive and line-shaft bearings for continuous running." },
    { t: "Sugar and cement", d: "Spherical rollers, thrust bearings and housed units for heavy, dusty duty." },
    { t: "Pumps and motors", d: "Deep groove ball bearings in sealed and motor-grade versions." },
    { t: "Agriculture", d: "Tapered rollers, UC inserts, pillow blocks and flange units." },
    { t: "Steel and general engineering", d: "Tapered, cylindrical and thrust bearings for mills and gearboxes." },
  ];
  return (
    <section className="bg-ink-950 py-20 lg:py-28">
      <div className="container-x">
        <Head eyebrow="Industries" title="Bearings for the machines that run industry" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((it, i) => (
            <Reveal key={it.t} delay={(i % 3) * 70} className="group bg-ink-950 p-7 transition-colors hover:bg-ink-900">
              <span className="font-display text-sm font-bold text-ink-500">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-xl font-bold text-white">{it.t}</h3>
              <p className="mt-2 leading-relaxed text-ink-400">{it.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Quality ────────────────────────────────────────────────────────────── */

function Quality() {
  return (
    <section className="light py-20 lg:py-28">
      <div className="container-x">
        <Head
          eyebrow="Quality"
          title="Certifications and quality control"
          lead="Certificate details and our inspection steps are being documented and will be published here."
          action={<LinkButton href="/quality" light>Quality and supply</LinkButton>}
        />
        <div className="mt-12"><Certifications light /></div>
        <h3 className="h3 mt-14 text-xl">Quality-control process</h3>
        <div className="mt-5"><QcProcess light /></div>
      </div>
    </section>
  );
}

/* ── Supply capabilities ────────────────────────────────────────────────── */

function Supply() {
  return (
    <section className="bg-ink-950 py-20 lg:py-28">
      <div className="container-x">
        <Head eyebrow="Supply" title="Supply capabilities" lead="What every SBA order is backed by today." />
        <div className="mt-12"><SupplyCapabilities /></div>
        <h3 className="h3 mt-16 text-xl">International buyers</h3>
        <p className="mt-2 max-w-2xl text-ink-400">Send your country and quantities with your enquiry. Export details below are being confirmed.</p>
        <div className="mt-6"><GlobalSupplyGrid /></div>
        <div className="mt-4"><ManufacturingNote /></div>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */

function FaqSection() {
  return (
    <section className="light py-20 lg:py-28">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-20">
        <Head stack eyebrow="FAQ" title="Questions buyers ask" lead="Can’t find your answer? Ask us on WhatsApp or by email." action={<LinkButton href="/faq" light>All questions</LinkButton>} />
        <Reveal delay={80}><Faq items={faqs.slice(0, 6)} /></Reveal>
      </div>
    </section>
  );
}
