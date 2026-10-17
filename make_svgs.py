#!/usr/bin/env python3
"""Generate clean technical SVG illustrations for the bearing types that
have no photograph in the SBA company-profile PDF."""
import math
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "images", "products")
os.makedirs(OUT, exist_ok=True)

DEFS = """
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#f4f6f9"/>
      <stop offset="22%" stop-color="#cdd4de"/>
      <stop offset="48%" stop-color="#8f99a8"/>
      <stop offset="72%" stop-color="#c8cfd9"/>
      <stop offset="100%" stop-color="#6f7889"/>
    </linearGradient>
    <linearGradient id="steelDark" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%"  stop-color="#5b6474"/>
      <stop offset="40%" stop-color="#9aa3b2"/>
      <stop offset="70%" stop-color="#5f6878"/>
      <stop offset="100%" stop-color="#3f4653"/>
    </linearGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#f0e0bd"/>
      <stop offset="35%" stop-color="#d3b478"/>
      <stop offset="65%" stop-color="#a8874a"/>
      <stop offset="100%" stop-color="#dcc189"/>
    </linearGradient>
    <radialGradient id="ball" cx="35%" cy="30%" r="72%">
      <stop offset="0%"  stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#d5dbe4"/>
      <stop offset="75%" stop-color="#8e97a6"/>
      <stop offset="100%" stop-color="#4e5665"/>
    </radialGradient>
    <linearGradient id="roller" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#eef1f5"/>
      <stop offset="30%" stop-color="#c2c9d3"/>
      <stop offset="62%" stop-color="#7d8695"/>
      <stop offset="100%" stop-color="#525a68"/>
    </linearGradient>
    <linearGradient id="poly" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#3a4150"/>
      <stop offset="55%" stop-color="#20252f"/>
      <stop offset="100%" stop-color="#454d5c"/>
    </linearGradient>
    <radialGradient id="floor" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#1f2937" stop-opacity=".20"/>
      <stop offset="100%" stop-color="#1f2937" stop-opacity="0"/>
    </radialGradient>
  </defs>
"""

SHADOW = '<ellipse cx="400" cy="686" rx="230" ry="34" fill="url(#floor)"/>'


def wrap(body: str, title: str) -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" '
        'width="800" height="800" role="img" aria-label="%s">\n'
        '  <title>%s</title>\n'
        ''
        "%s\n%s\n%s\n</svg>\n" % (title, title, DEFS, SHADOW, body)
    )


def ring(cx, cy, r, w, fill="url(#steel)", stroke="#5b6474", sw=2.5):
    """An annulus drawn as two circles with even-odd fill."""
    return (
        f'<path d="M {cx-r} {cy} a {r} {r} 0 1 0 {2*r} 0 a {r} {r} 0 1 0 {-2*r} 0 '
        f'M {cx-(r-w)} {cy} a {r-w} {r-w} 0 1 1 {2*(r-w)} 0 a {r-w} {r-w} 0 1 1 {-2*(r-w)} 0 Z" '
        f'fill="{fill}" fill-rule="evenodd" stroke="{stroke}" stroke-width="{sw}"/>'
    )


# ---------------------------------------------------------------- needle roller
def needle_roller():
    cx, cy = 400, 390
    out_r, out_w = 250, 34
    p = [ring(cx, cy, out_r, out_w, "url(#steelDark)")]
    # cage
    p.append(ring(cx, cy, out_r - out_w - 6, 10, "url(#brass)", "#8a6f38", 1.6))
    p.append(ring(cx, cy, 120, 10, "url(#brass)", "#8a6f38", 1.6))
    # long slender needle rollers
    n = 26
    r_mid = (out_r - out_w + 120) / 2
    length = out_r - out_w - 120 - 4
    for i in range(n):
        a = 2 * math.pi * i / n
        x = cx + r_mid * math.cos(a)
        y = cy + r_mid * math.sin(a)
        deg = math.degrees(a)
        p.append(
            f'<g transform="translate({x:.1f},{y:.1f}) rotate({deg:.1f})">'
            f'<rect x="{-length/2:.1f}" y="-8" width="{length:.1f}" height="16" rx="7" '
            f'fill="url(#roller)" stroke="#4b5361" stroke-width="1.6"/>'
            f'<rect x="{-length/2+4:.1f}" y="-5.5" width="{length-8:.1f}" height="4" rx="2" '
            f'fill="#ffffff" opacity=".55"/></g>'
        )
    p.append(
        f'<circle cx="{cx}" cy="{cy}" r="110" fill="#ffffff" stroke="#c3c9d4" stroke-width="2"/>'
    )
    p.append(
        f'<text x="{cx}" y="{cy+8}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" '
        f'font-size="34" font-weight="700" fill="#98a1b2" letter-spacing="4">NK</text>'
    )
    return wrap("\n  ".join(p), "Cage and roller type needle bearing")


