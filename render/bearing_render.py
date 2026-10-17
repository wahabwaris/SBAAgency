#!/usr/bin/env python3
"""
Studio product renders of bearings, ray-marched with signed distance fields.

Pure numpy, no 3D package needed:  python3 render/bearing_render.py [name ...]
Writes public/images/render/<name>.jpg (white background, soft floor shadow),
which is what the website uses for product pictures.

Each bearing is built in its own object space with the shaft axis along +z,
then placed in the scene with a rotation + translation. Materials:
  1 polished steel   2 brass   3 rubber seal   4 painted cast iron
  5 ground steel (matte)   6 dark oxide (set screws, holes)
"""
import math
import os
import sys
import time

import numpy as np
from PIL import Image

F = np.float32
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "images", "render")
os.makedirs(OUT, exist_ok=True)

# ───────────────────────────────────────────────────────── vector helpers

def length(v):
    return np.sqrt(np.sum(v * v, axis=-1))


def norm(v):
    return v / np.maximum(length(v)[..., None], 1e-8)


def rot_x(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], F)


def rot_y(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]], F)


def rot_z(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], F)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ───────────────────────────────────────────────────────── SDF primitives
# p: (N,3) array in object space (axis z)

def radial(p):
    return np.sqrt(p[:, 0] ** 2 + p[:, 1] ** 2)


def round_box2(qx, qy, hx, hy, r):
    dx, dy = np.abs(qx) - (hx - r), np.abs(qy) - (hy - r)
    out = np.sqrt(np.maximum(dx, 0) ** 2 + np.maximum(dy, 0) ** 2)
    return out + np.minimum(np.maximum(dx, dy), 0) - r


def ring(p, ri, ro, w, r=0.6, zc=0.0):
    """Annulus ri..ro, width w along z, rounded edges."""
    return round_box2(radial(p) - (ri + ro) / 2, p[:, 2] - zc, (ro - ri) / 2, w / 2, r)


def cone_ring(p, ri1, ro1, ri2, ro2, w, zc=0.0):
    """Ring whose inner/outer radii vary linearly from z=-w/2 (…1) to +w/2 (…2)."""
    z = p[:, 2] - zc
    t = np.clip(z / w + 0.5, 0, 1)
    ri = ri1 + (ri2 - ri1) * t
    ro = ro1 + (ro2 - ro1) * t
    rad = radial(p)
    d = np.maximum(np.maximum(ri - rad, rad - ro), np.abs(z) - w / 2)
    return d * 0.9


def torus(p, R, r, zc=0.0):
    return np.sqrt((radial(p) - R) ** 2 + (p[:, 2] - zc) ** 2) - r


def sphere(p, c, r):
    return length(p - np.asarray(c, F)) - r


def cyl_z(p, r, h, zc=0.0, round_r=0.4):
    return round_box2(radial(p), p[:, 2] - zc, r, h / 2, round_r) if False else _cyl(p, r, h, zc, round_r)


def _cyl(p, r, h, zc, rr):
    dx = radial(p) - (r - rr)
    dz = np.abs(p[:, 2] - zc) - (h / 2 - rr)
    return np.sqrt(np.maximum(dx, 0) ** 2 + np.maximum(dz, 0) ** 2) + np.minimum(np.maximum(dx, dz), 0) - rr


def box(p, c, h, r=0.5):
    q = np.abs(p - np.asarray(c, F)) - (np.asarray(h, F) - r)
    return length(np.maximum(q, 0)) + np.minimum(np.max(q, axis=1), 0) - r


def repeat_angle(p, n, phase=0.0):
    """Fold p into the sector of the nearest of n copies around z; returns
    p rotated so the copy sits on +x."""
    a = np.arctan2(p[:, 1], p[:, 0]) - phase
    k = np.round(a / (2 * math.pi / n))
    a0 = k * (2 * math.pi / n) + phase
    c, s = np.cos(-a0), np.sin(-a0)
    x = p[:, 0] * c - p[:, 1] * s
    y = p[:, 0] * s + p[:, 1] * c
    return np.stack([x, y, p[:, 2]], 1)


