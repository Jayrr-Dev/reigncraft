#!/usr/bin/env python3
"""Process a generated sprite sheet into a transparent cell-packed WebP.

Usage (from repo root):
  python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \\
    --input path/to/generated.png \\
    --output public/inventory/sprites/name.webp \\
    --columns 5 --rows 1 --cell-size 32 --padding 2

  # High quality (64x64 cells, padding 4):
  python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \\
    --from-images icon0.png icon1.png icon2.png \\
    --output public/inventory/sprites/name.webp \\
    --columns 3 --rows 1 --high-quality --expected-occupied 3

  # Pack separate icon files into one sheet (more reliable equal cells):
  python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \\
    --from-images icon0.png icon1.png icon2.png \\
    --output public/inventory/sprites/name.webp \\
    --columns 3 --rows 1 --cell-size 32 --padding 2
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def removing_checkerboard_background(
    image: Image.Image,
    *,
    max_channel: int,
    max_saturation: float,
) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels: list[tuple[int, int, int, int]] = []

    for red, green, blue, alpha in rgba.getdata():
        maximum = max(red, green, blue)
        minimum = min(red, green, blue)
        saturation = (maximum - minimum) / maximum if maximum else 0.0
        if maximum > max_channel and saturation < max_saturation:
            pixels.append((red, green, blue, 0))
        else:
            pixels.append((red, green, blue, alpha))

    rgba.putdata(pixels)
    return rgba


def fitting_sprite_into_cell(
    sprite: Image.Image,
    *,
    cell_size: int,
    padding: int,
) -> Image.Image:
    cell = Image.new("RGBA", (cell_size, cell_size))
    bounds = sprite.getchannel("A").getbbox()
    if bounds is None:
        return cell

    cropped = sprite.crop(bounds)
    usable = max(1, cell_size - padding * 2)
    scale = min(usable / cropped.width, usable / cropped.height)
    target_size = (
        max(1, round(cropped.width * scale)),
        max(1, round(cropped.height * scale)),
    )
    resized = cropped.resize(target_size, Image.Resampling.NEAREST)
    position = (
        (cell_size - resized.width) // 2,
        (cell_size - resized.height) // 2,
    )
    cell.alpha_composite(resized, position)
    return cell


def packing_sprite_sheet_cells(
    image: Image.Image,
    *,
    columns: int,
    rows: int,
    cell_size: int,
    padding: int,
) -> tuple[Image.Image, list[str]]:
    sheet = Image.new("RGBA", (columns * cell_size, rows * cell_size))
    cell_width = image.width / columns
    cell_height = image.height / rows
    reports: list[str] = []

    for row in range(rows):
        for column in range(columns):
            left = round(column * cell_width)
            top = round(row * cell_height)
            right = round((column + 1) * cell_width)
            bottom = round((row + 1) * cell_height)
            source_cell = image.crop((left, top, right, bottom))
            packed = fitting_sprite_into_cell(
                source_cell, cell_size=cell_size, padding=padding
            )
            sheet.alpha_composite(packed, (column * cell_size, row * cell_size))
            occupied = packed.getchannel("A").getbbox() is not None
            reports.append(
                f"cell[{column},{row}]={'ok' if occupied else 'empty'}"
            )

    return sheet, reports


def packing_from_separate_images(
    image_paths: list[Path],
    *,
    columns: int,
    rows: int,
    cell_size: int,
    padding: int,
    remove_bg: bool,
    max_channel: int,
    max_saturation: float,
) -> tuple[Image.Image, list[str]]:
    capacity = columns * rows
    if len(image_paths) > capacity:
        raise SystemExit(
            f"Got {len(image_paths)} images but grid only holds {capacity}"
        )

    sheet = Image.new("RGBA", (columns * cell_size, rows * cell_size))
    reports: list[str] = []

    for index in range(capacity):
        column = index % columns
        row = index // columns
        if index >= len(image_paths):
            reports.append(f"cell[{column},{row}]=empty")
            continue

        image = Image.open(image_paths[index]).convert("RGBA")
        if remove_bg:
            image = removing_checkerboard_background(
                image,
                max_channel=max_channel,
                max_saturation=max_saturation,
            )
        packed = fitting_sprite_into_cell(
            image, cell_size=cell_size, padding=padding
        )
        sheet.alpha_composite(packed, (column * cell_size, row * cell_size))
        occupied = packed.getchannel("A").getbbox() is not None
        reports.append(f"cell[{column},{row}]={'ok' if occupied else 'empty'}")

    return sheet, reports


def validating_sheet(
    sheet: Image.Image,
    *,
    columns: int,
    rows: int,
    cell_size: int,
    expected_occupied: int | None,
) -> None:
    expected_width = columns * cell_size
    expected_height = rows * cell_size
    if sheet.width != expected_width or sheet.height != expected_height:
        raise SystemExit(
            f"Bad sheet size {sheet.width}x{sheet.height}; "
            f"expected {expected_width}x{expected_height}"
        )

    occupied = 0
    for row in range(rows):
        for column in range(columns):
            cell = sheet.crop(
                (
                    column * cell_size,
                    row * cell_size,
                    (column + 1) * cell_size,
                    (row + 1) * cell_size,
                )
            )
            if cell.getchannel("A").getbbox() is not None:
                occupied += 1

    if expected_occupied is not None and occupied != expected_occupied:
        raise SystemExit(
            f"Expected {expected_occupied} occupied cells, found {occupied}"
        )


def parsing_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Remove bg, pack equal cells, export sprite sheet WebP."
    )
    parser.add_argument("--input", type=Path)
    parser.add_argument(
        "--from-images",
        nargs="+",
        type=Path,
        help="Separate icon files packed left-to-right, top-to-bottom.",
    )
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows", type=int, default=3)
    parser.add_argument(
        "--cell-size",
        type=int,
        default=None,
        help="Cell edge in px. Default 32, or 64 with --high-quality.",
    )
    parser.add_argument(
        "--padding",
        type=int,
        default=None,
        help="Inner cell padding in px. Default 2, or 4 with --high-quality.",
    )
    parser.add_argument(
        "--high-quality",
        action="store_true",
        help="Use 64x64 cells and padding 4 (unless --cell-size/--padding set).",
    )
    parser.add_argument("--bg-max", type=int, default=200)
    parser.add_argument("--bg-saturation", type=float, default=0.08)
    parser.add_argument(
        "--no-bg-remove",
        action="store_true",
        help="Skip checkerboard punch-out.",
    )
    parser.add_argument(
        "--keep-png",
        action="store_true",
        help="Also write a sibling .png next to the WebP output.",
    )
    parser.add_argument(
        "--expected-occupied",
        type=int,
        help="Fail if occupied cell count does not match.",
    )
    return parser.parse_args()


def resolving_cell_size_and_padding(args: argparse.Namespace) -> tuple[int, int]:
    """Resolve cell size + padding from flags (high-quality → 64 / 4)."""
    cell_size = (
        args.cell_size
        if args.cell_size is not None
        else (64 if args.high_quality else 32)
    )
    padding = (
        args.padding
        if args.padding is not None
        else (4 if args.high_quality else 2)
    )
    return cell_size, padding


def main() -> None:
    args = parsing_args()
    if args.columns < 1 or args.rows < 1:
        raise SystemExit("columns and rows must be >= 1")

    cell_size, padding = resolving_cell_size_and_padding(args)
    if cell_size < 1:
        raise SystemExit("cell-size must be >= 1")
    if padding < 0:
        raise SystemExit("padding must be >= 0")
    if padding * 2 >= cell_size:
        raise SystemExit("padding too large for cell-size")
    if cell_size not in (32, 64):
        print(
            f"warning: cell-size {cell_size} is unusual; prefer 32 or 64",
            flush=True,
        )
    if bool(args.input) == bool(args.from_images):
        raise SystemExit("Provide exactly one of --input or --from-images")

    remove_bg = not args.no_bg_remove

    if args.from_images:
        for path in args.from_images:
            if not path.is_file():
                raise SystemExit(f"Input not found: {path}")
        sheet, reports = packing_from_separate_images(
            args.from_images,
            columns=args.columns,
            rows=args.rows,
            cell_size=cell_size,
            padding=padding,
            remove_bg=remove_bg,
            max_channel=args.bg_max,
            max_saturation=args.bg_saturation,
        )
        expected_occupied = args.expected_occupied
        if expected_occupied is None:
            expected_occupied = len(args.from_images)
    else:
        if args.input is None or not args.input.is_file():
            raise SystemExit(f"Input not found: {args.input}")
        image = Image.open(args.input).convert("RGBA")
        if remove_bg:
            image = removing_checkerboard_background(
                image,
                max_channel=args.bg_max,
                max_saturation=args.bg_saturation,
            )
        sheet, reports = packing_sprite_sheet_cells(
            image,
            columns=args.columns,
            rows=args.rows,
            cell_size=cell_size,
            padding=padding,
        )
        expected_occupied = args.expected_occupied

    validating_sheet(
        sheet,
        columns=args.columns,
        rows=args.rows,
        cell_size=cell_size,
        expected_occupied=expected_occupied,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.output, "WEBP", lossless=True, method=6)

    if args.keep_png:
        sheet.save(args.output.with_suffix(".png"))

    quality_label = "high-quality" if cell_size >= 64 else "standard"
    print(
        f"{args.output}: {sheet.width}x{sheet.height}, "
        f"{args.columns}x{args.rows} cells @ {cell_size}px "
        f"(padding {padding}, {quality_label})"
    )
    print("; ".join(reports))


if __name__ == "__main__":
    main()
