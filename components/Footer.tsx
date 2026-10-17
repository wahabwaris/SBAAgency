import Image from "next/image";
import Link from "next/link";
import { company, locations, nav, footerLinks, waMessages, whatsappUrl } from "@/lib/site";
import { categories } from "@/lib/products";
import { WhatsAppGlyph } from "@/components/WhatsApp";
import { MailIcon } from "@/components/ui";
import { SocialList } from "@/components/Social";

export default function Footer() {
  return (
    <footer className="hatch relative overflow-hidden border-t border-ink-800 bg-ink-950">
      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Image
              src="/images/logo.svg"
              alt={`${company.name} logo`}
              width={600}
              height={120}
              className="h-12 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-400">
              Established {company.established}. One of the largest importers and
              stockists of Japanese bearings in Pakistan, chosen for one single
              reason — “{company.promise.toLowerCase()}”.
            </p>
            <a
              href={whatsappUrl(waMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-xl border border-whatsapp/40 bg-whatsapp/10 px-4 py-3 text-sm font-bold text-whatsapp transition hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppGlyph className="h-5 w-5" />
              {company.whatsappDisplay}
            </a>

            <div className="mt-7">
              <p className="font-display text-sm font-semibold text-ink-400">
                Follow us
              </p>
              <SocialList className="mt-3" />
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-[15px] font-bold text-white">
              Company
            </h3>
            <div className="rule-brand mt-3" />
            <ul className="mt-4 space-y-2.5 text-sm">
              {[...nav, ...footerLinks].map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="inline-block text-ink-400 transition hover:translate-x-1 hover:text-brand-400"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-[15px] font-bold text-white">
              Product range
            </h3>
            <div className="rule-brand mt-3" />
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="inline-block text-ink-400 transition hover:translate-x-1 hover:text-brand-400"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-[15px] font-bold text-white">
              Get in touch
            </h3>
            <div className="rule-brand mt-3" />
            <ul className="mt-4 space-y-5 text-sm">
              {locations.map((l) => (
                <li key={l.id}>
                  <p className="font-bold text-white">{l.label}</p>
                  <p className="mt-1 leading-relaxed text-ink-400">
                    {l.address}
                  </p>
                  {l.phones.length > 0 && (
                    <p className="mt-1 text-ink-400">
                      Tel:{" "}
                      {l.phones.map((p, i) => (
                        <span key={p}>
                          <a
                            href={`tel:${p.replace(/\s/g, "")}`}
                            className="transition hover:text-brand-400"
                          >
                            {p}
                          </a>
                          {i < l.phones.length - 1 ? " / " : ""}
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              ))}
              <li className="pt-1">
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-2 font-bold text-brand-500 transition hover:text-brand-400"
                >
                  <MailIcon className="h-4 w-4" />
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-800 pt-7 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>
            {company.legalTagline} ·{" "}
            <a
              href={company.websiteUrl}
              className="transition hover:text-brand-400"
              target="_blank"
              rel="noreferrer"
            >
              {company.website}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
