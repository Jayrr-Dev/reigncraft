import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { checkingWildlifeAggressiveHerbivoreMayFight } from '@/components/world/wildlife/domains/checkingWildlifeAggressiveHerbivoreMayFight';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingHerbivoreInstance(
  speciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY,
  aggressionLevel: DefiningWildlifeInstance['aggressionLevel'],
  activeTargetId: string | null
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:test:0',
    speciesId,
    anchorId: 'wildlife:test:0',
    aggressionLevel,
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 100,
    },
    hungerState: {
      hungerRatio: 0.9,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: {
      staminaRatio: 1,
      isExhausted: false,
      runningForSeconds: 0,
    },
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
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    docileFollowUntilMs: null,
    docileLastReactAtMs: null,
    },
    aggroState: {
      threats: activeTargetId
        ? [{ targetId: activeTargetId, threat: 5, lastUpdatedAtMs: 0 }]
        : [],
      activeTargetId,
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
}

describe('checkingWildlifeAggressiveHerbivoreMayFight', () => {
  it('returns true for aggressive herbivores with an active target', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;
    const instance = buildingHerbivoreInstance(
      'chicken',
      'aggressive',
      'player-1'
    );

    expect(checkingWildlifeAggressiveHerbivoreMayFight(species, instance)).toBe(
      true
    );
  });

  it('returns false for tame or normal herbivores even when aggroed', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const tameInstance = buildingHerbivoreInstance('deer', 'tame', 'player-1');
    const normalInstance = buildingHerbivoreInstance(
      'deer',
      'normal',
      'player-1'
    );

    expect(
      checkingWildlifeAggressiveHerbivoreMayFight(species, tameInstance)
    ).toBe(false);
    expect(
      checkingWildlifeAggressiveHerbivoreMayFight(species, normalInstance)
    ).toBe(false);
  });

  it('returns false for aggressive predators', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingHerbivoreInstance(
      'grey-wolf',
      'aggressive',
      'player-1'
    );

    expect(checkingWildlifeAggressiveHerbivoreMayFight(species, instance)).toBe(
      false
    );
  });
});
