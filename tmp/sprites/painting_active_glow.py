"""Paint a fiery interior glow into utility sprite cavities (bloomery, kiln, stove).

Approach: locate dark cavity pixels inside a region of interest, then fill them
with a radial ember gradient (deep red rim -> orange -> yellow-white core) with
slight ordered dithering so it reads as pixel art. Nearby opaque clay pixels get
a warm light spill that falls off with distance from the cavity.
"""

from __future__ import annotations

import math
import random

from PIL import Image

UTIL_DIR = "public/environment/sprites/utilities"

# name -> list of regions: (roi box (x0, y0, x1, y1), darkness threshold,
# glow spill radius px, hot spot depth 0..1 within cavity height)
# stove's mouth is only slightly recessed clay (~105-110 brightness), so its
# threshold sits just under the surrounding wall tone (~115-118).
# bloomery top hole is seen from above: hot spot centered (0.5), dimmer overall
SPRITES = {
    "bloomery": [
        ((50, 120, 92, 168), 70, 10, 0.72),
        # 110 threshold: hole interior shades up to ~105 on its lit right
        # wall, while the surrounding rim stays 145+
        ((25, 5, 90, 30), 110, 6, 0.5),
    ],
    "kiln": [((52, 72, 90, 122), 70, 9, 0.72)],
    "stove": [((43, 53, 57, 66), 112, 5, 0.72)],
}

# gradient stops: t in [0..1] from core to rim
FIRE_STOPS = [
    (0.00, (255, 246, 178)),  # near-white yellow core
    (0.30, (255, 196, 64)),   # bright orange
    (0.60, (232, 110, 30)),   # deep orange
    (0.85, (160, 44, 18)),    # ember red
    (1.00, (96, 22, 12)),     # dark red rim
]

BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
]


def fire_color(t: float) -> tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    for (t0, c0), (t1, c1) in zip(FIRE_STOPS, FIRE_STOPS[1:]):
        if t <= t1:
            f = 0.0 if t1 == t0 else (t - t0) / (t1 - t0)
            return tuple(round(a + (b - a) * f) for a, b in zip(c0, c1))
    return FIRE_STOPS[-1][1]


def paint_region(name: str, im: Image.Image, region) -> int:
    rng = random.Random(hash((name, region[0])) & 0xFFFF)
    box, dark_thresh, spill_radius, hot_depth = region
    px = im.load()
    x0, y0, x1, y1 = box

    cavity = []
    for y in range(y0, min(y1, im.height)):
        for x in range(x0, min(x1, im.width)):
            r, g, b, a = px[x, y]
            if a <= 200:
                continue
            if name == "stove":
                # stove mouth clay is desaturated (low red-blue gap) rather
                # than dark; brightness alone matches the outer wall too
                if (r - b) < 40 and (r + g + b) / 3 < dark_thresh:
                    cavity.append((x, y))
            elif (r + g + b) / 3 < dark_thresh:
                cavity.append((x, y))
    if not cavity:
        raise SystemExit(f"{name}: no cavity pixels in ROI {box}")

    # keep only the largest connected blob: stray dark outline pixels inside
    # the ROI must not turn into floating embers
    remaining = set(cavity)
    blobs = []
    while remaining:
        seed = next(iter(remaining))
        stack, blob = [seed], set()
        remaining.discard(seed)
        while stack:
            cxp, cyp = stack.pop()
            blob.add((cxp, cyp))
            for nx, ny in ((cxp+1,cyp),(cxp-1,cyp),(cxp,cyp+1),(cxp,cyp-1),
                           (cxp+1,cyp+1),(cxp-1,cyp-1),(cxp+1,cyp-1),(cxp-1,cyp+1)):
                if (nx, ny) in remaining:
                    remaining.discard((nx, ny))
                    stack.append((nx, ny))
        blobs.append(blob)
    cavity = sorted(max(blobs, key=len))

    xs = [p[0] for p in cavity]
    ys = [p[1] for p in cavity]
    # hottest point: horizontal middle, hot_depth down the cavity
    # (0.72 = fire bed for side openings, 0.5 = center for top-down holes)
    cx = (min(xs) + max(xs)) / 2
    cy = min(ys) + (max(ys) - min(ys)) * hot_depth
    top_down = hot_depth == 0.5
    if top_down:
        # flat ellipse seen from above: normalize each axis so the rim
        # darkens evenly all the way around
        rx = max(abs(x - cx) for x in xs) or 1.0
        ry = max(abs(y - cy) for y in ys) or 1.0
    max_d = max(math.hypot(x - cx, y - cy) for x, y in cavity) or 1.0

    cavity_set = set(cavity)
    for x, y in cavity:
        if top_down:
            d = math.hypot((x - cx) / rx, (y - cy) / ry)
        else:
            d = math.hypot(x - cx, (y - cy) * 1.25) / max_d
        # ordered dither + tiny jitter keeps banding away at pixel scale
        dither = (BAYER4[y % 4][x % 4] / 15.0 - 0.5) * 0.12
        t = d + dither + rng.uniform(-0.03, 0.03)
        px[x, y] = (*fire_color(t), 255)

    # warm spill on clay around the opening
    for y in range(max(0, y0 - spill_radius), min(im.height, y1 + spill_radius)):
        for x in range(max(0, x0 - spill_radius), min(im.width, x1 + spill_radius)):
            if (x, y) in cavity_set:
                continue
            r, g, b, a = px[x, y]
            if a < 200 or (r + g + b) / 3 < 60:
                continue  # skip transparent and dark outline pixels
            d = min(math.hypot(x - qx, y - qy) for qx, qy in cavity)
            if d > spill_radius:
                continue
            f = (1.0 - d / spill_radius) * 0.45
            px[x, y] = (
                min(255, round(r + (255 - r) * f * 0.55 + 30 * f)),
                min(255, round(g + 40 * f)),
                max(0, round(b - 25 * f)),
                a,
            )

    return len(cavity)


for sprite_name, regions in SPRITES.items():
    image = Image.open(f"{UTIL_DIR}/{sprite_name}.webp").convert("RGBA")
    counts = [paint_region(sprite_name, image, region) for region in regions]
    out_path = f"{UTIL_DIR}/{sprite_name}-active.webp"
    image.save(out_path, "WEBP", lossless=True, method=6)
    print(sprite_name, "->", out_path, image.size, "cavity px per region:", counts)