# ---------------------------------------------------------------- sliding bearing
def sliding_bearing():
    p = []
    # A flanged bronze bushing drawn in a light isometric view
    cx, cy = 400, 300
    rx, ry = 150, 58
    # barrel
    p.append(
        f'<path d="M {cx-rx} {cy} L {cx-rx} {cy+250} A {rx} {ry} 0 0 0 {cx+rx} {cy+250} '
        f'L {cx+rx} {cy} Z" fill="url(#brass)" stroke="#8a6f38" stroke-width="2.5"/>'
    )
    # flange
    p.append(
        f'<path d="M {cx-215} {cy} A 215 82 0 0 0 {cx+215} {cy} A 215 82 0 0 0 {cx-215} {cy} Z" '
        f'fill="url(#brass)" stroke="#8a6f38" stroke-width="2.5"/>'
    )
    p.append(
        f'<path d="M {cx-215} {cy} L {cx-215} {cy+34} A 215 82 0 0 0 {cx+215} {cy+34} '
        f'L {cx+215} {cy} A 215 82 0 0 1 {cx-215} {cy} Z" fill="#a8874a" opacity=".85"/>'
    )
    # bore
    p.append(
        f'<ellipse cx="{cx}" cy="{cy}" rx="108" ry="41" fill="#2b2f39" opacity=".9"/>'
    )
    p.append(
        f'<ellipse cx="{cx}" cy="{cy+6}" rx="108" ry="41" fill="url(#steelDark)" opacity=".55"/>'
    )
    p.append(
        f'<ellipse cx="{cx}" cy="{cy}" rx="108" ry="41" fill="none" stroke="#7a6234" stroke-width="3"/>'
    )
    # oil grooves
    for dx in (-95, -40, 15, 70):
        p.append(
            f'<path d="M {cx+dx} {cy+60} q 6 90 0 180" stroke="#8a6f38" stroke-width="4" '
            f'fill="none" opacity=".45"/>'
        )
    p.append(
        f'<ellipse cx="{cx-58}" cy="{cy+150}" rx="26" ry="120" fill="#ffffff" opacity=".22"/>'
    )
    return wrap("\n  ".join(p), "Sliding bearing / bronze bushing")


# ---------------------------------------------------------------- rod end
def rod_end():
    p = []
    cx, cy = 400, 250
    # eye
    p.append(f'<circle cx="{cx}" cy="{cy}" r="150" fill="url(#steelDark)" stroke="#3f4653" stroke-width="3"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="112" fill="url(#steel)" stroke="#5b6474" stroke-width="3"/>')
    # spherical inner
    p.append(f'<circle cx="{cx}" cy="{cy}" r="86" fill="url(#ball)" stroke="#454d5c" stroke-width="2.5"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="46" fill="#20252f"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="46" fill="url(#steelDark)" opacity=".5"/>')
    p.append(f'<ellipse cx="{cx-40}" cy="{cy-46}" rx="34" ry="20" fill="#ffffff" opacity=".45" transform="rotate(-28 {cx-40} {cy-46})"/>')
    # shank
    p.append(
        f'<path d="M {cx-58} {cy+128} L {cx-46} {cy+250} L {cx+46} {cy+250} L {cx+58} {cy+128} Z" '
        f'fill="url(#steelDark)" stroke="#3f4653" stroke-width="2.5"/>'
    )
    # threaded stud
    p.append(
        f'<rect x="{cx-46}" y="{cy+248}" width="92" height="210" rx="6" fill="url(#steel)" '
        f'stroke="#5b6474" stroke-width="2.5"/>'
    )
    for i in range(13):
        y = cy + 262 + i * 15
        p.append(f'<path d="M {cx-46} {y} L {cx+46} {y-9}" stroke="#6f7889" stroke-width="3" opacity=".75"/>')
    # lock nut
    p.append(
        f'<rect x="{cx-66}" y="{cy+300}" width="132" height="56" rx="7" fill="url(#steelDark)" '
        f'stroke="#3f4653" stroke-width="2.5"/>'
    )
    return wrap("\n  ".join(p), "Rod end bearing")


