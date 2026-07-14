"""Paint 4x3 @ 32px wildlife specialty RUNNERS loot sheet."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

CELL = 32
COLS = 4
ROWS = 3
PADDING = 2
OUT = Path("public/creatures/sprites/loot/wildlife-specialty-runners-sprites.webp")
PREVIEW = Path("tmp/sprites/inspect/wildlife-specialty-runners-preview.png")
TEMP_DIR = Path("tmp/sprites/wildlife-specialty/runners")


def put(img: Image.Image, x: int, y: int, rgba: tuple[int, int, int, int]) -> None:
    if 0 <= x < img.width and 0 <= y < img.height:
        img.putpixel((x, y), rgba)


def blank_cell() -> Image.Image:
    return Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))


def draw_folded_hide(
    cell: Image.Image,
    *,
    base: tuple[int, int, int],
    shadow: tuple[int, int, int],
    highlight: tuple[int, int, int],
    edge: tuple[int, int, int],
    stripe: tuple[int, int, int] | None = None,
    stripe_alt: tuple[int, int, int] | None = None,
) -> None:
    """Generic folded hide patch ~24x20 centered."""
    ox, oy = 4, 6
    for y in range(oy, oy + 18):
        for x in range(ox, ox + 24):
            rel_x, rel_y = x - ox, y - oy
            if rel_y < 4 and rel_x > 16:
                put(cell, x, y, highlight)
            elif rel_y > 12 and rel_x < 8:
                put(cell, x, y, shadow)
            elif rel_x + rel_y > 28:
                put(cell, x, y, edge)
            elif stripe and stripe_alt and (rel_x // 3) % 2 == 0:
                put(cell, x, y, stripe if rel_y % 4 < 2 else stripe_alt)
            else:
                put(cell, x, y, base)
    # fold crease
    for i in range(10):
        put(cell, ox + 8 + i, oy + 6 + i // 2, shadow)
        put(cell, ox + 9 + i, oy + 6 + i // 2, shadow)
    for i in range(8):
        put(cell, ox + 14 + i, oy + 3 + i // 3, highlight)


def paint_soft_hide() -> Image.Image:
    cell = blank_cell()
    draw_folded_hide(
        cell,
        base=(210, 188, 158),
        shadow=(150, 128, 102),
        highlight=(235, 220, 195),
        edge=(110, 92, 72),
    )
    return cell


def paint_tendon() -> Image.Image:
    cell = blank_cell()
    pale = (228, 215, 195)
    mid = (200, 180, 155)
    dark = (160, 140, 118)
    # coiled sinew cord
    coords = [
        (8, 22), (9, 21), (10, 20), (11, 19), (12, 18), (13, 17), (14, 16),
        (15, 15), (16, 14), (17, 13), (18, 12), (19, 11), (20, 10), (21, 9),
        (22, 8), (23, 8), (24, 9), (24, 10), (23, 11), (22, 12), (21, 13),
        (20, 14), (19, 15), (18, 16), (17, 17), (16, 18), (15, 19), (14, 20),
        (13, 21), (12, 22), (11, 23), (10, 24), (9, 25), (8, 26), (7, 26),
        (6, 25), (6, 24), (7, 23), (8, 22),
    ]
    for x, y in coords:
        put(cell, x, y, mid)
        put(cell, x, y + 1, dark)
    for x, y in [(8, 22), (15, 15), (22, 8), (16, 18), (10, 24)]:
        put(cell, x, y, pale)
    return cell


def paint_antler() -> Image.Image:
    cell = blank_cell()
    bone = (200, 178, 140)
    dark = (140, 115, 82)
    light = (230, 210, 175)
    # main beam
    for y in range(8, 26):
        put(cell, 15, y, bone)
        put(cell, 16, y, bone)
        if y % 3 == 0:
            put(cell, 14, y, dark)
            put(cell, 17, y, light)
    # left tine
    for i in range(6):
        put(cell, 14 - i, 12 + i, bone)
        put(cell, 13 - i, 12 + i, dark)
    for i in range(4):
        put(cell, 9 - i, 17 + i, bone)
    # right tine
    for i in range(5):
        put(cell, 17 + i, 10 + i, bone)
        put(cell, 18 + i, 10 + i, light)
    for i in range(4):
        put(cell, 21 + i, 14 + i, bone)
    # tip highlights
    put(cell, 6, 21, light)
    put(cell, 25, 18, light)
    put(cell, 16, 8, light)
    return cell


def paint_stripe_hide() -> Image.Image:
    cell = blank_cell()
    draw_folded_hide(
        cell,
        base=(240, 240, 235),
        shadow=(60, 60, 65),
        highlight=(255, 255, 250),
        edge=(30, 30, 35),
        stripe=(35, 35, 40),
        stripe_alt=(230, 230, 225),
    )
    return cell


def paint_thin_hide() -> Image.Image:
    cell = blank_cell()
    base = (225, 210, 185)
    shadow = (170, 155, 130)
    light = (245, 235, 215)
    edge = (130, 115, 95)
    # thin draped sheet
    for y in range(7, 25):
        for x in range(6, 26):
            if x + y < 14 or x - y > 18:
                continue
            put(cell, x, y, base)
    for y in range(8, 24):
        put(cell, 8, y, shadow)
        put(cell, 24, y, light)
    for x in range(10, 22):
        put(cell, x, 23, edge)
        put(cell, x, 24, shadow)
    for x in range(12, 20):
        put(cell, x, 10, light)
    return cell


def paint_desert_hide() -> Image.Image:
    cell = blank_cell()
    draw_folded_hide(
        cell,
        base=(210, 185, 140),
        shadow=(160, 130, 90),
        highlight=(235, 215, 170),
        edge=(120, 95, 60),
    )
    # dry crack marks
    for x, y in [(10, 14), (11, 15), (18, 12), (19, 13), (14, 18), (15, 19)]:
        put(cell, x, y, (140, 110, 70))
    return cell


def paint_plume() -> Image.Image:
    cell = blank_cell()
    shaft = (120, 90, 55)
    barb_dark = (40, 35, 30)
    barb_mid = (180, 50, 60)
    barb_light = (230, 100, 80)
    barb_tip = (255, 180, 60)
    # shaft
    for y in range(6, 28):
        put(cell, 16, y, shaft)
        put(cell, 15, y, (90, 65, 40))
    # fluffy barbs left
    for i in range(10):
        y = 8 + i
        w = 3 + i // 2
        for dx in range(w):
            put(cell, 15 - dx, y, barb_mid if dx % 2 else barb_light)
            put(cell, 14 - dx, y + 1, barb_dark)
    # barbs right
    for i in range(10):
        y = 8 + i
        w = 2 + i // 3
        for dx in range(w):
            put(cell, 17 + dx, y, barb_light if dx % 2 else barb_tip)
    put(cell, 12, 7, barb_tip)
    put(cell, 20, 9, barb_tip)
    put(cell, 14, 6, barb_light)
    return cell


def paint_ostrich_egg() -> Image.Image:
    cell = blank_cell()
    base = (240, 230, 205)
    shadow = (180, 165, 135)
    light = (255, 250, 230)
    dark = (130, 115, 90)
    # large egg oval
    cx, cy = 16, 16
    for y in range(5, 27):
        for x in range(7, 25):
            dx, dy = (x - cx) / 8.5, (y - cy) / 10.5
            if dx * dx + dy * dy <= 1.0:
                if y < cy - 2:
                    put(cell, x, y, light)
                elif x < cx - 3:
                    put(cell, x, y, shadow)
                elif x > cx + 4:
                    put(cell, x, y, base)
                else:
                    put(cell, x, y, base)
    # outline
    for y in range(5, 27):
        for x in range(7, 25):
            dx, dy = (x - cx) / 8.5, (y - cy) / 10.5
            if 0.85 <= dx * dx + dy * dy <= 1.05:
                put(cell, x, y, dark)
    put(cell, 13, 10, light)
    put(cell, 14, 9, light)
    return cell


def paint_camel_hair() -> Image.Image:
    cell = blank_cell()
    tan = (190, 155, 105)
    dark = (130, 100, 65)
    light = (220, 185, 135)
    # coarse hair tuft
    strands = [
        (16, 24, 16, 8), (14, 24, 12, 10), (18, 24, 20, 9),
        (15, 24, 10, 12), (17, 24, 22, 11), (13, 24, 8, 14),
        (19, 24, 24, 13), (16, 24, 16, 6), (12, 24, 6, 16),
        (20, 24, 26, 15),
    ]
    for x0, y0, x1, y1 in strands:
        steps = max(abs(x1 - x0), abs(y1 - y0))
        for i in range(steps + 1):
            t = i / max(steps, 1)
            x = round(x0 + (x1 - x0) * t)
            y = round(y0 + (y1 - y0) * t)
            c = light if i < steps // 3 else tan if i < 2 * steps // 3 else dark
            put(cell, x, y, c)
            put(cell, x + 1, y, dark if i > steps // 2 else tan)
    # base clump
    for x in range(10, 22):
        put(cell, x, 23, dark)
        put(cell, x, 24, tan)
    return cell


def paint_bladder() -> Image.Image:
    cell = blank_cell()
    base = (210, 175, 140)
    shadow = (150, 115, 85)
    light = (235, 205, 170)
    dark = (100, 75, 55)
    membrane = (180, 145, 110)
    # organic sac shape
    cx, cy = 16, 17
    for y in range(7, 26):
        for x in range(8, 24):
            dx, dy = (x - cx) / 7.0, (y - cy) / 8.5
            if dx * dx + dy * dy <= 1.0:
                if y < cy - 1:
                    put(cell, x, y, light)
                elif x < cx - 2:
                    put(cell, x, y, shadow)
                else:
                    put(cell, x, y, base)
    # neck tie
    for y in range(7, 11):
        put(cell, 15, y, membrane)
        put(cell, 16, y, membrane)
        put(cell, 17, y, shadow)
    put(cell, 16, 6, dark)
    put(cell, 15, 6, dark)
    # highlight gleam
    put(cell, 19, 13, light)
    put(cell, 20, 14, light)
    # outline spots
    for y in range(7, 26):
        for x in range(8, 24):
            dx, dy = (x - cx) / 7.0, (y - cy) / 8.5
            if 0.88 <= dx * dx + dy * dy <= 1.02:
                put(cell, x, y, dark)
    return cell


def paint_tall_hide() -> Image.Image:
    cell = blank_cell()
    base = (200, 170, 125)
    shadow = (145, 115, 75)
    light = (230, 200, 155)
    edge = (110, 85, 50)
    # long vertical hide strip
    for y in range(4, 28):
        for x in range(11, 21):
            if x < 14:
                put(cell, x, y, shadow)
            elif x > 18:
                put(cell, x, y, light)
            else:
                put(cell, x, y, base)
    for x in range(11, 21):
        put(cell, x, 4, edge)
        put(cell, x, 27, edge)
    for y in range(6, 26, 4):
        put(cell, 13, y, shadow)
        put(cell, 17, y, (170, 140, 95))
    put(cell, 12, 8, light)
    put(cell, 18, 20, light)
    return cell


def paint_neck_bone() -> Image.Image:
    cell = blank_cell()
    bone = (230, 220, 200)
    shadow = (170, 160, 140)
    light = (250, 245, 235)
    dark = (120, 110, 95)
    # long curved neck vertebra bone
    curve = [
        (10, 24), (11, 22), (12, 20), (13, 18), (14, 16), (15, 14),
        (16, 12), (17, 10), (18, 9), (19, 8), (20, 8), (21, 9),
        (22, 10), (22, 11),
    ]
    for x, y in curve:
        put(cell, x, y, bone)
        put(cell, x, y + 1, shadow)
        put(cell, x + 1, y, light)
    for x, y in curve[2:-2]:
        put(cell, x, y - 1, light)
    # joint knobs
    for cx, cy in [(12, 20), (16, 12), (20, 8)]:
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                if abs(dx) + abs(dy) <= 2:
                    put(cell, cx + dx, cy + dy, bone if dx <= 0 else light)
    put(cell, 10, 24, dark)
    put(cell, 22, 11, dark)
    return cell


PAINTERS = [
    ("00-soft-hide.png", paint_soft_hide),
    ("01-tendon.png", paint_tendon),
    ("02-antler.png", paint_antler),
    ("03-stripe-hide.png", paint_stripe_hide),
    ("04-thin-hide.png", paint_thin_hide),
    ("05-desert-hide.png", paint_desert_hide),
    ("06-plume.png", paint_plume),
    ("07-ostrich-egg.png", paint_ostrich_egg),
    ("08-camel-hair.png", paint_camel_hair),
    ("09-bladder.png", paint_bladder),
    ("10-tall-hide.png", paint_tall_hide),
    ("11-neck-bone.png", paint_neck_bone),
]


def save_individual_pngs() -> list[Path]:
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    paths: list[Path] = []
    for name, painter in PAINTERS:
        path = TEMP_DIR / name
        cell = painter()
        assert cell.size == (CELL, CELL)
        cell.save(path)
        paths.append(path)
    return paths


def build_sheet(cells: list[Image.Image]) -> Image.Image:
    sheet = Image.new("RGBA", (CELL * COLS, CELL * ROWS), (0, 0, 0, 0))
    for idx, cell in enumerate(cells):
        col = idx % COLS
        row = idx // COLS
        sheet.paste(cell, (col * CELL, row * CELL))
    return sheet


def write_preview(sheet: Image.Image) -> None:
    scale = 4
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
    draw = ImageDraw.Draw(cb)
    for gx in range(0, w * scale + 1, CELL * scale):
        draw.line([(gx, 0), (gx, h * scale)], fill=(255, 0, 255, 255), width=2)
    for gy in range(0, h * scale + 1, CELL * scale):
        draw.line([(0, gy), (w * scale, gy)], fill=(255, 0, 255, 255), width=2)
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    cb.save(PREVIEW)


def main() -> None:
    paths = save_individual_pngs()
    cells = [Image.open(p).convert("RGBA") for p in paths]
    sheet = build_sheet(cells)
    assert sheet.size == (128, 96)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT, "WEBP", lossless=True, method=6)
    write_preview(sheet)
    print(f"wrote {OUT} {sheet.size} {sheet.mode}")
    print(f"preview {PREVIEW}")
    print(f"cells {len(cells)}")


if __name__ == "__main__":
    main()
