import {
  advancingWildlifeAggroTick,
  applyingWildlifeDamageThreat,
} from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('PackHunter prey lock aggro', () => {
  it('alpha randomly locks onto one prey and ignores another nearby target', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      position: { x: 1, y: 1, layer: 1 },
      hungerState: {
        hungerRatio: 0.2,
        driveLevel: 'hungry',
        lastFedAtMs: null,
      },
    });
    const packmateA = creatingWildlifeTestInstance({
      instanceId: 'wildlife:1:1:1',
      speciesId: 'grey-wolf',
      position: { x: 1.5, y: 1, layer: 1 },
    });
    const packmateB = creatingWildlifeTestInstance({
      instanceId: 'wildlife:1:1:2',
      speciesId: 'grey-wolf',
      position: { x: 2, y: 1, layer: 1 },
    });
    const deer = creatingWildlifeTestInstance({
      instanceId: 'wildlife:2:2:0',
      speciesId: 'deer',
      position: { x: 4, y: 1, layer: 1 },
    });
    const boar = creatingWildlifeTestInstance({
      instanceId: 'wildlife:3:3:0',
      speciesId: 'boar',
      anchorId: 'wildlife:3:3:0',
      position: { x: 4, y: 2, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [instance, packmateA, packmateB, deer, boar],
      playerPosition: { x: 4, y: 1.5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 30_000,
    });

    expect(nextAggro.stalkLockedPreyTargetId).toBeTruthy();
    expect(nextAggro.activeTargetId).toBe(nextAggro.stalkLockedPreyTargetId);
    expect(nextAggro.threats).toHaveLength(1);
    expect(nextAggro.threats[0]?.targetId).toBe(
      nextAggro.stalkLockedPreyTargetId
    );
  });

  it('switches to player revenge aggro when hit while locked on another prey', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        threats: [{ targetId: 'boar-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'boar-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'boar-1',
        stalkingPreySinceMs: 1_000,
      },
    });

    const nextInstance = applyingWildlifeDamageThreat(
      instance,
      species,
      'player-1',
      10,
      2_000
    );

    expect(nextInstance.aggroState.activeTargetId).toBe('player-1');
    expect(nextInstance.aggroState.stalkLockedPreyTargetId).toBe('player-1');
    expect(nextInstance.aggroState.playerRevengeAggroUntilMs).toBe(32_000);
  });

  it('builds territory threat against rival wolves in the home patch', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
      position: { x: 1.5, y: 1.5, layer: 1 },
    });
    const rivalWolf = creatingWildlifeTestInstance({
      instanceId: 'wildlife:9:9:0',
      anchorId: 'wildlife:9:9:0',
      position: { x: 2.5, y: 1.5, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [rivalWolf],
      playerPosition: null,
      playerUserId: null,
      deltaSeconds: 1,
      nowMs: 1_000,
    });

    expect(nextAggro.threats[0]?.targetId).toBe(rivalWolf.instanceId);
    expect(nextAggro.stalkLockedPreyTargetId).toBeNull();
  });
});
