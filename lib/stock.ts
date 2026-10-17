/**
 * SBA stock list — part numbers transcribed from the client's stock sheets
 * (WhatsApp screenshots, 10 Oct 2026). One entry per row of the sheet.
 *
 * Dimensions are the standard ISO / ABMA boundary dimensions for each base
 * number (d × D × B, mm). They are filled in only where the series is a
 * published standard; automotive OE numbers and inch tapered sets are left
 * without dimensions and are quoted on request.
 *
 * To add a part: put the number in the right list below. That is all — the
 * home page, the stock page, search and the WhatsApp links pick it up.
 */

export type StockGroup = {
  /** heading shown above the part numbers */
  title: string;
  note?: string;
  image: string;
  parts: string[];
};

export type StockRange = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  groups: StockGroup[];
  /** set when the full list still has to be confirmed by the office */
  pending?: string;
};

export type StockItem = {
  part: string;
  /** URL segment for the detail page, e.g. "6205llu", "fcr48-11-3g1-2e-01" */
  slug: string;
  range: string; // range slug
  rangeName: string;
  group: string;
  image: string;
  dims?: [number, number, number];
  /** plain-language reading of the suffix, e.g. "Rubber sealed both sides" */
  variant?: string;
};

/* ── Standard dimension tables (d, D, B/T/H in mm) ───────────────────────── */

export const DGBB: Record<string, [number, number, number]> = {
  "6000": [10, 26, 8], "6001": [12, 28, 8], "6002": [15, 32, 9], "6003": [17, 35, 10],
  "6004": [20, 42, 12], "6005": [25, 47, 12], "6006": [30, 55, 13], "6007": [35, 62, 14],
  "6008": [40, 68, 15], "6009": [45, 75, 16], "6010": [50, 80, 16], "6011": [55, 90, 18],
  "6012": [60, 95, 18], "6013": [65, 100, 18], "6014": [70, 110, 20],
  "6200": [10, 30, 9], "6201": [12, 32, 10], "6202": [15, 35, 11], "6203": [17, 40, 12],
  "6204": [20, 47, 14], "6205": [25, 52, 15], "6206": [30, 62, 16], "6207": [35, 72, 17],
  "6208": [40, 80, 18], "6209": [45, 85, 19], "6210": [50, 90, 20], "6211": [55, 100, 21],
  "6212": [60, 110, 22], "6213": [65, 120, 23], "6214": [70, 125, 24], "6215": [75, 130, 25],
  "6216": [80, 140, 26], "6217": [85, 150, 28], "6218": [90, 160, 30], "62/22": [22, 50, 14],
  "6300": [10, 35, 11], "6301": [12, 37, 12], "6302": [15, 42, 13], "6303": [17, 47, 14],
  "6304": [20, 52, 15], "6305": [25, 62, 17], "6306": [30, 72, 19], "6307": [35, 80, 21],
  "6308": [40, 90, 23], "6309": [45, 100, 25], "6310": [50, 110, 27], "6311": [55, 120, 29],
  "6312": [60, 130, 31], "6313": [65, 140, 33], "6314": [70, 150, 35], "6315": [75, 160, 37],
  "6316": [80, 170, 39], "6317": [85, 180, 41], "6318": [90, 190, 43], "63/28": [28, 68, 18],
};

