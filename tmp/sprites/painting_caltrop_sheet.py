"""Paint 2x1 @ 32px caltrop sheet: dense tiny black iron jacks."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

CELL = 32
COLS = 2
ROWS = 1
OUT = Path("public/environment/sprites/props/trap/caltrop-sprites.webp")
PREVIEW = Path("tmp/sprites/inspect/caltrop-sheet-preview.png")

# Dark forged iron (avoid pure #7A7A7A key; keep near-black with cool edge)
INK = (18, 18, 22, 255)
BODY = (36, 36, 42, 255)
EDGE = (62, 64, 72, 255)
TIP = (88, 92, 102, 255)  # muted highlight, not white chrome


def put(img: Image.Image, x: int, y: int, rgba: tuple[int, int, int, int]) -> None:
    if 0 <= x < img.width and 0 <= y < img.height:
        img.putpixel((x, y), rgba)


def paint_caltrop(
    img: Image.Image,
    cx: int,
    cy: int,
    *,
    scale: int = 1,
    muted: bool = False,
) -> None:
    """Tiny tetrahedral jack: three base points + one up tip."""
    ink = INK if not muted else (14, 14, 16, 255)
    body = BODY if not muted else (28, 28, 32, 255)
    edge = EDGE if not muted else (48, 50, 56, 255)
    tip = TIP if not muted else (58, 60, 66, 255)

    # Center hub
    put(img, cx, cy, body)
    put(img, cx - 1, cy, ink)
    put(img, cx + 1, cy, edge)

    if scale <= 1:
        # Compact 5–7 px jack
        put(img, cx, cy - 1, tip)  # up
        put(img, cx - 1, cy + 1, ink)
        put(img, cx + 1, cy + 1, body)
        put(img, cx, cy + 1, ink)
        put(img, cx - 2, cy, ink)
        put(img, cx + 2, cy, edge)
        return

    # Slightly larger jack
    put(img, cx, cy - 2, tip)
    put(img, cx, cy - 1, edge)
    put(img, cx - 2, cy + 1, ink)
    put(img, cx - 1, cy + 1, body)
    put(img, cx + 1, cy + 1, body)
    put(img, cx + 2, cy + 1, edge)
    put(img, cx, cy + 2, ink)
    put(img, cx - 1, cy, ink)
    put(img, cx + 1, cy, edge)


def paint_scatter(
    cell: Image.Image,
    positions: list[tuple[int, int, int]],
    *,
    muted: bool = False,
) -> None:
    for x, y, scale in positions:
        paint_caltrop(cell, x, y, scale=scale, muted=muted)


def make_armed() -> Image.Image:
    cell = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    # Dense but readable scatter of many tiny spikes (pad ~2)
    positions = [
        (8, 10, 1),
        (12, 8, 1),
        (16, 9, 2),
        (20, 8, 1),
        (24, 11, 1),
        (7, 14, 1),
        (11, 13, 2),
        (15, 14, 1),
        (19, 13, 2),
        (23, 15, 1),
        (9, 18, 1),
        (13, 17, 1),
        (17, 18, 2),
        (21, 17, 1),
        (25, 19, 1),
        (10, 21, 1),
        (14, 22, 1),
        (18, 21, 1),
        (22, 22, 1),
        (15, 11, 1),
        (12, 20, 1),
        (20, 20, 1),
    ]
    paint_scatter(cell, positions, muted=False)
    return cell


def make_spent() -> Image.Image:
    cell = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    # Same footprint, fewer upright tips, flatter / muted
    positions = [
        (9, 11, 1),
        (13, 10, 1),
        (17, 11, 1),
        (21, 10, 1),
        (24, 13, 1),
        (8, 15, 1),
        (12, 15, 1),
        (16, 16, 1),
        (20, 15, 1),
        (23, 17, 1),
        (10, 19, 1),
        (14, 20, 1),
        (18, 19, 1),
        (22, 20, 1),
        (12, 22, 1),
        (16, 22, 1),
        (20, 22, 1),
    ]
    paint_scatter(cell, positions, muted=True)
    return cell


def build_sheet() -> Image.Image:
    sheet = Image.new("RGBA", (CELL * COLS, CELL * ROWS), (0, 0, 0, 0))
    sheet.paste(make_armed(), (0, 0))
    sheet.paste(make_spent(), (CELL, 0))
    return sheet


def write_preview(sheet: Image.Image) -> None:
    scale = 8
    w, h = sheet.size
    cb = Image.new("RGBA", (w * scale, h * scale))
    pixels = cb.load()
    assert pixels is not None
    for y in range(h * scale):
        for x in range(w * scale):
            c = 180 if ((x // 8) + (y // 8)) % 2 == 0 else 220
            pixels[x, y] = (c, c, c, 255)
    up = sheet.resize((w * scale, h * scale), Image.NEAREST)
    cb.alpha_composite(up)
    from PIL import ImageDraw

    draw = ImageDraw.Draw(cb)
    for gx in range(0, w * scale + 1, CELL * scale):
        draw.line([(gx, 0), (gx, h * scale)], fill=(255, 0, 255, 255), width=2)
    for gy in range(0, h * scale + 1, CELL * scale):
        draw.line([(0, gy), (w * scale, gy)], fill=(255, 0, 255, 255), width=2)
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    cb.save(PREVIEW)


def main() -> None:
    sheet = build_sheet()
    assert sheet.size == (64, 32)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT, "WEBP", lossless=True, method=6)
    write_preview(sheet)
    print(f"wrote {OUT} {sheet.size} {sheet.mode}")
    print(f"preview {PREVIEW}")


if __name__ == "__main__":
    main()
