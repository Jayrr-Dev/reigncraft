import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { checkingWildlifeFleeTargetReachableFromPosition } from '@/components/world/wildlife/domains/checkingWildlifeFleeTargetReachableFromPosition';
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
  checkingWorldCollisionBlockedAtPoint: vi.fn(
    (point: { x: number; y: number }) => point.x >= 10
  ),
}));

import {
  checkingWildlifeFleesFromPlayerCollision,
  checkingWildlifeIsHuntingPlayer,
  checkingWildlifeIsStartledFromPlayerCollision,
  resolvingWildlifeFleeFromThreatPointIntent,
  resolvingWildlifeLockedPlayerFleeIntent,
  resolvingWildlifePlayerCollisionStartleUntilMs,
} from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';

const DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING = {
  placedBlocks: [],
  isDaytime: true,
} as const;

function buildingHuntingInstance(
  targetInstanceId: string
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:wolf:1',
    speciesId: 'grey-wolf',
    anchorId: 'wildlife:wolf:1',
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
      intent: {
        mode: 'chase',
        targetInstanceId,
        targetPoint: { x: 5, y: 5, layer: 1 },
      },
      facingDirection: 'Down',
      motionClip: 'run',
      isMoving: true,
      lastThinkAtMs: 0,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: null,
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
      activeTargetId: targetInstanceId,
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
  };
}

describe('resolvingWildlifePlayerCollisionStartle', () => {
  it('passive and skittish temperaments flee on player contact', () => {
    expect(checkingWildlifeFleesFromPlayerCollision('passive', 'normal')).toBe(
      true
    );
    expect(checkingWildlifeFleesFromPlayerCollision('skittish', 'normal')).toBe(
      true
    );
    expect(
      checkingWildlifeFleesFromPlayerCollision('retaliator', 'normal')
    ).toBe(true);
  });

  it('predators and ambushers do not flee on player contact', () => {
    expect(checkingWildlifeFleesFromPlayerCollision('predator', 'normal')).toBe(
      false
    );
    expect(checkingWildlifeFleesFromPlayerCollision('ambusher', 'normal')).toBe(
      false
    );
  });

  it('aggressive spawns never flee on player contact', () => {
    expect(
      checkingWildlifeFleesFromPlayerCollision('skittish', 'aggressive')
    ).toBe(false);
  });

  it('tame spawns always flee on player contact', () => {
    expect(checkingWildlifeFleesFromPlayerCollision('predator', 'tame')).toBe(
      true
    );
  });

  it('detects when an animal is actively hunting the player', () => {
    const huntingInstance = buildingHuntingInstance('player-1');

    expect(checkingWildlifeIsHuntingPlayer(huntingInstance, 'player-1')).toBe(
      true
    );
    expect(checkingWildlifeIsHuntingPlayer(huntingInstance, 'other')).toBe(
      false
    );
  });

  it('resolves a flee target away from the threat point', () => {
    const intent = resolvingWildlifeFleeFromThreatPointIntent({
      position: { x: 5, y: 5, layer: 1 },
      threatPoint: { x: 8, y: 5, layer: 1 },
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
    });

    expect(intent.mode).toBe('flee');
    expect(intent.targetPoint?.x).toBeLessThan(5);
    expect(intent.targetPoint?.y).toBe(5);
  });

  it('reuses a locked flee heading instead of recomputing toward the player', () => {
    const lockedTarget = { x: 1, y: 9, layer: 1 };
    const intent = resolvingWildlifeLockedPlayerFleeIntent({
      position: { x: 5, y: 5, layer: 1 },
      playerPosition: { x: 8, y: 5, layer: 1 },
      lockedFleeTargetPoint: lockedTarget,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
    });

    expect(intent.targetPoint).toEqual(lockedTarget);
  });

  it('repicks a reachable flee heading when the locked target is blocked', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;
    const intent = resolvingWildlifeLockedPlayerFleeIntent({
      position: { x: 9.5, y: 4.5, layer: 1 },
      playerPosition: { x: 8, y: 4.5, layer: 1 },
      lockedFleeTargetPoint: { x: 12, y: 4.5, layer: 1 },
      species,
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
    });

    expect(intent.mode).toBe('flee');
    expect(intent.targetPoint).not.toEqual({ x: 12, y: 4.5, layer: 1 });
    expect(
      checkingWildlifeFleeTargetReachableFromPosition({
        position: { x: 9.5, y: 4.5, layer: 1 },
        fleeTargetPoint: intent.targetPoint!,
        species,
        hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      })
    ).toBe(true);
  });

  it('tracks startle duration from collision time', () => {
    expect(resolvingWildlifePlayerCollisionStartleUntilMs(1000)).toBe(3000);
    expect(checkingWildlifeIsStartledFromPlayerCollision(3000, 2500)).toBe(
      true
    );
    expect(checkingWildlifeIsStartledFromPlayerCollision(3000, 3000)).toBe(
      false
    );
    expect(checkingWildlifeIsStartledFromPlayerCollision(null, 1000)).toBe(
      false
    );
  });
});
