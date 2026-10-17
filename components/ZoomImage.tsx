"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/**
 * A product picture that opens full screen when tapped.
 *
 * In the viewer:
 *  - tap / click the picture to zoom in on that spot, tap again to zoom out
 *  - pinch with two fingers, or use the mouse wheel, to zoom freely
 *  - drag to move around while zoomed
 *  - Esc, the close button or a tap on the dark background closes it
 */
export default function ZoomImage({
  src,
  alt,
  caption,
  sizes = "(max-width:1024px) 100vw, 50vw",
  className = "",
  imgClassName = "object-contain p-6",
  priority,
  hint = true,
}: {
  src: string;
  alt: string;
  caption?: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  hint?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger picture: ${alt}`}
        className={`group relative block w-full cursor-zoom-in overflow-hidden ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${imgClassName} transition-transform duration-500 ease-out group-hover:scale-[1.04]`}
        />
        {hint && (
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md bg-ink-950/80 px-2 py-1 text-[11px] font-semibold text-white">
            <ZoomGlyph className="h-3.5 w-3.5" />
            Tap to zoom
          </span>
        )}
      </button>
      {open && <Viewer src={src} alt={alt} caption={caption ?? alt} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Small icon-only trigger, used on the thumbnails in the stock list. */
export function ZoomThumb({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger picture: ${alt}`}
        className={`group relative shrink-0 cursor-zoom-in overflow-hidden rounded-md bg-white ${className}`}
      >
        <Image src={src} alt="" fill sizes="80px" className="object-contain p-1 transition-transform group-hover:scale-110" />
        <span className="pointer-events-none absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded bg-ink-950/75 text-white">
          <ZoomGlyph className="h-3 w-3" />
        </span>
      </button>
      {open && <Viewer src={src} alt={alt} caption={caption ?? alt} onClose={() => setOpen(false)} />}
    </>
  );
}

function ZoomGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6" />
    </svg>
  );
}

/* ── Full-screen viewer ─────────────────────────────────────────────────── */

const MAX = 5;

function Viewer({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: false, startDist: 0, startScale: 1, lastX: 0, lastY: 0 });

  const clampPos = useCallback((x: number, y: number, s: number) => {
    const el = stage.current;
    if (!el || s <= 1) return { x: 0, y: 0 };
    const w = el.clientWidth, h = el.clientHeight;
    const mx = ((s - 1) * w) / 2, my = ((s - 1) * h) / 2;
    return { x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y)) };
  }, []);

  /** zoom to scale s keeping the screen point (cx, cy) fixed */
  const zoomAt = useCallback(
    (s: number, cx: number, cy: number) => {
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ox = cx - (r.left + r.width / 2);
      const oy = cy - (r.top + r.height / 2);
      setScale((old) => {
        const ns = Math.max(1, Math.min(MAX, s));
        setPos((p) => clampPos(ox - ((ox - p.x) * ns) / old, oy - ((oy - p.y) * ns) / old, ns));
        return ns;
      });
    },
    [clampPos]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(MAX, s + 0.5));
      if (e.key === "-") {
        setScale((s) => Math.max(1, s - 0.5));
        setPos({ x: 0, y: 0 });
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    g.moved = false;
    g.lastX = e.clientX;
    g.lastY = e.clientY;
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      g.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      g.startScale = scale;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.startDist > 0) {
        g.moved = true;
        zoomAt((g.startScale * d) / g.startDist, (a.x + b.x) / 2, (a.y + b.y) / 2);
      }
      return;
    }
    const dx = e.clientX - g.lastX, dy = e.clientY - g.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) g.moved = true;
    g.lastX = e.clientX;
    g.lastY = e.clientY;
    if (scale > 1) setPos((p) => clampPos(p.x + dx, p.y + dy, scale));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const wasPinch = pointers.current.size > 1;
    pointers.current.delete(e.pointerId);
    if (wasPinch || gesture.current.moved) return;
    // a tap: toggle zoom at the tapped point
    if (scale > 1) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    } else {
      zoomAt(2.5, e.clientX, e.clientY);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    zoomAt(scale * (e.deltaY < 0 ? 1.18 : 1 / 1.18), e.clientX, e.clientY);
  };

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Picture: ${alt}`}
      className="fixed inset-0 z-[120] flex flex-col bg-ink-950/95 backdrop-blur-sm animate-pop-in"
    >
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] text-white sm:px-6">
        <p className="min-w-0 truncate text-sm font-semibold">{caption}</p>
        <div className="flex shrink-0 items-center gap-2">
          <ViewerButton label="Zoom out" onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }} disabled={scale <= 1}>
            <path d="M5 12h14" />
          </ViewerButton>
          <ViewerButton label="Zoom in" onClick={() => setScale((s) => Math.min(MAX, s + 1))} disabled={scale >= MAX}>
            <path d="M12 5v14M5 12h14" />
          </ViewerButton>
          <ViewerButton label="Close" onClick={onClose}>
            <path d="M6 6l12 12M18 6 6 18" />
          </ViewerButton>
        </div>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center px-3"
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) onClose();
        }}
      >
        <div
          ref={stage}
          className="relative touch-none select-none overflow-hidden rounded-lg bg-white"
          style={{
            width: "min(94vw, calc(100dvh - 150px), 1100px)",
            aspectRatio: "1 / 1",
            cursor: scale > 1 ? "grab" : "zoom-in",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
          onWheel={onWheel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="h-full w-full object-contain transition-transform duration-200 ease-out"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
          />
        </div>
      </div>

      <p className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 text-center text-xs text-ink-400">
        Tap the picture to zoom. Pinch or scroll to zoom further, drag to move.
      </p>
    </div>
  );

  return createPortal(content, document.body);
}

function ViewerButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:bg-white/15 disabled:opacity-35"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {children}
      </svg>
    </button>
  );
}
