"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, nav, waMessages, whatsappUrl } from "@/lib/site";
import { WhatsAppGlyph } from "@/components/WhatsApp";
import SocialLinks from "@/components/Social";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(y / h, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Stop the page scrolling behind the mobile drawer
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Utility bar */}
      <div className="hidden border-b border-ink-800 bg-ink-950 lg:block">
        <div className="container-x flex h-10 items-center justify-between text-xs">
          <p className="font-medium tracking-wide text-ink-400">
            <span className="text-brand-500">●</span> Established{" "}
            {company.established} · {company.salesCentres} sales centres across
            Karachi &amp; Lahore
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${company.email}`}
              className="text-ink-400 transition hover:text-brand-400"
            >
              {company.email}
            </a>
            <span aria-hidden className="h-3 w-px bg-ink-700" />
            <a
              href="tel:+924237721168"
              className="text-ink-400 transition hover:text-brand-400"
            >
              042 3772 1168
            </a>
            <span aria-hidden className="h-3 w-px bg-ink-700" />
            <a
              href={whatsappUrl(waMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-whatsapp transition hover:text-white"
            >
              <WhatsAppGlyph className="h-3.5 w-3.5" />
              {company.whatsappDisplay}
            </a>
            <span aria-hidden className="h-3 w-px bg-ink-700" />
            <SocialLinks size="sm" className="!gap-1.5" />
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[70] border-b transition-all duration-300 ${
          scrolled
            ? "border-ink-800 bg-ink-950/90 backdrop-blur-md"
            : "border-transparent bg-ink-950"
        }`}
      >
        <div className="container-x flex h-[74px] items-center justify-between gap-6">
          <Link href="/" className="group flex shrink-0 items-center" aria-label={company.name}>
            <Image
              src="/images/logo.svg"
              alt={`${company.name} logo`}
              width={600}
              height={120}
              priority
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-[1.03] sm:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  isActive(item.href)
                    ? "text-brand-400"
                    : "text-ink-300 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand-500 transition-transform duration-300 ${
                    isActive(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={whatsappUrl(waMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden h-11 w-11 items-center justify-center rounded-lg border border-whatsapp/40 text-whatsapp transition hover:bg-whatsapp hover:text-white sm:inline-flex"
            >
              <WhatsAppGlyph className="h-5 w-5" />
            </a>
            <Link href="/quote" className="btn-primary hidden sm:inline-flex">
              Request a quote
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink-700 text-ink-200 transition hover:border-brand-500/60 hover:text-brand-400 lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                    open ? "top-[7px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded bg-current transition-all duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                    open ? "top-[7px] -rotate-45" : "top-[14px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Reading progress */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand-500 transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />

        {/* Mobile drawer */}
        <div
          className={`overflow-hidden border-t border-ink-800 bg-ink-950 transition-[max-height] duration-500 ease-out lg:hidden ${
            open ? "max-h-[560px]" : "max-h-0 border-t-0"
          }`}
        >
          <nav className="container-x flex flex-col py-3" aria-label="Mobile">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ transitionDelay: `${open ? i * 45 : 0}ms` }}
                className={`rounded-lg px-3 py-3.5 text-base font-bold transition-all duration-300 ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                } ${
                  isActive(item.href)
                    ? "bg-brand-500/10 text-brand-400"
                    : "text-ink-200 hover:bg-ink-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mb-4 mt-3 grid gap-2.5">
              <Link href="/quote" className="btn-primary">
                Request a quote
              </Link>
              <a
                href={whatsappUrl(waMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-whatsapp text-white hover:bg-whatsapp-dark"
              >
                <WhatsAppGlyph className="h-5 w-5" />
                WhatsApp {company.whatsappDisplay}
              </a>
              <a href={`tel:+${company.whatsapp}`} className="btn-ghost">
                Call {company.whatsappDisplay}
              </a>
              <SocialLinks className="justify-center pt-1" />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