export const THRUST: Record<string, [number, number, number]> = {
  "51100": [10, 24, 9], "51101": [12, 26, 9], "51102": [15, 28, 9], "51103": [17, 30, 9],
  "51104": [20, 35, 10], "51105": [25, 42, 11], "51106": [30, 47, 11], "51107": [35, 52, 12],
  "51108": [40, 60, 13], "51109": [45, 65, 14], "51110": [50, 70, 14], "51111": [55, 78, 16],
  "51112": [60, 85, 17], "51113": [65, 90, 18], "51114": [70, 95, 18], "51115": [75, 100, 19],
  "51116": [80, 105, 19], "51117": [85, 110, 19], "51118": [90, 120, 22], "51120": [100, 135, 25],
  "51122": [110, 145, 25], "51124": [120, 155, 25], "51126": [130, 170, 30], "51128": [140, 180, 31],
  "51130": [150, 190, 31], "51132": [160, 200, 31], "51134": [170, 215, 34], "51138": [190, 240, 37],
  "51140": [200, 250, 37], "51144": [220, 270, 37],
  "51200": [10, 26, 11], "51201": [12, 28, 11], "51202": [15, 32, 12], "51203": [17, 35, 12],
  "51204": [20, 40, 14], "51205": [25, 47, 15], "51206": [30, 52, 16], "51207": [35, 62, 18],
  "51208": [40, 68, 19], "51209": [45, 73, 20], "51210": [50, 78, 22], "51211": [55, 90, 25],
  "51212": [60, 95, 26], "51213": [65, 100, 27], "51214": [70, 105, 27], "51215": [75, 110, 27],
  "51216": [80, 115, 28], "51217": [85, 125, 31], "51218": [90, 135, 35], "51220": [100, 150, 38],
  "51222": [110, 160, 38], "51224": [120, 170, 39], "51226": [130, 190, 45], "51228": [140, 200, 46],
  "51230": [150, 215, 50], "51232": [160, 225, 51], "51234": [170, 240, 55], "51236": [180, 250, 56],
  "51238": [190, 270, 62], "51240": [200, 280, 62], "51244": [220, 300, 63],
  "51304": [20, 47, 18], "51305": [25, 52, 18], "51306": [30, 60, 21], "51307": [35, 68, 24],
  "51308": [40, 78, 26], "51309": [45, 85, 28], "51310": [50, 95, 31], "51311": [55, 105, 35],
  "51312": [60, 110, 35], "51313": [65, 115, 36], "51314": [70, 125, 40], "51315": [75, 135, 44],
  "51316": [80, 140, 44], "51317": [85, 150, 49], "51318": [90, 155, 50], "51320": [100, 170, 55],
  "51322": [110, 190, 63], "51324": [120, 210, 70], "51326": [130, 225, 75], "51328": [140, 240, 80],
  "51330": [150, 250, 80], "51332": [160, 270, 87], "51334": [170, 280, 87],
  "51405": [25, 60, 24], "51406": [30, 70, 28], "51407": [35, 80, 32], "51408": [40, 90, 36],
  "51409": [45, 100, 39], "51410": [50, 110, 43], "51411": [55, 120, 48], "51412": [60, 130, 51],
  "51413": [65, 140, 56], "51414": [70, 150, 60], "51415": [75, 160, 65], "51416": [80, 170, 68],
  "51417": [85, 180, 72],
};

export const TAPERED: Record<string, [number, number, number]> = {
  "30202": [15, 35, 11.75], "30203": [17, 40, 13.25], "30204": [20, 47, 15.25], "30205": [25, 52, 16.25],
  "30206": [30, 62, 17.25], "30207": [35, 72, 18.25], "30208": [40, 80, 19.75], "30209": [45, 85, 20.75],
  "30210": [50, 90, 21.75], "30211": [55, 100, 22.75], "30212": [60, 110, 23.75], "30213": [65, 120, 24.75],
  "30302": [15, 42, 14.25], "30304": [20, 52, 16.25], "30305": [25, 62, 18.25], "30306": [30, 72, 20.75],
  "30307": [35, 80, 22.75], "30308": [40, 90, 25.25], "30309": [45, 100, 27.25], "30310": [50, 110, 29.25],
  "30311": [55, 120, 31.5], "30312": [60, 130, 33.5], "30313": [65, 140, 36], "30314": [70, 150, 38],
  "320/28": [28, 52, 16], "32004": [20, 42, 15], "32005": [25, 47, 15], "32006": [30, 55, 17],
  "32007": [35, 62, 18], "32008": [40, 68, 19], "32009": [45, 75, 20], "32010": [50, 80, 20],
  "32011": [55, 90, 23], "32012": [60, 95, 23], "32013": [65, 100, 23], "32014": [70, 110, 25],
  "32204": [20, 47, 19.25], "32205": [25, 52, 19.25], "32206": [30, 62, 21.25], "32207": [35, 72, 24.25],
  "32208": [40, 80, 24.75], "32209": [45, 85, 24.75], "32210": [50, 90, 24.75], "32211": [55, 100, 26.75],
  "32212": [60, 110, 29.75], "32213": [65, 120, 32.75], "32214": [70, 125, 33.25], "32215": [75, 130, 33.25],
  "32216": [80, 140, 35.25], "32217": [85, 150, 38.5], "32218": [90, 160, 42.5],
  "32305": [25, 62, 25.25], "32306": [30, 72, 28.75], "32307": [35, 80, 32.75], "32308": [40, 90, 35.25],
  "32309": [45, 100, 38.25], "32310": [50, 110, 42.25], "32311": [55, 120, 45.5], "32312": [60, 130, 48.5],
  "32313": [65, 140, 51], "33010": [50, 80, 24], "33012": [60, 95, 27], "33013": [65, 100, 27],
  "33110": [50, 85, 26], "33205": [25, 52, 22], "33208": [40, 80, 32], "33210": [50, 90, 32],
};

