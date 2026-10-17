"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  boreRange,
  cageOptions,
  categories,
  products,
  sealOptions,
  type Product,
} from "@/lib/products";
import { waMessages } from "@/lib/site";
import { ProductCard, SearchIcon } from "@/components/ui";
import { WhatsAppButton } from "@/components/WhatsApp";

type SortKey = "relevance" | "bore-asc" | "bore-desc" | "name";

export default function ProductExplorer({
  initialCategory = "",
}: {
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [cages, setCages] = useState<string[]>([]);
  const [seals, setSeals] = useState<string[]>([]);
  const [maxBore, setMaxBore] = useState<number>(boreRange[1]);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (value: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (cages.length && !cages.includes(p.cage)) return false;
      if (seals.length && !seals.includes(p.seal)) return false;
      if (p.bore > maxBore) return false;
      if (!q) return true;
      const haystack = [
        p.designation,
        p.name,
        p.description,
        p.cage,
        p.seal,
        ...p.applications,
        String(p.bore),
        String(p.od),
      ]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((token) => haystack.includes(token));
    });

    out = [...out];
    if (sort === "bore-asc") out.sort((a, b) => a.bore - b.bore);
    else if (sort === "bore-desc") out.sort((a, b) => b.bore - a.bore);
    else if (sort === "name")
      out.sort((a, b) => a.designation.localeCompare(b.designation));
    return out;
  }, [query, category, cages, seals, maxBore, sort]);

  const activeCount =
    (category ? 1 : 0) +
    cages.length +
    seals.length +
    (maxBore < boreRange[1] ? 1 : 0);

  const reset = () => {
    setQuery("");
    setCategory("");
    setCages([]);
    setSeals([]);
    setMaxBore(boreRange[1]);
    setSort("relevance");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[276px_1fr] lg:gap-12">
      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center justify-between lg:mb-4">
          <h2 className="font-display text-lg font-bold text-white">
            Filters
            {activeCount > 0 && (
              <span className="ml-2 rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-ink-950">
                {activeCount}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="btn-ghost !px-3 !py-2 text-xs lg:hidden"
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? "Hide" : "Show"}
          </button>
        </div>

        <div className={`${filtersOpen ? "block" : "hidden"} mt-4 lg:mt-0 lg:block`}>
          <FilterGroup label="Category">
            <div className="space-y-1">
              <Row
                type="radio"
                checked={category === ""}
                onChange={() => setCategory("")}
                label="All categories"
                count={products.length}
              />
              {categories.map((c) => (
                <Row
                  key={c.slug}
                  type="radio"
                  checked={category === c.slug}
                  onChange={() => setCategory(c.slug)}
                  label={c.short}
                  count={products.filter((p) => p.category === c.slug).length}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label={`Max bore ⌀ — ${maxBore} mm`}>
            <input
              type="range"
              min={boreRange[0]}
              max={boreRange[1]}
              step={5}
              value={maxBore}
              onChange={(e) => setMaxBore(Number(e.target.value))}
              className="w-full accent-brand-500"
              aria-label="Maximum bore diameter in millimetres"
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-ink-500">
              <span>{boreRange[0]} mm</span>
              <span>{boreRange[1]} mm</span>
            </div>
          </FilterGroup>

          <FilterGroup label="Cage material">
            <div className="space-y-1">
              {cageOptions.map((c) => (
                <Row
                  key={c}
                  type="checkbox"
                  checked={cages.includes(c)}
                  onChange={() => toggle(c, cages, setCages)}
                  label={c}
                  count={products.filter((p) => p.cage === c).length}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Sealing">
            <div className="space-y-1">
              {sealOptions.map((s) => (
                <Row
                  key={s}
                  type="checkbox"
                  checked={seals.includes(s)}
                  onChange={() => toggle(s, seals, setSeals)}
                  label={s}
                  count={products.filter((p) => p.seal === s).length}
                />
              ))}
            </div>
          </FilterGroup>

          {activeCount > 0 && (
            <button type="button" onClick={reset} className="btn-ghost mt-6 w-full">
              Clear all filters
            </button>
          )}

          <div className="mt-8 rounded-2xl border border-brand-500/25 bg-brand-500/[.07] p-5">
            <p className="text-sm font-bold text-white">Can&apos;t find it?</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
              Our physical stock is far larger than this online list. Send the
              designation or dimensions and we will check all four sales centres.
            </p>
            <WhatsAppButton
              message={waMessages.stock}
              size="sm"
              className="mt-4 w-full"
            >
              Ask on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </aside>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by part number, type, size or application…"
              aria-label="Search products"
              className="field !pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort results"
            className="field sm:w-56"
          >
            <option value="relevance">Sort: default</option>
            <option value="name">Designation (A–Z)</option>
            <option value="bore-asc">Bore: small to large</option>
            <option value="bore-desc">Bore: large to small</option>
          </select>
        </div>

        <p className="mt-5 text-sm text-ink-500">
          Showing <span className="font-bold text-white">{results.length}</span> of{" "}
          {products.length} listed items
          {category && (
            <>
              {" "}
              in{" "}
              <span className="font-semibold text-brand-500">
                {categories.find((c) => c.slug === category)?.name}
              </span>
            </>
          )}
        </p>

        {results.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p: Product, i) => (
              <ProductCard key={p.slug} product={p} delay={Math.min(i, 8) * 45} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-ink-700 bg-ink-900 p-12 text-center">
            <p className="font-display text-lg font-bold text-white">
              No listed items match those filters
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-400">
              This online list is only a sample of what we hold. Clear the
              filters, or send us the part number and we will check the network.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="btn-ghost">
                Clear filters
              </button>
              <WhatsAppButton message={waMessages.stock}>
                Ask on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Filter primitives ───────────────────────────────────────────────────── */

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-ink-800 py-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-xs font-bold text-ink-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function Row({
  type,
  checked,
  onChange,
  label,
  count,
}: {
  type: "radio" | "checkbox";
  checked: boolean;
  onChange: () => void;
  label: string;
  count: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm text-ink-300 transition hover:bg-ink-800 hover:text-white">
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-brand-500"
      />
      <span className="flex-1">{label}</span>
      <span className="font-mono text-xs tabular-nums text-ink-500">
        {count}
      </span>
    </label>
  );
}
