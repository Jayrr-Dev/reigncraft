#!/usr/bin/env python3
"""Split generated survival row strips and pack inventory + world utility WebPs."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "tmp" / "survival-sprites" / "source"
TMP = ROOT / "tmp" / "survival-sprites"
PROCESSING = (
    ROOT / ".agents" / "skills" / "creating-sprites" / "scripts" / "processing_sprite_sheet.py"
)

ROW_FILES = [
    ("survival-row-01-wear.png", 5),
    ("survival-row-02-wear.png", 5),
    ("survival-row-03-mats.png", 5),
    ("survival-row-04-mats.png", 4),
]

ITEM_SLUGS = [
    "straw-sun-hat",
    "wool-neck-wrap",
    "frost-glare-lenses",
    "swamp-mesh-veil",
    "hide-trail-vest",
    "fur-shoulder-cape",
    "palm-leaf-poncho",
    "bark-bracers",
    "fingerless-work-mitts",
    "cloth-leg-wraps",
    "hide-trail-boots",
    "split-planks",
    "wattle-panel",
    "adobe-brick",
    "rope-coil",
    "peg-stake-pack",
    "reed-mat",
    "clay-daub-mix",
    "lashing-twine-spool",
]

WORLD_FILES = [
    ("survival-world-shade-lean-to.png", "survival-shade-lean-to.webp"),
    ("survival-world-brush-windbreak.png", "survival-brush-windbreak.webp"),
    ("survival-world-scout-tent.png", "survival-scout-tent.webp"),
    ("survival-world-claim-bedroll.png", "survival-claim-bedroll.webp"),
    ("survival-world-smoke-rack.png", "survival-smoke-rack.webp"),
]

KEY_RGB = (122, 122, 122)
KEY_TOLERANCE = 18
TARGET_WORLD_PX = 96


def removing_key_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels: list[tuple[int, int, int, int]] = []
    for red, green, blue, alpha in rgba.getdata():
        if (
            abs(red - KEY_RGB[0]) <= KEY_TOLERANCE
            and abs(green - KEY_RGB[1]) <= KEY_TOLERANCE
            and abs(blue - KEY_RGB[2]) <= KEY_TOLERANCE
        ):
            pixels.append((red, green, blue, 0))
        else:
            pixels.append((red, green, blue, alpha))
    rgba.putdata(pixels)
    return rgba


def splitting_row_strip(row_path: Path, occupied_cells: int, start_index: int) -> list[Path]:
    image = Image.open(row_path).convert("RGBA")
    width, height = image.size
    cell_width = width // 5
    outputs: list[Path] = []

    for column in range(occupied_cells):
        cell = image.crop(
            (column * cell_width, 0, (column + 1) * cell_width, height)
        )
        slug = ITEM_SLUGS[start_index + column]
        out_path = TMP / f"{start_index + column + 1:02d}-survival-{slug}.png"
        cell.save(out_path)
        outputs.append(out_path)

    return outputs


def packing_inventory_sheet(cell_paths: list[Path]) -> None:
    subprocess.run(
        [
            sys.executable,
            str(PROCESSING),
            *("--from-images", *[str(path) for path in cell_paths]),
            "--output",
            str(ROOT / "public" / "inventory" / "sprites" / "inventory-survival-sprites.webp"),
            "--columns",
            "5",
            "--rows",
            "4",
            "--cell-size",
            "32",
            "--padding",
            "2",
            "--expected-occupied",
            "19",
        ],
        check=True,
    )


def packing_shelter_recipe_sheet(world_webp_paths: list[Path]) -> None:
    subprocess.run(
        [
            sys.executable,
            str(PROCESSING),
            *("--from-images", *[str(path) for path in world_webp_paths]),
            "--output",
            str(
                ROOT
                / "public"
                / "inventory"
                / "sprites"
                / "inventory-survival-shelter-sprites.webp"
            ),
            "--columns",
            "5",
            "--rows",
            "1",
            "--cell-size",
            "32",
            "--padding",
            "2",
            "--expected-occupied",
            "5",
        ],
        check=True,
    )


def processing_world_utility(source_name: str, output_name: str) -> Path:
    source = ASSETS / source_name
    output = ROOT / "public" / "environment" / "sprites" / "utilities" / output_name
    image = removing_key_background(Image.open(source))
    width, height = image.size
    scale = TARGET_WORLD_PX / max(width, height)
    resized = image.resize(
        (max(1, round(width * scale)), max(1, round(height * scale))),
        Image.Resampling.NEAREST,
    )
    canvas = Image.new("RGBA", (TARGET_WORLD_PX, TARGET_WORLD_PX), (0, 0, 0, 0))
    offset_x = (TARGET_WORLD_PX - resized.width) // 2
    offset_y = TARGET_WORLD_PX - resized.height
    canvas.paste(resized, (offset_x, offset_y), resized)
    canvas.save(output, format="WEBP", lossless=True, method=6)
    return output


def main() -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    cell_paths: list[Path] = []
    index = 0

    for row_name, occupied in ROW_FILES:
        row_path = ASSETS / row_name
        if not row_path.exists():
            raise FileNotFoundError(row_path)
        cell_paths.extend(splitting_row_strip(row_path, occupied, index))
        index += occupied

    packing_inventory_sheet(cell_paths)

    recipe_icon_sources: list[Path] = []
    for source_name, output_name in WORLD_FILES:
        world_path = processing_world_utility(source_name, output_name)
        icon_path = TMP / f"recipe-icon-{output_name.replace('.webp', '.png')}"
        icon_image = Image.open(world_path).convert("RGBA")
        icon_image = icon_image.resize((32, 32), Image.Resampling.NEAREST)
        icon_image.save(icon_path)
        recipe_icon_sources.append(icon_path)

    packing_shelter_recipe_sheet(recipe_icon_sources)

    inventory = Image.open(
        ROOT / "public" / "inventory" / "sprites" / "inventory-survival-sprites.webp"
    )
    print(f"inventory-survival-sprites.webp {inventory.size} {inventory.mode}")


if __name__ == "__main__":
    main()