const DGBB_SUFFIX: Record<string, string> = {
  LLU: "Rubber sealed both sides",
  ZZ: "Steel shielded both sides",
  Z: "Steel shield one side",
  NR: "Snap ring groove with snap ring",
  ZNR: "Shield one side, with snap ring",
  CM: "Electric-motor grade clearance",
  U1: "Special internal specification (U1)",
};

/* ── The stock list ─────────────────────────────────────────────────────── */

const seq = (prefix: string, from: number, to: number, pad = 0) =>
  Array.from({ length: to - from + 1 }, (_, i) => prefix + String(from + i).padStart(pad, "0"));

export const stockRanges: StockRange[] = [
  {
    slug: "automotive",
    name: "Automotive Bearings",
    blurb:
      "Wheel hub bearings, wheel bearings, automotive tapered rollers and clutch release bearings for Japanese cars and light commercials.",
    image: "/images/render/wheel-hub.jpg",
    groups: [
      {
        title: "Wheel hub unit bearings (AU)",
        image: "/images/render/wheel-hub.jpg",
        parts: [
          "AU0504-13LXL", "AU0603-2LLX/L588", "AU0605-1LXL/L588", "AU0607-2LLX/L588",
          "AU0607-2LX4L/L588", "AU0609-2LL/L588", "AU0618-1LL/L588", "AU0701-4LL/L588",
          "AU0712-1/L588", "AU0714-2LX3L/L588", "AU0716-2LLX/L588", "AU0716-2LX8L/L588",
          "AU0721-2LL/L588", "AU0725-1LL/L588", "AU0726-3LXL/L588", "AU0727-19LXL",
          "AU0735-3LXL/L588", "AU0736-1/L588", "AU0742-2LXL/L588", "AU0743-2LXL/L588",
          "AU0750-2LL/L588", "AU0750-2LXL/L588", "AU0755-1LL/L588", "AU0804-5LL/L588",
          "AU0810-1LXL/L588", "AU0814-3LLX/L588", "AU0818-1LXL/L588", "AU0818-2LLX2/L588",
          "AU0822-2LL/L588", "AU0823-1/L588", "AU0826-1LL/L588", "AU0827-4/L588",
          "AU0831-2LX3LX7/L588", "AU0837-1LX2L/L669", "AU0838-5LXL/L588", "AU0844-1LL/L588",
          "AU0846-2LXL/L588", "AU0847-6LLX2/L588", "AU0847-6LX3L/L588", "AU0901-4LXL/L588",
          "AU0908-2LL/L588", "AU0908-3LL/L588", "AU0911-3LL/L588", "AU0915-2LX5LX7/L588",
          "AU0919-6LXL/L669", "AU0920-1LXL/L588", "AU0925-1LL/L588", "AU0933-7LX2L/L588",
          "AU1001-2LXL/L588", "AU1006-9LX2L/L588", "AU1021-1LXL/L588", "AU1022-6LXL/L588",
          "AU1101-3LX6L/L669", "AU1103-2LXL/L588", "AU1106-3LX2L/L669",
        ],
      },
      {
        title: "Wheel bearings (DE)",
        image: "/images/render/wheel-hub.jpg",
        parts: [
          "DE0655NRCS08", "DE0678CS12/5A", "DE0681CS18PX1/L588", "DE0763CS46PX1/5A",
          "DE0769CS46PX1/5A", "DE0829LLCS32PX1/5A", "DE0871LLCS26PX1/#02", "DE0892LLCS43/L58#01",
          "DE08A30LLCS67PX2/#02", "DE08A33CS38PX1/L588", "DE0962LLCS70PX2/5A", "DE0978LLCS64PX1/#01",
        ],
      },
      {
        title: "Automotive tapered roller bearings (ET-CR1)",
        image: "/images/render/tapered-roller.jpg",
        parts: ["ET-CR1-0678LLCS7#03", "ET-CR1-0846LLCS1#01", "ET-CR1-0846LXLCS#03"],
      },
      {
        title: "Clutch release bearings (FCR)",
        image: "/images/render/clutch-release.jpg",
        parts: [
          "FCR38-1G1/2E", "FCR44-13-2G1/2E", "FCR44-14-5G1/5K", "FCR44-2G1/2E",
          "FCR44-32-3G1/2E", "FCR44-36-1G1/2E", "FCR47-13-2G1/2E", "FCR47-8-4G1/2E",
          "FCR48-11-3G1/2E", "FCR48-11-3G1/2E#01", "FCR48-23-6G1/2E", "FCR48-24-5G1/2E",
          "FCR48-39-6G1/2E", "FCR50-10-2G1/2E", "FCR50-1-4G1/2E", "FCR50-17-9G1/2E",
          "FCR50-30-19G1/2E", "FCR50-41-5G1/2E", "FCR50-45-1G1/2E", "FCR50-46-1G1/2E",
          "FCR50-6-3G1/2E", "FCR54-15G1/2E", "FCR54-33-3G1/2E", "FCR54-46-2G1/2E",
          "FCR54-48-4G1/2E", "FCR54-58-6G1/2E", "FCR54-67-5G1/2E", "FCR54-69-6G1/2E",
          "FCR55-1-4G1/2E", "FCR55-17-15G1/2E", "FCR55-17-9G1/2E", "FCR55-33-1G1/2E",
          "FCR62-16-8G1/2E", "FCR62-26-6G1/2E", "FCR62-28-7G1/2E", "FCR62-29-11G1/2E",
          "FCR62-29-12G1/2E", "FCR62-30-6G1/2E", "FCR62-32-14G1/2E", "FCR62-32-15G1/2E",
          "FCR62-33-4G1/2E", "FCR62-42-13G1/2E", "FCR62-42-14G1/L756", "FCR62-58-1G1/2E",
          "FCR62-60-3G1/L756", "FCR62-69-1G1/L756", "FCR62-71-2G1/2E",
        ],
      },
    ],
  },
  {
    slug: "deep-groove",
    name: "Deep Groove Ball Bearings",
    blurb:
      "60, 62 and 63 series in sealed (LLU), shielded (ZZ), snap-ring (NR), motor-grade (CM) and open versions.",
    image: "/images/render/deep-groove-pair.jpg",
    groups: [
      {
        title: "6000 series",
        image: "/images/render/deep-groove-sealed.jpg",
        parts: [
          "6000LLU", "6000ZZ", "6001LLU", "6001ZZ", "6002LLU", "6002ZZ", "6003LLU", "6003ZZ",
          "6004LLU", "6004ZZ", "6005LLU", "6005ZZ", "6006LLU", "6006ZZ", "6007LLU", "6007ZZ",
          "6008LLU", "6008ZZ", "6009ZZ", "6010LLU", "6010ZZ", "6011ZZ", "6012ZZ", "6013ZZ", "6014ZZ",
        ],
      },
      {
        title: "6200 series",
        image: "/images/render/deep-groove-sealed.jpg",
        parts: [
          "62/22LLU", "6200LLU", "6200ZZ", "6201LLU", "6201ZZ", "6202LLU", "6202ZZ", "6203LLU",
          "6203ZZ", "6204LLU", "6204NR", "6204ZZ", "6205LLU", "6205ZZ", "6206LLU", "6206ZZ",
          "6207LLU", "6207NR", "6207U1", "6207ZZ", "6208LLU", "6208U1", "6208ZZ", "6209CM",
          "6209LLU", "6209NR", "6209ZZ", "6210LLU", "6210U1", "6210ZNR", "6210ZZ", "6211CM",
          "6211LLU", "6211NR", "6211ZZ", "6212LLU", "6212ZZ", "6213LLU", "6213ZZ", "6214LLU",
          "6214ZZ", "6215LLU", "6215ZZ", "6216ZZ", "6217ZZ", "6218ZZ",
        ],
      },
      {
        title: "6300 series",
        image: "/images/render/deep-groove-sealed.jpg",
        parts: [
          "63/28U1", "63/28Z", "63/28LLU", "6300LLU", "6300ZZ", "6301LLU", "6301ZZ", "6302LLU",
          "6302ZZ", "6303LLU", "6303ZZ", "6304CM", "6304LLU", "6304NR", "6304ZZ", "6305CM",
          "6305LLU", "6305ZZ", "6306LLU", "6306NR", "6306U1", "6306ZZ", "6307CM", "6307LLU",
          "6307NR", "6307ZZ", "6308CM", "6308LLU", "6308ZNR", "6308ZZ", "6309CM", "6309LLU",
          "6309ZZ", "6310CM", "6310LLU", "6310ZZ", "6311LLU", "6311NR", "6311U1", "6311ZZ",
          "6312U1", "6312LLU", "6312ZZ", "6313CM", "6313LLU", "6313NR", "6313ZZ", "6314LLU",
          "6314U1", "6314ZZ", "6315LLU", "6315U1", "6315ZZ", "6316LLU", "6316ZZ", "6317ZZ", "6318ZZ",
        ],
      },
    ],
  },
  {
    slug: "tapered-roller",
    name: "Tapered Roller Bearings",
    blurb:
      "Metric 302, 303, 320, 322, 323 and 330 series plus the popular inch cone-and-cup sets.",
    image: "/images/render/tapered-roller.jpg",
    groups: [
      {
        title: "Metric series",
        image: "/images/render/tapered-roller.jpg",
        parts: [
          ...seq("302", 2, 13, 2), "30302", "30304A", "30305", "30306", "30307",
          "30308D", "30308", "30309D", "30309", "30310D", "30310", "30311D", "30311",
          "30312D", "30312", "30313D", "30313", "30314D", "30314U",
          "320/28X", "32004X", "32005X", "32006X", "32007X", "32008X", "32009X", "32010XU",
          "32011X", "32012XU", "32013XU", "32014X", "3205A",
          ...seq("322", 4, 12, 2), "32213UX1", "32214", "32215", "32216U", "32217", "32218",
          ...seq("323", 5, 13, 2), "33010", "33012", "33013A", "33110", "33205", "33208", "33210",
        ],
      },
      {
        title: "Inch series (cone / cup)",
        image: "/images/render/tapered-roller.jpg",
        parts: [
          "02474/02420", "102949/10", "104948/10", "11749/11710", "11949/11910", "12649/12610",
          "12749/12710", "12749/12711", "15123/245", "17887/31", "25590/25520", "27687/20",
          "2788/2720", "28584/21", "29685/29620", "300849/300811", "3579/3525", "387/382",
          "39581/39520", "395A/394A", "3982/3927X", "3984/3920", "44649/44610", "45449/45410",
          "462/453X", "48548/48510", "501349/501310", "503349/503310", "506849/506810", "575/572",
          "603049/603011", "67048/67010", "68149/68110", "68149/68111", "69349/69310",
          "86649/10", "88649/10", "903249/903210",
        ],
      },
    ],
  },
  {
    slug: "spherical-roller",
    name: "Spherical Roller Bearings",
    blurb:
      "222, 223 and 230 series, cylindrical and tapered bore, in steel and brass cage versions.",
    image: "/images/render/spherical-roller.jpg",
    pending:
      "The full spherical roller list is being updated. Send the number on WhatsApp and we will confirm stock.",
    groups: [
      {
        title: "Series held",
        note: "Cylindrical and tapered (K) bore, steel and brass cage",
        image: "/images/render/spherical-roller.jpg",
        parts: ["222 series", "223 series", "230 series"],
      },
    ],
  },
  {
    slug: "thrust-ball",
    name: "Thrust Ball Bearings",
    blurb: "Single-direction thrust bearings in the 511, 512, 513 and 514 series.",
    image: "/images/render/thrust-ball.jpg",
    groups: [
      {
        title: "511 series",
        image: "/images/render/thrust-ball.jpg",
        parts: [...seq("511", 0, 18, 2), "51120", "51122", "51124", "51126", "51128", "51130",
          "51132", "51134", "51138", "51140", "51144"],
      },
      {
        title: "512 series",
        image: "/images/render/thrust-ball.jpg",
        parts: [...seq("512", 0, 18, 2), "51220", "51222", "51224", "51226", "51228", "51230",
          "51232", "51234", "51236", "51238", "51240", "51244"],
      },
      {
        title: "513 series",
        image: "/images/render/thrust-ball.jpg",
        parts: [...seq("513", 4, 18, 2), "51320", "51322", "51324", "51326", "51328", "51330",
          "51332", "51334"],
      },
      {
        title: "514 series",
        image: "/images/render/thrust-ball.jpg",
        parts: ["51405", "51406", "51407", "51408", "51409", "51410A", "51411", "51412",
          "51413", "51414", "51415", "51416", "51417"],
      },
    ],
  },
  {
    slug: "uc-bearings",
    name: "UC Insert Bearings",
    blurb: "Set-screw insert bearings for pillow blocks and flange units, metric and inch bore.",
    image: "/images/render/uc-insert.jpg",
    groups: [
      {
        title: "UC 200 series",
        image: "/images/render/uc-insert.jpg",
        parts: [
          "UC204", "UC205", "UC205-16", "UC206", "UC206-20", "UC207", "UC207-20", "UC208",
          "UC208-24", "UC209", "UC210", "UC210-32", "UC211", "UC211-32", "UC212", "UC212-36",
          "UC214", "UC214-44", "UC216", "UC217", "UC218",
        ],
      },
    ],
  },
  {
    slug: "blocks",
    name: "Bearing Blocks & Housings",
    blurb: "Pillow blocks (P), square flange (F) and two-bolt flange (FL) housings for UC inserts.",
    image: "/images/render/pillow-block.jpg",
    groups: [
      {
        title: "Pillow blocks (P)",
        image: "/images/render/pillow-block.jpg",
        parts: seq("P2", 4, 18, 2),
      },
      {
        title: "Square flange (F)",
        image: "/images/render/flange-unit.jpg",
        parts: seq("F2", 4, 15, 2),
      },
      {
        title: "Two-bolt flange (FL)",
        image: "/images/render/flange-unit.jpg",
        parts: ["FL204", "FL205", "FL206"],
      },
    ],
  },
];

