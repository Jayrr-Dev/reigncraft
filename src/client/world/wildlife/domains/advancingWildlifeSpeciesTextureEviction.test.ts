import { beforeEach, describe, expect, it, vi } from 'vitest';

import { advancingWildlifeSpeciesTextureEviction } from '@/components/world/wildlife/domains/advancingWildlifeSpeciesTextureEviction';
import { DEFINING_WILDLIFE_BIOME_PROXIMITY_OUT_OF_RANGE_GRACE_MS } from '@/components/world/wildlife/domains/definingWildlifeBiomeProximityTextureConstants';
import { DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS } from '@/components/world/wildlife/domains/definingWildlifeTextureEvictionConstants';

const listingWildlifeSpeciesTexturesCacheIdsMock = vi.hoisted(() => vi.fn());
const checkingWildlifeSpeciesTexturesAreResolvedMock = vi.hoisted(() =>
  vi.fn()
);
const peekingWildlifeSpeciesTextureLastSeenAtMsMock = vi.hoisted(() => vi.fn());
const resolvingWildlifeSpeciesDefinitionMock = vi.hoisted(() => vi.fn());
const evictingWildlifeSpeciesTexturesMock = vi.hoisted(() => vi.fn());
const resolvingWildlifeTextureEvictionProfileMock = vi.hoisted(() => vi.fn());

vi.mock(
  '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures',
  () => ({
    listingWildlifeSpeciesTexturesCacheIds:
      listingWildlifeSpeciesTexturesCacheIdsMock,
    checkingWildlifeSpeciesTexturesAreResolved:
      checkingWildlifeSpeciesTexturesAreResolvedMock,
  })
);

vi.mock(
  '@/components/world/wildlife/domains/managingWildlifeSpeciesTextureResidence',
  () => ({
    peekingWildlifeSpeciesTextureLastSeenAtMs:
      peekingWildlifeSpeciesTextureLastSeenAtMsMock,
  })
);

vi.mock(
  '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry',
  () => ({
    resolvingWildlifeSpeciesDefinition: resolvingWildlifeSpeciesDefinitionMock,
  })
);

vi.mock(
  '@/components/world/wildlife/domains/evictingWildlifeSpeciesTextures',
  () => ({
    evictingWildlifeSpeciesTextures: evictingWildlifeSpeciesTexturesMock,
  })
);

vi.mock(
  '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile',
  () => ({
    resolvingWildlifeTextureEvictionProfile:
      resolvingWildlifeTextureEvictionProfileMock,
  })
);

describe('advancingWildlifeSpeciesTextureEviction', () => {
  beforeEach(() => {
    listingWildlifeSpeciesTexturesCacheIdsMock.mockReset();
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReset();
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReset();
    resolvingWildlifeSpeciesDefinitionMock.mockReset();
    evictingWildlifeSpeciesTexturesMock.mockReset();
    resolvingWildlifeTextureEvictionProfileMock.mockReset();
    evictingWildlifeSpeciesTexturesMock.mockResolvedValue(true);
    resolvingWildlifeTextureEvictionProfileMock.mockReturnValue({
      graceMs: DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS,
      maxCachedSpecies: null,
    });
  });

  it('evicts proximate species past the standard grace window', async () => {
    const nowMs = 100_000;
    const giraffe = { speciesId: 'giraffe' };

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['giraffe']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(
      nowMs - DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS - 1
    );
    resolvingWildlifeSpeciesDefinitionMock.mockReturnValue(giraffe);

    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(),
      proximateSpeciesIds: new Set(['giraffe']),
    });

    expect(evicted).toEqual(['giraffe']);
    expect(evictingWildlifeSpeciesTexturesMock).toHaveBeenCalledWith(giraffe);
  });

  it('culls out-of-range species after the short biome grace window', async () => {
    const nowMs = 100_000;
    const giraffe = { speciesId: 'giraffe' };

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['giraffe']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(
      nowMs - DEFINING_WILDLIFE_BIOME_PROXIMITY_OUT_OF_RANGE_GRACE_MS - 1
    );
    resolvingWildlifeSpeciesDefinitionMock.mockReturnValue(giraffe);

    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(),
      proximateSpeciesIds: new Set(['cow']),
    });

    expect(evicted).toEqual(['giraffe']);
    expect(evictingWildlifeSpeciesTexturesMock).toHaveBeenCalledWith(giraffe);
  });

  it('keeps proximate species inside the grace window', async () => {
    const nowMs = 100_000;

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['cow']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(
      nowMs - DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS + 1_000
    );

    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(),
      proximateSpeciesIds: new Set(['cow']),
    });

    expect(evicted).toEqual([]);
    expect(evictingWildlifeSpeciesTexturesMock).not.toHaveBeenCalled();
  });

  it('skips species that still have live instances', async () => {
    const nowMs = 100_000;

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['giraffe']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(0);

    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(['giraffe']),
      proximateSpeciesIds: new Set(),
    });

    expect(evicted).toEqual([]);
    expect(evictingWildlifeSpeciesTexturesMock).not.toHaveBeenCalled();
  });
});
