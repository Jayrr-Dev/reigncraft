/**
 * Spritcore inventory glyph sheet (4×1 @ 32px, weakest → strongest).
 * Color cycles reuse these cells with a CSS mask overlay.
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import type { DefiningWorldPlazaSpritcoreOrbStepId } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants';

export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-spritcore-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ROW_COUNT = 1;

/** Default panel/HUD glyph (bright violet orb). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ICON =
  resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep(2);

/** Resolves the 32px sprite-sheet cell for one orb step (1–4). */
export function resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep(
  orbStep: DefiningWorldPlazaSpritcoreOrbStepId
): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ROW_COUNT,
    columnIndex: orbStep - 1,
    rowIndex: 0,
  };
}
