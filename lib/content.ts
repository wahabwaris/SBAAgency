/**
 * Website content that is not product data.
 *
 * RULE: only facts from the SBA company profile or confirmed by SBA go in
 * `verified` lists. Anything SBA still has to confirm is a Placeholder: the
 * site shows it as "to be confirmed" and it is easy to find here. Do not
 * replace a placeholder with a claim (a certificate, an export market, a
 * test) unless SBA can show proof of it.
 */
import { company } from "@/lib/site";

export type Placeholder = {
  placeholder: true;
  title: string;
  /** what SBA needs to supply to complete this item */
  needs: string;
};

/* ── Supply capabilities (all from the company profile) ─────────────────── */

export const supplyCapabilities = [
  {
    title: "Direct importer of Japanese bearings",
    body: "SBA imports directly and is one of the largest importers and stockists of Japanese bearings in Pakistan.",
  },
  {
    title: "Stock held in depth",
    body: "Ball, roller, needle, sliding, tapered and spherical plain bearings, bearing units and housings, held as stock rather than ordered on demand.",
  },
  {
    title: `${company.salesCentres} sales centres, one system`,
    body: "Three sales centres in Karachi and one in Lahore, connected by a computerised sale and information system.",
  },
  {
    title: `In business since ${company.established}`,
    body: "Demanding customers and local retailers have relied on SBA for decades for one reason: unwavering and uncompromising reliability.",
  },
];

/* ── Placeholders: SBA to confirm before these show real content ─────────── */

export const certifications: Placeholder[] = [
  { placeholder: true, title: "Quality management certificate", needs: "Certificate name, number, issuing body and expiry date, plus a PDF copy." },
  { placeholder: true, title: "Authorised distributor status", needs: "Brand name(s) and a letter or certificate of authorisation." },
  { placeholder: true, title: "Trade and import registration", needs: "Registration type and number you are happy to publish." },
];

export const qcSteps: Placeholder[] = [
  { placeholder: true, title: "Goods-in inspection", needs: "What is checked when a shipment arrives (packaging, markings, documents)." },
  { placeholder: true, title: "Origin and authenticity", needs: "How origin is confirmed (supplier documents, brand verification)." },
  { placeholder: true, title: "Storage and handling", needs: "How bearings are stored (packaging kept sealed, dry storage, stock rotation)." },
  { placeholder: true, title: "Dispatch check", needs: "What is checked before an order leaves (part number, quantity, packing)." },
];

export const globalSupply: Placeholder[] = [
  { placeholder: true, title: "Export markets served", needs: "Countries or regions SBA ships to today." },
  { placeholder: true, title: "Shipping terms (Incoterms)", needs: "e.g. EXW Karachi, FOB Karachi, CIF; which ones SBA quotes." },
  { placeholder: true, title: "Payment terms for overseas buyers", needs: "e.g. advance payment, letter of credit." },
  { placeholder: true, title: "Export documents", needs: "Which documents SBA can provide (commercial invoice, packing list, certificate of origin)." },
];

export const manufacturing: Placeholder = {
  placeholder: true,
  title: "Brands and manufacturing partners",
  needs:
    "SBA is an importer and stockist, not a manufacturer. List the bearing brands/manufacturers SBA is authorised to sell, with logos you have permission to use.",
};

/* ── FAQ (answers use only confirmed information) ────────────────────────── */

export const faqs = [
  {
    q: "How do I get a price for a bearing?",
    a: `Send the part number and quantity using the Request a Quote form or on WhatsApp (${company.whatsappDisplay}). We reply with price and availability.`,
  },
  {
    q: "I only have the old bearing, with no readable number. Can you help?",
    a: "Yes. Send a clear photo and the measurements (bore, outside diameter and width in millimetres) on WhatsApp and we will identify it and check stock.",
  },
  {
    q: "Which bearings do you stock?",
    a: "Ball and roller bearings, cage and roller type needle bearings, sliding bearings, bearing units and housings, spherical plain bearings and rod ends, and tapered roller bearings, plus automotive wheel hub and clutch release bearings. Search the Part Finder for the numbers listed online.",
  },
  {
    q: "Is every part number you hold listed on the website?",
    a: "No. The Part Finder shows the numbers listed online so far. If you cannot find yours, send it to us; we check stock across all sales centres.",
  },
  {
    q: "Where are your sales centres and when are they open?",
    a: "Our head office is in Karachi, with three sales centres in Karachi and one in Lahore. Counters are open Monday to Saturday, 10:00 to 19:00 (Pakistan time).",
  },
  {
    q: "What do the letters after a bearing number mean?",
    a: "They describe the version. For example LLU or 2RS means rubber seals on both sides, ZZ means steel shields, NR means a snap ring on the outer ring and X marks ISO-revised tapered roller dimensions. Each part page in the Part Finder explains its own suffix.",
  },
  {
    q: "Do you supply buyers outside Pakistan?",
    a: "Send your enquiry with your country and the quantities needed and we will reply with what we can offer. (Export terms are being added to this page.)",
  },
  {
    q: "Can I download your product list?",
    a: "Yes. The stock catalogue PDF lists every part number shown online with its standard dimensions. Download it from the Downloads page.",
  },
];

export const catalogue = {
  href: "/downloads/SBA-Stock-Catalogue.pdf",
  title: "SBA stock catalogue",
};
