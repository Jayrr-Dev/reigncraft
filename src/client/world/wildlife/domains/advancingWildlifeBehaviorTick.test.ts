import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeBehaviorTick } from '@/components/world/wildlife/domains/advancingWildlifeBehaviorTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingBlackboard(
  temperamentSpeciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY,
  overrides: Partial<DefiningWildlifeBehaviorBlackboard> = {}
): DefiningWildlifeBehaviorBlackboard {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY[temperamentSpeciesId];
  const instance: DefiningWildlifeInstance = {
    instanceId: 'wildlife:1:1:0',
    speciesId: species.speciesId,
    anchorId: 'wildlife:1:1:0',
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.9,
      driveLevel: 'sated',
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
  };

  return {
    instance,
    species,
    nearbyInstances: [],
    playerPosition: { x: 20, y: 20, layer: 1 },
    playerUserId: 'player-1',
    nowMs: 1000,
    selectedPreyInstanceId: null,
    resolveSpecies: (speciesId) =>
      DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    ...overrides,
  };
}

describe('advancingWildlifeBehaviorTick', () => {
  it('passive temperament grazes when hungry', () => {
    const blackboard = buildingBlackboard('cow', {
      instance: {
        ...buildingBlackboard('cow').instance,
        hungerState: {
          hungerRatio: 0.3,
          driveLevel: 'hungry',
          lastFedAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('graze');
  });

  it('skittish temperament flees when the player is too close', () => {
    const blackboard = buildingBlackboard('deer', {
      playerPosition: { x: 2, y: 2, layer: 1 },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('flee');
  });

  it('retaliator temperament attacks when aggroed on the player', () => {
    const blackboard = buildingBlackboard('boar', {
      playerPosition: { x: 2, y: 2, layer: 1 },
      instance: {
        ...buildingBlackboard('boar').instance,
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: 1000,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('attack');

    if (intent.mode === 'attack') {
      expect(intent.targetInstanceId).toBe('player-1');
    }
  });

  it('retaliator temperament chases when the target is out of melee range', () => {
    const blackboard = buildingBlackboard('boar', {
      playerPosition: { x: 8, y: 8, layer: 1 },
      instance: {
        ...buildingBlackboard('boar').instance,
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: 1000,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('chase');
  });
});
