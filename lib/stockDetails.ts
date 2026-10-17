/**
 * Written content for the stock-list detail pages (/stock/<part>).
 *
 * Every part gets: a product title, a summary, a specification table,
 * an explanation of its suffix, typical applications and, where we have
 * verified it, vehicle fitment. The text is generated from the series and
 * suffix so 500+ parts stay consistent and correct; nothing here is
 * invented per part.
 */
import type { StockItem } from "@/lib/stock";

export type Detail = {
  title: string;
  summary: string;
  specs: { label: string; value: string }[];
  about: string[];
  suffix?: { code: string; meaning: string }[];
  applications: string[];
  fitment?: string;
};

const mm = (n: number) => `${n} mm`;

/* Reference data checked against NTN-SNR's catalogue and stockist listings. */
const AUTO_DIMS: Record<string, [number, number, number]> = {
  "AU0726-3LXL/L588": [35, 64, 43],
  "AU0826-1LL/L588": [38, 79, 45],
  "ET-CR1-0846LLCS1#01": [42, 76, 39],
  "ET-CR1-0846LXLCS#03": [42, 76, 39],
};
const FITMENT: Record<string, string> = {
  "AU0726-3LXL/L588": "Daihatsu Materia, Toyota bB (front)",
  "AU0727-19LXL": "Nissan Micra IV (front)",
  "AU0826-1LL/L588": "Nissan X-Trail I (rear)",
  "AU0831-2LX3LX7/L588": "Mitsubishi Colt VI (front)",
  "FCR62-16-8G1/2E": "Subaru Leone, Subaru XT",
  "FCR62-26-6G1/2E": "Nissan Sunny, Primera, Almera, Bluebird",
  "FCR62-28-7G1/2E": "Nissan Bluebird, Pick Up, NP300",
  "FCR62-29-11G1/2E": "Nissan Maxima III, Pick Up, Prairie II",
  "FCR62-29-12G1/2E": "Nissan Maxima III",
  "FCR62-32-14G1/2E": "Nissan Almera, Sunny III, Maxima, Pick Up, Urvan",
  "FCR62-42-14G1/L756": "Subaru Impreza, Legacy, Forester, Outback, BRZ, XV",
};

const DG_SUFFIX: Record<string, string> = {
  LLU: "Contact rubber seals on both sides, filled with grease for life. Keeps dirt and water out; the usual choice for motors, pumps and farm machinery.",
  ZZ: "Pressed steel shields on both sides. Lower friction than rubber seals, so suited to higher speeds where the bearing is not exposed to water.",
  Z: "A steel shield on one side only, the other side open for lubrication from the machine.",
  NR: "A snap-ring groove in the outer ring with the snap ring fitted, which locates the bearing in the housing without a shoulder.",
  ZNR: "A steel shield on one side plus a snap ring on the outer ring.",
  CM: "Electric-motor grade: radial clearance and noise level selected for quiet running in motors.",
  U1: "A maker's internal specification code. Send us the old bearing or the machine model and we will confirm the match.",
};

const DG_SERIES: Record<string, string> = {
  "60": "60 series (extra-light): the thinnest section for its bore, used where space is tight.",
  "62": "62 series (light): the most common section, a balance of size and load capacity.",
  "63": "63 series (medium): a deeper section that carries heavier loads and shocks.",
};

