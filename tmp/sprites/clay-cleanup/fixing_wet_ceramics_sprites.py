"""Rebuild broken wet bowl/crock; despeckle wet teapot/bottle highlights."""

from __future__ import annotations

import statistics
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "public/inventory/sprites/inventory-ceramics-sprites.webp"
OUT_DIR = Path(__file__).resolve().parent

CELL = 32
COLS = 4


def cell_box(index: int) -> tuple[int, int, int, int]:
    col, row = index % COLS, index // COLS
    x0, y0 = col * CELL, row * CELL
    return x0, y0, x0 + CELL, y0 + CELL


def lum(rgb: tuple[int, int, int]) -> float:
    return (rgb[0] + rgb[1] + rgb[2]) / 3.0


def paste_cell(sheet: Image.Image, index: int, cell: Image.Image) -> None:
    x0, y0, _, _ = cell_box(index)
    sheet.paste(cell, (x0, y0))


def sample_wet_ramp(sheet: Image.Image) -> list[tuple[int, int, int]]:
    """Build sorted dark→light wet clay ramp from wet cup + teapot + bottle."""
    colors: list[tuple[float, tuple[int, int, int]]] = []
    for idx in (0, 1, 3):
        cell = sheet.crop(cell_box(idx))
        px = cell.load()
        assert px is not None
        for y in range(CELL):
            for x in range(CELL):
                r, g, b, a = px[x, y]
                if a < 200:
                    continue
                if b > r + 10:
                    continue
                colors.append((lum((r, g, b)), (r, g, b)))
    colors.sort(key=lambda t: t[0])
    ramp: list[tuple[int, int, int]] = []
    last_L = -999.0
    for L, rgb in colors:
        if L - last_L < 1.5 and ramp:
            continue
        ramp.append(rgb)
        last_L = L
    if not ramp:
        raise RuntimeError("empty wet ramp")
    return ramp


