import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsApp";
import { company, locations } from "@/lib/site";

export const viewport: Viewport = {
  themeColor: "#050B1A",
};

export const metadata: Metadata = {
  metadataBase: new URL(company.websiteUrl),
  title: {
    default: `${company.name} (SBA) — ${company.legalTagline}`,
    template: `%s | ${company.name}`,
  },
  description:
    "Sind Bearing Agency (SBA) — established 1982, one of the largest importers and stockists of Japanese bearings in Pakistan. Ball, roller, needle, tapered, sliding and spherical plain bearings from four sales centres in Karachi and Lahore.",
  keywords: [
    "bearings Pakistan",
    "Japanese bearings Karachi",
    "ball bearing supplier Lahore",
    "bearing importer Pakistan",
    "tapered roller bearing",
    "needle bearing",
    "pillow block",
    "Sind Bearing Agency",
    "SBA bearings",
  ],
  openGraph: {
    type: "website",
    title: `${company.name} (SBA)`,
    description:
      "Importers & stockists of Japanese bearings since 1982. Four sales centres across Karachi and Lahore.",
    siteName: company.name,
    locale: "en_PK",
  },
  icons: { icon: "/favicon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  alternateName: "SBA",
  url: company.websiteUrl,
  email: company.email,
  logo: `${company.websiteUrl}/images/logo-dark.svg`,
  foundingDate: String(company.established),
  description: company.legalTagline,
  address: locations.map((l) => ({
    "@type": "PostalAddress",
    streetAddress: l.address,
    addressLocality: l.city,
    addressCountry: "PK",
  })),
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: `+${company.whatsapp}`,
      contactType: "sales",
      contactOption: "TollFree",
      areaServed: "PK",
      availableLanguage: ["en", "ur"],
    },
    ...locations
      .filter((l) => l.phones.length > 0)
      .map((l) => ({
        "@type": "ContactPoint",
        telephone: l.phones[0],
        contactType: "sales",
        areaServed: "PK",
      })),
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-bold focus:text-ink-950"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* Mounted here, so the WhatsApp button is on every single page */}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