/* ── Derived data ───────────────────────────────────────────────────────── */

function describe(part: string, range: string): Pick<StockItem, "dims" | "variant"> {
  if (range === "deep-groove") {
    const m = part.match(/^(6\d{3}|6\d\/\d{2})(.*)$/);
    if (m) return { dims: DGBB[m[1]], variant: DGBB_SUFFIX[m[2]] };
  }
  if (range === "thrust-ball") {
    return { dims: THRUST[part.replace(/[A-Z]+$/, "")] };
  }
  if (range === "tapered-roller") {
    const base = part.match(/^(320\/28|3\d{4})/)?.[1];
    if (base && !part.includes("/") && part !== "3205A") return { dims: TAPERED[base] };
    if (part === "320/28X") return { dims: TAPERED["320/28"] };
  }
  if (range === "uc-bearings") {
    const m = part.match(/^UC2(\d\d)(?:-(\d+))?$/);
    if (m) {
      const shaft = m[2] ? `${fraction(+m[2])} shaft` : `${+m[1] * 5} mm shaft`;
      return { variant: shaft };
    }
  }
  if (range === "blocks") {
    const m = part.match(/^(?:FL|F|P)2(\d\d)$/);
    if (m) return { variant: `Takes UC2${m[1]} insert · ${+m[1] * 5} mm shaft` };
  }
  return {};
}

