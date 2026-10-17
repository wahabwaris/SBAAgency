"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  normalisePart,
  stockCount,
  stockItems,
  stockRanges,
  type StockItem,
} from "@/lib/stock";
import { waMessages, whatsappUrl } from "@/lib/site";
import { WhatsAppButton, WhatsAppGlyph } from "@/components/WhatsApp";
import { SearchIcon } from "@/components/ui";
import { ZoomThumb } from "@/components/ZoomImage";

const listedRanges = stockRanges.filter((r) => !r.pending);

/**
 * Part-number search over the stock list.
 *
 * compact  — home-page version: search box only, shows the first few matches
 *            once the visitor types and links to /stock for the rest.
 * full     — /stock page: range filter, every part grouped by series, and a
 *            "selected parts" list that goes to WhatsApp as one message.
 */
export default function StockFinder({
  mode = "full",
  initialQuery = "",
  initialRange = "",
}: {
  mode?: "compact" | "full";
  initialQuery?: string;
  initialRange?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [range, setRange] = useState(initialRange);
  const [picked, setPicked] = useState<string[]>([]);

  const q = normalisePart(query.trim());

  const matches = useMemo(() => {
    return stockItems.filter((it) => {
      if (range && it.range !== range) return false;
      if (!q) return true;
      return normalisePart(it.part).includes(q);
    });
  }, [q, range]);

  // Exact or prefix hits first, so "6205" puts 6205LLU / 6205ZZ at the top
  const ranked = useMemo(() => {
    if (!q) return matches;
    return [...matches].sort((a, b) => {
      const pa = normalisePart(a.part).startsWith(q) ? 0 : 1;
      const pb = normalisePart(b.part).startsWith(q) ? 0 : 1;
      return pa - pb;
    });
  }, [matches, q]);

  const toggle = (part: string) =>
    setPicked((list) =>
      list.includes(part) ? list.filter((p) => p !== part) : [...list, part]
    );

  const searchBox = (
    <label className="relative block">
      <span className="sr-only">Search by part number</span>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Part number, e.g. 6205ZZ or UC208"
        autoComplete="off"
        spellCheck={false}
        className="field !py-4 !pl-12 font-mono text-base"
      />
    </label>
  );

  /* ── Compact (home page) ── */
  if (mode === "compact") {
    const shown = ranked.slice(0, 6);
    return (
      <div>
        {searchBox}
        {q && (
          <div className="mt-4">
            {shown.length ? (
              <>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {shown.map((it) => (
                    <PartRow key={it.part} item={it} />
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="text-ink-400">
                    {ranked.length} match{ranked.length === 1 ? "" : "es"}
                  </span>
                  {ranked.length > shown.length && (
                    <Link
                      href={`/stock?q=${encodeURIComponent(query.trim())}`}
                      className="font-bold text-brand-400 hover:text-brand-300"
                    >
                      See all {ranked.length} matches
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <NotListed query={query.trim()} />
            )}
          </div>
        )}
      </div>
    );
  }

  /* ── Full (/stock) ── */
  const grouped = listedRanges
    .map((r) => ({
      range: r,
      groups: r.groups
        .map((g) => ({
          title: g.title,
          items: ranked.filter((it) => it.range === r.slug && it.group === g.title),
        }))
        .filter((g) => g.items.length),
    }))
    .filter((r) => r.groups.length);

  return (
    <div className="pb-24">
      <div className="sticky top-[75px] z-30 -mx-5 border-b border-ink-800 bg-ink-950/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        {searchBox}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by range">
          <RangeChip active={!range} onClick={() => setRange("")} label="All" count={stockItems.length} />
          {listedRanges.map((r) => (
            <RangeChip
              key={r.slug}
              active={range === r.slug}
              onClick={() => setRange(range === r.slug ? "" : r.slug)}
              label={r.name.replace(" Bearings", "")}
              count={stockCount(r.slug)}
            />
          ))}
        </div>
      </div>

      {grouped.length === 0 && (
        <div className="mt-10">
          <NotListed query={query.trim()} />
        </div>
      )}

      {grouped.map(({ range: r, groups }) => (
        <section key={r.slug} id={r.slug} className="mt-12 scroll-mt-48">
          <div className="flex items-center gap-4">
            <div className="product-tile h-16 w-16 shrink-0">
              <Image src={r.image} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </div>
            <div className="min-w-0">
              <h2 className="h3 text-xl">{r.name}</h2>
              <p className="mt-0.5 text-sm text-ink-400">{r.blurb}</p>
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title} className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-ink-200">
                {g.title}{" "}
                <span className="font-medium text-ink-500">({g.items.length})</span>
              </h3>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((it) => (
                  <PartRow
                    key={it.part}
                    item={it}
                    picked={picked.includes(it.part)}
                    onPick={() => toggle(it.part)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      {/* Spherical rollers: list still being confirmed */}
      {!q && (!range || range === "spherical-roller") &&
        stockRanges
          .filter((r) => r.pending)
          .map((r) => (
            <section key={r.slug} id={r.slug} className="mt-12 scroll-mt-48">
              <div className="flex flex-col gap-5 rounded-2xl border border-ink-800 bg-ink-900 p-5 sm:flex-row sm:items-center">
                <div className="product-tile h-24 w-24 shrink-0">
                  <Image src={r.image} alt="" fill sizes="96px" className="object-contain p-2" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="h3 text-xl">{r.name}</h2>
                  <p className="mt-1 text-sm text-ink-400">
                    {r.groups[0].parts.join(", ")}. {r.pending}
                  </p>
                </div>
                <WhatsAppButton message={waMessages.range(r.name.toLowerCase())} size="sm">
                  Ask on WhatsApp
                </WhatsAppButton>
              </div>
            </section>
          ))}

      {/* Selected parts → one WhatsApp message */}
      {picked.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-ink-700 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <div className="container-x flex flex-wrap items-center gap-3 py-3 pr-24 sm:pr-28">
            <p className="min-w-0 flex-1 text-sm text-ink-200">
              <span className="font-bold text-white">
                {picked.length} part{picked.length === 1 ? "" : "s"} selected
              </span>
              <span className="ml-2 hidden truncate font-mono text-xs text-ink-400 sm:inline">
                {picked.join(", ")}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setPicked([])}
              className="btn-ghost !px-4 !py-2.5 text-xs"
            >
              Clear
            </button>
            <a
              href={whatsappUrl(waMessages.parts(picked))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-whatsapp !px-4 !py-2.5 text-xs text-white hover:bg-whatsapp-dark"
            >
              <WhatsAppGlyph className="h-4 w-4" />
              Send list on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────────────── */

function PartRow({
  item,
  picked,
  onPick,
}: {
  item: StockItem;
  picked?: boolean;
  onPick?: () => void;
}) {
  return (
    <li
      className={`flex min-w-0 items-center gap-3 rounded-lg border bg-ink-900 p-2.5 pr-3 transition-colors ${
        picked ? "border-whatsapp/70" : "border-ink-800 hover:border-ink-600"
      }`}
    >
      <ZoomThumb src={item.image} alt={item.part} caption={`${item.part} (${item.group})`} className="h-14 w-14" />
      <Link href={`/stock/${item.slug}`} className="group/link min-w-0 flex-1">
        <p className="font-mono text-[15px] font-bold leading-tight text-white [overflow-wrap:anywhere] group-hover/link:text-brand-300" title={item.part}>
          {item.part}
        </p>
        <p className="truncate text-xs text-ink-400">
          {item.dims
            ? `${item.dims[0]} × ${item.dims[1]} × ${item.dims[2]} mm`
            : item.group}
          {item.variant ? ` · ${item.variant}` : ""}
        </p>
        <p className="mt-0.5 text-xs font-semibold text-brand-400 group-hover/link:text-brand-300">View details</p>
      </Link>
      {onPick && (
        <button
          type="button"
          onClick={onPick}
          aria-pressed={picked}
          aria-label={picked ? `Remove ${item.part} from list` : `Add ${item.part} to list`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition ${
            picked
              ? "border-whatsapp bg-whatsapp/15 text-whatsapp"
              : "border-ink-700 text-ink-400 hover:border-ink-500 hover:text-white"
          }`}
        >
          {picked ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          )}
        </button>
      )}
      <a
        href={whatsappUrl(waMessages.part(item.part, item.rangeName.replace(/s$/, "")))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ask about ${item.part} on WhatsApp`}
        title="Ask price on WhatsApp"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-whatsapp text-white transition hover:bg-whatsapp-dark"
      >
        <WhatsAppGlyph className="h-[18px] w-[18px]" />
      </a>
    </li>
  );
}

function RangeChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
        active
          ? "border-brand-500 bg-brand-500 text-ink-950"
          : "border-ink-700 bg-ink-900 text-ink-300 hover:border-brand-500/60 hover:text-white"
      }`}
    >
      {label} <span className={active ? "text-ink-950/70" : "text-ink-500"}>{count}</span>
    </button>
  );
}

function NotListed({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-700 bg-ink-900/60 p-6 text-center">
      <p className="font-bold text-white">
        {query ? <>“{query}” is not on the online list yet.</> : "Nothing in this range matches."}
      </p>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-400">
        We hold many more numbers at the counter than are listed here. Send it on
        WhatsApp and we will check stock across all four sales centres.
      </p>
      <WhatsAppButton
        message={query ? waMessages.part(query, "not on the online list") : waMessages.stock}
        size="sm"
        className="mt-4"
      >
        Ask about {query || "a part"} on WhatsApp
      </WhatsAppButton>
    </div>
  );
}
