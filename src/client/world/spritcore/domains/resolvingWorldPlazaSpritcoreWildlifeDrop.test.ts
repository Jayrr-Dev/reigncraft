import { resolvingWorldPlazaSpritcoreWildlifeDrop } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeDrop';
import { applyingWildlifeSpritcoreFeast } from '@/components/world/wildlife/domains/applyingWildlifeSpritcoreFeast';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaSpritcoreWildlifeDrop', () => {
  const greyWolf = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];

  it('matches species baseline when no instance is passed', () => {
    expect(resolvingWorldPlazaSpritcoreWildlifeDrop(greyWolf)).toBe(33);
  });

  it('drops more SC for larger / farther instances than the species baseline', () => {
    const averageNearOrigin = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      sizeScaleSample: 0,
      spawnAnchor: { x: 10, y: 10, layer: 1 },
      position: { x: 10, y: 10, layer: 1 },
    });
    const largeFarOut = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      sizeScaleSample: 3,
      largeSizeFrame: 'apex',
      spawnAnchor: { x: 10_000, y: 0, layer: 1 },
      position: { x: 10_000, y: 0, layer: 1 },
    });

    const baselineDrop = resolvingWorldPlazaSpritcoreWildlifeDrop(
      greyWolf,
      averageNearOrigin
    );
    const strongDrop = resolvingWorldPlazaSpritcoreWildlifeDrop(
      greyWolf,
      largeFarOut
    );

    expect(baselineDrop).toBeGreaterThanOrEqual(33);
    expect(strongDrop).toBeGreaterThan(baselineDrop);
  });

  it('reports concrete drops for far 4σ and feasted wolves', () => {
    const nowMs = 1_000_000;
    const apexFar = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      sizeScaleSample: 4,
      largeSizeFrame: 'apex',
      spawnAnchor: { x: 10_000, y: 0, layer: 1 },
      position: { x: 10_000, y: 0, layer: 1 },
    });
    const obeseFar = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      sizeScaleSample: 4,
      largeSizeFrame: 'obese',
      spawnAnchor: { x: 10_000, y: 0, layer: 1 },
      position: { x: 10_000, y: 0, layer: 1 },
    });
    const apexFeasted = applyingWildlifeSpritcoreFeast(apexFar, 1_000, nowMs);
    const obeseFeasted = applyingWildlifeSpritcoreFeast(obeseFar, 1_000, nowMs);

    const apexDrop = resolvingWorldPlazaSpritcoreWildlifeDrop(
      greyWolf,
      apexFar,
      nowMs
    );
    const obeseDrop = resolvingWorldPlazaSpritcoreWildlifeDrop(
      greyWolf,
      obeseFar,
      nowMs
    );
    const apexFeastDrop = resolvingWorldPlazaSpritcoreWildlifeDrop(
      greyWolf,
      apexFeasted,
      nowMs
    );
    const obeseFeastDrop = resolvingWorldPlazaSpritcoreWildlifeDrop(
      greyWolf,
      obeseFeasted,
      nowMs
    );

    expect(apexDrop).toBe(131);
    expect(obeseDrop).toBe(315);
    expect(apexFeastDrop).toBe(248);
    expect(obeseFeastDrop).toBe(596);
  });
});