export const partSlug = (part: string) =>
  part.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Deep groove pictures follow the closure: sealed, shielded or open. */
function imageFor(part: string, range: string, fallback: string) {
  if (range !== "deep-groove") return fallback;
  if (/LLU$/.test(part)) return "/images/render/deep-groove-sealed.jpg";
  if (/(ZZ|Z|ZNR)$/.test(part)) return "/images/render/deep-groove-shielded.jpg";
  return "/images/render/deep-groove-open.jpg";
}

/** sixteenths of an inch -> "1-1/4 in" */
function fraction(sixteenths: number) {
  const whole = Math.floor(sixteenths / 16);
  let n = sixteenths % 16;
  let d = 16;
  while (n && n % 2 === 0) {
    n /= 2;
    d /= 2;
  }
  return `${whole ? whole : ""}${whole && n ? "-" : ""}${n ? `${n}/${d}` : ""} in`;
}

export const stockItems: StockItem[] = stockRanges.flatMap((r) =>
  r.pending
    ? []
    : r.groups.flatMap((g) =>
        g.parts.map((part) => ({
          part,
          slug: partSlug(part),
          range: r.slug,
          rangeName: r.name,
          group: g.title,
          image: imageFor(part, r.slug, g.image),
          ...describe(part, r.slug),
        }))
      )
);

export const stockCount = (slug: string) =>
  stockRanges.find((r) => r.slug === slug)?.groups.reduce((n, g) => n + g.parts.length, 0) ?? 0;

/** Search key that ignores spaces, dashes, slashes and dots, so
 *  "6205 zz", "6205-ZZ" and "6205zz" all find 6205ZZ. */
export const normalisePart = (s: string) => s.toUpperCase().replace(/[\s\-/.#]/g, "");

export const findItem = (slug: string) => stockItems.find((it) => it.slug === slug);
