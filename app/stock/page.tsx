import type { Metadata } from "next";
import { PageBanner, Section } from "@/components/ui";
import StockFinder from "@/components/StockFinder";
import { stockItems, stockRanges } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Stock list",
  description:
    "Search SBA's stock list by part number — automotive hub and clutch release bearings, deep groove ball, tapered roller, spherical roller, thrust ball, UC inserts and bearing blocks. Ask price and availability on WhatsApp.",
};

export default function StockPage({
  searchParams,
}: {
  searchParams?: { q?: string; range?: string };
}) {
  const q = (searchParams?.q ?? "").slice(0, 60);
  const requested = searchParams?.range ?? "";
  const range = stockRanges.some((r) => r.slug === requested && !r.pending) ? requested : "";

  return (
    <>
      <PageBanner
        eyebrow="Stock list"
        title="Find your part number"
        description={`${stockItems.length} part numbers listed online across ${stockRanges.length} ranges. Tap the WhatsApp button on any part for price and availability, or add several and send them as one list.`}
        crumbs={[{ href: "/", label: "Home" }, { label: "Stock list" }]}
      />
      <Section className="!pt-0">
        <StockFinder mode="full" initialQuery={q} initialRange={range} />
      </Section>
    </>
  );
}
