import { listingWorldPlazaEntityDiseaseDescriptors } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS,
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_ROW_COUNT,
  resolvingWorldPlazaEntityDiseaseSpriteSheetIcon,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseSpriteSheetConstants';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaEntityDiseaseSpriteSheetConstants', () => {
  it('maps each sheet id to a unique in-bounds cell', () => {
    const registeredIds = new Set(
      listingWorldPlazaEntityDiseaseDescriptors().map(
        (descriptor) => descriptor.id
      )
    );
    const cellCapacity =
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_COLUMN_COUNT *
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_ROW_COUNT;

    expect(DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS).toHaveLength(
      cellCapacity
    );

    const seenCells = new Set<string>();

    for (const diseaseId of DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS) {
      expect(registeredIds.has(diseaseId)).toBe(true);

      const sprite = resolvingWorldPlazaEntityDiseaseSpriteSheetIcon(diseaseId);
      expect(sprite).not.toBeNull();
      if (!sprite) {
        continue;
      }

      expect(sprite.columnCount).toBe(
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_COLUMN_COUNT
      );
      expect(sprite.rowCount).toBe(
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_ROW_COUNT
      );
      expect(sprite.columnIndex).toBeGreaterThanOrEqual(0);
      expect(sprite.columnIndex).toBeLessThan(sprite.columnCount);
      expect(sprite.rowIndex).toBeGreaterThanOrEqual(0);
      expect(sprite.rowIndex).toBeLessThan(sprite.rowCount);

      const cellKey = `${sprite.columnIndex},${sprite.rowIndex}`;
      expect(seenCells.has(cellKey)).toBe(false);
      seenCells.add(cellKey);
    }
  });
});
