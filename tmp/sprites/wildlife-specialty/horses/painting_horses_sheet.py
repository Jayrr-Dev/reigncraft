"""Paint 4x3 @ 32px wildlife specialty HORSES/PRIMATES loot sheet."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

CELL = 32
COLS = 4
ROWS = 3
PADDING = 2
OUT = Path("public/creatures/sprites/loot/wildlife-specialty-horses-sprites.webp")
PREVIEW = Path("tmp/sprites/inspect/wildlife-specialty-horses-preview.png")
TEMP_DIR = Path("tmp/sprites/wildlife-specialty/horses")


def put(img: Image.Image, x: int, y: int, rgba: tuple[int, int, int, int]) -> None:
    if 0 <= x < img.width and 0 <= y < img.height:
        img.putpixel((x, y), rgba)


def blank_cell() -> Image.Image:
    return Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))


def paint_hair_tuft(
    cell: Image.Image,
    *,
    light: tuple[int, int, int],
    mid: tuple[int, int, int],
    dark: tuple[int, int, int],
    strand_count: int = 10,
    spread: int = 10,
) -> None:
    """Fan of hair strands rising from a base clump."""
    base_y = 24
    for i in range(strand_count):
        x0 = 16 + (i - strand_count // 2) * 2
        x1 = x0 + (i % 3 - 1) * spread // 3
        y1 = 6 + (i % 4)
        steps = base_y - y1
        for step in range(steps + 1):
            t = step / max(steps, 1)
            x = round(x0 + (x1 - x0) * t)
            y = round(base_y - step)
            if step < steps // 4:
                c = light
            elif step < 2 * steps // 3:
                c = mid
            else:
                c = dark
            put(cell, x, y, c)
            if i % 2 == 0:
                put(cell, x + 1, y, dark if step > steps // 2 else mid)
    for x in range(10, 22):
        put(cell, x, 24, dark)
        put(cell, x, 25, mid)


def paint_horsehair() -> Image.Image:
    cell = blank_cell()
    paint_hair_tuft(
        cell,
        light=(90, 75, 60),
        mid=(55, 45, 35),
        dark=(30, 25, 20),
        strand_count=12,
        spread=12,
    )
    return cell


def paint_fine_hair() -> Image.Image:
    cell = blank_cell()
    light = (245, 235, 210)
    mid = (220, 205, 175)
    dark = (175, 160, 130)
    strands = [
        (16, 25, 16, 7), (14, 25, 11, 9), (18, 25, 21, 8),
        (15, 25, 9, 11), (17, 25, 23, 10), (13, 25, 7, 13),
        (19, 25, 25, 12), (12, 25, 5, 15), (20, 25, 27, 14),
    ]
    for x0, y0, x1, y1 in strands:
        steps = max(abs(x1 - x0), abs(y1 - y0))
        for i in range(steps + 1):
            t = i / max(steps, 1)
            x = round(x0 + (x1 - x0) * t)
            y = round(y0 + (y1 - y0) * t)
            c = light if i < steps // 3 else mid if i < 2 * steps // 3 else dark
            put(cell, x, y, c)
    for x in range(9, 23):
        put(cell, x, 25, dark)
        put(cell, x, 26, mid)
    return cell


def paint_coarse_hair() -> Image.Image:
    cell = blank_cell()
    paint_hair_tuft(
        cell,
        light=(150, 145, 140),
        mid=(110, 108, 105),
        dark=(70, 68, 65),
        strand_count=8,
        spread=8,
    )
    # rough kink marks
    for x, y in [(12, 14), (18, 12), (14, 18), (20, 16)]:
        put(cell, x, y, (85, 82, 78))
    return cell


def paint_hoof() -> Image.Image:
    cell = blank_cell()
    base = (45, 38, 32)
    shadow = (25, 20, 18)
    light = (75, 65, 55)
    edge = (15, 12, 10)
    # chunky hoof block
    for y in range(10, 26):
        for x in range(9, 23):
            if y < 14 and x > 18:
                put(cell, x, y, light)
            elif y > 20 and x < 13:
                put(cell, x, y, shadow)
            elif x < 11 or x > 21 or y < 11 or y > 24:
                put(cell, x, y, edge)
            else:
                put(cell, x, y, base)
    # hoof rim
    for x in range(9, 23):
        put(cell, x, 25, shadow)
        put(cell, x, 26, edge)
    # wear highlight
    put(cell, 19, 12, light)
    put(cell, 20, 13, light)
    put(cell, 11, 22, shadow)
    return cell


def paint_wool_puff(
    cell: Image.Image,
    *,
    light: tuple[int, int, int],
    mid: tuple[int, int, int],
    dark: tuple[int, int, int],
    cx: int = 16,
    cy: int = 16,
    radius: float = 9.0,
) -> None:
    for y in range(6, 26):
        for x in range(6, 26):
            dx, dy = (x - cx) / radius, (y - cy) / (radius * 0.85)
            if dx * dx + dy * dy <= 1.0:
                if y < cy - 2:
                    put(cell, x, y, light)
                elif x < cx - 2:
                    put(cell, x, y, dark)
                else:
                    put(cell, x, y, mid)
    # fluffy bumps
    for bx, by in [(12, 11), (20, 12), (11, 18), (21, 17), (16, 10), (15, 20)]:
        put(cell, bx, by, light)
        put(cell, bx + 1, by, light)
    for bx, by in [(10, 15), (22, 14), (14, 22)]:
        put(cell, bx, by, dark)


def paint_llama_wool() -> Image.Image:
    cell = blank_cell()
    paint_wool_puff(
        cell,
        light=(255, 252, 240),
        mid=(240, 230, 210),
        dark=(200, 185, 165),
    )
    return cell


def paint_spit_sac() -> Image.Image:
    cell = blank_cell()
    base = (120, 155, 85)
    shadow = (70, 100, 50)
    light = (160, 195, 110)
    dark = (45, 65, 30)
    slime = (90, 130, 60)
    cx, cy = 16, 18
    for y in range(8, 26):
        for x in range(8, 24):
            dx, dy = (x - cx) / 7.5, (y - cy) / 8.0
            if dx * dx + dy * dy <= 1.0:
                if y < cy:
                    put(cell, x, y, light)
                elif x < cx - 1:
                    put(cell, x, y, shadow)
                else:
                    put(cell, x, y, base)
    # neck / duct
    for y in range(8, 12):
        put(cell, 15, y, slime)
        put(cell, 16, y, slime)
        put(cell, 17, y, shadow)
    # gross drips
    for x, y in [(13, 24), (14, 25), (18, 24), (19, 26)]:
        put(cell, x, y, slime)
    for y in range(8, 26):
        for x in range(8, 24):
            dx, dy = (x - cx) / 7.5, (y - cy) / 8.0
            if 0.9 <= dx * dx + dy * dy <= 1.05:
                put(cell, x, y, dark)
    put(cell, 20, 14, light)
    return cell


def paint_soft_fleece() -> Image.Image:
    cell = blank_cell()
    paint_wool_puff(
        cell,
        light=(255, 245, 235),
        mid=(235, 220, 205),
        dark=(195, 175, 160),
        radius=8.5,
    )
    # extra soft curl marks
    for x, y in [(13, 13), (19, 14), (15, 19), (18, 18)]:
        put(cell, x, y, (250, 240, 230))
        put(cell, x + 1, y, (220, 205, 190))
    return cell


def paint_yak_wool() -> Image.Image:
    cell = blank_cell()
    paint_wool_puff(
        cell,
        light=(90, 80, 70),
        mid=(55, 48, 42),
        dark=(30, 26, 22),
        radius=10.0,
    )
    # shaggy tufts
    for x0, y0, x1, y1 in [
        (10, 20, 8, 10), (22, 20, 24, 11), (14, 22, 12, 13), (18, 22, 20, 12),
    ]:
        steps = max(abs(x1 - x0), abs(y1 - y0))
        for i in range(steps + 1):
            t = i / max(steps, 1)
            x = round(x0 + (x1 - x0) * t)
            y = round(y0 + (y1 - y0) * t)
            put(cell, x, y, (70, 62, 55))
    return cell


def paint_fur_patch(
    cell: Image.Image,
    *,
    light: tuple[int, int, int],
    mid: tuple[int, int, int],
    dark: tuple[int, int, int],
) -> None:
    for y in range(9, 24):
        for x in range(8, 24):
            if (x - 16) ** 2 + (y - 17) ** 2 <= 64:
                if y < 14:
                    put(cell, x, y, light)
                elif x < 13:
                    put(cell, x, y, dark)
                else:
                    put(cell, x, y, mid)
    # fur texture strokes
    for x, y, c in [
        (11, 12, dark), (14, 11, mid), (17, 10, light), (20, 12, mid),
        (22, 15, dark), (12, 17, mid), (15, 18, light), (19, 19, mid),
        (21, 21, dark), (13, 21, dark), (17, 22, mid),
    ]:
        put(cell, x, y, c)
        put(cell, x, y + 1, dark)


def paint_monkey_fur() -> Image.Image:
    cell = blank_cell()
    paint_fur_patch(
        cell,
        light=(160, 110, 65),
        mid=(120, 80, 45),
        dark=(75, 50, 28),
    )
    return cell


def paint_stolen_fruit() -> Image.Image:
    cell = blank_cell()
    # small colorful fruit cluster
    fruits = [
        (12, 18, 6, (220, 50, 45), (180, 30, 30)),   # red
        (18, 17, 5, (255, 200, 40), (210, 150, 20)),  # yellow
        (15, 21, 5, (90, 170, 55), (60, 130, 35)),    # green
        (20, 20, 4, (180, 70, 160), (140, 45, 120)), # purple
    ]
    for cx, cy, r, base, shadow in fruits:
        for y in range(cy - r, cy + r + 1):
            for x in range(cx - r, cx + r + 1):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                    put(cell, x, y, base if x >= cx else shadow)
        put(cell, cx, cy - r, (60, 120, 40))  # stem
    # tiny leaf
    put(cell, 13, 11, (50, 140, 45))
    put(cell, 14, 11, (70, 160, 55))
    put(cell, 13, 12, (40, 110, 35))
    return cell


def paint_chimp_fur() -> Image.Image:
    cell = blank_cell()
    paint_fur_patch(
        cell,
        light=(70, 55, 45),
        mid=(45, 35, 28),
        dark=(22, 18, 15),
    )
    return cell


def paint_knuckle_bone() -> Image.Image:
    cell = blank_cell()
    bone = (230, 220, 200)
    shadow = (165, 155, 135)
    light = (250, 245, 235)
    dark = (110, 100, 85)
    # thick knuckle with bulb ends
    for y in range(12, 22):
        for x in range(8, 24):
            put(cell, x, y, bone)
            if y == 12 or y == 21:
                put(cell, x, y, dark)
    for y in range(10, 24):
        for x in range(9, 13):
            if (x - 11) ** 2 + (y - 17) ** 2 <= 16:
                put(cell, x, y, light if y < 17 else bone)
    for y in range(10, 24):
        for x in range(19, 23):
            if (x - 21) ** 2 + (y - 17) ** 2 <= 16:
                put(cell, x, y, light if y < 17 else bone)
    # central knuckle ridge
    for x in range(13, 19):
        put(cell, x, 14, light)
        put(cell, x, 15, bone)
        put(cell, x, 19, shadow)
        put(cell, x, 20, shadow)
    put(cell, 8, 16, dark)
    put(cell, 23, 18, dark)
    return cell


PAINTERS = [
    ("00-horsehair.png", paint_horsehair),
    ("01-fine-hair.png", paint_fine_hair),
    ("02-coarse-hair.png", paint_coarse_hair),
    ("03-hoof.png", paint_hoof),
    ("04-llama-wool.png", paint_llama_wool),
    ("05-spit-sac.png", paint_spit_sac),
    ("06-soft-fleece.png", paint_soft_fleece),
    ("07-yak-wool.png", paint_yak_wool),
    ("08-monkey-fur.png", paint_monkey_fur),
    ("09-stolen-fruit.png", paint_stolen_fruit),
    ("10-chimp-fur.png", paint_chimp_fur),
    ("11-knuckle-bone.png", paint_knuckle_bone),
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
