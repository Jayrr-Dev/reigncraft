import {
  buildingWorldPlazaBiomeMusicStarAudioManifest,
  buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds,
} from '@/components/world/domains/buildingWorldPlazaBiomeMusicStarAudioManifest';
import { resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind';
import { describe, expect, it } from 'vitest';

describe('buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds', () => {
  it('loads only the requested Cozy Tunes tracks', () => {
    const partialManifest =
      buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds([
        'sheep',
        'golden_gleam',
      ]);
    const fullManifest = buildingWorldPlazaBiomeMusicStarAudioManifest();

    expect(Object.keys(partialManifest)).toHaveLength(2);
    expect(partialManifest).toEqual({
      'biome-music.sheep': fullManifest['biome-music.sheep'],
      'biome-music.golden_gleam': fullManifest['biome-music.golden_gleam'],
    });
  });
});

describe('resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind', () => {
  it('includes the night override when one exists for the biome', () => {
    expect(
      [...resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind('forest')].sort()
    ).toEqual(['sunlight_through_leaves', 'whispering_woods'].sort());
  });

  it('returns only the daytime tune for biomes without a night override', () => {
    expect(resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind('desert')).toEqual([
      'golden_gleam',
    ]);
  });
});