def capped_cone_z(p, r1, r2, h):
    """Cone along z from z=-h/2 (radius r1) to +h/2 (r2) — iq's exact SDF."""
    q = np.stack([radial(p), p[:, 2]], 1)
    k1 = np.array([r2, h / 2], F)
    k2 = np.array([r2 - r1, h], F)
    ca = np.stack([q[:, 0] - np.minimum(q[:, 0], np.where(q[:, 1] < 0, r1, r2)), np.abs(q[:, 1]) - h / 2], 1)
    cb = q - k1 + k2 * np.clip(((k1 - q) @ k2) / (k2 @ k2), 0, 1)[:, None]
    s = np.where((cb[:, 0] < 0) & (ca[:, 1] < 0), -1, 1)
    return s * np.sqrt(np.minimum(np.sum(ca * ca, 1), np.sum(cb * cb, 1)))


def local_frame(p, origin, R):
    """Express points in a frame at origin with rotation R (columns = axes)."""
    return (p - np.asarray(origin, F)) @ R


# ───────────────────────────────────────────────────────── bearing builders
# Each returns sdf(p) -> (dist, mat) in object space.

def combine(*parts):
    def f(p):
        best = None
        mat = None
        for fn, m in parts:
            d = fn(p)
            if best is None:
                best, mat = d, np.full(d.shape, m, np.int8)
            else:
                sel = d < best
                best = np.where(sel, d, best)
                mat = np.where(sel, m, mat)
        return best, mat
    return f


def deep_groove(D=52, d=25, B=15, kind="sealed", n=9, cage="steel"):
    ro, ri = D / 2, d / 2
    pitch = (ro + ri) / 2
    ball = (ro - ri) * 0.31
    sec = (ro - ri)
    o_in = pitch + ball * 0.62           # outer ring bore
    i_out = pitch - ball * 0.62          # inner ring OD

    def outer(p):
        return np.maximum(ring(p, o_in, ro, B, 0.8), -torus(p, pitch, ball * 1.04))

    def inner(p):
        return np.maximum(ring(p, ri, i_out, B, 0.8), -torus(p, pitch, ball * 1.04))

    def balls(p):
        q = repeat_angle(p, n, 0.3)
        return length(q - np.array([pitch, 0, 0], F)) - ball

    parts = [(outer, 1), (inner, 1)]
    if kind == "open":
        parts.append((balls, 1))

        def cage_fn(p):
            band = ring(p, pitch - ball * 0.35, pitch + ball * 0.35, ball * 1.25, 0.15)
            q = repeat_angle(p, n, 0.3)
            holes = length(q - np.array([pitch, 0, 0], F)) - ball * 1.08
            return np.maximum(band, -holes)
        parts.append((cage_fn, 2 if cage == "brass" else 5))
    else:
        parts.append((balls, 1))
        face = B / 2 - 0.9

        def seal(p):
            a = ring(p, i_out - 0.3, o_in + 0.3, 1.0, 0.3, zc=face)
            b = ring(p, i_out - 0.3, o_in + 0.3, 1.0, 0.3, zc=-face)
            # a moulded lip line on the seal face
            lip = torus(p, (i_out + o_in) / 2, 0.35, zc=face + 0.5)
            return np.minimum(np.minimum(a, b), lip)
        parts.append((seal, 3 if kind == "sealed" else 5))
    return combine(*parts), ro


def wheel_hub(D=72, d=37, B=37):
    ro, ri = D / 2, d / 2
    pitch = (ro + ri) / 2
    ball = (ro - ri) * 0.26
    o_in, i_out = pitch + ball * 0.6, pitch - ball * 0.6

    def outer(p):
        g = np.minimum(torus(p, pitch, ball * 1.04, zc=B * 0.22), torus(p, pitch, ball * 1.04, zc=-B * 0.22))
        o = np.maximum(ring(p, o_in, ro, B, 1.0), -g)
        groove = torus(p, ro + 0.25, 0.7)            # centre groove on the OD
        return np.maximum(o, -groove)

    def inner(p):
        return np.minimum(ring(p, ri, i_out, B * 0.5 - 0.2, 0.7, zc=B * 0.25 + 0.1),
                          ring(p, ri, i_out, B * 0.5 - 0.2, 0.7, zc=-B * 0.25 - 0.1))

    def seal(p):
        face = B / 2 - 1.0
        a = ring(p, i_out - 0.2, o_in + 0.2, 1.1, 0.3, zc=face)
        b = ring(p, i_out - 0.2, o_in + 0.2, 1.1, 0.3, zc=-face)
        return np.minimum(a, b)

    def slinger(p):
        face = B / 2 - 0.55
        return ring(p, i_out - 0.4, i_out + (o_in - i_out) * 0.38, 0.6, 0.2, zc=face)

    return combine((outer, 1), (inner, 1), (seal, 3), (slinger, 5)), ro


