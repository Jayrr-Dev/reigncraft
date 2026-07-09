import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  advancingWildlifeSpeciesTextureEviction,
  clearingWildlifePinnedBootSpeciesIdsForTests,
} from '@/components/world/wildlife/domains/advancingWildlifeSpeciesTextureEviction';
import { DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS } from '@/components/world/wildlife/domains/definingWildlifeTextureEvictionConstants';

const listingWildlifeBootPreloadSpeciesIdsMock = vi.hoisted(() =>
  vi.fn(() => ['cow', 'sheep', 'deer'] as const)
);
const listingWildlifeSpeciesTexturesCacheIdsMock = vi.hoisted(() => vi.fn());
const checkingWildlifeSpeciesTexturesAreResolvedMock = vi.hoisted(() =>
  vi.fn()
);
const peekingWildlifeSpeciesTextureLastSeenAtMsMock = vi.hoisted(() =>
  vi.fn()
);
const resolvingWildlifeSpeciesDefinitionMock = vi.hoisted(() => vi.fn());
const evictingWildlifeSpeciesTexturesMock = vi.hoisted(() => vi.fn());

vi.mock(
  '@/components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures',
  () => ({
    listingWildlifeBootPreloadSpeciesIds:
      listingWildlifeBootPreloadSpeciesIdsMock,
  })
);

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

describe('advancingWildlifeSpeciesTextureEviction', () => {
  beforeEach(() => {
    clearingWildlifePinnedBootSpeciesIdsForTests();
    listingWildlifeBootPreloadSpeciesIdsMock.mockClear();
    listingWildlifeSpeciesTexturesCacheIdsMock.mockReset();
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReset();
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReset();
    resolvingWildlifeSpeciesDefinitionMock.mockReset();
    evictingWildlifeSpeciesTexturesMock.mockReset();
    evictingWildlifeSpeciesTexturesMock.mockResolvedValue(true);
  });

  it('evicts resolved non-pin species past the grace window', async () => {
    const nowMs = 100_000;
    const giraffe = { speciesId: 'giraffe' };

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['giraffe']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(
      nowMs - DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS - 1
    );
    resolvingWildlifeSpeciesDefinitionMock.mockReturnValue(giraffe);

    const onEvictedSpeciesId = vi.fn();
    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(),
      onEvictedSpeciesId,
    });

    expect(evicted).toEqual(['giraffe']);
    expect(evictingWildlifeSpeciesTexturesMock).toHaveBeenCalledWith(giraffe);
    expect(onEvictedSpeciesId).toHaveBeenCalledWith('giraffe');
  });

  it('never evicts plains boot-pin species', async () => {
    const nowMs = 100_000;

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['cow']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(0);
    resolvingWildlifeSpeciesDefinitionMock.mockReturnValue({
      speciesId: 'cow',
    });

    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(),
    });

    expect(evicted).toEqual([]);
    expect(evictingWildlifeSpeciesTexturesMock).not.toHaveBeenCalled();
  });

  it('respects the grace window', async () => {
    const nowMs = 100_000;

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['giraffe']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(true);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(
      nowMs - DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS + 1_000
    );
    resolvingWildlifeSpeciesDefinitionMock.mockReturnValue({
      speciesId: 'giraffe',
    });

    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(),
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
    });

    expect(evicted).toEqual([]);
    expect(evictingWildlifeSpeciesTexturesMock).not.toHaveBeenCalled();
  });

  it('skips pending (unresolved) loads', async () => {
    const nowMs = 100_000;

    listingWildlifeSpeciesTexturesCacheIdsMock.mockReturnValue(['giraffe']);
    checkingWildlifeSpeciesTexturesAreResolvedMock.mockReturnValue(false);
    peekingWildlifeSpeciesTextureLastSeenAtMsMock.mockReturnValue(0);

    const evicted = await advancingWildlifeSpeciesTextureEviction({
      nowMs,
      liveSpeciesIds: new Set(),
    });

    expect(evicted).toEqual([]);
    expect(evictingWildlifeSpeciesTexturesMock).not.toHaveBeenCalled();
  });
});