# ---------------------------------------------------------------- spherical plain
def spherical_plain():
    p = []
    cx, cy = 400, 390
    p.append(f'<circle cx="{cx}" cy="{cy}" r="255" fill="url(#steelDark)" stroke="#3f4653" stroke-width="3"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="212" fill="url(#steel)" stroke="#5b6474" stroke-width="3"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="168" fill="url(#ball)" stroke="#454d5c" stroke-width="3"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="96" fill="#191d25"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="96" fill="url(#steelDark)" opacity=".55"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="96" fill="none" stroke="#39404d" stroke-width="4"/>')
    # sphere highlight band
    p.append(
        f'<path d="M {cx-168} {cy} a 168 168 0 0 1 336 0" fill="none" stroke="#ffffff" '
        f'stroke-width="16" opacity=".35"/>'
    )
    p.append(f'<ellipse cx="{cx-92}" cy="{cy-100}" rx="52" ry="30" fill="#ffffff" opacity=".5" transform="rotate(-30 {cx-92} {cy-100})"/>')
    # lubrication hole
    p.append(f'<circle cx="{cx}" cy="{cy-233}" r="15" fill="#20252f"/>')
    return wrap("\n  ".join(p), "Spherical plain bearing")


# ---------------------------------------------------------------- flange unit
def flange_unit():
    p = []
    cx, cy = 400, 390
    # square flange housing
    p.append(
        f'<path d="M 150 140 H 650 V 640 H 150 Z" fill="url(#poly)" stroke="#171b22" '
        f'stroke-width="3" stroke-linejoin="round"/>'
    )
    p.append('<path d="M 150 140 H 650 V 200 H 150 Z" fill="#ffffff" opacity=".07"/>')
    # bolt holes
    for bx, by in [(214, 204), (586, 204), (214, 576), (586, 576)]:
        p.append(f'<circle cx="{bx}" cy="{by}" r="34" fill="#0f1218"/>')
        p.append(f'<circle cx="{bx}" cy="{by}" r="34" fill="none" stroke="#4a5262" stroke-width="3"/>')
        p.append(f'<circle cx="{bx-8}" cy="{by-9}" r="24" fill="#ffffff" opacity=".07"/>')
    # bearing insert
    p.append(f'<circle cx="{cx}" cy="{cy}" r="176" fill="url(#steelDark)" stroke="#2b303a" stroke-width="3"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="146" fill="url(#steel)" stroke="#5b6474" stroke-width="3"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="104" fill="#1c212a"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="104" fill="url(#steelDark)" opacity=".45"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="104" fill="none" stroke="#39404d" stroke-width="4"/>')
    # set screws
    for a in (-38, 38):
        rad = math.radians(a)
        p.append(
            f'<circle cx="{cx + 124*math.cos(rad):.1f}" cy="{cy + 124*math.sin(rad):.1f}" '
            f'r="15" fill="#2b2f39" stroke="#6f7889" stroke-width="2"/>'
        )
    # grease nipple
    p.append(f'<rect x="{cx-13}" y="145" width="26" height="60" rx="7" fill="url(#steel)" stroke="#5b6474" stroke-width="2"/>')
    p.append(f'<ellipse cx="{cx-52}" cy="{cy-60}" rx="30" ry="17" fill="#ffffff" opacity=".35" transform="rotate(-30 {cx-52} {cy-60})"/>')
    return wrap("\n  ".join(p), "Flange bearing unit")


