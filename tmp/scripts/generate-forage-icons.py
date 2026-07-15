#!/usr/bin/env python3
"""Generate extended forage berry and leaf inventory icons."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

KEY = (122, 122, 122)
SIZE = 32
PADDING = 2
OUT = Path("tmp/sprites/forage-icons")


def cell() -> Image.Image:
    return Image.new("RGB", (SIZE, SIZE), KEY)


def berry(
    body: tuple[int, int, int],
    *,
    highlight: tuple[int, int, int] = (255, 255, 255),
    stem: bool = True,
    cluster: int = 1,
) -> Image.Image:
    img = cell()
    draw = ImageDraw.Draw(img)
    cx, cy = SIZE // 2, SIZE // 2 + 1
    if cluster == 1:
        draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=body)
        draw.ellipse((cx - 3, cy - 4, cx - 1, cy - 2), fill=highlight)
    elif cluster == 3:
        for ox, oy in [(-4, 2), (4, 2), (0, -3)]:
            draw.ellipse(
                (cx + ox - 4, cy + oy - 4, cx + ox + 4, cy + oy + 4), fill=body
            )
    else:
        for ox, oy in [(-5, 0), (0, -4), (5, 0), (0, 4)]:
            draw.ellipse(
                (cx + ox - 3, cy + oy - 3, cx + ox + 3, cy + oy + 3), fill=body
            )
    if stem:
        draw.line((cx, cy - 7, cx + 1, cy - 11), fill=(58, 92, 42), width=1)
    return img


def leaf(
    fill: tuple[int, int, int],
    *,
    veins: bool = True,
    spines: bool = False,
    oval: bool = False,
) -> Image.Image:
    img = cell()
    draw = ImageDraw.Draw(img)
    if oval:
        draw.ellipse((9, 10, 23, 24), fill=fill)
    else:
        draw.polygon([(16, 6), (24, 14), (22, 26), (10, 26), (8, 14)], fill=fill)
    if veins:
        draw.line((16, 8, 16, 24), fill=(40, 70, 30))
        draw.line((16, 14, 11, 18), fill=(40, 70, 30))
        draw.line((16, 14, 21, 18), fill=(40, 70, 30))
    if spines:
        for x in range(10, 23, 3):
            draw.line((x, 12, x - 1, 10), fill=(220, 220, 220))
    return img


BERRIES = [
    ("cranberry", berry((168, 28, 48))),
    ("blackberry", berry((48, 24, 72), cluster=3)),
    ("raspberry", berry((214, 58, 88), cluster=4)),
    ("bilberry", berry((34, 24, 58))),
    ("juniper", berry((52, 84, 128), highlight=(140, 180, 220))),
    ("sea_buckthorn", berry((238, 148, 28), highlight=(255, 220, 120))),
    ("yew_aril", berry((210, 32, 48), stem=False)),
    ("wolfberry", berry((188, 42, 52), highlight=(240, 120, 80))),
    ("lotus_fruit", berry((236, 220, 196), highlight=(255, 255, 255))),
]

LEAVES = [
    ("nettle", leaf((72, 118, 48), spines=True)),
    ("lemon_balm", leaf((118, 168, 72))),
    ("sage", leaf((108, 128, 98))),
    ("mugwort", leaf((138, 148, 108))),
    ("bay_laurel", leaf((58, 98, 48), oval=True)),
    ("holly", leaf((28, 78, 42), spines=True)),
    ("mistletoe", leaf((168, 188, 118), oval=True)),
    ("olive", leaf((98, 118, 72), oval=True)),
    ("moly", leaf((236, 236, 220))),
]


def main() -> None:
    berry_dir = OUT / "berries"
    leaf_dir = OUT / "leaves"
    berry_dir.mkdir(parents=True, exist_ok=True)
    leaf_dir.mkdir(parents=True, exist_ok=True)

    for name, icon in BERRIES:
        icon.save(berry_dir / f"{name}.png")

    for name, icon in LEAVES:
        icon.save(leaf_dir / f"{name}.png")

    print("Wrote", len(BERRIES), "berries and", len(LEAVES), "leaves to", OUT)


if __name__ == "__main__":
    main()
