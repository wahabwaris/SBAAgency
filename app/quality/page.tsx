import type { Metadata } from "next";
import { PageBanner } from "@/components/ui";
import {
  CatalogueBand,
  Certifications,
  GlobalSupplyGrid,
  Head,
  LinkButton,
  ManufacturingNote,
  QcProcess,
  SupplyCapabilities,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Quality and supply",
  description:
    "Sind Bearing Agency supply capabilities, quality control and certifications. Direct importer of Japanese bearings with four sales centres in Karachi and Lahore.",
};

export default function QualityPage() {
  return (
    <>
      <PageBanner
        eyebrow="Quality and supply"
        title="How we supply bearings you can rely on"
        description="Our supply capabilities, quality-control steps and certifications. Items marked “to be confirmed” are being documented and will be published here."
        crumbs={[{ href: "/", label: "Home" }, { label: "Quality" }]}
      />

      <section className="bg-ink-950 py-20 lg:py-24">
        <div className="container-x">
          <Head eyebrow="Supply" title="Supply capabilities" lead="Confirmed facts from the SBA company profile." />
          <div className="mt-12"><SupplyCapabilities /></div>
        </div>
      </section>

      <section className="light py-20 lg:py-24">
        <div className="container-x">
          <Head eyebrow="Quality control" title="Quality-control process" lead="The inspection steps from goods-in to dispatch." />
          <div className="mt-12"><QcProcess light /></div>

          <div className="rule-steel my-16" />

          <Head eyebrow="Certifications" title="Certificates and authorisations" lead="Details will be published here once confirmed." />
          <div className="mt-12"><Certifications light /></div>

          <div className="rule-steel my-16" />

          <Head eyebrow="Sourcing" title="Brands and manufacturing" />
          <div className="mt-8 max-w-xl"><ManufacturingNote light /></div>
        </div>
      </section>

      <section className="bg-ink-950 py-20 lg:py-24">
        <div className="container-x">
          <Head
            eyebrow="International"
            title="Global supply"
            lead="Overseas buyers are welcome to send enquiries now. These terms are being confirmed."
            action={<LinkButton href="/quote">Request a quote</LinkButton>}
          />
          <div className="mt-12"><GlobalSupplyGrid /></div>
        </div>
      </section>

      <CatalogueBand />
    </>
  );
}
