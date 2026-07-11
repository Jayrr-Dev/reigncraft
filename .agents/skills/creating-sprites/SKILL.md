---
name: creating-sprites
description: >-
  Generate, clean, resize, validate, and export pixel-art sprite sheets as
  transparent lossless WebP for any grid size (4x3, 5x1, 3x3, etc.). Use when
  creating inventory icons, loot sprites, bag icons, meat sheets, item atlases,
  or when the user asks to generate sprites, inspect a sprite sheet, pack equal
  32x32 cells, remove backgrounds, or convert sprites to WebP.
---

# Creating sprites

Pipeline: pick grid → generate equal-cell art → remove bg → pack 32×32 → **inspect** → WebP → optional inventory wire-up.

## Hard requirements (32×32 inventory sheets)

Industry / engine rules this project follows:

| Rule              | Requirement                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cell size         | Every frame is exactly **32×32 px**                                                                                                                                        |
| Sheet size        | Exactly `columns * 32` by `rows * 32`                                                                                                                                      |
| Spacing           | **0 px** gap between cells (tight grid)                                                                                                                                    |
| Alignment         | Regular grid, left→right, top→bottom                                                                                                                                       |
| Filter            | Nearest-neighbor only (no bilinear)                                                                                                                                        |
| Background        | True RGBA transparency (no checkerboard)                                                                                                                                   |
| Uniform footprint | Each icon’s opaque bounds fit inside its cell with similar max height/width (~70–90% of cell). Tier “size” is shown by **silhouette detail**, not by blowing past the cell |
| No bleed          | No pixel of icon A in cell B                                                                                                                                               |

If generated art has uneven spacing or wildly different bounding boxes, **do not ship**. Regenerate or pack from separate equal icons.

## Defaults

| Setting               | Value                                       |
| --------------------- | ------------------------------------------- |
| Cell size             | **32×32 px**                                |
| Padding inside cell   | **2 px** (keeps outline clear of cell edge) |
| Export                | lossless WebP (`method=6`)                  |
| Preferred when N = 12 | **4×3**                                     |

## Picking a grid

1. Count icons `N`.
2. If user names a grid, use that.
3. Else:

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
- [ ] 1. Confirm subject list + grid (C×R)
- [ ] 2. Generate equal-cell art (sheet OR separate icons)
- [ ] 3. Process with script (--expected-occupied N)
- [ ] 4. Inspect output with Read tool (mandatory)
- [ ] 5. Fix / regenerate if inspect fails
- [ ] 6. Ship WebP under public/
- [ ] 7. Wire inventory only if asked
```

### 1. Confirm list + grid

Order is left→right, top→bottom. Record `C`, `R`, `N`.

### 2. Generate

**Preferred for small N (≤8):** generate **one icon per image**, same style, then pack with `--from-images`. Equal cells are much more reliable.

**Sheet mode:** one image with explicit equal cells:

- “Exactly N icons in a clean **C×R** grid”
- “Every cell is the **same square size**”
- “Each icon centered in its cell”
- “All icons share roughly the **same bounding-box height** (~80% of cell)”
- “Size tiers use detail/straps/pockets, **not** making later icons much taller”
- “No overlapping, no text, no UI, transparent background”

Do not ship the raw generator PNG.

### 3. Process

```bash
# From one sheet
python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \
  --input "PATH/generated.png" \
  --output "public/.../NAME.webp" \
  --columns C --rows R --cell-size 32 --padding 2 \
  --expected-occupied N

# From separate icons (recommended for bags / tools)
python .agents/skills/creating-sprites/scripts/processing_sprite_sheet.py \
  --from-images a.png b.png c.png d.png e.png \
  --output "public/inventory/sprites/inventory-bag-sprites.webp" \
  --columns 5 --rows 1 --cell-size 32 --padding 2 \
  --expected-occupied 5
```

Script validates final size is `C*32 × R*32` and occupied cell count.

### 4. Inspect (mandatory)

After writing the WebP, verify with code **and** the image Read tool:

```bash
python -c "from PIL import Image; i=Image.open('PATH.webp'); print(i.size, i.mode)"
# must print (C*32, R*32) RGBA
```

Also build a temporary checkerboard + magenta grid preview (4× nearest upscale), Read that preview, then delete it. Transparent pixels often look black in plain previews; checkerboard is required.

Inspect checklist:

- [ ] Size is exactly `C*32 × R*32`
- [ ] Magenta grid shows equal square cells
- [ ] Count of icons matches `N` (empty pad cells OK)
- [ ] No icon cut off / no bleed across cell lines
- [ ] Similar fill per cell (~0.6–0.85 of cell area)
- [ ] True alpha outside icons (corners alpha 0)

Fail any box → regenerate or re-pack. Do not ship.

### 5–6. Ship

Prefer WebP only under the right `public/` folder:

- Meat / creature loot → `public/creatures/sprites/loot/`
- Inventory bags / UI items → `public/inventory/sprites/`

### 7. Wire inventory (only when asked)

Map item ids → `{ spriteSheetUrl, columnCount, rowCount, columnIndex, rowIndex }`.

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

## Example

Bags (5): generate five equal icons → pack `5×1` → inspect → `public/inventory/sprites/inventory-bag-sprites.webp` → wire bag registry.