def tapered(D=80, d=40, T=19.75, n=17):
    ro, ri = D / 2, d / 2
    # cup (outer ring): conical bore
    def cup(p):
        return cone_ring(p, ro - 7.5, ro, ro - 4.8, ro, T - 2.0, zc=-1.0)

    # cone (inner ring) with ribs, slightly wider than the cup
    def cone(p):
        body = cone_ring(p, ri, ri + 6.0, ri, ri + 8.8, T, zc=0.0)
        big_rib = ring(p, ri, ri + 10.8, 2.6, 0.5, zc=T / 2 - 1.3)
        small_rib = ring(p, ri, ri + 7.2, 1.6, 0.4, zc=-T / 2 + 0.8)
        return np.minimum(np.minimum(body, big_rib), small_rib)

    rm = (ro - 6.0 + ri + 7.4) / 2
    alpha = math.atan2(2.6, T)       # roller axis tilt in r-z plane

    def rollers(p):
        q = repeat_angle(p, n, 0.1)
        q = q - np.array([rm, 0, 0], F)
        Rr = rot_y(-alpha)
        q = q @ Rr
        return capped_cone_z(q, 3.0, 3.9, T - 6.0) - 0.25

    def cage(p):
        band = cone_ring(p, rm - 0.6, rm + 2.0, rm + 0.4, rm + 3.0, T - 4.0)
        q = repeat_angle(p, n, 0.1)
        win = box(q, (rm + 0.8, 0, 0), (3.5, 2.6, (T - 6.6) / 2), 0.6)
        return np.maximum(band, -win)

    return combine((cup, 1), (cone, 1), (rollers, 1), (cage, 5)), ro, combine((cone, 1), (rollers, 1), (cage, 5)), combine((cup, 1),)


def spherical(D=120, d=65, B=31, n=17):
    ro, ri = D / 2, d / 2
    Rs = ro - 4.0            # sphere radius of the outer raceway

    def outer(p):
        return np.maximum(ring(p, ri + 12, ro, B, 1.0), Rs - length(p))

    def inner(p):
        body = ring(p, ri, ri + 10.5, B, 0.9)
        return body

    rm = (Rs + ri + 10.5) / 2 - 1.0
    alpha = math.radians(11)

    def rollers(p):
        out = None
        for sgn, ph in ((1, 0.0), (-1, math.pi / n)):
            q = repeat_angle(p, n, ph)
            q = q - np.array([rm, 0, sgn * B * 0.22], F)
            q = q @ rot_y(sgn * alpha)
            # barrel: rounded cylinder with a slight crown
            r = 5.2 - 0.0016 * (q[:, 2] ** 2) * 6
            d_ = np.sqrt(q[:, 0] ** 2 + q[:, 1] ** 2) - r
            d_ = np.maximum(d_, np.abs(q[:, 2]) - B * 0.24) - 0.0
            out = d_ if out is None else np.minimum(out, d_)
        return out * 0.9

    def cage(p):
        return ring(p, rm - 2.0, rm + 3.5, 2.2, 0.5)

    return combine((outer, 1), (inner, 1), (rollers, 1), (cage, 2)), ro


def cylindrical(D=90, d=50, B=20, n=15, rows=1, cage="brass"):
    ro, ri = D / 2, d / 2
    o_in = ro - 6.0
    i_out = ri + 6.0
    rr = (o_in - i_out) / 2
    rm = (o_in + i_out) / 2

    def outer(p):
        body = ring(p, o_in, ro, B, 0.9)
        lips = np.minimum(ring(p, o_in - 2.2, ro, 2.0, 0.5, zc=B / 2 - 1.0),
                          ring(p, o_in - 2.2, ro, 2.0, 0.5, zc=-B / 2 + 1.0))
        return np.minimum(body, lips)

    def inner(p):
        return ring(p, ri, i_out, B, 0.9)

    def rollers(p):
        q = repeat_angle(p, n, 0.2)
        out = None
        lw = (B - 4.4) / rows
        for k in range(rows):
            zc = -B / 2 + 2.2 + lw * (k + 0.5)
            rp = q - np.array([rm, 0, zc], F)
            d_ = _cyl(rp, rr * 0.98, lw - 0.6, 0.0, 0.5)
            out = d_ if out is None else np.minimum(out, d_)
        return out

    def cage_fn(p):
        band = ring(p, rm + rr * 0.3, rm + rr * 0.9, B - 3.0, 0.3)
        q = repeat_angle(p, n, 0.2)
        holes = _cyl(q - np.array([rm, 0, 0], F), rr * 1.05, B - 4.0, 0.0, 0.3)
        return np.maximum(band, -holes)

    return combine((outer, 1), (inner, 1), (rollers, 1), (cage_fn, 2 if cage == "brass" else 5)), ro