# ---------------------------------------------------------------- plummer block housing
def plummer_housing():
    p = []
    cx, cy = 400, 350
    p.append(
        '<path d="M 120 640 H 680 V 560 H 596 C 596 430 520 300 400 300 '
        'C 280 300 204 430 204 560 H 120 Z" fill="url(#poly)" stroke="#171b22" '
        'stroke-width="3" stroke-linejoin="round"/>'
    )
    p.append(
        '<path d="M 204 560 C 204 430 280 300 400 300 C 520 300 596 430 596 560 '
        'L 556 560 C 556 452 494 344 400 344 C 306 344 244 452 244 560 Z" '
        'fill="#ffffff" opacity=".08"/>'
    )
    # cap split line
    p.append(f'<path d="M 214 470 H 586" stroke="#0d1015" stroke-width="6" opacity=".8"/>')
    # bore
    p.append(f'<circle cx="{cx}" cy="{cy+130}" r="152" fill="url(#steelDark)" stroke="#2b303a" stroke-width="3"/>')
    p.append(f'<circle cx="{cx}" cy="{cy+130}" r="120" fill="#12161d"/>')
    p.append(f'<circle cx="{cx}" cy="{cy+130}" r="120" fill="url(#steelDark)" opacity=".4"/>')
    p.append(f'<circle cx="{cx}" cy="{cy+130}" r="120" fill="none" stroke="#39404d" stroke-width="4"/>')
    # foot bolt holes
    for bx in (176, 624):
        p.append(f'<rect x="{bx-28}" y="576" width="56" height="46" rx="22" fill="#0f1218" stroke="#4a5262" stroke-width="3"/>')
    # cap bolts
    for bx in (256, 544):
        p.append(f'<circle cx="{bx}" cy="440" r="20" fill="#0f1218" stroke="#59616f" stroke-width="3"/>')
    # grease nipple
    p.append(f'<rect x="{cx-13}" y="284" width="26" height="46" rx="7" fill="url(#steel)" stroke="#5b6474" stroke-width="2"/>')
    return wrap("\n  ".join(p), "Plummer block bearing housing")


# ---------------------------------------------------------------- angular contact
def angular_contact():
    p = []
    cx, cy = 400, 390
    p.append(ring(cx, cy, 258, 40, "url(#steelDark)"))
    p.append(ring(cx, cy, 138, 40, "url(#steelDark)"))
    n = 13
    for i in range(n):
        a = 2 * math.pi * i / n - math.pi / 2
        x = cx + 178 * math.cos(a)
        y = cy + 178 * math.sin(a)
        p.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="38" fill="url(#ball)" stroke="#454d5c" stroke-width="2"/>')
        p.append(f'<circle cx="{x-13:.1f}" cy="{y-14:.1f}" r="12" fill="#ffffff" opacity=".7"/>')
    # brass cage arcs
    p.append(ring(cx, cy, 200, 8, "url(#brass)", "#8a6f38", 1.4))
    p.append(ring(cx, cy, 160, 8, "url(#brass)", "#8a6f38", 1.4))
    p.append(f'<circle cx="{cx}" cy="{cy}" r="98" fill="#ffffff" stroke="#c3c9d4" stroke-width="2"/>')
    p.append(
        f'<text x="{cx}" y="{cy+9}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" '
        f'font-size="30" font-weight="700" fill="#98a1b2" letter-spacing="3">7000</text>'
    )
    return wrap("\n  ".join(p), "Angular contact ball bearing")


FILES = {
    "needle-roller.svg": needle_roller,
    "sliding-bearing.svg": sliding_bearing,
    "rod-end.svg": rod_end,
    "spherical-plain.svg": spherical_plain,
    "flange-unit.svg": flange_unit,
    "plummer-block-housing.svg": plummer_housing,
    "angular-contact.svg": angular_contact,
}

for fname, fn in FILES.items():
    with open(os.path.join(OUT, fname), "w") as fh:
        fh.write(fn())
    print("wrote", fname)
