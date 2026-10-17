import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { company, locations, waMessages } from "@/lib/site";
import { categories } from "@/lib/products";
import Reveal, { Counter } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsApp";
import {
  ArrowRight,
  BoltIcon,
  CheckIcon,
  PageBanner,
  Section,
  SectionHeading,
  ShieldIcon,
  ShipIcon,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sind Bearing Agency (SBA) has been established since 1982 and is one of the largest importers and stockists of Japanese bearings, with four sales centres across Karachi and Lahore.",
};

const milestones = [
  {
    year: "1982",
    title: "SBA is established",
    body: "Sind Bearing Agency opens in Karachi with a single focus — the top quality of all sorts of bearings.",
  },
  {
    year: "Growth",
    title: "Direct import from Japan",
    body: "SBA becomes one of the largest importers and stockists of Japanese bearings serving the Pakistani market.",
  },
  {
    year: "Network",
    title: "Four sales centres",
    body: "Three counters in Karachi and one in Lahore, backed by the infrastructure needed to hold real depth of stock.",
  },
  {
    year: "Today",
    title: "One computerised system",
    body: "All sales centres are connected by a computerised sale and information system for prompt, efficient service.",
  },
];

const values = [
  {
    icon: <ShieldIcon className="h-6 w-6" />,
    title: "Quality first",
    body: "From day one the firm has focused on the top quality of all sorts of bearings. We would rather quote a longer lead time than supply the wrong part.",
  },
  {
    icon: <BoltIcon className="h-6 w-6" />,
    title: "Reliability, uncompromised",
    body: "For over 35 years demanding customers and local retailers have chosen SBA for one single reason — unwavering and uncompromising reliability.",
  },
  {
    icon: <ShipIcon className="h-6 w-6" />,
    title: "Complete satisfaction",
    body: "Excellent infrastructure and sales centres in two cities let us ensure complete satisfaction for retail buyers and industrial accounts alike.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="About us"
        title="Established 1982"
        description="A prominent and ever-improving firm, focused since day one on the top quality of all sorts of bearings."
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">
                <span className="h-px w-7 bg-brand-500" />
                Company profile
              </p>
              <h2 className="h2 mt-3 text-balance">
                One of the largest importers and stockists of Japanese bearings
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-400 sm:text-lg">
                <p>
                  This is tremendously pleasurable to have the introduction of
                  our prominent and ever-improving firm. Sind Bearing Agency
                  (SBA) is well established since {company.established} and with
                  effect from then has always focused on top quality of all sort
                  of bearings.
                </p>
                <p>
                  We are one of the largest importers and stockists of Japanese
                  bearings. For over 35 years demanding customers and local
                  retailers have chosen SBA for one single reason —{" "}
                  <strong className="font-semibold text-white">
                    “unwavering and uncompromising reliability”.
                  </strong>
                </p>
                <p>
                  With its excellent infrastructure and sales centres in Karachi
                  and Lahore we ensure complete satisfaction of our customers. At
                  the moment we have four sales centres, three in Karachi and one
                  in Lahore, which are connected with each other by a
                  computerised sale and information system to help us provide
                  prompt and efficient service to our valued customers.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { to: company.yearsInBusiness, suffix: "+", label: "Years in business" },
                  { to: 4, suffix: "", label: "Sales centres" },
                  { to: 2, suffix: "", label: "Cities served" },
                  { to: 10, suffix: "k+", label: "Part numbers" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-ink-800 bg-ink-900 p-5"
                  >
                    <dt className="font-display text-3xl font-extrabold text-brand-500">
                      <Counter to={s.to} suffix={s.suffix} />
                    </dt>
                    <dd className="mt-1 text-xs font-semibold text-ink-500">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={90}>
              <div className="rounded-3xl border border-ink-800 bg-ink-900 p-3 shadow-card">
                <div className="product-tile">
                  <Image
                    src="/images/products/assortment.jpg"
                    alt="An assortment of tapered, cylindrical, needle and ball bearings from SBA stock"
                    width={800}
                    height={800}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={170}>
              <div className="relative mt-6 overflow-hidden rounded-3xl border border-brand-500/25 bg-ink-900 p-8">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(60%_120%_at_85%_0%,rgba(59,130,246,.18),transparent_60%)]"
                />
                <div className="relative">
                  <p className="text-xs font-bold text-brand-500">
                    Our promise
                  </p>
                  <p className="mt-3 font-display text-2xl font-extrabold leading-snug text-white">
                    “Unwavering and uncompromising reliability.”
                  </p>
                  <p className="mt-3 text-sm text-ink-400">
                    The single reason customers have chosen SBA for more than
                    three decades.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section className="hatch border-y border-ink-800 bg-ink-900">
        <SectionHeading
          eyebrow="Our story"
          title="From one counter to a four-centre network"
          align="center"
        />
        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-500/35 to-transparent lg:block"
          />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <Reveal key={m.title} delay={i * 110} as="li" className="relative">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/40 bg-ink-950 font-display text-sm font-extrabold text-brand-500">
                  0{i + 1}
                </span>
                <p className="mt-5 font-display text-xs font-extrabold text-brand-500">
                  {m.year}
                </p>
                <h3 className="mt-1.5 text-lg font-bold text-white">{m.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-400">
                  {m.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeading
          eyebrow="What we stand for"
          title="Three things we do not compromise on"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 90}>
              <div className="card card-hover group h-full p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition-transform duration-300 group-hover:scale-110">
                  {v.icon}
                </span>
                <h3 className="h3 mt-5 text-xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Range */}
      <Section className="hatch border-y border-ink-800 bg-ink-900">
        <SectionHeading eyebrow="Our range" title="We deal in all types of:" />
        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60} as="li">
              <Link
                href={`/products?category=${c.slug}`}
                className="group flex items-center gap-3 border-b border-ink-800 py-3.5 text-base font-medium text-ink-300 transition hover:text-white"
              >
                <CheckIcon className="h-4 w-4 shrink-0 text-brand-500" />
                <span className="flex-1">{c.name}</span>
                <ArrowRight className="h-4 w-4 text-brand-500 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Locations */}
      <Section>
        <SectionHeading
          eyebrow="Where to find us"
          title="Sales centres"
          description={`${company.salesCentres} counters across Karachi and Lahore, connected by one computerised stock system.`}
          action={
            <Link href="/locations" className="btn-ghost">
              Locations &amp; maps
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {locations.map((l, i) => (
            <Reveal key={l.id} delay={i * 90}>
              <div className="card card-hover h-full p-7">
                <p className="eyebrow">
                  <span className="h-px w-7 bg-brand-500" />
                  {l.kind}
                </p>
                <h3 className="h3 mt-2 text-xl">{l.city}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">
                  {l.address}
                </p>
                {l.phones.length > 0 && (
                  <p className="mt-2 text-sm font-semibold text-ink-300">
                    Tel: {l.phones.join(" / ")}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160} className="mt-10">
          <WhatsAppButton message={waMessages.visit}>
            Ask which counter is nearest
          </WhatsAppButton>
        </Reveal>
      </Section>
    </>
  );
}
