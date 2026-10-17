/**
 * Central source of truth for company information.
 * Every fact below is taken verbatim from the SBA Company Profile PDF.
 */

export const company = {
  name: "Sind Bearing Agency",
  shortName: "SBA",
  legalTagline: "Importers & Stockists of Japanese Bearings",
  established: 1982,
  get yearsInBusiness() {
    return new Date().getFullYear() - this.established;
  },
  promise: "Unwavering and uncompromising reliability",
  email: "sba@ktntn.com",
  website: "ktntn.com",
  websiteUrl: "https://ktntn.com",
  /** WhatsApp sales line. Digits only, full international format, no "+". */
  whatsapp: "923002028297",
  whatsappDisplay: "+92 300 2028297",
  whatsappName: "SBA Sales",
  salesCentres: 4,
  intro:
    "This is tremendously pleasurable to have the introduction of our prominent and ever-improving firm. Sind Bearing Agency (SBA) is well established since 1982 and with effect from then has always focused on top quality of all sort of bearings. We are one of the largest importers and stockists of Japanese bearings. For over 35 years demanding customers and local retailers have chosen SBA for one single reason — “unwavering and uncompromising reliability”. With its excellent infrastructure and sales centres in Karachi and Lahore we ensure complete satisfaction of our customers. At the moment we have four sales centres, three in Karachi and one in Lahore, which are connected with each other by a computerised sale and information system to help us provide prompt and efficient service to our valued customers.",
} as const;

export type Location = {
  id: string;
  label: string;
  kind: "Head Office" | "Branch Office";
  city: string;
  address: string;
  phones: string[];
  email: string;
  mapQuery: string;
  hours: string;
};

export const locations: Location[] = [
  {
    id: "karachi-head-office",
    label: "Head Office",
    kind: "Head Office",
    city: "Karachi",
    address:
      "10, Green Terrace No. 2, Noman Street, Plaza Quarters, Karachi-74400, Pakistan.",
    phones: [],
    email: company.email,
    mapQuery:
      "10 Green Terrace No. 2, Noman Street, Plaza Quarters, Karachi 74400, Pakistan",
    hours: "Mon – Sat, 10:00 – 19:00 (PKT)",
  },
  {
    id: "lahore-office",
    label: "Lahore Office",
    kind: "Branch Office",
    city: "Lahore",
    address: "17 - L.M.C. Market, Badami Bagh, Lahore, Pakistan.",
    phones: ["042 3772 1168", "042 3772 1177"],
    email: company.email,
    mapQuery: "17 LMC Market, Badami Bagh, Lahore, Pakistan",
    hours: "Mon – Sat, 10:00 – 19:00 (PKT)",
  },
];

export function mapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function mapLinkUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

export const stats = [
  { value: `${company.yearsInBusiness}+`, label: "Years in business" },
  { value: "4", label: "Sales centres" },
  { value: "2", label: "Cities served" },
  { value: "10k+", label: "Part numbers stocked" },
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/stock", label: "Part Finder" },
  { href: "/quality", label: "Quality" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** secondary links, shown in the footer */
export const footerLinks = [
  { href: "/quote", label: "Request a quote" },
  { href: "/downloads", label: "Downloads" },
  { href: "/faq", label: "FAQ" },
  { href: "/locations", label: "Locations" },
];

/* ── WhatsApp helpers ─────────────────────────────────────────────────────
   wa.me works on mobile, desktop app and WhatsApp Web, so one link covers
   every device. The message is pre-written; the customer just presses send. */

export function whatsappUrl(message: string) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  general: `Hello ${company.shortName}, I found you through your website and I would like to enquire about bearings.`,
  quote: `Hello ${company.shortName}, I would like a quotation. Part number / size:`,
  stock: `Hello ${company.shortName}, could you check stock availability for me? Part number:`,
  identify: `Hello ${company.shortName}, I need help identifying a bearing. I will send a photo and the dimensions.`,
  bulk: `Hello ${company.shortName}, I am enquiring about trade / bulk pricing for a repeat order.`,
  visit: `Hello ${company.shortName}, I would like to visit a sales centre. Which counter is nearest to me?`,
  part: (part: string, range: string) =>
    `Hello ${company.shortName}, please share the price and availability of *${part}* (${range}).`,
  parts: (list: string[]) =>
    `Hello ${company.shortName}, please share price and availability for these bearings:\n\n${list
      .map((p) => `• ${p}`)
      .join("\n")}`,
  range: (range: string) =>
    `Hello ${company.shortName}, I am looking for ${range}. Part number / size:`,
  product: (designation: string, name: string) =>
    `Hello ${company.shortName}, I am interested in *${designation}* (${name}).\n\nPlease confirm availability, price and lead time.`,
};

export const quickReplies = [
  { label: "Request a quotation", message: waMessages.quote },
  { label: "Check stock availability", message: waMessages.stock },
  { label: "Help me identify a bearing", message: waMessages.identify },
  { label: "Trade / bulk pricing", message: waMessages.bulk },
  { label: "Visit a sales centre", message: waMessages.visit },
];

/* ── Social profiles ──────────────────────────────────────────────────────
   Change a link here and every icon on the site follows. */

export type Social = {
  name: string;
  handle: string;
  href: string;
  icon: "instagram" | "facebook" | "tiktok" | "whatsapp";
};

export const socials: Social[] = [
  {
    name: "Instagram",
    handle: "@sind.bearingagency",
    href: "https://www.instagram.com/sind.bearingagency/",
    icon: "instagram",
  },
  {
    name: "Facebook",
    handle: "Sadiq Ameen",
    // Opens a Facebook search for the page name. Replace with the exact
    // profile link (https://www.facebook.com/...) once you have it.
    href: "https://www.facebook.com/search/top/?q=Sadiq%20Ameen",
    icon: "facebook",
  },
  {
    name: "WhatsApp",
    handle: company.whatsappDisplay,
    href: whatsappUrl(waMessages.general),
    icon: "whatsapp",
  },
];

/* ── Phone numbers ────────────────────────────────────────────────────────
   `tel:` needs the number with no spaces. Every phone shown on the site is a
   real link, so a tap dials on mobile. */

export const phones = [
  {
    label: "WhatsApp / Sales",
    display: company.whatsappDisplay,
    tel: `+${company.whatsapp}`,
    primary: true,
  },
  { label: "Lahore Office", display: "042 3772 1168", tel: "+924237721168" },
  { label: "Lahore Office", display: "042 3772 1177", tel: "+924237721177" },
];

export function telHref(display: string) {
  const digits = display.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? digits : "+92" + digits.replace(/^0/, "")}`;
}
