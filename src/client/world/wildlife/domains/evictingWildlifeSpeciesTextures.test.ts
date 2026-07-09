import { beforeEach, describe, expect, it, vi } from 'vitest';

import { evictingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/evictingWildlifeSpeciesTextures';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

const checkingWildlifeSpeciesTexturesAreResolvedMock = vi.hoisted(() =>
  vi.fn()
);
const peekingWildlifeSpeciesTexturesResolvedMock = vi.hoisted(() => vi.fn());
const removingWildlifeSpeciesTexturesCacheEntryMock = vi.hoisted(() =>
  vi.fn()
);
const clearingWildlifeSpeciesTextureResidenceMock = vi.hoisted(() => vi.fn());
const clearingWildlifeAnimationClipRegistrationForSpeciesMock = vi.hoisted(
  () => vi.fn()
);
const removingWorldPlazaAnimationClipsByPrefixMock = vi.hoisted(() =>
  vi.fn(() => 0)
);
const assetsUnloadMock = vi.hoisted(() => vi.fn(async () => undefined));

vi.mock(
  '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures',
  () => ({
    DEFINING_WILDLIFE_MOTION_CLIP_KINDS: [
      'idle',
      'walk',
      'run',
      'attack',
      'takeDamage',
      'die',
    ],
    checkingWildlifeSpeciesTexturesAreResolved:
      checkingWildlifeSpeciesTexturesAreResolvedMock,
    peekingWildlifeSpeciesTexturesResolved:
      peekingWildlifeSpeciesTexturesResolvedMock,
    removingWildlifeSpeciesTexturesCacheEntry:
      removingWildlifeSpeciesTexturesCacheEntryMock,
  })
);

vi.mock(
  '@/components/world/wildlife/domains/managingWildlifeSpeciesTextureResidence',
  () => ({
    clearingWildlifeSpeciesTextureResidence:
      clearingWildlifeSpeciesTextureResidenceMock,
  })
);

vi.mock(
  '@/components/world/wildlife/domains/registeringWildlifeAnimationClips',
  () => ({
    clearingWildlifeAnimationClipRegistrationForSpecies:
      clearingWildlifeAnimationClipRegistrationForSpeciesMock,
  })
);

vi.mock(
  '@/components/world/animation/domains/registeringWorldPlazaAnimationClip',
  () => ({
    removingWorldPlazaAnimationClipsByPrefix:
      removingWorldPlazaAnimationClipsByPrefixMock,
  })
);

vi.mock('pixi.js', () => ({
  Assets: {
    unload: assetsUnloadMock,
  },
}));

const giraffeSpecies = {
  speciesId: 'giraffe',
  spriteFolder: 'Giraffe',
} as DefiningWildlifeSpeciesDefinition;

describe('evictingWildlifeSpeciesTextures', () => {
  beforeEach(() => {
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReset();
    peekingWildlifeSpeciesTexturesResolvedMock.mockReset();
    removingWildlifeSpeciesTexturesCacheEntryMock.mockReset();
    clearingWildlifeSpeciesTextureResidenceMock.mockReset();
    clearingWildlifeAnimationClipRegistrationForSpeciesMock.mockReset();
    removingWorldPlazaAnimationClipsByPrefixMock.mockReset();
    removingWorldPlazaAnimationClipsByPrefixMock.mockReturnValue(0);
    assetsUnloadMock.mockReset();
    assetsUnloadMock.mockResolvedValue(undefined);
  });

  it('tears down clips, cache, residence, and Assets when resolved', async () => {
    const destroyMock = vi.fn();
    const rowTexture = {
      destroyed: false,
      destroy: destroyMock,
    };

    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTexturesResolvedMock.mockReturnValue({
      idle: {
        directionTextures: { Down: rowTexture },
        frameWidthPx: 32,
        frameHeightPx: 32,
      },
    });

    const didEvict = await evictingWildlifeSpeciesTextures(giraffeSpecies);

    expect(didEvict).toBe(true);
    expect(removingWorldPlazaAnimationClipsByPrefixMock).toHaveBeenCalledWith(
      'wildlife-giraffe-'
    );
    expect(
      clearingWildlifeAnimationClipRegistrationForSpeciesMock
    ).toHaveBeenCalledWith('giraffe');
    expect(destroyMock).toHaveBeenCalledWith(false);
    expect(removingWildlifeSpeciesTexturesCacheEntryMock).toHaveBeenCalledWith(
      'giraffe'
    );
    expect(clearingWildlifeSpeciesTextureResidenceMock).toHaveBeenCalledWith(
      'giraffe'
    );
    expect(assetsUnloadMock).toHaveBeenCalled();
  });

  it('skips eviction while the load is still pending', async () => {
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(false);

    const didEvict = await evictingWildlifeSpeciesTextures(giraffeSpecies);

    expect(didEvict).toBe(false);
    expect(removingWorldPlazaAnimationClipsByPrefixMock).not.toHaveBeenCalled();
    expect(
      removingWildlifeSpeciesTexturesCacheEntryMock
    ).not.toHaveBeenCalled();
    expect(assetsUnloadMock).not.toHaveBeenCalled();
  });
});
