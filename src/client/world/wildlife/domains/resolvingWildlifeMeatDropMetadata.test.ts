import {
  DEFINING_WILDLIFE_MEAT_LARGE_SIZE_FRAME_METADATA_KEY,
  DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY,
} from '@/components/world/wildlife/domains/definingWildlifeMeatSizeMetadataConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeMeatDropMetadata } from '@/components/world/wildlife/domains/resolvingWildlifeMeatDropMetadata';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeMeatDropMetadata', () => {
  const species = resolvingWildlifeSpeciesDefinition('boar');

  if (!species) {
    throw new Error('Expected boar species');
  }

  it('stamps size tier from the kill sample', () => {
    const metadata = resolvingWildlifeMeatDropMetadata({
      instance: {
        speciesId: 'boar',
        sizeScaleSample: 2.1,
        largeSizeFrame: 'apex',
        aggressionLevel: 0,
        aggroState: null,
      },
      species,
      killerTargetId: null,
      playerUserId: null,
      nowMs: 1,
    });

    expect(metadata[DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY]).toBe(2);
    expect(metadata[DEFINING_WILDLIFE_MEAT_LARGE_SIZE_FRAME_METADATA_KEY]).toBe(
      'apex'
    );
  });
});
