"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DGBB, TAPERED, THRUST, stockItems } from "@/lib/stock";

/**
 * Standard dimension tables (ISO boundary dimensions) with tabs per series.
 * Each base number links to its first listed version in the Part Finder.
 */
const series = [
  { id: "62", label: "Deep groove 62", table: DGBB, match: /^62\d\d$|^62\/22$/, cols: ["d", "D", "B"] },
  { id: "63", label: "Deep groove 63", table: DGBB, match: /^63\d\d$|^63\/28$/, cols: ["d", "D", "B"] },
  { id: "60", label: "Deep groove 60", table: DGBB, match: /^60\d\d$/, cols: ["d", "D", "B"] },
  { id: "302", label: "Tapered 302 / 303", table: TAPERED, match: /^30[23]\d\d$/, cols: ["d", "D", "T"] },
  { id: "322", label: "Tapered 320 / 322", table: TAPERED, match: /^32[02]\d\d$/, cols: ["d", "D", "T"] },
  { id: "511", label: "Thrust 511 / 512", table: THRUST, match: /^51[12]\d\d$/, cols: ["d", "D", "H"] },
];

export default function SpecTables() {
  const [active, setActive] = useState(series[0].id);
  const s = series.find((x) => x.id === active)!;

  const rows = useMemo(() => {
    return Object.entries(s.table)
      .filter(([k]) => s.match.test(k))
      .sort((a, b) => a[1][0] - b[1][0] || a[0].localeCompare(b[0]))
      .map(([base, dims]) => {
        const listed = stockItems.filter((it) => it.part.replace(/(LLU|ZZ|ZNR|Z|NR|CM|U1|X|XU|UX1|U|D|A)$/, "") === base || it.part === base);
        return { base, dims, listed };
      });
  }, [s]);

  return (
    <div>
      <div role="tablist" aria-label="Bearing series" className="flex gap-2 overflow-x-auto pb-2">
        {series.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={active === x.id}
            onClick={() => setActive(x.id)}
            className={`shrink-0 rounded-md border px-3.5 py-2 text-sm font-semibold transition ${
              active === x.id
                ? "border-ink-950 bg-ink-950 text-white"
                : "border-ink-300 bg-white text-ink-700 hover:border-ink-500"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-4 overflow-hidden rounded-lg border border-ink-200 bg-white">
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">{s.label} dimensions in millimetres</caption>
            <thead className="sticky top-0 bg-ink-100 text-ink-700">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Base number</th>
                {s.cols.map((c) => (
                  <th key={c} scope="col" className="px-4 py-3 text-right font-semibold">
                    {c} <span className="font-normal text-ink-500">mm</span>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 font-semibold">Versions listed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 text-ink-800">
              {rows.map((r) => (
                <tr key={r.base} className="transition-colors hover:bg-brand-50/60">
                  <th scope="row" className="px-4 py-2.5 font-mono font-bold text-ink-950">{r.base}</th>
                  {r.dims.map((v, i) => (
                    <td key={i} className="px-4 py-2.5 text-right tabular-nums">{v}</td>
                  ))}
                  <td className="px-4 py-2.5">
                    <span className="flex flex-wrap gap-1.5">
                      {r.listed.length ? (
                        r.listed.map((it) => (
                          <Link key={it.slug} href={`/stock/${it.slug}`} className="rounded-sm bg-ink-100 px-1.5 py-0.5 font-mono text-xs text-ink-800 hover:bg-brand-100 hover:text-brand-800">
                            {it.part}
                          </Link>
                        ))
                      ) : (
                        <span className="text-xs text-ink-400">Ask us</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-500">
        d = bore, D = outside diameter, B / T / H = width, total width or height. Standard ISO boundary dimensions.
      </p>
    </div>
  );
}
