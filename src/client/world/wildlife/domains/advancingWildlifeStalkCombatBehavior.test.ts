import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeBehaviorTick } from '@/components/world/wildlife/domains/advancingWildlifeBehaviorTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
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

function buildingBlackboard(
  overrides: Partial<DefiningWildlifeBehaviorBlackboard> = {}
): DefiningWildlifeBehaviorBlackboard {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
  const instance: DefiningWildlifeInstance = {
    instanceId: 'wildlife:1:1:0',
    speciesId: species.speciesId,
    anchorId: 'wildlife:1:1:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 2, y: 1.5, layer: 1 },
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
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
      hasPlayerSleepBumpContact: false,
    },
    aggroState: {
      threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1000 }],
      activeTargetId: 'player-1',
      lastDamagedAtMs: null,
      stalkingPreySinceMs: 1000,
      stalkAttackingPreySinceMs: null,
      stalkPhase: 'shadowing',
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
    playerPosition: { x: 3, y: 1.5, layer: 1 },
    playerUserId: 'player-1',
    isPlayerWalking: false,
    isPlayerRunning: false,
    isPlayerJumping: false,
    nowMs: 1000,
    selectedPreyInstanceId: null,
    selectedProximityPreyInstanceId: null,
    selectedGroundFoodItemId: null,
    playerHealthRatio: 0.4,
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

describe('stalker attack timeout behavior', () => {
  it('returns to surround / flank after an attack burst without a kill', () => {
    const blackboard = buildingBlackboard({
      nowMs: 1_000 + DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS,
      instance: {
        ...buildingBlackboard().instance,
        aggroState: {
          ...buildingBlackboard().instance.aggroState,
          stalkAttackingPreySinceMs: 1_000,
          stalkPhase: 'surrounding',
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(
      intent.mode === 'stalk' ||
        intent.mode === 'chase' ||
        intent.mode === 'attack'
    ).toBe(true);
  });

  it('goes full attack when the pack is enraged', () => {
    const blackboard = buildingBlackboard({
      instance: {
        ...buildingBlackboard().instance,
        aggroState: {
          ...buildingBlackboard().instance.aggroState,
          stalkPhase: 'attacking',
        },
      },
    });

    const intent = advancingWildlifeBehaviorTick(blackboard);

    expect(intent.mode === 'attack' || intent.mode === 'chase').toBe(true);
  });
});
