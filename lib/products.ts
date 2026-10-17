/**
 * SBA product catalogue.
 *
 * The six categories below are exactly the six lines listed under
 * "WE DEAL IN ALL TYPES OF:" in the SBA company profile. The individual
 * items use standard ISO/industry designations and their published
 * nominal dimensions, so the catalogue is a realistic starting point —
 * swap in your own stock list and pricing when you go live.
 */

export type Category = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  image: string;
  icon: string;
};

export type Product = {
  slug: string;
  designation: string;
  name: string;
  category: string; // category slug
  image: string;
  /** bore ⌀ d (mm) */
  bore: number;
  /** outside ⌀ D (mm) */
  od: number;
  /** width / height B (mm) */
  width: number;
  cage: "Steel" | "Brass" | "Polyamide" | "Bronze" | "Full complement";
  seal: "Open" | "2RS (rubber)" | "ZZ (shielded)" | "Sealed" | "N/A";
  dynamicLoad?: string;
  speed?: string;
  applications: string[];
  description: string;
  featured?: boolean;
};

export const categories: Category[] = [
  {
    slug: "ball-and-roller-bearings",
    name: "Ball & Roller Bearings",
    short: "Ball & Roller",
    blurb:
      "The workhorse of every drive line. Deep groove, angular contact, cylindrical, spherical and multi-row roller bearings held in depth across metric and inch series.",
    image: "/images/render/deep-groove-pair.jpg",
    icon: "ball",
  },
  {
    slug: "needle-bearings",
    name: "Cage & Roller Type Needle Bearings",
    short: "Needle",
    blurb:
      "Where radial space is tight. Drawn cup, machined ring and cage-and-roller assemblies that carry heavy radial loads in a very small section height.",
    image: "/images/products/needle-roller.svg",
    icon: "needle",
  },
  {
    slug: "sliding-bearings",
    name: "Sliding Bearings",
    short: "Sliding",
    blurb:
      "Bronze, self-lubricating and composite bushings for low-speed, high-load and oscillating duty where a rolling element simply will not fit.",
    image: "/images/products/sliding-bearing.svg",
    icon: "bush",
  },
  {
    slug: "bearing-units-and-housings",
    name: "Bearing Units & Housings",
    short: "Units & Housings",
    blurb:
      "Ready-to-bolt pillow blocks, flange units, take-up units and split plummer block housings — insert bearing, seals and grease nipple already fitted.",
    image: "/images/render/pillow-block.jpg",
    icon: "unit",
  },
  {
    slug: "spherical-plain-and-rod-ends",
    name: "Spherical Plain Bearings & Rod Ends",
    short: "Plain & Rod Ends",
    blurb:
      "Maintenance-free and re-greasable spherical plain bearings plus male and female rod ends for hydraulic cylinders, linkages and steering gear.",
    image: "/images/products/spherical-plain.svg",
    icon: "rodend",
  },
  {
    slug: "tapered-roller-bearings",
    name: "Tapered Roller Bearings",
    short: "Tapered",
    blurb:
      "Single, double and four-row tapered rollers for combined radial and axial loads — wheel hubs, gearboxes, rolling mills and heavy axles.",
    image: "/images/render/tapered-roller.jpg",
    icon: "taper",
  },
];

