"""Fill interior transparent pixels in ceramics sheet (silhouette white holes)."""

from __future__ import annotations

import statistics
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "public/inventory/sprites/inventory-ceramics-sprites.webp"
OUT_DIR = Path(__file__).resolve().parent
CELL = 32


def fill_interior_alpha_holes(
    im: Image.Image, *, min_opaque_neighbors: int = 5, passes: int = 6
) -> tuple[Image.Image, int]:
    out = im.copy()
    total = 0
    for _ in range(passes):
        px = out.load()
        assert px is not None
        w, h = out.size
        holes: list[tuple[int, int]] = []
        for y in range(h):
            for x in range(w):
                if px[x, y][3] >= 128:
                    continue
                nbrs = 0
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        if dx == 0 and dy == 0:
                            continue
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] >= 200:
                            nbrs += 1
                if nbrs >= min_opaque_neighbors:
                    holes.append((x, y))
        if not holes:
            break
        snap = out.copy()
        spx = snap.load()
        assert spx is not None
        opx = out.load()
        assert opx is not None
        for x, y in holes:
            colors: list[tuple[int, int, int, int]] = []
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        nr, ng, nb, na = spx[nx, ny]
                        if na >= 200:
                            colors.append((nr, ng, nb, na))
            if not colors:
                continue
            opx[x, y] = (
                int(statistics.median([c[0] for c in colors])),
                int(statistics.median([c[1] for c in colors])),
                int(statistics.median([c[2] for c in colors])),
                255,
            )
        total += len(holes)
    return out, total


def count_holes(im: Image.Image, min_n: int = 5) -> list[tuple[int, int]]:
    px = im.load()
    assert px is not None
    w, h = im.size
    holes: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] >= 128:
                continue
            n = 0
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] >= 200:
                        n += 1
            if n >= min_n:
                holes.append((x, y))
    return holes


def silhouette_preview(im: Image.Image, path: Path, scale: int = 6) -> None:
    bg = Image.new(
        "RGBA", (im.width * scale, im.height * scale), (232, 220, 196, 255)
    )
    sil = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sp = sil.load()
    px = im.load()
    assert sp is not None and px is not None
    for y in range(im.height):
        for x in range(im.width):
            if px[x, y][3] >= 128:
                sp[x, y] = (30, 30, 30, 255)
    bg.alpha_composite(
        sil.resize((im.width * scale, im.height * scale), Image.NEAREST)
    )
    d = ImageDraw.Draw(bg)
    for x in range(0, im.width + 1, CELL):
        d.line(
            [(x * scale, 0), (x * scale, im.height * scale)],
            fill=(255, 0, 255, 120),
        )
    for y in range(0, im.height + 1, CELL):
        d.line(
            [(0, y * scale), (im.width * scale, y * scale)],
            fill=(255, 0, 255, 120),
        )
    bg.save(path)


def main() -> None:
    sheet = Image.open(SRC).convert("RGBA")
    before = count_holes(sheet)
    print(f"before holes: {len(before)}")
    fixed, n = fill_interior_alpha_holes(sheet)
    after = count_holes(fixed)
    print(f"filled {n} pixels across passes; remaining holes: {len(after)}")
    for idx in range(12):
        col, row = idx % 4, idx // 4
        cell_holes = [
            (x, y)
            for x, y in after
            if col * 32 <= x < col * 32 + 32 and row * 32 <= y < row * 32 + 32
        ]
        if cell_holes:
            local = [(x - col * 32, y - row * 32) for x, y in cell_holes]
            print(f"  cell {idx} still {len(cell_holes)}: {local}")

    fixed.save(OUT_DIR / "ceramics-holes-fixed.webp", "WEBP", lossless=True, method=6)
    fixed.save(SRC, "WEBP", lossless=True, method=6)
    silhouette_preview(fixed, OUT_DIR / "ceramics-silhouette-after.png")

    scale = 6
    bw, bh = fixed.width * scale, fixed.height * scale
    chk = Image.new("RGBA", (bw, bh))
    cpx = chk.load()
    assert cpx is not None
    for y in range(bh):
        for x in range(bw):
            c = 200 if ((x // scale) + (y // scale)) % 2 == 0 else 160
            cpx[x, y] = (c, c, c, 255)
    chk.alpha_composite(fixed.resize((bw, bh), Image.NEAREST))
    d = ImageDraw.Draw(chk)
    for x in range(0, fixed.width + 1, CELL):
        d.line([(x * scale, 0), (x * scale, bh)], fill=(255, 0, 255, 160))
    for y in range(0, fixed.height + 1, CELL):
        d.line([(0, y * scale), (bw, y * scale)], fill=(255, 0, 255, 160))
    chk.save(OUT_DIR / "ceramics-color-after.png")
    print("shipped", SRC, "size", fixed.size)


if __name__ == "__main__":
    main()
