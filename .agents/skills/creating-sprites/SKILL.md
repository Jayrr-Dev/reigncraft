---
name: creating-sprites
description: >-
  Generate, clean, resize, validate, and export pixel-art sprite sheets as
  transparent lossless WebP for any grid size (4x3, 5x1, 3x3, etc.). Use when
  creating inventory icons, loot sprites, bag icons, meat sheets, item atlases,
  or when the user asks to generate sprites, inspect a sprite sheet, pack equal
  32x32 or 64x64 cells, remove backgrounds, convert sprites to WebP, or requests
  high quality / HQ / 64px sprites.
---

# Creating sprites

Pipeline: pick grid → pick cell size → generate equal-cell art → remove bg → pack → **inspect** → WebP → optional inventory wire-up.

## Cell size (quality)

| Mode                   | Trigger phrases                                                       | Cell size | Padding  | Sheet size    |
| ---------------------- | --------------------------------------------------------------------- | --------- | -------- | ------------- |
| **Standard** (default) | (none) / `32` / `standard`                                            | **32×32** | **2 px** | `C*32 × R*32` |
| **High quality**       | `high quality`, `hq`, `64`, `64x`, `64px`, `hi-res`, `--high-quality` | **64×64** | **4 px** | `C*64 × R*64` |

Rules:

1. Default stays **32×32** (inventory / HUD density).
2. When user says **high quality** (or synonyms above), use **64×64** + padding **4**.
3. Explicit `--cell-size` / `--padding` always win over the quality preset.
4. Record the chosen cell size in the progress checklist before generate/pack.
5. Inspect math uses the chosen cell size (`C*cell × R*cell`), not hard-coded 32.

Prefer 32 for toolbar / bag slots. Prefer 64 for cookbook pages, dialog art glyphs, or anything shown large on screen.

## Hard requirements (equal-cell sheets)

Industry / engine rules this project follows:

| Rule              | Requirement                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cell size         | Every frame is exactly **S×S px** where `S` is 32 (standard) or 64 (high quality)                                                                                          |
| Sheet size        | Exactly `columns * S` by `rows * S`                                                                                                                                        |
| Spacing           | **0 px** gap between cells (tight grid)                                                                                                                                    |
| Alignment         | Regular grid, left→right, top→bottom                                                                                                                                       |
| Filter            | Nearest-neighbor only (no bilinear)                                                                                                                                        |
| Background        | True RGBA transparency (no checkerboard)                                                                                                                                   |
| Uniform footprint | Each icon’s opaque bounds fit inside its cell with similar max height/width (~70–90% of cell). Tier “size” is shown by **silhouette detail**, not by blowing past the cell |
| No bleed          | No pixel of icon A in cell B                                                                                                                                               |

If generated art has uneven spacing or wildly different bounding boxes, **do not ship**. Regenerate or pack from separate equal icons.

## Defaults

| Setting               | Value                                         |
| --------------------- | --------------------------------------------- |
| Cell size             | **32×32 px** (or **64×64** when high quality) |
| Padding inside cell   | **2 px** (or **4 px** when high quality)      |
| Export                | lossless WebP (`method=6`)                    |
| Preferred when N = 12 | **4×3**                                       |

## Picking a grid

1. Count icons `N`.
2. Pick cell size (32 default, 64 if high quality).
3. If user names a grid, use that.
4. Else:

| N     | Default C×R                                |
| ----- | ------------------------------------------ |
| 1–4   | `N×1`                                      |
| 5     | prefer **`5×1`** (or `3×2` with one empty) |
| 6–8   | `4×2` (pad) or `N×1`                       |
| 9     | `3×3`                                      |
| 10–12 | `4×3` (pad if needed)                      |
| 13–16 | `4×4`                                      |

## Workflow

```
Sprite Progress:
- [ ] 1. Confirm subject list + grid (C×R) + cell size (32 or 64)
- [ ] 2. Generate equal-cell art (sheet OR separate icons)
- [ ] 3. Process with script (--expected-occupied N; --high-quality if 64)
- [ ] 4. Inspect output with Read tool (mandatory)
- [ ] 5. Fix / regenerate if inspect fails
- [ ] 6. Ship WebP under public/
- [ ] 7. Wire inventory only if asked
```

### 1. Confirm list + grid + quality

