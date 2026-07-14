"""Replace cool grey / blue-grey speck pixels on wet clay + ceramics sheets."""

from __future__ import annotations

import statistics
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = Path(__file__).resolve().parent


def is_warm_clay(r: int, g: int, b: int, a: int = 255) -> bool:
    if a < 16:
        return False
    # cool cast (the grey/cyan specks)
    if b > r + 8:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    lum = (r + g + b) / 3
    sat = (mx - mn) / mx if mx else 0.0
    if sat < 0.12 and lum >= 110:
        return False
    if sat < 0.18 and lum >= 150 and abs(r - b) < 25:
        return False
    if lum >= 170 and b >= r:
        return False
    return True


def is_speck(r: int, g: int, b: int, a: int) -> bool:
    if a < 16:
        return False
    return not is_warm_clay(r, g, b, a)


def cleanup_sheet(src: Path, dst: Path) -> int:
    im = Image.open(src).convert("RGBA")
    px = im.load()
    assert px is not None
    w, h = im.size
    specks: list[tuple[int, int, int, int, int, int]] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_speck(r, g, b, a):
                specks.append((x, y, r, g, b, a))

    print(f"{src.name}: {len(specks)} speck(s)")
    for s in specks:
        print(f"  {s}")

    out = im.copy()
    opx = out.load()
    assert opx is not None
    for x, y, r, g, b, a in specks:
        replacement = None
        for rad in (1, 2, 3, 4):
            nbrs: list[tuple[int, int, int, int]] = []
            for dy in range(-rad, rad + 1):
                for dx in range(-rad, rad + 1):
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        nr, ng, nb, na = px[nx, ny]
                        if is_warm_clay(nr, ng, nb, na) and na > 200:
                            nbrs.append((nr, ng, nb, na))
            if nbrs:
                replacement = (
                    int(statistics.median([n[0] for n in nbrs])),
                    int(statistics.median([n[1] for n in nbrs])),
                    int(statistics.median([n[2] for n in nbrs])),
                    int(statistics.median([n[3] for n in nbrs])),
                )
                break
        if replacement is None:
            print(f"  NO REPLACEMENT at {(x, y)} {(r, g, b, a)}")
            continue
        opx[x, y] = replacement

    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, "WEBP", lossless=True, method=6)
    print(f"saved {dst}")
    return len(specks)


def remaining_specks(path: Path) -> list[tuple[int, int, int, int, int]]:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    assert px is not None
    left: list[tuple[int, int, int, int, int]] = []
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if is_speck(r, g, b, a):
                left.append((x, y, r, g, b))
    return left


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
    up = im.resize((bw, bh), Image.NEAREST)
    bg.alpha_composite(up)
    if cell:
        draw = ImageDraw.Draw(bg)
        for x in range(0, im.width + 1, cell):
            draw.line(
                [(x * scale, 0), (x * scale, bh)],
                fill=(255, 0, 255, 180),
            )
    bg.save(out)
    print(f"preview {out} {bg.size}")


def main() -> None:
    wet_src = ROOT / "public/inventory/sprites/inventory-wet-clay-sprites.webp"
    cer_src = ROOT / "public/inventory/sprites/inventory-ceramics-sprites.webp"

    wet_out = OUT_DIR / "wet-clay-cleaned.webp"
    cer_out = OUT_DIR / "ceramics-cleaned.webp"

    cleanup_sheet(wet_src, wet_out)
    cleanup_sheet(cer_src, cer_out)

    for p in (wet_out, cer_out):
        left = remaining_specks(p)
        print(f"remaining {p.name}: {len(left)} {left[:10]}")

    preview(wet_out, 10, OUT_DIR / "wet-clay-after.png")
    preview(cer_out, 6, OUT_DIR / "ceramics-after.png", cell=32)

    # ship (copy, keep tmp copies for inspect)
    Image.open(wet_out).save(wet_src, "WEBP", lossless=True, method=6)
    Image.open(cer_out).save(cer_src, "WEBP", lossless=True, method=6)
    print("shipped to public/")


if __name__ == "__main__":
    main()