export function detailFor(it: StockItem): Detail {
  const specs: Detail["specs"] = [{ label: "Part number", value: it.part }];
  const dims = it.dims ?? AUTO_DIMS[it.part];
  const pushDims = (labels: [string, string, string]) => {
    if (!dims) return;
    specs.push({ label: labels[0], value: mm(dims[0]) }, { label: labels[1], value: mm(dims[1]) }, { label: labels[2], value: mm(dims[2]) });
  };

  switch (it.range) {
    case "deep-groove": {
      const m = it.part.match(/^(6\d)(\d\d|\/\d\d)(.*)$/)!;
      const series = m[1];
      const suf = m[3];
      specs.push({ label: "Type", value: "Single-row deep groove ball bearing" });
      specs.push({ label: "Series", value: `${series} series` });
      pushDims(["Bore (d)", "Outside diameter (D)", "Width (B)"]);
      specs.push({ label: "Closure", value: it.variant ?? "Open" });
      specs.push({ label: "Rolling elements", value: "Steel balls, single row" });
      return {
        title: `${it.part} Deep Groove Ball Bearing`,
        summary: `${it.part} is a single-row deep groove ball bearing${dims ? ` measuring ${dims[0]} × ${dims[1]} × ${dims[2]} mm` : ""}. It carries radial load and moderate axial load in both directions, runs quietly at high speed and needs little maintenance.`,
        specs,
        about: [
          DG_SERIES[series] ?? "",
          "Deep groove ball bearings are the most widely used bearing type. The deep raceways let the balls take load from the side as well as from above, so one bearing often does the job of two.",
        ].filter(Boolean),
        suffix: suf ? [{ code: suf, meaning: DG_SUFFIX[suf] ?? "Variant code. Ask us to confirm the exact specification." }] : undefined,
        applications: ["Electric motors and generators", "Water pumps", "Fans and blowers", "Gearboxes", "Agricultural machinery", "Textile machinery"],
      };
    }

    case "tapered-roller": {
      const inch = it.part.includes("/") && it.part !== "320/28X";
      specs.push({ label: "Type", value: inch ? "Tapered roller bearing, inch series (cone and cup)" : "Single-row tapered roller bearing" });
      if (inch) {
        const [cone, cup] = it.part.split("/");
        specs.push({ label: "Cone (inner ring + rollers)", value: cone });
        specs.push({ label: "Cup (outer ring)", value: cup.length < cone.length ? cone.slice(0, cone.length - cup.length) + cup : cup });
      } else {
        pushDims(["Bore (d)", "Outside diameter (D)", "Total width (T)"]);
      }
      specs.push({ label: "Rolling elements", value: "Tapered rollers, steel cage" });
      const sufs: Detail["suffix"] = [];
      if (/^303\d\dD$/.test(it.part)) sufs.push({ code: "D", meaning: "Steeper contact angle, for a higher share of axial (thrust) load." });
      if (/X/.test(it.part.replace(/^.*\//, "")) && !inch) sufs.push({ code: "X", meaning: "Dimensions to the current ISO standard; interchangeable with other makers' X versions." });
      if (inch) sufs.push({ code: "cone / cup", meaning: "Inch bearings are numbered as a pair: the first number is the cone, the number after the slash is the cup. Both can also be bought separately." });
      return {
        title: `${it.part} Tapered Roller Bearing`,
        summary: `${it.part} is a ${inch ? "inch-series" : "metric"} tapered roller bearing${!inch && dims ? ` measuring ${dims[0]} × ${dims[1]} × ${dims[2]} mm` : ""}. The tapered rollers take heavy radial and axial load together, which is why these bearings are used in pairs on wheel hubs, axles and gearboxes.`,
        specs,
        about: [
          "A tapered roller bearing comes in two parts: the cone (inner ring with the rollers and cage) and the cup (outer ring). They are fitted separately and the bearing clearance is set when the pair is adjusted on the shaft.",
          "Fit them as a pair, facing each other, so each takes the axial load in one direction.",
        ],
        suffix: sufs.length ? sufs : undefined,
        applications: ["Wheel hubs and axles", "Gearboxes and differentials", "Tractor and trailer axles", "Pinion shafts", "Machine tool spindles", "Conveyor head pulleys"],
      };
    }

    case "thrust-ball": {
      const series = it.part.slice(0, 3);
      const weight: Record<string, string> = { "511": "light", "512": "medium", "513": "heavy", "514": "extra-heavy" };
      specs.push({ label: "Type", value: "Single-direction thrust ball bearing" });
      specs.push({ label: "Series", value: `${series} (${weight[series]})` });
      pushDims(["Bore (d)", "Outside diameter (D)", "Height (H)"]);
      specs.push({ label: "Parts", value: "Shaft washer, housing washer, balls in a cage" });
      return {
        title: `${it.part} Thrust Ball Bearing`,
        summary: `${it.part} is a single-direction thrust ball bearing${dims ? ` measuring ${dims[0]} × ${dims[1]} × ${dims[2]} mm` : ""}. It carries axial load in one direction only and takes no radial load, so it is normally fitted alongside a radial bearing.`,
        specs,
        about: [
          `The ${series} series is the ${weight[series]} section for its bore size.`,
          "The two washers and the ball-and-cage assembly come apart, which makes fitting simple. Keep a light axial preload on the bearing so the balls do not skid at speed.",
        ],
        applications: ["Vertical shafts", "Crane hooks and swivels", "Screw jacks", "Turntables", "Gear drives with end thrust", "Clutch and steering mechanisms"],
      };
    }

    case "uc-bearings": {
      const m = it.part.match(/^UC2(\d\d)(?:-(\d+))?$/);
      specs.push({ label: "Type", value: "Insert bearing with set screws (UC)" });
      if (it.variant) specs.push({ label: "Shaft size", value: it.variant.replace(" shaft", "") });
      specs.push({ label: "Fits housings", value: m ? `P2${m[1]}, F2${m[1]}, FL2${m[1]}, UCT2${m[1]}` : "UC 200 series housings" });
      specs.push({ label: "Locking", value: "Two set screws on the extended inner ring" });
      specs.push({ label: "Outer ring", value: "Spherical, self-aligning in the housing" });
      return {
        title: `${it.part} Insert Bearing`,
        summary: `${it.part} is a sealed insert bearing for ${it.variant ?? "a"} shaft. Its spherical outer ring lets it line itself up inside the housing, and two set screws lock it to the shaft, so it fits without a press.`,
        specs,
        about: [
          m && m[2]
            ? `The "-${m[2]}" ending means an inch bore: ${it.variant?.replace(" shaft", "")}. The same outside size fits the standard UC2${m[1]} housing.`
            : "Metric bore. The bore in millimetres is the last two digits × 5.",
          "Supplied sealed and greased. Tighten the set screws after the shaft is aligned, and re-grease through the housing nipple where one is fitted.",
        ],
        applications: ["Conveyors and roller beds", "Agricultural machinery", "Fans and blowers", "Food and packaging lines", "Shaft supports in general machinery"],
      };
    }

    case "blocks": {
      const kind = it.part.startsWith("FL") ? "FL" : it.part[0];
      const names: Record<string, string> = { P: "Pillow block housing", F: "Square four-bolt flange housing", FL: "Two-bolt oval flange housing" };
      const m = it.part.match(/(\d\d)$/)!;
      specs.push({ label: "Type", value: names[kind] });
      specs.push({ label: "Takes insert", value: `UC2${m[1]}` });
      specs.push({ label: "Shaft size with UC2" + m[1], value: `${+m[1] * 5} mm` });
      specs.push({ label: "Material", value: "Grey cast iron, painted" });
      specs.push({ label: "Mounting", value: kind === "P" ? "Two bolts through the base, shaft parallel to the mounting surface" : kind === "F" ? "Four bolts, shaft at right angles to the mounting face" : "Two bolts, shaft at right angles to the mounting face" });
      return {
        title: `${it.part} ${names[kind]}`,
        summary: `${it.part} is a ${names[kind].toLowerCase()} for the UC2${m[1]} insert bearing (${+m[1] * 5} mm shaft). Order it as a housing only, or with the insert as a complete unit (UC${kind}2${m[1]}).`,
        specs,
        about: [
          "Housing and insert together make a ready-to-bolt bearing unit: no machined housing bore and no press fit needed.",
          "The housing has a grease nipple so the insert can be re-lubricated in service.",
        ],
        applications: ["Conveyors", "Agricultural machinery", "Fans and ventilation", "Mixers and crushers (light duty)", "Line shafts"],
      };
    }

    default: {
      // automotive
      const g = it.group;
      const fit = FITMENT[it.part];
      if (g.startsWith("Clutch")) {
        specs.push({ label: "Type", value: "Clutch release bearing" });
        specs.push({ label: "Fitting position", value: "Clutch release fork / guide sleeve" });
        if (fit) specs.push({ label: "Vehicles (reference)", value: fit });
        return {
          title: `${it.part} Clutch Release Bearing`,
          summary: `${it.part} is a clutch release (throw-out) bearing. It presses on the clutch diaphragm spring each time the pedal is pressed, so it must run smoothly at engine speed and take a strong axial push.`,
          specs,
          about: [
            "Change the release bearing whenever the clutch plate is replaced: a worn bearing whines with the pedal pressed and can damage the new pressure plate.",
            "Tell us the vehicle model and year on WhatsApp and we will confirm this is the right number.",
          ],
          applications: ["Manual-transmission cars", "Pick-ups and light commercials"],
          fitment: fit,
        };
      }
      const tapered = g.startsWith("Automotive tapered");
      const typeName = tapered ? "Automotive tapered roller bearing (sealed)" : g.startsWith("Wheel hub") ? "Wheel hub unit bearing (double-row angular contact, sealed)" : "Automotive wheel bearing (double-row)";
      specs.push({ label: "Type", value: typeName });
      pushDims(["Bore (d)", "Outside diameter (D)", "Width (B)"]);
      specs.push({ label: "Lubrication", value: "Sealed and greased for life" });
      if (fit) specs.push({ label: "Vehicles (reference)", value: fit });
      return {
        title: `${it.part} ${tapered ? "Automotive Tapered Roller Bearing" : "Wheel Bearing"}`,
        summary: `${it.part} is ${tapered ? "a sealed tapered roller bearing for automotive wheel and transmission positions" : "a double-row, sealed wheel bearing"}${dims ? ` measuring ${dims[0]} × ${dims[1]} × ${dims[2]} mm` : ""}. It is an original-equipment number for Japanese vehicles, supplied pre-greased and ready to press in.`,
        specs,
        about: [
          "Two rows of rolling elements in one sealed unit carry the weight of the car and the side loads of cornering, with no adjustment needed on fitting.",
          "A worn wheel bearing hums or rumbles at speed and gets louder in corners. Replace in pairs on the same axle where possible.",
          "Send us the vehicle model, year and front or rear position on WhatsApp and we will confirm the match.",
        ],
        applications: ["Front and rear wheel hubs", "Japanese cars and light commercials"],
        fitment: fit,
      };
    }
  }
}
