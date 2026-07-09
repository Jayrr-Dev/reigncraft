import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_SPRITE_SHEET_FRAME_HEIGHT_BY_FOLDER,
  resolvingWildlifeSpriteSheetFrameHeightPx,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetFrameHeightByFolder';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeSpriteSheetFrameHeightPx', () => {
  it('covers every registered species sprite folder', () => {
    for (const species of Object.values(DEFINING_WILDLIFE_SPECIES_REGISTRY)) {
      expect(
        DEFINING_WILDLIFE_SPRITE_SHEET_FRAME_HEIGHT_BY_FOLDER[
          species.spriteFolder
        ],
        `missing frame height for folder ${species.spriteFolder} (${species.speciesId})`
      ).toBeTypeOf('number');
    }
  });

  it('returns the measured height for known folders', () => {
    expect(resolvingWildlifeSpriteSheetFrameHeightPx('ELITE Wolf')).toBe(96);
    expect(resolvingWildlifeSpriteSheetFrameHeightPx('Grey Wolf')).toBe(64);
    expect(resolvingWildlifeSpriteSheetFrameHeightPx('Elephant')).toBe(128);
  });

  it('falls back to 84 for unknown folders', () => {
    expect(resolvingWildlifeSpriteSheetFrameHeightPx('Missing Folder')).toBe(
      84
    );
  });
});