Order is left→right, top→bottom. Record `C`, `R`, `N`, and `S` (32 or 64).

### 2. Generate

**Preferred for small N (≤8):** generate **one icon per image**, same style, then pack with `--from-images`. Equal cells are much more reliable.

**Sheet mode:** one image with explicit equal cells:

- “Exactly N icons in a clean **C×R** grid”
- “Every cell is the **same square size**”
- “Each icon centered in its cell”
- “All icons share roughly the **same bounding-box height** (~80% of cell)”
- “Size tiers use detail/straps/pockets, **not** making later icons much taller”
- “No overlapping, no text, no UI, transparent background”
- For high quality: ask the generator for **sharper pixel detail** that still reads after nearest-neighbor pack into 64×64 (more silhouette detail, not blur)

Do not ship the raw generator PNG.

### 3. Process

```bash
# Standard 32px — from one sheet
python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \
  --input "PATH/generated.png" \
  --output "public/.../NAME.webp" \
  --columns C --rows R --cell-size 32 --padding 2 \
  --expected-occupied N

# High quality 64px — separate icons (recommended)
python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \
  --from-images a.png b.png c.png \
  --output "public/inventory/sprites/inventory-cookbook-page-sprites.webp" \
  --columns 3 --rows 1 --high-quality \
  --expected-occupied 3

# Explicit 64 (same as --high-quality defaults)
python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \
  --from-images a.png b.png c.png d.png e.png \
  --output "public/inventory/sprites/inventory-bag-sprites.webp" \
  --columns 5 --rows 1 --cell-size 64 --padding 4 \
  --expected-occupied 5
```

Script validates final size is `C*S × R*S` and occupied cell count. `--high-quality` sets `S=64` and padding `4` unless `--cell-size` / `--padding` override.

### 4. Inspect (mandatory)

After writing the WebP, verify with code **and** the image Read tool:

```bash
python -c "from PIL import Image; i=Image.open('PATH.webp'); print(i.size, i.mode)"
# must print (C*S, R*S) RGBA  — S is 32 or 64
```

Also build a temporary checkerboard + magenta grid preview (4× nearest upscale for 32, or **2×–3×** for 64 so the preview stays readable), Read that preview, then delete it. Transparent pixels often look black in plain previews; checkerboard is required.

Inspect checklist:

- [ ] Size is exactly `C*S × R*S`
- [ ] Magenta grid shows equal square cells of size `S`
- [ ] Count of icons matches `N` (empty pad cells OK)
- [ ] No icon cut off / no bleed across cell lines
- [ ] Similar fill per cell (~0.6–0.85 of cell area)
- [ ] True alpha outside icons (corners alpha 0)

Fail any box → regenerate or re-pack. Do not ship.

### 5–6. Ship

Prefer WebP only under the right `public/` folder:

- Meat / creature loot → `public/creatures/sprites/loot/`
- Inventory bags / UI items → `public/inventory/sprites/`

Optional filename hint for high quality: `*-hq.webp` or keep the normal name and document `cellSize: 64` at the call site.

### 7. Wire inventory (only when asked)

Map item ids → `{ spriteSheetUrl, columnCount, rowCount, columnIndex, rowIndex }`.

When the sheet is 64×64 cells, the CSS glyph still crops by column/row fraction (`background-size: C*100% R*100%`). Slot DOM size can stay 32 CSS px (downscale with `image-rendering: pixelated`) or grow for dialogs.

```
columnIndex = index % columns
rowIndex = floor(index / columns)
```

Glyph renderer uses CSS background crop. Keep Iconify as fallback.

## Anti-patterns

- Shipping generator output without inspect
- Uneven free-floating icons on a strip (not a grid)
- Encoding “bigger bag” as a much larger sprite footprint
- Bilinear upscale
- Wrong `--columns` / `--rows` for the art
- Assuming every sheet is 4×3
- Assuming every sheet is 32×32 (check quality mode)
- Using `--high-quality` then hard-coding inspect as `(C*32, R*32)`

## Example

Bags (5): generate five equal icons → pack `5×1` @ 32 → inspect → `public/inventory/sprites/inventory-bag-sprites.webp` → wire bag registry.

Cookbook pages (3, high quality): generate three page icons → pack `3×1 --high-quality` → inspect `(192, 64)` → `public/inventory/sprites/inventory-cookbook-page-sprites.webp`.
