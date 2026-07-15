import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Disease HUD / Pathology microbe sprite sheet (7×5 @ 64px = 448×320).
 * Rows 0–2: meat / flower microbes. Rows 3–4: mushroom toxin proteins (6 pad cells).
 *
 * @module components/world/health/domains/definingWorldPlazaEntityDiseaseSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-disease-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_COLUMN_COUNT = 7;
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_ROW_COUNT = 5;
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_CELL_SIZE_PX = 64;

/** Sprite sheet cell order (left→right, top→bottom; matches 7×5 art export). */
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS = [
  'salmonellosis',
  'chronic-wasting',
  'trichinellosis',
  'mad-cow',
  'liver-fluke',
  'sleeping-sickness',
  'wolf-fever',
  'bear-worm',
  'toxoplasmosis',
  'vibrio-infection',
  'feline-gut',
  'primate-fever',
  'equine-drowse',
  'scavenger-rot',
  'tusk-fluke',
  'cucco-rage',
  'pollen-fever',
  'petal-pox',
  'rootgut',
  'moonblight',
  'seedlung',
  'amatoxin-angel',
  'amatoxin-bell',
  'gyromitra-storm',
  'ghost-wing-fog',
  'parasol-purge',
  'lantern-gut',
  'bolete-bile',
  'yellow-stain-gut',
] as const satisfies readonly DefiningWorldPlazaEntityDiseaseId[];

const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_INDEX_BY_ID = new Map<
  DefiningWorldPlazaEntityDiseaseId,
  number
>(
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS.map(
    (diseaseId, index) => [diseaseId, index]
  )
);

/**
 * Resolves sprite crop for one disease id.
 */
export function resolvingWorldPlazaEntityDiseaseSpriteSheetIcon(
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_INDEX_BY_ID.get(diseaseId);

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex / DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}
