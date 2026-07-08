import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { checkingWildlifeProximityPreyInterrupt } from '@/components/world/wildlife/domains/checkingWildlifeProximityPreyInterrupt';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingInstance(
  speciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY,
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:1:1:0',
    speciesId,
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
      fleeTargetPoint: null,
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
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
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    ...overrides,
  };
}

describe('checkingWildlifeProximityPreyInterrupt', () => {
  it('interrupts sated wolves when deer are within proximity range', () => {
    const wolf = buildingInstance('grey-wolf');
    const deer = buildingInstance('deer', {
      instanceId: 'wildlife:2:2:0',
      position: { x: 5, y: 1.5, layer: 1 },
    });

    expect(
      checkingWildlifeProximityPreyInterrupt({
        instance: wolf,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        nearbyInstances: [deer],
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toBe(true);
  });

  it('ignores prey that are outside proximity range', () => {
    const wolf = buildingInstance('grey-wolf');
    const deer = buildingInstance('deer', {
      instanceId: 'wildlife:2:2:0',
      position: { x: 12, y: 1.5, layer: 1 },
    });

    expect(
      checkingWildlifeProximityPreyInterrupt({
        instance: wolf,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        nearbyInstances: [deer],
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toBe(false);
  });
});
