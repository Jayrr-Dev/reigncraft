import { beforeEach, describe, expect, it, vi } from 'vitest';

import { checkingWildlifeSpeciesUsesGlowOrbPresentation } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesUsesGlowOrbPresentation';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  listingWildlifeBootPreloadSpeciesIds,
  preloadingWildlifeBootSpeciesTextures,
} from '@/components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures';

const loadingWildlifeSpeciesTexturesMock = vi.hoisted(() => vi.fn());

vi.mock(
  '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures',
  () => ({
    loadingWildlifeSpeciesTextures: loadingWildlifeSpeciesTexturesMock,
  })
);

function countingWildlifeBootTexturePreloadSpecies(): number {
  return listingWildlifeBootPreloadSpeciesIds().filter((speciesId) => {
    const species = resolvingWildlifeSpeciesDefinition(speciesId);

    return (
      species !== null &&
      !checkingWildlifeSpeciesUsesGlowOrbPresentation(species)
    );
  }).length;
}

describe('listingWildlifeBootPreloadSpeciesIds', () => {
  it('includes plains spawn-table species', () => {
    const speciesIds = listingWildlifeBootPreloadSpeciesIds();

    expect(speciesIds).toContain('cow');
    expect(speciesIds).toContain('sheep');
    expect(speciesIds).toContain('deer');
  });

  it('excludes species that only spawn outside the boot biomes', () => {
    const speciesIds = listingWildlifeBootPreloadSpeciesIds();

    expect(speciesIds).not.toContain('giraffe');
    expect(speciesIds).not.toContain('polar-bear');
    expect(speciesIds).not.toContain('crocodile');
  });

  it('returns each species id once', () => {
    const speciesIds = listingWildlifeBootPreloadSpeciesIds();

    expect(new Set(speciesIds).size).toBe(speciesIds.length);
  });

  it('includes glow-orb companions in the roster for non-texture boot work', () => {
    expect(listingWildlifeBootPreloadSpeciesIds()).toContain('fairy');
  });
});

describe('preloadingWildlifeBootSpeciesTextures', () => {
  beforeEach(() => {
    loadingWildlifeSpeciesTexturesMock.mockReset();
  });

  it('loads every sprite boot roster species and reports full progress', async () => {
    loadingWildlifeSpeciesTexturesMock.mockResolvedValue({});
    const reportedRatios: number[] = [];

    await preloadingWildlifeBootSpeciesTextures((ratio) => {
      reportedRatios.push(ratio);
    });

    expect(loadingWildlifeSpeciesTexturesMock).toHaveBeenCalledTimes(
      countingWildlifeBootTexturePreloadSpecies()
    );
    expect(
      loadingWildlifeSpeciesTexturesMock.mock.calls.some(
        ([species]) => species.speciesId === 'fairy'
      )
    ).toBe(false);
    expect(reportedRatios.at(-1)).toBe(1);
  });

  it('keeps loading remaining species when one species fails', async () => {
    loadingWildlifeSpeciesTexturesMock
      .mockRejectedValueOnce(new Error('sheet 404'))
      .mockResolvedValue({});
    const reportedRatios: number[] = [];

    await expect(
      preloadingWildlifeBootSpeciesTextures((ratio) => {
        reportedRatios.push(ratio);
      })
    ).resolves.toBeUndefined();

    expect(reportedRatios.at(-1)).toBe(1);
  });

  it('never exceeds the configured species concurrency', async () => {
    let activeCount = 0;
    let peakActiveCount = 0;

    loadingWildlifeSpeciesTexturesMock.mockImplementation(async () => {
      activeCount += 1;
      peakActiveCount = Math.max(peakActiveCount, activeCount);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      activeCount -= 1;

      return {};
    });

    await preloadingWildlifeBootSpeciesTextures(() => {});

    expect(peakActiveCount).toBeLessThanOrEqual(3);
  });
});