def thrust_ball(D=70, d=50, H=14, n=18):
    ro, ri = D / 2, d / 2
    rm = (ro + ri) / 2
    b = H * 0.26

    def washers(p):
        w = H * 0.3
        top = np.maximum(ring(p, ri, ro - 0.6, w, 0.6, zc=H / 2 - w / 2), -torus(p, rm, b * 1.04))
        bot = np.maximum(ring(p, ri + 0.6, ro, w, 0.6, zc=-H / 2 + w / 2), -torus(p, rm, b * 1.04))
        return np.minimum(top, bot)

    def balls(p):
        q = repeat_angle(p, n)
        return length(q - np.array([rm, 0, 0], F)) - b

    def cage(p):
        band = ring(p, rm - b * 1.25, rm + b * 1.25, b * 0.6, 0.2)
        q = repeat_angle(p, n)
        return np.maximum(band, -(length(q - np.array([rm, 0, 0], F)) - b * 1.05))

    return combine((washers, 1), (balls, 1), (cage, 2)), ro


def thrust_roller(D=70, d=40, H=18, n=14):
    ro, ri = D / 2, d / 2
    rm = (ro + ri) / 2

    def washers(p):
        w = H * 0.28
        return np.minimum(ring(p, ri, ro - 1, w, 0.6, zc=H / 2 - w / 2), ring(p, ri + 1, ro, w, 0.6, zc=-H / 2 + w / 2))

    def rollers(p):
        q = repeat_angle(p, n)
        q = q - np.array([rm, 0, 0], F)
        q = q @ np.array([[0, 0, 1], [0, 1, 0], [-1, 0, 0]], F)   # axis radial
        return capped_cone_z(q, 3.0, 3.6, (ro - ri) * 0.78) - 0.3

    def cage(p):
        band = ring(p, ri + 1, ro - 1, 3.0, 0.4)
        q = repeat_angle(p, n)
        qq = (q - np.array([rm, 0, 0], F)) @ np.array([[0, 0, 1], [0, 1, 0], [-1, 0, 0]], F)
        return np.maximum(band, -(capped_cone_z(qq, 3.4, 4.0, (ro - ri) * 0.82)))

    return combine((washers, 1), (rollers, 1), (cage, 2)), ro


def uc_insert(D=80, d=40, B=49.2, Bo=21):
    ro = D / 2
    ri = d / 2
    pitch = (ro + ri + 5) / 2
    i_out = pitch - 3.0
    o_in = pitch + 3.0

    def outer(p):
        sph = length(p) - ro * 1.08
        return np.maximum(np.maximum(ring(p, o_in, ro, Bo, 0.8), sph), -torus(p, pitch, 3.3))

    def inner(p):
        # extended inner ring, longer on the set-screw side
        r = ring(p, ri, i_out, B, 0.8, zc=B * 0.12)
        holes = None
        for ang in (math.radians(30), math.radians(-30)):
            c = np.array([math.cos(ang + math.pi / 2), math.sin(ang + math.pi / 2), 0], F)
            q = p - np.array([0, 0, B * 0.12 + B * 0.36], F)
            # hole along radial direction c
            along = q @ c
            perp = length(q - along[:, None] * c[None, :])
            h = np.maximum(perp - 2.6, np.abs(along - i_out) - 4)
            holes = h if holes is None else np.minimum(holes, h)
        return np.maximum(r, -holes), holes

    def inner_d(p):
        return inner(p)[0]

    def screws(p):
        h = inner(p)[1]
        return h + 0.9

    def seal(p):
        face = Bo / 2 - 0.9
        return np.minimum(ring(p, i_out - 0.2, o_in + 0.2, 1.0, 0.3, zc=face),
                          ring(p, i_out - 0.2, o_in + 0.2, 1.0, 0.3, zc=-face))

    def slinger(p):
        face = Bo / 2 - 0.4
        return ring(p, i_out + 0.4, o_in - 0.4, 0.6, 0.2, zc=face)

    def balls(p):
        q = repeat_angle(p, 9)
        return length(q - np.array([pitch, 0, 0], F)) - 3.0

    return combine((outer, 1), (inner_d, 1), (screws, 6), (seal, 3), (slinger, 5), (balls, 1)), ro


