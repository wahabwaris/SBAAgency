import Link from "next/link";
import { waMessages } from "@/lib/site";
import { WhatsAppButton } from "@/components/WhatsApp";
import { ArrowRight } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="hatch relative flex min-h-[64vh] flex-col items-center justify-center overflow-hidden py-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 animate-spin-slower rounded-full border-[42px] border-brand-500/[.07]"
      />
      <div className="container-x relative">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="h1 mt-4">This part is out of stock</h1>
        <p className="lead mx-auto mt-5 max-w-lg">
          The page you were looking for does not exist. Try the catalogue, or
          send us the part number and we will track it down.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-primary">
            Browse the catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
          <WhatsAppButton message={waMessages.stock}>
            Ask on WhatsApp
          </WhatsAppButton>
          <Link href="/" className="btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
