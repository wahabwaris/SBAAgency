import type { Metadata } from "next";
import { PageBanner } from "@/components/ui";
import { QuoteSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Request a quotation for Japanese bearings from Sind Bearing Agency. List part numbers and quantities and get price and availability by WhatsApp or email.",
};

export default function QuotePage({ searchParams }: { searchParams?: { part?: string } }) {
  const part = (searchParams?.part ?? "").slice(0, 80);
  return (
    <>
      <PageBanner
        eyebrow="Request a quote"
        title="Price and availability for your bearings"
        description="Add each part number with its quantity. Your enquiry opens in WhatsApp or your email app, ready to send."
        crumbs={[{ href: "/", label: "Home" }, { label: "Request a quote" }]}
      />
      <QuoteSection initialPart={part} />
    </>
  );
}
