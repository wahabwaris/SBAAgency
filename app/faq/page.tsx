import type { Metadata } from "next";
import { PageBanner } from "@/components/ui";
import Faq from "@/components/Faq";
import { QuoteSection } from "@/components/sections";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about ordering bearings from Sind Bearing Agency: quotations, identifying bearings, stock, locations and part number suffixes.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageBanner
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Ordering, identifying bearings, stock and part numbers."
        crumbs={[{ href: "/", label: "Home" }, { label: "FAQ" }]}
      />
      <section className="light py-16 lg:py-24">
        <div className="container-x max-w-4xl">
          <Faq items={faqs} />
        </div>
      </section>
      <QuoteSection />
    </>
  );
}