def pillow_block():
    """P208-style pillow block with a UC208 insert. Housing in object space:
    shaft axis z, foot down (-y)."""
    ins, _ = uc_insert()
    H = 49.2   # shaft centre height

    def housing(p):
        boss = _cyl(p, 46, 38, 0.0, 3.0)
        web = box(p, (0, -H * 0.55, 0), (34, H * 0.5, 17), 3.0)
        foot = box(p, (0, -H + 7, 0), (95, 7, 19), 2.5)
        k = 6.0
        # smooth union
        def smin(a, b):
            h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
            return b * (1 - h) + a * h - k * h * (1 - h)
        body = smin(smin(boss, web), foot)
        bore = length(p) - 41.5
        body = np.maximum(body, -bore)
        body = np.maximum(body, -(_cyl(p, 34, 60, 0.0, 0.5)))
        slots = np.minimum(box(p, (-72, -H + 7, 0), (11, 9, 6.5), 3.0), box(p, (72, -H + 7, 0), (11, 9, 6.5), 3.0))
        body = np.maximum(body, -slots)
        nipple = np.minimum(_cyl((p - np.array([0, 50, 0], F)) @ rot_x(math.pi / 2), 4.0, 12, 0.0, 1.0),
                            length(p - np.array([0, 56.5, 0], F)) - 4.2)
        return body, nipple

    def body_d(p):
        return housing(p)[0]

    def nipple_d(p):
        return housing(p)[1]

    def insert_d(p):
        return ins(p)

    def f(p):
        d1 = body_d(p)
        d2, m2 = ins(p)
        d3 = nipple_d(p)
        best = d1
        mat = np.full(d1.shape, 4, np.int8)
        sel = d2 < best
        best = np.where(sel, d2, best)
        mat = np.where(sel, m2, mat)
        sel = d3 < best
        best = np.where(sel, d3, best)
        mat = np.where(sel, 2, mat)
        return best, mat

    return f, H


def flange_square():
    ins, _ = uc_insert()

    def plate(p):
        sq = box(p, (0, 0, -6), (64, 64, 9), 10.0)
        boss = _cyl(p, 50, 34, 2.0, 4.0)
        body = np.minimum(sq, boss)
        body = np.maximum(body, -(length(p) - 41.5))
        body = np.maximum(body, -_cyl(p, 34, 80, 0, 0.5))
        for sx in (-1, 1):
            for sy in (-1, 1):
                body = np.maximum(body, -_cyl(p - np.array([sx * 46, sy * 46, 0], F), 7.5, 60, 0.0, 0.6))
        return body

    def f(p):
        d1 = plate(p)
        d2, m2 = ins(p)
        best = np.minimum(d1, d2)
        mat = np.where(d2 < d1, m2, 4).astype(np.int8)
        return best, mat

    return f, 64


def clutch_release():
    """Bearing with a pressed-steel contact face and a rear guide sleeve."""
    bear, _ = deep_groove(D=62, d=36, B=16, kind="sealed", n=12)

    def face(p):
        disc = ring(p, 19, 34, 2.4, 1.0, zc=9.2)
        lip = torus(p, 34, 1.2, zc=8.2)
        return np.minimum(disc, lip)

    def sleeve(p):
        s = ring(p, 18, 23, 26, 1.0, zc=-19)
        flange = ring(p, 18, 33, 2.4, 0.8, zc=-9.4)
        return np.minimum(s, flange)

    def f(p):
        d1, m1 = bear(p)
        d2 = face(p)
        d3 = sleeve(p)
        best = d1
        mat = m1
        for d_, m in ((d2, 1), (d3, 5)):
            sel = d_ < best
            best = np.where(sel, d_, best)
            mat = np.where(sel, m, mat)
        return best, mat

    return f, 34


# ───────────────────────────────────────────────────────── environment & shading

def env(dirs):
    """Photo-studio light: a white infinity sweep (bright above and below),
    a darker horizon line and two black flags that give polished steel its
    contrast, an overhead softbox and two strip lights. Returns (N,3)."""
    y = dirs[:, 1]
    az = np.arctan2(dirs[:, 0], -dirs[:, 2])
    up = smoothstep(-0.2, 0.3, y)
    v = 0.80 - 0.18 * smoothstep(-0.1, -0.8, y)
    v = v - 0.58 * smoothstep(0.13, 0.0, np.abs(y + 0.03))
    v = v - 0.50 * smoothstep(0.24, 0.08, np.abs(az - 0.55)) * up
    v = v - 0.42 * smoothstep(0.22, 0.07, np.abs(az + 0.75)) * up
    v = v + 0.30 * smoothstep(0.62, 0.92, y)
    v = v + 0.45 * smoothstep(0.12, 0.03, np.abs(az - 1.35)) * up
    v = v + 0.40 * smoothstep(0.12, 0.03, np.abs(az + 1.45)) * up
    return np.stack([v * 0.97, v * 0.99, v * 1.03], 1)


