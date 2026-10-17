#!/usr/bin/env python3
"""
Original SBA logo for the v2 site.

Concept: a bearing outer race whose rolling elements sit on the same ring as a
globe's latitude lines. The inner ring carries meridians, so the mark reads as a
bearing and as international trade at once. A blue roller sits in the race gap
with a trade arc sweeping out of it — 'stock in motion'.

Everything is drawn from primitives; no traced or borrowed artwork.

The wordmark uses textLength + lengthAdjust so it occupies exactly the same box
no matter which font the renderer substitutes. Without that, a fallback font
silently overflows the canvas.
"""
import math
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "images")
os.makedirs(OUT, exist_ok=True)

ACCENT = "#3B82F6"
ACCENT_HI = "#93C5FD"
INK = "#050B1A"
STEEL_D = "#47536B"
STEEL_L = "#94A3B8"
WHITE = "#FFFFFF"

FONT = "'Segoe UI',Arial,Helvetica,sans-serif"


def mark(ink: str, accent: str, accent_hi: str) -> str:
    """The icon alone, drawn on a 120x120 box."""
    cx = cy = 60
    R_OUT, R_IN = 54, 30
    p = []

    # outer race — a split ring; the gap is where the accent roller sits
    p.append(
        f'<circle cx="{cx}" cy="{cy}" r="{R_OUT}" fill="none" stroke="{ink}" '
        f'stroke-width="9" stroke-linecap="round" stroke-dasharray="250 90" '
        f'transform="rotate(-52 {cx} {cy})"/>'
    )

    # globe — sphere with equator and meridian
    p.append(f'<circle cx="{cx}" cy="{cy}" r="{R_IN}" fill="none" stroke="{ink}" stroke-width="5"/>')
    p.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{R_IN}" ry="12" fill="none" stroke="{ink}" stroke-width="3.4" opacity=".85"/>')
    p.append(f'<ellipse cx="{cx}" cy="{cy}" rx="12" ry="{R_IN}" fill="none" stroke="{ink}" stroke-width="3.4" opacity=".85"/>')

    # rolling elements riding between race and globe
    ring_r = (R_OUT + R_IN) / 2
    for i in range(8):
        a = math.radians(-52 + i * 40)
        p.append(
            f'<circle cx="{cx + ring_r * math.cos(a):.2f}" '
            f'cy="{cy + ring_r * math.sin(a):.2f}" r="5.4" fill="{ink}"/>'
        )

    # accent roller in the race gap
    ax, ay = cx, cy - ring_r
    p.append(f'<circle cx="{ax:.2f}" cy="{ay:.2f}" r="9.5" fill="{accent}"/>')
    p.append(f'<circle cx="{ax-2.6:.2f}" cy="{ay-2.8:.2f}" r="3.1" fill="{accent_hi}"/>')

    # trade arc sweeping out of the gap
    p.append(
        f'<path d="M {cx+16} {cy-52} A 56 56 0 0 1 {cx+52} {cy-14}" fill="none" '
        f'stroke="{accent}" stroke-width="5.5" stroke-linecap="round"/>'
    )
    return "\n    ".join(p)


# wordmark geometry — fixed, so nothing can overflow
X = 146           # left edge of the type block
W = 396           # locked width of the top line
VB_W = 600


def logo_svg(ink: str, accent: str, accent_hi: str, sub: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB_W} 120" width="{VB_W}" height="120"
     role="img" aria-label="Sind Bearing Agency">
  <title>Sind Bearing Agency</title>
  <g>
    {mark(ink, accent, accent_hi)}
  </g>
  <g font-family="{FONT}">
    <text x="{X}" y="55" font-size="42" font-weight="800" fill="{ink}"
          textLength="{W}" lengthAdjust="spacingAndGlyphs">SIND BEARING</text>
    <rect x="{X}" y="66" width="{W}" height="2.4" fill="{sub}" opacity=".45"/>
    <text x="{X}" y="99" font-size="24" font-weight="700" fill="{accent}"
          textLength="196" lengthAdjust="spacingAndGlyphs">AGENCY</text>
    <text x="{X + W}" y="99" font-size="15" font-weight="700" fill="{sub}"
          text-anchor="end" textLength="76" lengthAdjust="spacingAndGlyphs">EST. 1982</text>
  </g>
</svg>
"""


def mark_svg(ink: str, accent: str, accent_hi: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"
     role="img" aria-label="Sind Bearing Agency mark">
  <title>Sind Bearing Agency</title>
  {mark(ink, accent, accent_hi)}
</svg>
"""


def favicon_svg() -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="26" fill="{INK}"/>
  <g transform="translate(60 60) scale(.80) translate(-60 -60)">
    {mark(WHITE, ACCENT, ACCENT_HI)}
  </g>
</svg>
"""


files = {
    "logo.svg": logo_svg(WHITE, ACCENT, ACCENT_HI, STEEL_L),        # dark backgrounds
    "logo-dark.svg": logo_svg(INK, ACCENT, ACCENT_HI, STEEL_D),  # light backgrounds
    "logo-mark.svg": mark_svg(WHITE, ACCENT, ACCENT_HI),
    "logo-mark-dark.svg": mark_svg(INK, ACCENT, ACCENT_HI),
}

for name, svg in files.items():
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(svg)
    print("wrote", name)

with open(os.path.join(os.path.dirname(OUT), "favicon.svg"), "w") as fh:
    fh.write(favicon_svg())
print("wrote favicon.svg")
