import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBanner } from "@/components/ui";
import { catalogue } from "@/lib/content";
import { stockItems } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download the Sind Bearing Agency stock catalogue (PDF) and print technical datasheets for any listed bearing.",
};

export default function DownloadsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Downloads"
        title="Catalogue and datasheets"
        description="Product information to keep, print or share with your purchasing team."
        crumbs={[{ href: "/", label: "Home" }, { label: "Downloads" }]}
      />
      <section className="light py-16 lg:py-24">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <article className="flex flex-col gap-6 rounded-lg border border-ink-200 bg-white p-7 sm:flex-row">
            <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-sm border border-ink-200 bg-white">
              <Image src="/images/render/deep-groove-pair.jpg" alt="" fill sizes="128px" className="object-contain p-2" />
            </div>
            <div>
              <h2 className="h3 text-xl">{catalogue.title} (PDF)</h2>
              <p className="mt-2 text-ink-600">
                All {stockItems.length} part numbers in the Part Finder, grouped by range, with standard dimensions.
                16 pages, about 0.5 MB.
              </p>
              <a href={catalogue.href} download className="btn-primary mt-5">Download PDF</a>
            </div>
          </article>
          <article className="rounded-lg border border-ink-200 bg-white p-7">
            <h2 className="h3 text-xl">Technical datasheets</h2>
            <p className="mt-2 text-ink-600">
              Every bearing in the Part Finder has its own page with specifications, suffix explanation and
              applications. Use “Print datasheet” on that page to print it or save it as a PDF.
            </p>
            <Link href="/stock" className="btn mt-5 border border-ink-300 text-ink-900 hover:border-ink-900">Open the Part Finder</Link>
          </article>
          <article className="rounded-lg border border-dashed border-ink-300 bg-white/60 p-7 lg:col-span-2">
            <span className="rounded bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">To be confirmed</span>
            <h2 className="h3 mt-3 text-xl">Company profile and certificates</h2>
            <p className="mt-2 text-ink-600">Downloadable copies will be added here once confirmed.</p>
          </article>
        </div>
      </section>
    </>
  );
}