def render(name, objects, size=1100, ss=1.5, cam_pos=(0, 60, -260), look=(0, 0, 0), fov=26,
           floor_y=None, light=(-0.35, 1.0, -0.25), fit=None):
    """objects: list of (sdf, R, t) — sdf in object space, R rotation (object→world), t translation."""
    t0 = time.time()
    W = int(size * ss)
    cam = np.array(cam_pos, F)
    fwd = norm(np.array(look, F) - cam)
    right = norm(np.cross(fwd, np.array([0, 1, 0], F)))
    up = np.cross(right, fwd)
    half = math.tan(math.radians(fov / 2))
    ys, xs = np.mgrid[0:W, 0:W].astype(F)
    u = (xs + 0.5) / W * 2 - 1
    v = 1 - (ys + 0.5) / W * 2
    rd = norm(fwd[None, :] + (u.reshape(-1, 1) * half) * right[None, :] + (v.reshape(-1, 1) * half) * up[None, :])
    N = rd.shape[0]
    ro_ = np.broadcast_to(cam, (N, 3)).astype(F)

    def scene(pw):
        best = np.full(pw.shape[0], 1e9, F)
        mat = np.zeros(pw.shape[0], np.int8)
        for sdf, R, tr in objects:
            po = (pw - np.asarray(tr, F)) @ R      # world→object (R orthonormal)
            d, m = sdf(po)
            sel = d < best
            best = np.where(sel, d, best).astype(F)
            mat = np.where(sel, m, mat)
        return best, mat

    def dist(pw):
        return scene(pw)[0]

    # ── march
    t = np.zeros(N, F)
    hit = np.zeros(N, bool)
    active = np.ones(N, bool)
    tmax = np.float32(np.linalg.norm(cam) + 400)
    for i in range(220):
        idx = np.nonzero(active)[0]
        if idx.size == 0:
            break
        p = ro_[idx] + rd[idx] * t[idx, None]
        d = dist(p)
        t[idx] += d * 0.85
        done = d < 0.02
        hit[idx[done]] = True
        far = t[idx] > tmax
        active[idx[done | far]] = False

    img = np.ones((N, 3), F)
    ldir = norm(np.array(light, F))

    # ── floor (plane y = floor_y): soft shadow from the overhead softbox
    if floor_y is not None:
        with np.errstate(divide="ignore", invalid="ignore"):
            tf = (floor_y - ro_[:, 1]) / rd[:, 1]
        fl = (~hit) & (tf > 0)
        idx = np.nonzero(fl)[0]
        if idx.size:
            pf = ro_[idx] + rd[idx] * tf[idx, None]
            sh = np.ones(idx.size, F)
            tt = np.full(idx.size, 0.5, F)
            for _ in range(48):
                q = pf + ldir[None, :] * tt[:, None]
                h = dist(q)
                sh = np.minimum(sh, 9.0 * h / tt)
                tt += np.clip(h, 0.6, 12)
            sh = np.clip(sh, 0, 1)
            # contact occlusion
            occ = np.ones(idx.size, F)
            for k, s in enumerate((1.0, 3.0, 7.0, 14.0)):
                dd = dist(pf + np.array([0, s, 0], F))
                occ -= (s - np.minimum(dd, s)) / s * (0.22 / (k + 1))
            occ = np.clip(occ, 0, 1)
            shade = 1 - 0.42 * (1 - sh) - 0.35 * (1 - occ)
            img[idx] = np.clip(shade, 0, 1)[:, None] * np.array([1, 1, 1], F)

    # ── shade object hits
    idx = np.nonzero(hit)[0]
    p = ro_[idx] + rd[idx] * t[idx, None]
    e = 0.04
    k1 = np.array([1, -1, -1], F); k2 = np.array([-1, -1, 1], F)
    k3 = np.array([-1, 1, -1], F); k4 = np.array([1, 1, 1], F)
    n = norm(k1 * dist(p + k1 * e)[:, None] + k2 * dist(p + k2 * e)[:, None]
             + k3 * dist(p + k3 * e)[:, None] + k4 * dist(p + k4 * e)[:, None])
    _, mat = scene(p)
    v = rd[idx]
    refl = v - 2 * np.sum(v * n, 1)[:, None] * n
    cosv = np.clip(-np.sum(v * n, 1), 0, 1)
    ao = np.ones(idx.size, F)
    for k, s in enumerate((0.4, 1.0, 2.2, 4.5, 8.0)):
        dd = dist(p + n * s)
        ao -= (s - np.clip(dd, 0, s)) / s * (0.5 ** k) * 0.55
    ao = np.clip(ao, 0.08, 1)
    # shadow from the softbox onto the part itself
    sh = np.ones(idx.size, F)
    tt = np.full(idx.size, 0.3, F)
    for _ in range(28):
        h = dist(p + n * 0.05 + ldir[None, :] * tt[:, None])
        sh = np.minimum(sh, 6.0 * h / tt)
        tt += np.clip(h, 0.3, 10)
    sh = 0.45 + 0.55 * np.clip(sh, 0, 1)
    diff = np.clip(n @ ldir, 0, 1)
    E = env(refl)
    fres = 0.04 + 0.96 * (1 - cosv) ** 5
    col = np.zeros((idx.size, 3), F)

    def put(m, c):
        s = mat == m
        col[s] = c[s] if c.ndim == 2 else c

    steel = E * (0.72 + 0.28 * fres)[:, None] * np.array([0.93, 0.95, 0.98], F) + 0.10 * diff[:, None]
    brass = E * (0.62 + 0.38 * fres)[:, None] * np.array([1.0, 0.76, 0.42], F) + 0.05 * diff[:, None] * np.array([1, .8, .5], F)
    rub_spec = E * (0.03 + 0.25 * fres)[:, None]
    rubber = np.array([0.07, 0.075, 0.085], F)[None, :] * (0.4 + 0.8 * diff)[:, None] + rub_spec
    iron_base = np.array([0.20, 0.26, 0.36], F)       # navy-grey paint, matches the site
    iron = iron_base[None, :] * (0.35 + 0.85 * diff)[:, None] + E * (0.05 + 0.35 * fres)[:, None]
    ground = E * 0.42 * np.array([0.95, 0.96, 0.98], F) + np.array([0.16, 0.17, 0.19], F) * (0.4 + 0.7 * diff)[:, None]
    oxide = np.array([0.05, 0.05, 0.06], F)[None, :] + E * 0.12
    put(1, steel); put(2, brass); put(3, rubber); put(4, iron); put(5, ground); put(6, oxide)
    col *= ((0.35 + 0.65 * ao) * (0.78 + 0.22 * sh))[:, None]
    img[idx] = col

    # filmic tone map
    img = img / (1 + 0.35 * img) * 1.35          # filmic shoulder; white stays white
    img = np.clip(img, 0, 1) ** (1 / 1.05)
    im = Image.fromarray((img.reshape(W, W, 3) * 255).astype(np.uint8))
    im = im.resize((size, size), Image.LANCZOS)
    if fit:
        im = autocrop(im, fit)
    path = os.path.join(OUT, name + ".jpg")
    im.save(path, quality=90, optimize=True, progressive=True)
    print(f"{name}: {time.time() - t0:.0f}s -> {path}")


