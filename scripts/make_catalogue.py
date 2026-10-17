#!/usr/bin/env python3
"""
Build public/downloads/SBA-Stock-Catalogue.pdf from lib/stock.ts.

    node scripts/export-stock.js /tmp/stock.json
    python3 scripts/make_catalogue.py /tmp/stock.json

Re-run both whenever part numbers are added, so the PDF always matches the
website's Part Finder.
"""
import datetime
import json
import os
import sys

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import (Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate,
                                Spacer, Table, TableStyle)
from reportlab.lib.styles import ParagraphStyle

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAVY = colors.HexColor("#0B1830")
BLUE = colors.HexColor("#2563EB")
STEEL = colors.HexColor("#64748B")
LINE = colors.HexColor("#CBD5E1")
PALE = colors.HexColor("#F1F5F9")

H1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=26, leading=31, textColor=NAVY)
H2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=17, leading=21, textColor=NAVY, spaceAfter=3)
H3 = ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=NAVY, spaceBefore=8, spaceAfter=4)
BODY = ParagraphStyle("b", fontName="Helvetica", fontSize=9.5, leading=13.5, textColor=colors.HexColor("#334155"))
SMALL = ParagraphStyle("s", fontName="Helvetica", fontSize=8, leading=11, textColor=STEEL)


def page_frame(c, doc):
    c.saveState()
    w, h = A4
    c.setFillColor(NAVY)
    c.rect(0, h - 12 * mm, w, 12 * mm, stroke=0, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(15 * mm, h - 7.8 * mm, "SIND BEARING AGENCY (SBA)")
    c.setFont("Helvetica", 8)
    c.drawRightString(w - 15 * mm, h - 7.8 * mm, "Stock catalogue")
    c.setFillColor(STEEL)
    c.setFont("Helvetica", 7.5)
    c.drawString(15 * mm, 9 * mm, "WhatsApp +92 300 2028297   ·   sba@ktntn.com   ·   ktntn.com")
    c.drawRightString(w - 15 * mm, 9 * mm, f"Page {doc.page}")
    c.restoreState()


def dims(it):
    d = it.get("dims")
    return [str(d[0]), str(d[1]), str(d[2])] if d else ["–", "–", "–"]


def build(data, out):
    doc = SimpleDocTemplate(out, pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm,
                            topMargin=20 * mm, bottomMargin=16 * mm,
                            title="SBA Stock Catalogue", author="Sind Bearing Agency")
    story = []
    total = len(data["items"])

    # cover
    story += [Spacer(1, 18 * mm), Paragraph("Stock catalogue", H1), Spacer(1, 4 * mm),
              Paragraph("Sind Bearing Agency (SBA): importers and stockists of Japanese bearings since 1982. "
                        "Head office in Karachi; sales centres in Karachi and Lahore.", BODY), Spacer(1, 3 * mm),
              Paragraph(f"This catalogue lists the {total} part numbers shown on our website, with standard "
                        "boundary dimensions where the series is an ISO standard. We hold many more numbers than "
                        "are listed here. For prices and availability, send the part number and quantity on "
                        "WhatsApp +92 300 2028297 or email sba@ktntn.com.", BODY), Spacer(1, 8 * mm)]
    cover_imgs = ["deep-groove-pair", "tapered-roller", "wheel-hub", "pillow-block"]
    row = [Image(os.path.join(ROOT, "public/images/render", f"{n}.jpg"), 40 * mm, 40 * mm) for n in cover_imgs]
    story.append(Table([row], colWidths=[45 * mm] * 4))
    story.append(Spacer(1, 8 * mm))
    toc = [["Range", "Part numbers"]]
    for r in data["ranges"]:
        n = sum(len(g["parts"]) for g in r["groups"])
        toc.append([r["name"], "Series list" if r.get("pending") else str(n)])
    t = Table(toc, colWidths=[120 * mm, 40 * mm])
    t.setStyle(TableStyle([("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 9), ("FONT", (0, 1), (-1, -1), "Helvetica", 9),
                           ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                           ("LINEBELOW", (0, 1), (-1, -1), 0.4, LINE), ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                           ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    story += [t, Spacer(1, 6 * mm),
              Paragraph(f"Dimensions in millimetres: d = bore, D = outside diameter, B = width (T for tapered, "
                        f"H for thrust). Pictures show the bearing type. Issued {datetime.date.today():%d %B %Y}.", SMALL)]

    for r in data["ranges"]:
        story.append(PageBreak())
        head = Table([[Image(os.path.join(ROOT, "public", r["image"].lstrip("/")), 30 * mm, 30 * mm),
                       [Paragraph(r["name"], H2), Paragraph(r["blurb"], BODY)]]], colWidths=[34 * mm, 146 * mm])
        head.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
        story += [head, Spacer(1, 3 * mm)]
        if r.get("pending"):
            story.append(Paragraph("Series held: " + ", ".join(r["groups"][0]["parts"]) + ". " + r["pending"], BODY))
            continue
        for g in r["groups"]:
            items = [it for it in data["items"] if it["range"] == r["slug"] and it["group"] == g["title"]]
            has_dims = any(it.get("dims") for it in items)
            third = "T" if r["slug"] == "tapered-roller" else "H" if r["slug"] == "thrust-ball" else "B"
            if has_dims:
                header = ["Part number", "d", "D", third, "Version / note"]
                rows = [[it["part"], *dims(it), it.get("variant") or ""] for it in items]
                widths = [42 * mm, 15 * mm, 15 * mm, 15 * mm, 93 * mm]
            else:
                # compact grid of numbers, four per row
                header = None
                cells = [it["part"] + (f"  ({it['variant']})" if it.get("variant") else "") for it in items]
                per = 2 if any(it.get("variant") for it in items) else 3
                rows = [cells[i:i + per] + [""] * (per - len(cells[i:i + per])) for i in range(0, len(cells), per)]
                widths = [180 * mm / per] * per
            data_rows = ([header] if header else []) + rows
            tbl = Table(data_rows, colWidths=widths, repeatRows=1 if header else 0)
            st = [("FONT", (0, 0), (-1, -1), "Helvetica", 8.5),
                  ("LINEBELOW", (0, 0), (-1, -1), 0.3, LINE),
                  ("TOPPADDING", (0, 0), (-1, -1), 3.2), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2),
                  ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#0F172A"))]
            if header:
                st += [("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 8.5), ("BACKGROUND", (0, 0), (-1, 0), PALE),
                       ("FONT", (0, 1), (0, -1), "Helvetica-Bold", 8.5),
                       ("ALIGN", (1, 0), (3, -1), "RIGHT")]
                for i in range(2, len(data_rows), 2):
                    st.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#F8FAFC")))
            else:
                st += [("FONT", (0, 0), (-1, -1), "Helvetica-Bold", 8.5)]
            tbl.setStyle(TableStyle(st))
            story += [KeepTogether([Paragraph(f"{g['title']}  ({len(items)})", H3), tbl]) if len(rows) < 25
                      else Paragraph(f"{g['title']}  ({len(items)})", H3)]
            if len(rows) >= 25:
                story.append(tbl)
            story.append(Spacer(1, 3 * mm))

    doc.build(story, onFirstPage=page_frame, onLaterPages=page_frame)


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "/tmp/stock.json"
    out = os.path.join(ROOT, "public", "downloads", "SBA-Stock-Catalogue.pdf")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build(json.load(open(src)), out)
    print("wrote", out, os.path.getsize(out) // 1024, "KB")
