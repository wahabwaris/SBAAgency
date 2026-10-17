import type { Metadata } from "next";
import Link from "next/link";
import {
  company,
  locations,
  mapEmbedUrl,
  mapLinkUrl,
  waMessages,
} from "@/lib/site";
import Reveal from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsApp";
import {
  ArrowRight,
  ClockIcon,
  MailIcon,
  PageBanner,
  PhoneIcon,
  PinIcon,
  Section,
  SectionHeading,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "SBA sales centres — Head Office at 10, Green Terrace No. 2, Noman Street, Plaza Quarters, Karachi-74400, and the Lahore office at 17 - L.M.C. Market, Badami Bagh, Lahore, Pakistan.",
};

export default function LocationsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Visit us"
        title="Our locations"
        description={`${company.salesCentres} sales centres — three in Karachi and one in Lahore — connected by a computerised sale and information system.`}
        crumbs={[{ href: "/", label: "Home" }, { label: "Locations" }]}
      />

      <Section>
        <SectionHeading
          eyebrow="Sales centres"
          title="Karachi & Lahore"
          description="Walk in to any counter, or send us the part number and we will check availability across the whole network before you travel."
        />

        <div className="mt-12 space-y-12">
          {locations.map((l, i) => (
            <Reveal key={l.id} delay={i * 90}>
              <div className="grid overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 shadow-card lg:grid-cols-2">
                <div className={`p-8 sm:p-10 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-400">
                    {l.kind}
                  </span>
                  <h2 className="h2 mt-4">{l.city}</h2>

                  <dl className="mt-7 space-y-5">
                    <Detail icon={<PinIcon className="h-5 w-5" />} label="Address">
                      {l.address}
                    </Detail>

                    {l.phones.length > 0 && (
                      <Detail
                        icon={<PhoneIcon className="h-5 w-5" />}
                        label="Telephone"
                      >
                        {l.phones.map((p, idx) => (
                          <span key={p}>
                            <a
                              href={`tel:${p.replace(/\s/g, "")}`}
                              className="font-semibold text-brand-500 hover:text-brand-400"
                            >
                              {p}
                            </a>
                            {idx < l.phones.length - 1 && (
                              <span className="text-ink-600"> / </span>
                            )}
                          </span>
                        ))}
                      </Detail>
                    )}

                    <Detail icon={<MailIcon className="h-5 w-5" />} label="Email">
                      <a
                        href={`mailto:${l.email}`}
                        className="font-semibold text-brand-500 hover:text-brand-400"
                      >
                        {l.email}
                      </a>
                    </Detail>

                    <Detail
                      icon={<ClockIcon className="h-5 w-5" />}
                      label="Counter hours"
                    >
                      {l.hours}
                    </Detail>
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={mapLinkUrl(l.mapQuery)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                    >
                      Get directions
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <WhatsAppButton message={waMessages.visit}>
                      Ask about this branch
                    </WhatsAppButton>
                  </div>
                </div>

                <div className="relative min-h-[320px] bg-ink-800 lg:min-h-[460px]">
                  <iframe
                    title={`Map showing the SBA ${l.label} in ${l.city}`}
                    src={mapEmbedUrl(l.mapQuery)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="rounded-3xl border border-dashed border-ink-700 bg-ink-900 p-8 sm:p-10">
            <h2 className="h3 text-xl">Two further Karachi counters</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-400">
              SBA operates four sales centres in total — three in Karachi and one
              in Lahore. The addresses of the two additional Karachi counters are
              not printed in the current company profile. Send them across and
              they will slot straight into this page; until then, the head office
              above will direct you to the nearest counter.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton message={waMessages.visit}>
                WhatsApp {company.whatsappDisplay}
              </WhatsAppButton>
              <a href={`mailto:${company.email}`} className="btn-ghost">
                <MailIcon className="h-4 w-4" />
                {company.email}
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-bold text-ink-500">
          {label}
        </dt>
        <dd className="mt-1 text-sm leading-relaxed text-ink-300">
          {children}
        </dd>
      </div>
    </div>
  );
}