def autocrop(im, size, margin=0.07):
    """Trim white space so the bearing fills the frame, then pad to a square."""
    a = np.asarray(im).astype(np.int16)
    mask = (255 - a).max(axis=2) > 10
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    s = int(max(x1 - x0, y1 - y0) * (1 + 2 * margin))
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    canvas = Image.new("RGB", (s, s), (255, 255, 255))
    canvas.paste(im, (s // 2 - cx, s // 2 - cy))
    return canvas.resize((size, size), Image.LANCZOS)


# ───────────────────────────────────────────────────────── scenes

def stand(ro, yaw=-0.62, pitch=0.0):
    """Bearing standing on its edge, face turned towards the camera."""
    R = (rot_y(yaw) @ rot_x(pitch)).astype(F)
    return R, (0, ro, 0)


def lay(tilt=-1.15, yaw=0.0):
    """Lying flat-ish (axis near vertical), tipped towards the camera."""
    return (rot_y(yaw) @ rot_x(tilt)).astype(F)


SCENES = {}


def scene(fn):
    SCENES[fn.__name__] = fn
    return fn


@scene
def deep_groove_sealed():
    f, ro = deep_groove(kind="sealed")
    R, t = stand(ro)
    render("deep-groove-sealed", [(f, R, t)], cam_pos=(0, 38, -175), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def deep_groove_shielded():
    f, ro = deep_groove(D=62, d=30, B=16, kind="shield")
    R, t = stand(ro)
    render("deep-groove-shielded", [(f, R, t)], cam_pos=(0, 42, -205), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def deep_groove_open():
    f, ro = deep_groove(D=100, d=45, B=25, kind="open", n=8, cage="brass")
    R, t = stand(ro, yaw=-0.55)
    render("deep-groove-open", [(f, R, t)], cam_pos=(0, 70, -330), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def deep_groove_pair():
    a, ra = deep_groove(D=52, d=25, B=15, kind="sealed")
    b, rb = deep_groove(D=42, d=20, B=12, kind="open", n=8)
    Ra, _ = stand(ra, yaw=-0.62)
    Rb, _ = stand(rb, yaw=-0.75)
    render("deep-groove-pair", [(b, Rb, (-30, rb, 26)), (a, Ra, (14, ra, -6))],
           cam_pos=(0, 48, -215), look=(-6, 22, 0), floor_y=0, fit=1000)


@scene
def wheel_hub_unit():
    f, ro = wheel_hub()
    R, t = stand(ro, yaw=-0.68)
    render("wheel-hub", [(f, R, t)], cam_pos=(0, 52, -240), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def clutch():
    f, ro = clutch_release()
    R, t = stand(ro, yaw=-0.75)
    render("clutch-release", [(f, R, (0, ro, 0))], cam_pos=(0, 50, -230), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def tapered_roller():
    """Cone assembly (rollers showing) in front, the cup standing behind it."""
    _, ro, assembly, cup = tapered()
    T = 19.75
    Ra = (rot_x(math.pi / 2 - 0.42)).astype(F)          # large end down, tipped to camera
    Rc, _ = stand(ro, yaw=-0.5)
    render("tapered-roller",
           [(assembly, Ra, (-14, T / 2 + 4.5, -10)), (cup, Rc, (34, ro, 46))],
           cam_pos=(0, 120, -260), look=(8, 22, 10), floor_y=0, fit=1000)


@scene
def spherical_roller():
    f, ro = spherical()
    R, t = stand(ro, yaw=-0.6)
    render("spherical-roller", [(f, R, t)], cam_pos=(0, 80, -400), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def cylindrical_roller():
    f, ro = cylindrical()
    R, t = stand(ro, yaw=-0.62)
    render("cylindrical-roller", [(f, R, t)], cam_pos=(0, 60, -300), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def four_row_cylindrical():
    f, ro = cylindrical(D=90, d=50, B=60, n=15, rows=4, cage="steel")
    R, t = stand(ro, yaw=-0.75)
    render("four-row-cylindrical", [(f, R, t)], cam_pos=(0, 70, -330), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def thrust_ball_bearing():
    f, ro = thrust_ball()
    R = lay(tilt=-2.0)
    render("thrust-ball", [(f, R, (0, ro * 0.42 + 6, 0))], cam_pos=(0, 110, -220), look=(0, 18, 0), floor_y=0, fit=1000)


@scene
def thrust_roller_bearing():
    f, ro = thrust_roller()
    R = lay(tilt=-2.0)
    render("thrust-roller", [(f, R, (0, ro * 0.42 + 8, 0))], cam_pos=(0, 110, -220), look=(0, 18, 0), floor_y=0, fit=1000)


@scene
def uc():
    f, ro = uc_insert()
    R, t = stand(ro, yaw=-0.9)
    render("uc-insert", [(f, R, t)], cam_pos=(0, 60, -280), look=(0, ro * 0.9, 0), floor_y=0, fit=1000)


@scene
def pillow():
    f, H = pillow_block()
    R = rot_y(-0.55).astype(F)
    render("pillow-block", [(f, R, (0, H, 0))], cam_pos=(0, 140, -430), look=(0, 45, 0), floor_y=0, fit=1000)


@scene
def flange():
    f, h = flange_square()
    R = rot_y(-0.5).astype(F)
    render("flange-unit", [(f, R, (0, h, 0))], cam_pos=(0, 120, -420), look=(0, h, 0), floor_y=0, fit=1000)


if __name__ == "__main__":
    names = sys.argv[1:] or list(SCENES)
    for nm in names:
        SCENES[nm]()