export const products: Product[] = [
  // ── Ball & roller ──────────────────────────────────────────────────────────
  {
    slug: "6205-2rs",
    designation: "6205-2RS",
    name: "Deep Groove Ball Bearing",
    category: "ball-and-roller-bearings",
    image: "/images/render/deep-groove-sealed.jpg",
    bore: 25,
    od: 52,
    width: 15,
    cage: "Steel",
    seal: "2RS (rubber)",
    dynamicLoad: "14.0 kN",
    speed: "9,000 rpm",
    applications: ["Electric motors", "Pumps", "Fans", "Agricultural machinery"],
    description:
      "The single most requested bearing in our stock. Contact-sealed on both sides and pre-greased for life, the 6205-2RS handles radial and moderate axial load in either direction with very low friction.",
    featured: true,
  },
  {
    slug: "6206-zz",
    designation: "6206-ZZ",
    name: "Deep Groove Ball Bearing, Shielded",
    category: "ball-and-roller-bearings",
    image: "/images/render/deep-groove-shielded.jpg",
    bore: 30,
    od: 62,
    width: 16,
    cage: "Steel",
    seal: "ZZ (shielded)",
    dynamicLoad: "19.5 kN",
    speed: "11,000 rpm",
    applications: ["Gearboxes", "Textile machinery", "Compressors"],
    description:
      "Pressed-steel shields keep contamination out without the drag of a contact seal, making the ZZ variant the right pick where speed matters more than sealing.",
  },
  {
    slug: "6309-open",
    designation: "6309",
    name: "Deep Groove Ball Bearing, Open",
    category: "ball-and-roller-bearings",
    image: "/images/render/deep-groove-open.jpg",
    bore: 45,
    od: 100,
    width: 25,
    cage: "Brass",
    seal: "Open",
    dynamicLoad: "55.3 kN",
    speed: "6,700 rpm",
    applications: ["Crushers", "Conveyor drives", "Marine gear"],
    description:
      "Heavy 63-series section with a machined brass cage for shock loading and elevated temperature. Supplied open for oil-bath or circulating-oil lubrication.",
  },
  {
    slug: "7208-becbp",
    designation: "7208 BECBP",
    name: "Angular Contact Ball Bearing",
    category: "ball-and-roller-bearings",
    image: "/images/products/angular-contact.svg",
    bore: 40,
    od: 80,
    width: 18,
    cage: "Polyamide",
    seal: "Open",
    dynamicLoad: "37.7 kN",
    speed: "12,000 rpm",
    applications: ["Machine tool spindles", "Pump shafts", "Worm gear units"],
    description:
      "A 40° contact angle carries axial load in one direction and high combined load when mounted back-to-back or in tandem. Universally matchable in pairs.",
  },
  {
    slug: "nu-210-ecp",
    designation: "NU 210 ECP",
    name: "Cylindrical Roller Bearing",
    category: "ball-and-roller-bearings",
    image: "/images/render/cylindrical-roller.jpg",
    bore: 50,
    od: 90,
    width: 20,
    cage: "Polyamide",
    seal: "Open",
    dynamicLoad: "64.4 kN",
    speed: "8,500 rpm",
    applications: ["Traction motors", "Rolling mills", "Large gear drives"],
    description:
      "Line contact between roller and raceway gives a far higher radial capacity than a ball bearing of the same envelope. The NU design lets the shaft float axially.",
    featured: true,
  },
  {
    slug: "22213-ek",
    designation: "22213 EK",
    name: "Spherical Roller Bearing, Tapered Bore",
    category: "ball-and-roller-bearings",
    image: "/images/render/spherical-roller.jpg",
    bore: 65,
    od: 120,
    width: 31,
    cage: "Brass",
    seal: "Open",
    dynamicLoad: "186 kN",
    speed: "5,300 rpm",
    applications: ["Vibrating screens", "Paper mills", "Cement plant", "Fans"],
    description:
      "Two rows of barrel rollers running on a common spherical outer raceway. Self-aligning, so it forgives shaft deflection and housing misalignment — indispensable in heavy plant.",
    featured: true,
  },
  {
    slug: "23130-cc-w33",
    designation: "23130 CC/W33",
    name: "Spherical Roller Bearing, Annular Groove",
    category: "ball-and-roller-bearings",
    image: "/images/render/spherical-roller.jpg",
    bore: 150,
    od: 250,
    width: 80,
    cage: "Steel",
    seal: "Open",
    dynamicLoad: "800 kN",
    speed: "2,000 rpm",
    applications: ["Crushers", "Kiln drives", "Marine propulsion"],
    description:
      "W33 annular groove and three lubrication holes in the outer ring feed grease directly to the rollers, extending relubrication intervals on large slow-turning shafts.",
  },
  {
    slug: "51105-thrust",
    designation: "51105",
    name: "Thrust Roller Bearing",
    category: "ball-and-roller-bearings",
    image: "/images/render/thrust-roller.jpg",
    bore: 25,
    od: 42,
    width: 11,
    cage: "Brass",
    seal: "Open",
    dynamicLoad: "19.8 kN",
    speed: "3,600 rpm",
    applications: ["Vertical pumps", "Turntables", "Crane hooks", "Jacks"],
    description:
      "Pure axial capacity in one direction. Washers separate so the shaft and housing rings can be mounted independently.",
  },
  {
    slug: "fc-4056170-four-row",
    designation: "FC 4056170",
    name: "Four-Row Cylindrical Roller Bearing",
    category: "ball-and-roller-bearings",
    image: "/images/render/four-row-cylindrical.jpg",
    bore: 200,
    od: 280,
    width: 170,
    cage: "Brass",
    seal: "Open",
    dynamicLoad: "1,850 kN",
    speed: "900 rpm",
    applications: ["Rolling mill work rolls", "Backup rolls"],
    description:
      "Purpose-built for rolling mill roll necks. Four rows of rollers give an exceptionally high radial rating in a short section, with separable rings for fast roll changes.",
  },

  // ── Needle ────────────────────────────────────────────────────────────────
  {
    slug: "hk-1512",
    designation: "HK 1512",
    name: "Drawn Cup Needle Roller Bearing",
    category: "needle-bearings",
    image: "/images/products/needle-roller.svg",
    bore: 15,
    od: 21,
    width: 12,
    cage: "Steel",
    seal: "Open",
    dynamicLoad: "9.1 kN",
    speed: "16,000 rpm",
    applications: ["Motorcycle gearboxes", "Small pumps", "Power tools"],
    description:
      "A thin drawn outer cup runs directly on a hardened shaft, giving the smallest possible section height. Press directly into the housing bore — no separate outer ring needed.",
  },
  {
    slug: "na-4905",
    designation: "NA 4905",
    name: "Machined Ring Needle Bearing, With Inner Ring",
    category: "needle-bearings",
    image: "/images/products/needle-roller.svg",
    bore: 25,
    od: 42,
    width: 17,
    cage: "Steel",
    seal: "Open",
    dynamicLoad: "22.5 kN",
    speed: "9,000 rpm",
    applications: ["Machine tools", "Textile machinery", "Robot joints"],
    description:
      "Supplied with an inner ring so the shaft does not need to be hardened and ground. Machined rings hold tighter tolerances than a drawn cup.",
  },
  {
    slug: "k-25x30x17",
    designation: "K 25x30x17",
    name: "Needle Roller & Cage Assembly",
    category: "needle-bearings",
    image: "/images/products/needle-roller.svg",
    bore: 25,
    od: 30,
    width: 17,
    cage: "Steel",
    seal: "N/A",
    dynamicLoad: "15.6 kN",
    speed: "13,000 rpm",
    applications: ["Planetary gears", "Connecting rods", "Automotive transmissions"],
    description:
      "Cage and roller set only — the shaft and housing form the raceways. The lightest, most compact needle arrangement available.",
  },
  {
    slug: "nkia-5905",
    designation: "NKIA 5905",
    name: "Combined Needle Roller / Angular Contact Bearing",
    category: "needle-bearings",
    image: "/images/products/needle-roller.svg",
    bore: 25,
    od: 42,
    width: 23,
    cage: "Steel",
    seal: "Open",
    dynamicLoad: "24.2 kN",
    speed: "8,500 rpm",
    applications: ["Machine tool feed drives", "Screw jacks"],
    description:
      "A needle row for radial load and an angular contact ball row for axial load in a single unit — ideal for lead-screw supports.",
  },

  // ── Sliding ───────────────────────────────────────────────────────────────
  {
    slug: "bushing-cb-3040",
    designation: "CB 3040-30",
    name: "Bronze Sleeve Bushing",
    category: "sliding-bearings",
    image: "/images/products/sliding-bearing.svg",
    bore: 30,
    od: 40,
    width: 30,
    cage: "Bronze",
    seal: "N/A",
    applications: ["Hydraulic cylinders", "Hinges", "Agricultural linkages"],
    description:
      "Wrapped bronze sleeve with diamond-shaped oil pockets. Handles heavy load at low sliding speed and tolerates edge loading better than any rolling element.",
  },
  {
    slug: "bushing-fb-3040",
    designation: "FB 3040-25",
    name: "Flanged Bronze Bushing",
    category: "sliding-bearings",
    image: "/images/products/sliding-bearing.svg",
    bore: 30,
    od: 40,
    width: 25,
    cage: "Bronze",
    seal: "N/A",
    applications: ["Presses", "Rollers", "Conveyor idlers"],
    description:
      "The integral flange takes light axial thrust and locates the bushing positively in the housing during press-fit.",
  },
  {
    slug: "bushing-pap-2530",
    designation: "PAP 2530 P10",
    name: "Self-Lubricating Composite Bushing",
    category: "sliding-bearings",
    image: "/images/products/sliding-bearing.svg",
    bore: 25,
    od: 28,
    width: 30,
    cage: "Bronze",
    seal: "N/A",
    applications: ["Food machinery", "Packaging lines", "Dry-running pivots"],
    description:
      "Steel backing, sintered bronze interlayer and a PTFE running surface. Runs dry, so there is no grease to attract dust or contaminate product.",
  },

  // ── Units & housings ──────────────────────────────────────────────────────
  {
    slug: "ucp-205",
    designation: "UCP 205",
    name: "Pillow Block Bearing Unit",
    category: "bearing-units-and-housings",
    image: "/images/render/pillow-block.jpg",
    bore: 25,
    od: 52,
    width: 140,
    cage: "Steel",
    seal: "Sealed",
    dynamicLoad: "14.0 kN",
    speed: "4,300 rpm",
    applications: ["Conveyors", "Fans", "Agricultural shafts", "Packing plant"],
    description:
      "Cast iron two-bolt housing with a wide inner ring insert, set screws and a grease nipple fitted. Self-aligning on assembly — the fastest way to support a shaft.",
    featured: true,
  },
  {
    slug: "ucf-207",
    designation: "UCF 207",
    name: "Square Flange Bearing Unit",
    category: "bearing-units-and-housings",
    image: "/images/render/flange-unit.jpg",
    bore: 35,
    od: 72,
    width: 42,
    cage: "Steel",
    seal: "Sealed",
    dynamicLoad: "25.5 kN",
    speed: "3,400 rpm",
    applications: ["Bucket elevators", "Mixers", "Textile machinery"],
    description:
      "Four-bolt square flange for mounting on a vertical face or bulkhead. Same relubricatable insert bearing as the pillow block range.",
  },
  {
    slug: "ucfl-206",
    designation: "UCFL 206",
    name: "Two-Bolt Oval Flange Unit",
    category: "bearing-units-and-housings",
    image: "/images/render/flange-unit.jpg",
    bore: 30,
    od: 62,
    width: 38,
    cage: "Steel",
    seal: "Sealed",
    dynamicLoad: "19.5 kN",
    speed: "3,800 rpm",
    applications: ["Light conveyors", "Blowers", "Grain handling"],
    description:
      "Compact oval flange where a full square flange will not fit. Cast iron body, pre-lubricated and sealed on both sides.",
  },
  {
    slug: "snl-517",
    designation: "SNL 517-615",
    name: "Split Plummer Block Housing",
    category: "bearing-units-and-housings",
    image: "/images/products/plummer-block-housing.svg",
    bore: 75,
    od: 130,
    width: 300,
    cage: "N/A" as unknown as Product["cage"],
    seal: "Sealed",
    applications: ["Fans", "Crushers", "Paper machines", "Marine gear"],
    description:
      "Heavy split cast iron housing for spherical roller bearings on an adapter sleeve. Splitting the cap lets you inspect or change the bearing without pulling the shaft.",
  },

  // ── Spherical plain & rod ends ────────────────────────────────────────────
  {
    slug: "ge-20-es",
    designation: "GE 20 ES",
    name: "Radial Spherical Plain Bearing",
    category: "spherical-plain-and-rod-ends",
    image: "/images/products/spherical-plain.svg",
    bore: 20,
    od: 35,
    width: 16,
    cage: "Bronze",
    seal: "N/A",
    dynamicLoad: "38 kN",
    applications: ["Hydraulic cylinder eyes", "Suspension links", "Excavator arms"],
    description:
      "Steel-on-steel sliding contact with a very high static rating. Requires relubrication and copes with heavy shock and slow oscillating motion.",
  },
  {
    slug: "ge-30-es-2rs",
    designation: "GE 30 ES-2RS",
    name: "Sealed Spherical Plain Bearing",
    category: "spherical-plain-and-rod-ends",
    image: "/images/products/spherical-plain.svg",
    bore: 30,
    od: 47,
    width: 22,
    cage: "Bronze",
    seal: "2RS (rubber)",
    dynamicLoad: "78 kN",
    applications: ["Construction plant", "Tipper rams", "Steering linkages"],
    description:
      "Lip seals on both sides retain grease and keep abrasive dust out — a large gain in service life on outdoor and mobile equipment.",
  },
  {
    slug: "sa-20-es",
    designation: "SA 20 ES",
    name: "Rod End, Male Thread",
    category: "spherical-plain-and-rod-ends",
    image: "/images/products/rod-end.svg",
    bore: 20,
    od: 46,
    width: 25,
    cage: "Bronze",
    seal: "N/A",
    dynamicLoad: "38 kN",
    applications: ["Cylinder rods", "Control linkages", "Test rigs"],
    description:
      "External M20×1.5 thread with a spherical plain bearing pressed into the eye. Accepts angular misalignment of roughly ±13°.",
  },
  {
    slug: "si-25-es",
    designation: "SI 25 ES",
    name: "Rod End, Female Thread",
    category: "spherical-plain-and-rod-ends",
    image: "/images/products/rod-end.svg",
    bore: 25,
    od: 58,
    width: 31,
    cage: "Bronze",
    seal: "N/A",
    dynamicLoad: "60 kN",
    applications: ["Hydraulic rams", "Agricultural top links"],
    description:
      "Internal thread version for screwing directly onto a piston rod. Includes a grease nipple in the shank for periodic relubrication.",
  },

  // ── Tapered ───────────────────────────────────────────────────────────────
  {
    slug: "30206",
    designation: "30206",
    name: "Single-Row Tapered Roller Bearing",
    category: "tapered-roller-bearings",
    image: "/images/render/tapered-roller.jpg",
    bore: 30,
    od: 62,
    width: 17.25,
    cage: "Steel",
    seal: "Open",
    dynamicLoad: "46.5 kN",
    speed: "6,000 rpm",
    applications: ["Wheel hubs", "Gearboxes", "Pinion shafts"],
    description:
      "Separable cone and cup. Mounted in opposing pairs it takes heavy combined load and can be set to a precise preload or end float.",
    featured: true,
  },
  {
    slug: "32210",
    designation: "32210",
    name: "Tapered Roller Bearing, Wide Series",
    category: "tapered-roller-bearings",
    image: "/images/render/tapered-roller.jpg",
    bore: 50,
    od: 90,
    width: 24.75,
    cage: "Steel",
    seal: "Open",
    dynamicLoad: "108 kN",
    speed: "4,300 rpm",
    applications: ["Truck axles", "Heavy gearboxes", "Winches"],
    description:
      "The 322-series wide section raises both radial and axial rating for the same bore — the standard choice for commercial vehicle axles.",
  },
  {
    slug: "33212",
    designation: "33212",
    name: "Tapered Roller Bearing, Steep Angle",
    category: "tapered-roller-bearings",
    image: "/images/render/tapered-roller.jpg",
    bore: 60,
    od: 110,
    width: 38,
    cage: "Steel",
    seal: "Open",
    dynamicLoad: "172 kN",
    speed: "3,600 rpm",
    applications: ["Bevel pinions", "Rolling mill housings", "Crane slew drives"],
    description:
      "A steeper contact angle shifts capacity toward the axial direction — used where thrust dominates, such as behind a bevel pinion.",
  },
  {
    slug: "352044x2",
    designation: "352044 X2",
    name: "Double-Row Tapered Roller Bearing",
    category: "tapered-roller-bearings",
    image: "/images/render/four-row-cylindrical.jpg",
    bore: 220,
    od: 340,
    width: 170,
    cage: "Brass",
    seal: "Open",
    dynamicLoad: "1,320 kN",
    speed: "1,100 rpm",
    applications: ["Rolling mills", "Heavy reduction gearboxes"],
    description:
      "Two rows face-to-face in one assembly, carrying very heavy radial load and thrust in both directions with a factory-set clearance.",
  },
];

// ── helpers ─────────────────────────────────────────────────────────────────

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsInCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function relatedProducts(p: Product, limit = 4) {
  return products
    .filter((x) => x.category === p.category && x.slug !== p.slug)
    .slice(0, limit);
}

export const featuredProducts = products.filter((p) => p.featured);

export const cageOptions = Array.from(new Set(products.map((p) => p.cage))).sort();
export const sealOptions = Array.from(new Set(products.map((p) => p.seal))).sort();

export const boreRange: [number, number] = [
  Math.min(...products.map((p) => p.bore)),
  Math.max(...products.map((p) => p.bore)),
];
