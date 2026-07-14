"""Despeckle wet clay + ceramics: smooth isolated bright/dark outlier pixels."""

from __future__ import annotations

import statistics
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = Path(__file__).resolve().parent

WET_CELLS = {0, 1, 3}
FIRED_CELLS = {2, 4}


def lum(r: int, g: int, b: int) -> float:
    return (r + g + b) / 3.0


def neighbor_lums(
    px, x: int, y: int, w: int, h: int
) -> list[float]:
    out: list[float] = []
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                nr, ng, nb, na = px[nx, ny]
                if na >= 200:
                    out.append(lum(nr, ng, nb))
    return out


def near_transparent_edge(px, x: int, y: int, w: int, h: int) -> bool:
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            nx, ny = x + dx, y + dy
            if not (0 <= nx < w and 0 <= ny < h):
                return True
            if px[nx, ny][3] < 128:
                return True
    return False


def find_bright_peaks(
    im: Image.Image,
    *,
    delta: float,
    cell_filter: set[int] | None = None,
) -> list[tuple[int, int]]:
    px = im.load()
    assert px is not None
    w, h = im.size
    peaks: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            if cell_filter is not None and (x // 32) not in cell_filter:
                continue
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            nbrs = neighbor_lums(px, x, y, w, h)
            if len(nbrs) < 5:
                continue
            L = lum(r, g, b)
            med = statistics.median(nbrs)
            if L >= med + delta and L >= max(nbrs) - 1:
                peaks.append((x, y))
    return peaks


def find_dark_pits(
    im: Image.Image,
    *,
    delta: float,
    cell_filter: set[int],
) -> list[tuple[int, int]]:
    px = im.load()
    assert px is not None
    w, h = im.size
    pits: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            if (x // 32) not in cell_filter:
                continue
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            if near_transparent_edge(px, x, y, w, h):
                continue
            nbrs = neighbor_lums(px, x, y, w, h)
            if len(nbrs) < 6:
                continue
            L = lum(r, g, b)
            med = statistics.median(nbrs)
            if L <= med - delta and L <= min(nbrs) + 1:
                pits.append((x, y))
    return pits


def replace_with_neighbor_median(
    im: Image.Image, coords: list[tuple[int, int]]
) -> Image.Image:
    px = im.load()
    assert px is not None
    out = im.copy()
    opx = out.load()
    assert opx is not None
    w, h = im.size
    for x, y in coords:
        replacement = None
        for rad in (1, 2, 3):
            nbrs: list[tuple[int, int, int, int]] = []
            for dy in range(-rad, rad + 1):
                for dx in range(-rad, rad + 1):
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        nr, ng, nb, na = px[nx, ny]
                        if na >= 200 and (nx, ny) not in coords:
                            nbrs.append((nr, ng, nb, na))
            if nbrs:
                replacement = (
                    int(statistics.median([n[0] for n in nbrs])),
                    int(statistics.median([n[1] for n in nbrs])),
                    int(statistics.median([n[2] for n in nbrs])),
                    int(statistics.median([n[3] for n in nbrs])),
                )
                break
        if replacement is not None:
            opx[x, y] = replacement
    return out


def preview(path: Path, scale: int, out: Path, cell: int | None = None) -> None:
    im = Image.open(path).convert("RGBA")
    bw, bh = im.width * scale, im.height * scale
    bg = Image.new("RGBA", (bw, bh))
    bpx = bg.load()
    assert bpx is not None
    for y in range(bh):
        for x in range(bw):
            c = 200 if ((x // scale) + (y // scale)) % 2 == 0 else 160
            bpx[x, y] = (c, c, c, 255)
    bg.alpha_composite(im.resize((bw, bh), Image.NEAREST))
    if cell:
        draw = ImageDraw.Draw(bg)
        for x in range(0, im.width + 1, cell):
            draw.line([(x * scale, 0), (x * scale, bh)], fill=(255, 0, 255, 180))
    bg.save(out)


def despeckle_pass(im: Image.Image, *, is_sheet: bool) -> tuple[Image.Image, int]:
    total = 0
    cur = im
    # iterate a few times so clusters settle
    for _ in range(3):
        if is_sheet:
            bright = find_bright_peaks(cur, delta=22, cell_filter=WET_CELLS)
            # milder on fired: only strong isolated peaks (not rim glow)
            fired_bright = find_bright_peaks(cur, delta=40, cell_filter=FIRED_CELLS)
            # skip fired peaks near top rim (y < 8) — keep silhouette highlights
            fired_bright = [(x, y) for x, y in fired_bright if y >= 8]
            dark = find_dark_pits(cur, delta=28, cell_filter=FIRED_CELLS)
            coords = bright + fired_bright + dark
        else:
            coords = find_bright_peaks(cur, delta=28)
        # unique
        seen: set[tuple[int, int]] = set()
        uniq: list[tuple[int, int]] = []
        for c in coords:
            if c in seen:
                continue
            seen.add(c)
            uniq.append(c)
        if not uniq:
            break
        total += len(uniq)
        cur = replace_with_neighbor_median(cur, uniq)
    return cur, total


def main() -> None:
    wet_src = ROOT / "public/inventory/sprites/inventory-wet-clay-sprites.webp"
    cer_src = ROOT / "public/inventory/sprites/inventory-ceramics-sprites.webp"

    wet = Image.open(wet_src).convert("RGBA")
    cer = Image.open(cer_src).convert("RGBA")

    wet2, n_wet = despeckle_pass(wet, is_sheet=False)
    cer2, n_cer = despeckle_pass(cer, is_sheet=True)
    print(f"wet clay replaced {n_wet} speck pixels (across passes)")
    print(f"ceramics replaced {n_cer} speck pixels (across passes)")

    wet_out = OUT_DIR / "wet-clay-despeckle.webp"
    cer_out = OUT_DIR / "ceramics-despeckle.webp"
    wet2.save(wet_out, "WEBP", lossless=True, method=6)
    cer2.save(cer_out, "WEBP", lossless=True, method=6)
    wet2.save(wet_src, "WEBP", lossless=True, method=6)
    cer2.save(cer_src, "WEBP", lossless=True, method=6)

    preview(wet_out, 10, OUT_DIR / "wet-clay-final.png")
    preview(cer_out, 6, OUT_DIR / "ceramics-final.png", cell=32)

    # remaining peaks report
    print(
        "wet remaining peaks",
        len(find_bright_peaks(wet2, delta=28)),
    )
    print(
        "cer wet-cell peaks",
        len(find_bright_peaks(cer2, delta=22, cell_filter=WET_CELLS)),
    )
    print(
        "cer fired pits",
        len(find_dark_pits(cer2, delta=28, cell_filter=FIRED_CELLS)),
    )
    print("shipped")


if __name__ == "__main__":
    main()
