import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getProduct,
  products,
  relatedProducts,
} from "@/lib/products";
import { company, waMessages } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsApp";
import ZoomImage from "@/components/ZoomImage";
import {
  ArrowRight,
  CheckIcon,
  PageBanner,
  ProductCard,
  Section,
} from "@/components/ui";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getProduct(params.slug);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.designation} — ${p.name}`,
    description: `${p.designation} ${p.name}: bore ⌀${p.bore} mm, outside ⌀${p.od} mm, width ${p.width} mm. ${p.description}`,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = relatedProducts(product);

  const specs: [string, string][] = [
    ["Designation", product.designation],
    ["Type", product.name],
    ["Bore diameter (d)", `${product.bore} mm`],
    ["Outside diameter (D)", `${product.od} mm`],
    ["Width / height (B)", `${product.width} mm`],
    ["Cage material", product.cage],
    ["Sealing", product.seal],
    ...(product.dynamicLoad
      ? ([["Basic dynamic load rating (C)", product.dynamicLoad]] as [string, string][])
      : []),
    ...(product.speed
      ? ([["Reference speed (grease)", product.speed]] as [string, string][])
      : []),
  ];

  return (
    <>
      <PageBanner
        eyebrow={category?.name ?? "Product"}
        title={product.designation}
        description={product.name}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          ...(category
            ? [{ href: `/products?category=${category.slug}`, label: category.short }]
            : []),
          { label: product.designation },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <Reveal>
            <ZoomImage
              src={product.image}
              alt={`${product.designation} ${product.name}`}
              caption={`${product.designation} ${product.name}`}
              priority
              className="aspect-square rounded-lg bg-white"
              imgClassName="object-contain p-6 sm:p-10"
            />
            <p className="mt-3 text-xs text-ink-600">
              Tap the picture to zoom. Picture shows the bearing type; markings and
              cage material vary by maker and series.
            </p>
          </Reveal>

          {/* Detail */}
          <Reveal delay={110}>
            {category && (
              <Link
                href={`/products?category=${category.slug}`}
                className="eyebrow hover:text-brand-400"
              >
                <span className="h-px w-7 bg-brand-500" />
                {category.name}
              </Link>
            )}
            <h1 className="h2 mt-3">{product.name}</h1>
            <p className="mt-2 font-display text-2xl font-extrabold text-brand-500">
              {product.designation}
            </p>

            <p className="lead mt-6">{product.description}</p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { k: "Bore ⌀", v: `${product.bore} mm` },
                { k: "Outside ⌀", v: `${product.od} mm` },
                { k: "Width", v: `${product.width} mm` },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-ink-800 bg-ink-900 p-4 text-center"
                >
                  <p className="text-xs font-semibold text-ink-500">
                    {s.k}
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold text-white">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-bold text-ink-500">
                Typical applications
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.applications.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 text-sm text-ink-300"
                  >
                    <CheckIcon className="h-4 w-4 shrink-0 text-brand-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* The WhatsApp message names this exact part */}
            <div className="mt-9 flex flex-wrap gap-3">
              <WhatsAppButton
                message={waMessages.product(product.designation, product.name)}
              >
                Ask price on WhatsApp
              </WhatsAppButton>
              <Link
                href={`/quote?part=${encodeURIComponent(product.designation)}`}
                className="btn-ghost"
              >
                Request a quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              Opens a chat with {company.whatsappDisplay}, pre-filled with{" "}
              {product.designation}.
            </p>
          </Reveal>
        </div>

        {/* Spec table */}
        <Reveal className="mt-16">
          <h2 className="h3 text-xl">Technical specification</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-ink-800">
            <table className="w-full text-sm">
              <tbody>
                {specs.map(([k, v], i) => (
                  <tr
                    key={k}
                    className={i % 2 === 0 ? "bg-ink-900" : "bg-ink-950"}
                  >
                    <th
                      scope="row"
                      className="w-1/2 px-5 py-3.5 text-left font-semibold text-ink-400 sm:w-2/5"
                    >
                      {k}
                    </th>
                    <td className="px-5 py-3.5 font-medium text-white">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-600">
            Dimensions are nominal and follow standard ISO series designations.
            Load ratings and speeds vary between manufacturers — confirm against
            the maker&apos;s catalogue before final selection.
          </p>
        </Reveal>
      </Section>

      {related.length > 0 && (
        <Section className="hatch border-t border-ink-800 bg-ink-900 pt-16">
          <h2 className="h2">More from {category?.short}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} delay={i * 70} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
