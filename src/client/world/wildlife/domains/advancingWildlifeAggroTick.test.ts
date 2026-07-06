import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeAggroTick } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'grey-wolf',
    anchorId: 'wildlife:0:0:0',
    spawnAnchor: { x: 0.5, y: 0.5, layer: 1 },
    position: { x: 0.5, y: 0.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.1,
      driveLevel: 'starving',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Down',
      motionClip: 'idle',
      isMoving: false,
      lastThinkAtMs: 0,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: null,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    floatingTexts: [],
    environmentalDamageLastTickAtMs: null,
    ...overrides,
  };
}

describe('advancingWildlifeAggroTick', () => {
  it('decays threat over time', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingTestWildlifeInstance({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 3, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
      },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: null,
      playerUserId: null,
      deltaSeconds: 5,
      nowMs: 5000,
    });

    expect(nextAggro.threats[0]?.threat ?? 0).toBeLessThan(3);
  });
});
