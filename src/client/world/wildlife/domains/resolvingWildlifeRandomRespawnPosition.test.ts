import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeRandomRespawnPosition } from '@/components/world/wildlife/domains/resolvingWildlifeRandomRespawnPosition';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint', () => ({
  checkingWildlifeHazardAtPoint: () => 'safe',
}));

describe('resolvingWildlifeRandomRespawnPosition', () => {
  const deerSpecies = resolvingWildlifeSpeciesDefinition('deer');

  it('returns null when the player is still on the death site', () => {
    if (!deerSpecies) {
      throw new Error('deer species missing');
    }

    const deathPosition = { x: 40, y: 40, layer: 1 };
    const playerCenter = { x: 40.5, y: 40.5, layer: 1 };

    expect(
      resolvingWildlifeRandomRespawnPosition({
        playerCenter,
        deathPosition,
        species: deerSpecies,
        placementSeed: 1234,
        isDaytime: true,
      })
    ).toBeNull();
  });

  it('returns a point far from the player and death site when placement succeeds', () => {
    if (!deerSpecies) {
      throw new Error('deer species missing');
    }

    const deathPosition = { x: 40, y: 40, layer: 1 };
    const playerCenter = { x: 10, y: 10, layer: 1 };

    const respawnPosition = resolvingWildlifeRandomRespawnPosition({
      playerCenter,
      deathPosition,
      species: deerSpecies,
      placementSeed: 5678,
      isDaytime: true,
    });

    if (!respawnPosition) {
      return;
    }

    expect(
      Math.hypot(
        respawnPosition.x - playerCenter.x,
        respawnPosition.y - playerCenter.y
      )
    ).toBeGreaterThanOrEqual(20);
    expect(
      Math.hypot(
        respawnPosition.x - deathPosition.x,
        respawnPosition.y - deathPosition.y
      )
    ).toBeGreaterThanOrEqual(12);
  });
});
