import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_PACK_ALPHA_SURROUND_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';
import { resolvingWildlifeStalkSurroundTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSurroundTargetPoint';
import { describe, expect, it } from 'vitest';

function buildingPackWolf(
  packIndex: number,
  sizeScaleSample: number,
  position: { x: number; y: number; layer: number }
) {
  const instanceId = `wildlife:4:7:${packIndex}`;

  return creatingWildlifeTestInstance({
    instanceId,
    anchorId: instanceId,
    sizeScaleSample,
    spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
    position,
    aggroState: {
      threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1 }],
      activeTargetId: 'player-1',
      lastDamagedAtMs: null,
      stalkingPreySinceMs: 1_000,
      stalkAttackingPreySinceMs: null,
    },
  });
}

describe('resolvingWildlifeStalkSpawnPackFormation', () => {
  const resolveSpecies = (speciesId: string) =>
    DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;

  it('marks the largest pack member as alpha', () => {
    const alpha = buildingPackWolf(1, 1.2, { x: 4, y: 10, layer: 1 });
    const follower = buildingPackWolf(0, -0.5, { x: 2, y: 10, layer: 1 });
    const packmates = [alpha, follower];

    expect(
      resolvingWildlifeStalkSpawnPackFormation({
        instance: alpha,
        nearbyInstances: packmates,
        packmatesTargetingPrey: packmates,
        resolveSpecies,
      })
    ).toEqual({ isAlpha: true, followerRank: 0 });

    expect(
      resolvingWildlifeStalkSpawnPackFormation({
        instance: follower,
        nearbyInstances: packmates,
        packmatesTargetingPrey: packmates,
        resolveSpecies,
      })
    ).toEqual({ isAlpha: false, followerRank: 1 });
  });
});

describe('resolvingWildlifeStalkSurroundTargetPoint', () => {
  const playerPosition = { x: 10, y: 10, layer: 1 };
  const resolveSpecies = (speciesId: string) =>
    DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;

  it('places the alpha on the closest lead point', () => {
    const alpha = buildingPackWolf(1, 1.2, { x: 4, y: 10, layer: 1 });
    const follower = buildingPackWolf(0, -0.5, { x: 16, y: 10, layer: 1 });
    const packmates = [alpha, follower];
    const alphaFormation = resolvingWildlifeStalkSpawnPackFormation({
      instance: alpha,
      nearbyInstances: packmates,
      packmatesTargetingPrey: packmates,
      resolveSpecies,
    });
    const followerFormation = resolvingWildlifeStalkSpawnPackFormation({
      instance: follower,
      nearbyInstances: packmates,
      packmatesTargetingPrey: packmates,
      resolveSpecies,
    });

    const alphaPoint = resolvingWildlifeStalkSurroundTargetPoint({
      instance: alpha,
      preyPosition: playerPosition,
      formation: alphaFormation,
    });
    const followerPoint = resolvingWildlifeStalkSurroundTargetPoint({
      instance: follower,
      preyPosition: playerPosition,
      formation: followerFormation,
    });

    const alphaDistance = Math.hypot(
      alphaPoint.x - playerPosition.x,
      alphaPoint.y - playerPosition.y
    );
    const followerDistance = Math.hypot(
      followerPoint.x - playerPosition.x,
      followerPoint.y - playerPosition.y
    );

    expect(alphaDistance).toBeCloseTo(
      DEFINING_WILDLIFE_PACK_ALPHA_SURROUND_RADIUS_GRID,
      5
    );
    expect(alphaDistance).toBeLessThan(followerDistance);
    expect(alphaPoint.x).toBeLessThan(playerPosition.x);
    expect(followerPoint.x).toBeGreaterThan(playerPosition.x);
  });
});