def map_to_ramp(
    L: float, Lmin: float, Lmax: float, ramp: list[tuple[int, int, int]]
) -> tuple[int, int, int]:
    if Lmax <= Lmin:
        return ramp[len(ramp) // 2]
    t = (L - Lmin) / (Lmax - Lmin)
    t = max(0.0, min(1.0, t)) * 0.92
    idx = t * (len(ramp) - 1)
    i0 = int(idx)
    i1 = min(len(ramp) - 1, i0 + 1)
    f = idx - i0
    r0, g0, b0 = ramp[i0]
    r1, g1, b1 = ramp[i1]
    return (
        int(round(r0 + (r1 - r0) * f)),
        int(round(g0 + (g1 - g0) * f)),
        int(round(b0 + (b1 - b0) * f)),
    )


def recolor_fired_to_wet(
    fired: Image.Image, ramp: list[tuple[int, int, int]]
) -> Image.Image:
    px = fired.load()
    assert px is not None
    ls: list[float] = []
    for y in range(CELL):
        for x in range(CELL):
            r, g, b, a = px[x, y]
            if a >= 200:
                ls.append(lum((r, g, b)))
    Lmin, Lmax = min(ls), max(ls)
    out = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    opx = out.load()
    assert opx is not None
    for y in range(CELL):
        for x in range(CELL):
            r, g, b, a = px[x, y]
            if a < 16:
                opx[x, y] = (0, 0, 0, 0)
                continue
            nr, ng, nb = map_to_ramp(lum((r, g, b)), Lmin, Lmax, ramp)
            L = lum((nr, ng, nb))
            if L > 115:
                scale = 115 / L
                nr = int(nr * scale)
                ng = int(ng * scale)
                nb = int(nb * scale)
            opx[x, y] = (nr, ng, nb, a)
    return out


def neighbor_lums(px, x: int, y: int) -> list[float]:
    out: list[float] = []
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            nx, ny = x + dx, y + dy
            if 0 <= nx < CELL and 0 <= ny < CELL:
                nr, ng, nb, na = px[nx, ny]
                if na >= 200:
                    out.append(lum((nr, ng, nb)))
    return out


def find_bright_peaks(cell: Image.Image, delta: float) -> list[tuple[int, int]]:
    px = cell.load()
    assert px is not None
    peaks: list[tuple[int, int]] = []
    for y in range(CELL):
        for x in range(CELL):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            nbrs = neighbor_lums(px, x, y)
            if len(nbrs) < 5:
                continue
            L = lum((r, g, b))
            med = statistics.median(nbrs)
            if L >= med + delta and L >= max(nbrs) - 1:
                peaks.append((x, y))
    return peaks


def replace_with_neighbor_median(
    cell: Image.Image, coords: list[tuple[int, int]]
) -> Image.Image:
    px = cell.load()
    assert px is not None
    out = cell.copy()
    opx = out.load()
    assert opx is not None
    coord_set = set(coords)
    for x, y in coords:
        replacement = None
        for rad in (1, 2, 3):
            nbrs: list[tuple[int, int, int, int]] = []
            for dy in range(-rad, rad + 1):
                for dx in range(-rad, rad + 1):
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < CELL and 0 <= ny < CELL:
                        nr, ng, nb, na = px[nx, ny]
                        if na >= 200 and (nx, ny) not in coord_set:
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


def despeckle_cell(
    cell: Image.Image, delta: float, passes: int = 4
) -> tuple[Image.Image, int]:
    cur = cell
    total = 0
    for _ in range(passes):
        peaks = find_bright_peaks(cur, delta)
        if not peaks:
            break
        total += len(peaks)
        cur = replace_with_neighbor_median(cur, peaks)
    return cur, total


def soft_clamp_highlights(cell: Image.Image, max_L: float = 125.0) -> Image.Image:
    out = cell.copy()
    px = out.load()
    assert px is not None
    for y in range(CELL):
        for x in range(CELL):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            L = lum((r, g, b))
            if L > max_L:
                scale = max_L / L
                px[x, y] = (int(r * scale), int(g * scale), int(b * scale), a)
    return out


def preview_sheet(path: Path, scale: int, out: Path) -> None:
    im = Image.open(path).convert("RGBA")
    bw, bh = im.width * scale, im.height * scale
    bg = Image.new("RGBA", (bw, bh), (232, 220, 196, 255))
    bg.alpha_composite(im.resize((bw, bh), Image.NEAREST))
    draw = ImageDraw.Draw(bg)
    for x in range(0, im.width + 1, CELL):
        draw.line([(x * scale, 0), (x * scale, bh)], fill=(255, 0, 255, 160))
    for y in range(0, im.height + 1, CELL):
        draw.line([(0, y * scale), (bw, y * scale)], fill=(255, 0, 255, 160))
    bg.save(out)


def preview_cell(cell: Image.Image, scale: int, out: Path) -> None:
    bg = Image.new("RGBA", (CELL * scale, CELL * scale), (232, 220, 196, 255))
    bg.alpha_composite(cell.resize((CELL * scale, CELL * scale), Image.NEAREST))
    bg.save(out)


def main() -> None:
    sheet = Image.open(SRC).convert("RGBA")
    ramp = sample_wet_ramp(sheet)
    print(f"wet ramp colors: {len(ramp)} L={lum(ramp[0]):.0f}..{lum(ramp[-1]):.0f}")

    wet_bowl = recolor_fired_to_wet(sheet.crop(cell_box(7)), ramp)
    wet_crock = recolor_fired_to_wet(sheet.crop(cell_box(10)), ramp)
    wet_bowl, n_bowl = despeckle_cell(wet_bowl, delta=18)
    wet_crock, n_crock = despeckle_cell(wet_crock, delta=18)
    wet_bowl = soft_clamp_highlights(wet_bowl, 118)
    wet_crock = soft_clamp_highlights(wet_crock, 118)
    print(
        "rebuilt wet_bowl",
        f"despeckle={n_bowl}",
        f"opaque={sum(1 for p in wet_bowl.getdata() if p[3] >= 128)}",
    )
    print(
        "rebuilt wet_crock",
        f"despeckle={n_crock}",
        f"opaque={sum(1 for p in wet_crock.getdata() if p[3] >= 128)}",
    )

    wet_teapot, n_tp = despeckle_cell(sheet.crop(cell_box(1)), delta=20)
    wet_bottle, n_bt = despeckle_cell(sheet.crop(cell_box(3)), delta=18)
    wet_teapot = soft_clamp_highlights(wet_teapot, 120)
    wet_bottle = soft_clamp_highlights(wet_bottle, 120)
    print(f"despeckle wet_teapot={n_tp} wet_bottle={n_bt}")

    paste_cell(sheet, 1, wet_teapot)
    paste_cell(sheet, 3, wet_bottle)
    paste_cell(sheet, 6, wet_bowl)
    paste_cell(sheet, 9, wet_crock)

    tmp_webp = OUT_DIR / "ceramics-wet-fixed.webp"
    sheet.save(tmp_webp, "WEBP", lossless=True, method=6)
    sheet.save(SRC, "WEBP", lossless=True, method=6)
    print(f"shipped {SRC} size={sheet.size}")

    preview_sheet(SRC, 6, OUT_DIR / "ceramics-wet-fixed-sheet-6x.png")
    for idx, name, cell in [
        (1, "wet_teapot", wet_teapot),
        (3, "wet_bottle", wet_bottle),
        (6, "wet_bowl", wet_bowl),
        (9, "wet_crock", wet_crock),
    ]:
        preview_cell(cell, 12, OUT_DIR / f"fixed-{idx:02d}-{name}-12x.png")


if __name__ == "__main__":
    main()
