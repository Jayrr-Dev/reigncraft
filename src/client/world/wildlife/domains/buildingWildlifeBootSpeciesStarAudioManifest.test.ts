import { describe, expect, it } from 'vitest';

import { buildingWildlifeBootSpeciesStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeBootSpeciesStarAudioManifest';
import { listingWildlifeBootPreloadSpeciesIds } from '@/components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures';
import {
  listingWildlifeSpeciesSfxClipIdsForSpecies,
  listingWildlifeSpeciesSfxClipIdsForSpeciesIds,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';
import { resolvingWildlifeSpeciesSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxStarAudioId';

describe('listingWildlifeSpeciesSfxClipIdsForSpecies', () => {
  it('includes cow idle and combat clips but not unrelated species pools', () => {
    const clipIds = listingWildlifeSpeciesSfxClipIdsForSpecies('cow');

    expect(clipIds).toContain('cow_moo_01');
    expect(clipIds).not.toContain('sheep_baa_01');
    expect(clipIds).not.toContain('pixabay_tiger_roar_loud_01');
  });

  it('includes both chicken cluck and rooster crow pools', () => {
    const clipIds = listingWildlifeSpeciesSfxClipIdsForSpecies('chicken');

    expect(clipIds.some((clipId) => clipId.startsWith('chicken_cluck_'))).toBe(
      true
    );
    expect(clipIds.some((clipId) => clipId.startsWith('rooster_crow_'))).toBe(
      true
    );
  });

  it('skips idle clips for turtle but keeps hit_taken hiss', () => {
    const clipIds = listingWildlifeSpeciesSfxClipIdsForSpecies('turtle');

    expect(clipIds).toContain('pixabay_reptile_hiss_01');
    expect(clipIds).not.toContain('cow_moo_01');
  });
});

describe('listingWildlifeSpeciesSfxClipIdsForSpeciesIds', () => {
  it('dedupes clip ids across species', () => {
    const clipIds = listingWildlifeSpeciesSfxClipIdsForSpeciesIds([
      'cow',
      'cow',
      'sheep',
    ]);

    expect(new Set(clipIds).size).toBe(clipIds.length);
    expect(clipIds).toContain('cow_moo_01');
    expect(clipIds).toContain('sheep_baa_01');
  });
});

describe('buildingWildlifeBootSpeciesStarAudioManifest', () => {
  it('registers every boot-roster vocal clip with star-audio ids', () => {
    const manifest = buildingWildlifeBootSpeciesStarAudioManifest();
    const expectedClipIds = listingWildlifeSpeciesSfxClipIdsForSpeciesIds(
      listingWildlifeBootPreloadSpeciesIds()
    );

    expect(Object.keys(manifest).length).toBe(expectedClipIds.length);

    for (const clipId of expectedClipIds) {
      expect(manifest[resolvingWildlifeSpeciesSfxStarAudioId(clipId)]).toEqual({
        group: 'sfx',
        src: expect.stringContaining('/sfx/'),
      });
    }
  });

  it('excludes vocals for species outside the boot biomes', () => {
    const manifest = buildingWildlifeBootSpeciesStarAudioManifest();

    expect(
      manifest[resolvingWildlifeSpeciesSfxStarAudioId('mixkit_lion_roar_01')]
    ).toBeUndefined();
  });
});
