import type { Metadata } from "next";
import { Suspense } from "react";
import {
  company,
  locations,
  mapEmbedUrl,
  mapLinkUrl,
  quickReplies,
  waMessages,
  whatsappUrl,
} from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import { FacebookIcon, InstagramIcon } from "@/components/Social";
import Reveal from "@/components/Reveal";
import { WhatsAppButton, WhatsAppGlyph } from "@/components/WhatsApp";
import {
  ArrowRight,
  ClockIcon,
  MailIcon,
  PageBanner,
  PhoneIcon,
  PinIcon,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Sind Bearing Agency — WhatsApp +92 300 2028297, email sba@ktntn.com, call the Lahore office on 042 3772 1168 / 042 3772 1177, or visit the head office in Karachi.",
};

export default function ContactPage() {
  const head = locations[0];

  return (
    <>
      <PageBanner
        eyebrow="Contact us"
        title="Let's find your part"
        description="Send the designation, the dimensions, or a photo of the old bearing. We will check availability across all four sales centres and come back with a price."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />

      {/* WhatsApp first — it is how most customers reach us */}
      <Section className="pb-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-whatsapp/30 bg-ink-900 p-8 sm:p-10">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(50%_120%_at_88%_0%,rgba(37,211,102,.16),transparent_60%)]"
            />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 text-xs font-bold text-whatsapp">
                  <WhatsAppGlyph className="h-4 w-4" />
                  Fastest reply
                </p>
                <h2 className="h2 mt-3">Message us on WhatsApp</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-400">
                  Send a photo of the bearing or just the numbers stamped on the
                  race. Our sales line is{" "}
                  <strong className="font-bold text-white">
                    {company.whatsappDisplay}
                  </strong>
                  .
                </p>
              </div>
              <WhatsAppButton message={waMessages.general} className="shrink-0">
                Open WhatsApp chat
              </WhatsAppButton>
            </div>

            <div className="relative mt-8 flex flex-wrap gap-2.5">
              {quickReplies.map((q) => (
                <a
                  key={q.label}
                  href={whatsappUrl(q.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-950 px-4 py-2 text-sm font-medium text-ink-300 transition hover:-translate-y-0.5 hover:border-whatsapp/60 hover:text-white"
                >
                  <WhatsAppGlyph className="h-3.5 w-3.5 text-whatsapp" />
                  {q.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">
                <span className="h-px w-7 bg-brand-500" />
                Direct lines
              </p>
              <h2 className="h2 mt-3">Talk to us</h2>
              <p className="lead mt-4">
                Counter sales, trade accounts and bulk enquiries all go through
                the same team.
              </p>
            </Reveal>

            <div className="mt-9 space-y-4">
              {[
                {
                  icon: <WhatsAppGlyph className="h-5 w-5" />,
                  label: "WhatsApp",
                  value: company.whatsappDisplay,
                  href: whatsappUrl(waMessages.general),
                  external: true,
                  accent: true,
                },
                {
                  icon: <MailIcon className="h-5 w-5" />,
                  label: "Email",
                  value: company.email,
                  href: `mailto:${company.email}`,
                },
                {
                  icon: <PhoneIcon className="h-5 w-5" />,
                  label: "Lahore office",
                  value: "042 3772 1168 / 042 3772 1177",
                  href: "tel:+924237721168",
                },
                {
                  icon: <PinIcon className="h-5 w-5" />,
                  label: "Head office",
                  value: head.address,
                  href: mapLinkUrl(head.mapQuery),
                  external: true,
                },
                {
                  icon: <InstagramIcon className="h-5 w-5" />,
                  label: "Instagram",
                  value: "@sind.bearingagency",
                  href: "https://www.instagram.com/sind.bearingagency/",
                  external: true,
                },
                {
                  icon: <FacebookIcon className="h-5 w-5" />,
                  label: "Facebook",
                  value: "Sadiq Ameen",
                  href: "https://www.facebook.com/search/top/?q=Sadiq%20Ameen",
                  external: true,
                },
                {
                  icon: <ClockIcon className="h-5 w-5" />,
                  label: "Counter hours",
                  value: head.hours,
                },
              ].map((t, i) => (
                <Reveal key={t.label} delay={i * 70}>
                  <ContactTile {...t} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={200} className="mt-9">
              <div className="overflow-hidden rounded-lg border border-ink-800">
                <iframe
                  title="Map showing the SBA head office in Karachi"
                  src={mapEmbedUrl(head.mapQuery)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[300px] w-full border-0"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <p className="eyebrow">
                <span className="h-px w-7 bg-brand-500" />
                Enquiry form
              </p>
              <h2 className="h2 mt-3">Request a quote</h2>
              <p className="lead mt-4">
                Fill this in and we will confirm availability, lead time and
                price — by email or straight to WhatsApp, whichever you prefer.
              </p>
            </Reveal>
            <Reveal delay={140} className="mt-8">
              <Suspense
                fallback={
                  <div className="card h-[520px] animate-pulse bg-ink-900" />
                }
              >
                <ContactForm />
              </Suspense>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="hatch border-t border-ink-800 bg-ink-900 pt-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {locations.map((l, i) => (
            <Reveal key={l.id} delay={i * 90}>
              <div className="card card-hover h-full p-8">
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
                <a
                  href={mapLinkUrl(l.mapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 transition hover:text-brand-400"
                >
                  Get directions
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

function ContactTile({
  icon,
  label,
  value,
  href,
  external,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  accent?: boolean;
}) {
  const inner = (
    <>
      <span
        className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          accent
            ? "bg-whatsapp/15 text-whatsapp"
            : "bg-brand-500/10 text-brand-500"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-ink-500">
          {label}
        </span>
        <span className="mt-1 block text-sm font-medium leading-relaxed text-white">
          {value}
        </span>
      </span>
    </>
  );

  const cls = `flex gap-4 rounded-2xl border bg-ink-900 p-5 shadow-card transition ${
    accent ? "border-whatsapp/30" : "border-ink-800"
  }`;

  return href ? (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${cls} hover:-translate-y-0.5 ${
        accent ? "hover:border-whatsapp/70" : "hover:border-brand-500/50"
      } hover:shadow-lift`}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
