import { advancingWildlifeAggroTick } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

function buildingWolfPackmates(anchorX: number) {
  return [
    creatingWildlifeTestInstance({
      instanceId: 'wildlife:pack:1',
      speciesId: 'grey-wolf',
      anchorId: 'wildlife:pack:1',
      position: { x: anchorX + 0.5, y: 1, layer: 1 },
    }),
    creatingWildlifeTestInstance({
      instanceId: 'wildlife:pack:2',
      speciesId: 'grey-wolf',
      anchorId: 'wildlife:pack:2',
      position: { x: anchorX + 1, y: 1, layer: 1 },
    }),
  ];
}

describe('favorite prey aggro', () => {
  it('wolves abandon a player hunt lock when a sheep is spotted on sight', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      position: { x: 1, y: 1, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1_000 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'player-1',
        stalkingPreySinceMs: 1_000,
        stalkAttackingPreySinceMs: null,
      },
    });
    const packmates = buildingWolfPackmates(1);
    const sheep = creatingWildlifeTestInstance({
      instanceId: 'wildlife:sheep:1',
      speciesId: 'sheep',
      anchorId: 'wildlife:sheep:1',
      position: { x: 8, y: 1, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [instance, ...packmates, sheep],
      playerPosition: { x: 2, y: 1, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 0.1,
      nowMs: 2_000,
    });

    expect(nextAggro.stalkLockedPreyTargetId).toBe(sheep.instanceId);
    expect(nextAggro.activeTargetId).toBe(sheep.instanceId);
    expect(nextAggro.stalkingPreySinceMs).toBe(2_000);
    expect(nextAggro.stalkPhase).toBe('shadowing');
    expect(
      nextAggro.threats.find((entry) => entry.targetId === 'player-1')
    ).toBeUndefined();
  });

  it('wolves hunt a lone sheep on sight even while sated', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      position: { x: 1, y: 1, layer: 1 },
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: 1_000,
      },
    });
    const packmates = buildingWolfPackmates(1);
    const sheep = creatingWildlifeTestInstance({
      instanceId: 'wildlife:sheep:2',
      speciesId: 'sheep',
      anchorId: 'wildlife:sheep:2',
      position: { x: 6, y: 1, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [instance, ...packmates, sheep],
      playerPosition: null,
      playerUserId: null,
      deltaSeconds: 0.1,
      nowMs: 1_000,
    });

    expect(nextAggro.stalkLockedPreyTargetId).toBe(sheep.instanceId);
    expect(nextAggro.activeTargetId).toBe(sheep.instanceId);
  });

  it('keeps player revenge aggro for thirty seconds even when sheep are nearby', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      position: { x: 1, y: 1, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1_000 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: 2_000,
        stalkLockedPreyTargetId: 'player-1',
        stalkingPreySinceMs: 2_000,
        playerRevengeAggroUntilMs: 32_000,
      },
    });
    const sheep = creatingWildlifeTestInstance({
      instanceId: 'wildlife:sheep:3',
      speciesId: 'sheep',
      anchorId: 'wildlife:sheep:3',
      position: { x: 6, y: 1, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [sheep],
      playerPosition: { x: 2, y: 1, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 0.1,
      nowMs: 5_000,
    });

    expect(nextAggro.stalkLockedPreyTargetId).toBe('player-1');
    expect(nextAggro.activeTargetId).toBe('player-1');
    expect(nextAggro.playerRevengeAggroUntilMs).toBe(32_000);
  });
});
