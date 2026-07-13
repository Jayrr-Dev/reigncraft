import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalHazardAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn(() => false),
}));

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/collision', () => ({
  checkingWorldCollisionBlockedAtPoint: vi.fn(() => false),
}));

import { advancingWildlifeBehaviorTick } from '@/components/world/wildlife/domains/advancingWildlifeBehaviorTick';

function buildingBlackboard(
  temperamentSpeciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY,
  overrides: Partial<DefiningWildlifeBehaviorBlackboard> = {}
): DefiningWildlifeBehaviorBlackboard {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY[temperamentSpeciesId];
  const instance: DefiningWildlifeInstance = {
    instanceId: 'wildlife:1:1:0',
    speciesId: species.speciesId,
    anchorId: 'wildlife:1:1:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
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
      attackComboIndex: 0,
      howlingUntilMs: null,
      lastHowlAtMs: null,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      fleeTargetPoint: null,
      pendingGroundFoodBite: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
      hasPlayerSleepBumpContact: false,
      docileFollowUntilMs: null,
      docileLastReactAtMs: null,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    hasBeenStudied: false,
    floatingTexts: [],

    speechState: {
      activeBubble: null,

      lastEmittedAtMs: null,

      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
  };

  return {
    instance,
    species,
    nearbyInstances: [],
    playerPosition: { x: 20, y: 20, layer: 1 },
    playerUserId: 'player-1',
    isPlayerWalking: false,
    isPlayerRunning: false,
    isPlayerJumping: false,
    nowMs: 1000,
    selectedPreyInstanceId: null,
    selectedProximityPreyInstanceId: null,
    selectedGroundFoodItemId: null,
    playerHealthRatio: 1,
    playerStaminaRatio: 1,
    playerStaminaIsDepleted: false,
    playerStillDurationMs: 0,
    resolveSpecies: (speciesId) =>
      DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    hazardSampling: {
      placedBlocks: [],
      isDaytime: true,
    },
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

  it('skittish temperament flees when the running player is too close', () => {
    const blackboard = buildingBlackboard('deer', {
      playerPosition: { x: 2, y: 2, layer: 1 },
      isPlayerRunning: true,
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('flee');
  });

  it('skittish temperament ignores a walking player at close range', () => {
    const blackboard = buildingBlackboard('deer', {
      playerPosition: { x: 2, y: 2, layer: 1 },
      isPlayerWalking: false,
      isPlayerRunning: false,
      isPlayerJumping: false,
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).not.toBe('flee');
  });

  it('retaliator temperament warns when the player enters its territory', () => {
    const blackboard = buildingBlackboard('boar', {
      playerPosition: { x: 4, y: 1.5, layer: 1 },
      instance: {
        ...buildingBlackboard('boar').instance,
        spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
        position: { x: 1.5, y: 1.5, layer: 1 },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('territoryWarn');

    if (intent.mode === 'territoryWarn') {
      expect(intent.targetInstanceId).toBe('player-1');
    }
  });

  it('predator temperament warns when the player enters lion territory', () => {
    const blackboard = buildingBlackboard('lion', {
      playerPosition: { x: 7, y: 1.5, layer: 1 },
      instance: {
        ...buildingBlackboard('lion').instance,
        spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
        position: { x: 1.5, y: 1.5, layer: 1 },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('territoryWarn');
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
          stalkingPreySinceMs: null,
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
          stalkingPreySinceMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('chase');
  });

  it('aggressive passive herbivores attack when aggroed on the player', () => {
    const blackboard = buildingBlackboard('chicken', {
      playerPosition: { x: 2, y: 2, layer: 1 },
      instance: {
        ...buildingBlackboard('chicken').instance,
        aggressionLevel: 'aggressive',
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('attack');

    if (intent.mode === 'attack') {
      expect(intent.targetInstanceId).toBe('player-1');
    }
  });

  it('aggressive passive herbivores warn when the player enters their home patch', () => {
    const blackboard = buildingBlackboard('cow', {
      playerPosition: { x: 4, y: 1.5, layer: 1 },
      instance: {
        ...buildingBlackboard('cow').instance,
        aggressionLevel: 'aggressive',
        spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
        position: { x: 1.5, y: 1.5, layer: 1 },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('territoryWarn');

    if (intent.mode === 'territoryWarn') {
      expect(intent.targetInstanceId).toBe('player-1');
    }
  });

  it('aggressive skittish herbivores warn before fleeing when the player is in their patch', () => {
    const blackboard = buildingBlackboard('deer', {
      playerPosition: { x: 4, y: 1.5, layer: 1 },
      isPlayerWalking: false,
      isPlayerRunning: true,
      isPlayerJumping: false,
      instance: {
        ...buildingBlackboard('deer').instance,
        aggressionLevel: 'aggressive',
        spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
        position: { x: 1.5, y: 1.5, layer: 1 },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('territoryWarn');
  });

  it('aggressive cows fight back when hit instead of fleeing', () => {
    const blackboard = buildingBlackboard('cow', {
      playerPosition: { x: 2, y: 2, layer: 1 },
      instance: {
        ...buildingBlackboard('cow').instance,
        aggressionLevel: 'aggressive',
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: 1000,
          stalkingPreySinceMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('attack');
  });

  it('aggressive skittish herbivores fight instead of fleeing when aggroed', () => {
    const blackboard = buildingBlackboard('deer', {
      playerPosition: { x: 2, y: 2, layer: 1 },
      instance: {
        ...buildingBlackboard('deer').instance,
        aggressionLevel: 'aggressive',
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('attack');
  });

  it('skittish keeps an in-progress flee when the player stops running inside the exit radius', () => {
    const base = buildingBlackboard('deer').instance;
    const blackboard = buildingBlackboard('deer', {
      // Distance 6: outside the flee entry radius (4.5) but inside exit (7.2).
      playerPosition: { x: 7.5, y: 1.5, layer: 1 },
      isPlayerWalking: false,
      isPlayerRunning: false,
      isPlayerJumping: false,
      instance: {
        ...base,
        aiState: {
          ...base.aiState,
          intent: { mode: 'flee', targetPoint: { x: -4.5, y: 1.5, layer: 1 } },
          hasUsedBluffCharge: false,
          bluffChargePlayerExitedTerritory: false,
          bluffReturnPoint: null,
          docileFollowUntilMs: null,
          docileLastReactAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('flee');
  });

  it('skittish calms down once an in-progress flee clears the exit radius', () => {
    const base = buildingBlackboard('deer').instance;
    const blackboard = buildingBlackboard('deer', {
      // Distance 9: beyond the flee exit radius (7.2).
      playerPosition: { x: 10.5, y: 1.5, layer: 1 },
      isPlayerWalking: false,
      isPlayerRunning: false,
      isPlayerJumping: false,
      instance: {
        ...base,
        aiState: {
          ...base.aiState,
          intent: { mode: 'flee', targetPoint: { x: -4.5, y: 1.5, layer: 1 } },
          hasUsedBluffCharge: false,
          bluffChargePlayerExitedTerritory: false,
          bluffReturnPoint: null,
          docileFollowUntilMs: null,
          docileLastReactAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).not.toBe('flee');
  });

  it('predator keeps returning to its anchor until well inside the leash when idle', () => {
    const base = buildingBlackboard('lion').instance;
    const blackboard = buildingBlackboard('lion', {
      playerPosition: { x: 20, y: 1.5, layer: 1 },
      instance: {
        ...base,
        // Distance 12 from anchor: inside the leash (18) but beyond half of it.
        position: { x: 13.5, y: 1.5, layer: 1 },
        aiState: {
          ...base.aiState,
          intent: { mode: 'return', targetPoint: base.spawnAnchor },
          hasUsedBluffCharge: false,
          bluffChargePlayerExitedTerritory: false,
          bluffReturnPoint: null,
          docileFollowUntilMs: null,
          docileLastReactAtMs: null,
        },
        // No active hunt or threat: leash hysteresis must finish the walk home.
        aggroState: {
          threats: [],
          activeTargetId: null,
          lastDamagedAtMs: null,
          stalkingPreySinceMs: null,
        },
        hungerState: {
          hungerRatio: 0.95,
          driveLevel: 'sated',
          lastFedAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('return');
  });

  it('predator re-engages once the leash return reaches the anchor area', () => {
    const base = buildingBlackboard('lion').instance;
    const blackboard = buildingBlackboard('lion', {
      playerPosition: { x: 20, y: 1.5, layer: 1 },
      instance: {
        ...base,
        // Distance 6 from anchor: within half the leash distance (9).
        position: { x: 7.5, y: 1.5, layer: 1 },
        aiState: {
          ...base.aiState,
          intent: { mode: 'return', targetPoint: base.spawnAnchor },
          hasUsedBluffCharge: false,
          bluffChargePlayerExitedTerritory: false,
          bluffReturnPoint: null,
          docileFollowUntilMs: null,
          docileLastReactAtMs: null,
        },
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: 1000,
          stalkingPreySinceMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('chase');
  });

  it('predator keeps chasing past the leash when committed to a hunt', () => {
    const deer = {
      ...buildingBlackboard('deer').instance,
      instanceId: 'wildlife:2:2:0',
      position: { x: 26, y: 1.5, layer: 1 },
    };
    const base = buildingBlackboard('tiger').instance;
    const blackboard = buildingBlackboard('tiger', {
      nearbyInstances: [deer],
      selectedPreyInstanceId: deer.instanceId,
      instance: {
        ...base,
        // Past default leash (18) while still hunting.
        position: { x: 22, y: 1.5, layer: 1 },
        hungerState: {
          hungerRatio: 0.2,
          driveLevel: 'starving',
          lastFedAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('chase');
    if (intent.mode === 'chase') {
      expect(intent.targetInstanceId).toBe(deer.instanceId);
    }
  });

  it('predator keeps chasing a player threat past the leash', () => {
    const base = buildingBlackboard('lion').instance;
    const blackboard = buildingBlackboard('lion', {
      playerPosition: { x: 30, y: 1.5, layer: 1 },
      instance: {
        ...base,
        position: { x: 22, y: 1.5, layer: 1 },
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: 1000,
          stalkingPreySinceMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('chase');
  });

  it('normal skittish herbivores flee when the running player is too close', () => {
    const blackboard = buildingBlackboard('deer', {
      playerPosition: { x: 2, y: 2, layer: 1 },
      isPlayerRunning: true,
      instance: {
        ...buildingBlackboard('deer').instance,
        aggressionLevel: 'normal',
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('flee');
  });

  it('predator temperament attacks prey that wanders within close range while sated', () => {
    const deer = {
      ...buildingBlackboard('deer').instance,
      instanceId: 'wildlife:2:2:0',
      position: { x: 2.4, y: 1.5, layer: 1 },
    };
    const blackboard = buildingBlackboard('grey-wolf', {
      nearbyInstances: [deer],
      selectedProximityPreyInstanceId: deer.instanceId,
      instance: {
        ...buildingBlackboard('grey-wolf').instance,
        hungerState: {
          hungerRatio: 0.9,
          driveLevel: 'sated',
          lastFedAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('attack');

    if (intent.mode === 'attack') {
      expect(intent.targetInstanceId).toBe(deer.instanceId);
    }
  });

  it('predator temperament chases prey within close range but outside melee', () => {
    const deer = {
      ...buildingBlackboard('deer').instance,
      instanceId: 'wildlife:2:2:0',
      position: { x: 6, y: 1.5, layer: 1 },
    };
    const blackboard = buildingBlackboard('grey-wolf', {
      nearbyInstances: [deer],
      selectedProximityPreyInstanceId: deer.instanceId,
      instance: {
        ...buildingBlackboard('grey-wolf').instance,
        hungerState: {
          hungerRatio: 0.9,
          driveLevel: 'sated',
          lastFedAtMs: null,
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('chase');

    if (intent.mode === 'chase') {
      expect(intent.targetInstanceId).toBe(deer.instanceId);
    }
  });

  it('PackHunter temperament shadows the player until a kill trigger opens', () => {
    const blackboard = buildingBlackboard('grey-wolf', {
      playerPosition: { x: 10, y: 1.5, layer: 1 },
      nowMs: 5_000,
      instance: {
        ...buildingBlackboard('grey-wolf').instance,
        position: { x: 2, y: 1.5, layer: 1 },
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: null,
          stalkingPreySinceMs: 1000,
          stalkPhase: 'shadowing',
        },
      },
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      nearbyInstances: [
        {
          ...buildingBlackboard('grey-wolf').instance,
          instanceId: 'wildlife:2:2:0',
          aggroState: {
            threats: [
              { targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1000 },
            ],
            activeTargetId: 'player-1',
            lastDamagedAtMs: null,
            stalkingPreySinceMs: 1000,
            stalkPhase: 'shadowing',
          },
        },
        {
          ...buildingBlackboard('grey-wolf').instance,
          instanceId: 'wildlife:3:3:0',
          aggroState: {
            threats: [
              { targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1000 },
            ],
            activeTargetId: 'player-1',
            lastDamagedAtMs: null,
            stalkingPreySinceMs: 1000,
            stalkPhase: 'shadowing',
          },
        },
      ],
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('stalk');
  });

  it('PackHunter temperament keeps patrolling when caught up to a still player', () => {
    const blackboard = buildingBlackboard('grey-wolf', {
      playerPosition: { x: 10, y: 1.5, layer: 1 },
      nowMs: 5_000,
      instance: {
        ...buildingBlackboard('grey-wolf').instance,
        position: { x: 2.5, y: 1.5, layer: 1 },
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: null,
          stalkingPreySinceMs: 1000,
          stalkPhase: 'shadowing',
        },
      },
      playerStillDurationMs: 2_000,
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode).toBe('stalk');
    if (intent.mode === 'stalk') {
      expect(intent.facingPoint).toEqual({ x: 10, y: 1.5, layer: 1 });
    }
  });

  it('PackHunter temperament attacks when the player drops below half health', () => {
    const blackboard = buildingBlackboard('grey-wolf', {
      playerPosition: { x: 3, y: 1.5, layer: 1 },
      nowMs: 31_000,
      instance: {
        ...buildingBlackboard('grey-wolf').instance,
        position: { x: 2, y: 1.5, layer: 1 },
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: null,
          stalkingPreySinceMs: 1000,
          stalkPhase: 'attacking',
        },
      },
      playerHealthRatio: 0.4,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode === 'attack' || intent.mode === 'chase').toBe(true);
  });

  it('PackHunter temperament attacks when the player has stood still for eight seconds', () => {
    const blackboard = buildingBlackboard('grey-wolf', {
      playerPosition: { x: 3, y: 1.5, layer: 1 },
      nowMs: 31_000,
      instance: {
        ...buildingBlackboard('grey-wolf').instance,
        position: { x: 2, y: 1.5, layer: 1 },
        aggroState: {
          threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1000 }],
          activeTargetId: 'player-1',
          lastDamagedAtMs: null,
          stalkingPreySinceMs: 1000,
          stalkPhase: 'attacking',
        },
      },
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 8_000,
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode === 'attack' || intent.mode === 'chase').toBe(true);
  });
});
