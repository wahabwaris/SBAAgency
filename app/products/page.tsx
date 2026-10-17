import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner, Section } from "@/components/ui";
import ProductExplorer from "@/components/ProductExplorer";
import { categories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the SBA bearing catalogue — ball and roller, needle, sliding, bearing units and housings, spherical plain and rod ends, and tapered roller bearings. Search by part number, size or application.",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const requested = searchParams?.category ?? "";
  const initialCategory = categories.some((c) => c.slug === requested)
    ? requested
    : "";

  return (
    <>
      <PageBanner
        eyebrow="Catalogue"
        title="We deal in all types of bearings"
        description="Ball and roller, cage and roller type needle, sliding, bearing units and housings, spherical plain and rod ends, and tapered roller bearings — searchable by part number, dimension or application."
        crumbs={[{ href: "/", label: "Home" }, { label: "Products" }]}
      />

      <Section>
        <Suspense fallback={<p className="text-steel-500">Loading catalogue…</p>}>
          <ProductExplorer initialCategory={initialCategory} />
        </Suspense>
      </Section>
    </>
  );
}
