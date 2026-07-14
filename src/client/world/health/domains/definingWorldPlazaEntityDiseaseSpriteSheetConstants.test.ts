import { listingWorldPlazaEntityDiseaseDescriptors } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS,
  resolvingWorldPlazaEntityDiseaseSpriteSheetIcon,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseSpriteSheetConstants';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaEntityDiseaseSpriteSheetConstants', () => {
  it('covers every registered disease with a unique sheet cell', () => {
    const registeredIds = listingWorldPlazaEntityDiseaseDescriptors().map(
      (descriptor) => descriptor.id
    );

    expect(
      [...DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS].sort()
    ).toEqual([...registeredIds].sort());

    const seenCells = new Set<string>();

    for (const diseaseId of DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SPRITE_SHEET_IDS) {
      const sprite = resolvingWorldPlazaEntityDiseaseSpriteSheetIcon(diseaseId);
      expect(sprite).not.toBeNull();
      if (!sprite) {
        continue;
      }

      const cellKey = `${sprite.columnIndex},${sprite.rowIndex}`;
      expect(seenCells.has(cellKey)).toBe(false);
      seenCells.add(cellKey);
    }
  });
});
