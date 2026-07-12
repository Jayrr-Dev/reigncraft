/**
 * Boulder cover effects on wildlife player aggro.
 */

import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const checkingWildlifePlayerOccludedByColumnRockMock = vi.fn(() => false);

vi.mock(
  '@/components/world/wildlife/domains/checkingWildlifePlayerOccludedByColumnRock',
  () => ({
    checkingWildlifePlayerOccludedByColumnRock: () =>
      checkingWildlifePlayerOccludedByColumnRockMock(),
    checkingWildlifeSightLineOccludedByDiamonds: vi.fn(() => false),
  })
);

import { advancingWildlifeAggroTick } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import {
  DEFINING_WILDLIFE_BOULDER_COVER_CHASE_BREAK_DISTANCE_GRID,
  DEFINING_WILDLIFE_BOULDER_COVER_DETECTION_THREAT_MULTIPLIER,
} from '@/components/world/wildlife/domains/definingWildlifeBoulderCoverConstants';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'grey-wolf',
    anchorId: 'wildlife:0:0:0',
    aggressionLevel: 'aggressive',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 0.5, y: 0.5, layer: 1 },
    position: { x: 0.5, y: 0.5, layer: 1 },
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
    ...overrides,
  };
}

describe('advancingWildlifeAggroTick boulder cover', () => {
  beforeEach(() => {
    checkingWildlifePlayerOccludedByColumnRockMock.mockReset();
    checkingWildlifePlayerOccludedByColumnRockMock.mockReturnValue(false);
  });

  it('reduces on-sight proximity threat while the player is behind a boulder', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingTestWildlifeInstance({
      position: { x: 1, y: 1, layer: 1 },
    });

    const exposedAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 1.5, y: 1.5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    checkingWildlifePlayerOccludedByColumnRockMock.mockReturnValue(true);

    const coveredAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 1.5, y: 1.5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    const exposedThreat = exposedAggro.threats[0]?.threat ?? 0;
    const coveredThreat = coveredAggro.threats[0]?.threat ?? 0;

    expect(exposedThreat).toBeGreaterThan(0);
    expect(coveredThreat).toBeCloseTo(
      exposedThreat *
        DEFINING_WILDLIFE_BOULDER_COVER_DETECTION_THREAT_MULTIPLIER,
      5
    );
  });

  it('drops player chase aggro when occluded and far enough', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const farDistance =
      DEFINING_WILDLIFE_BOULDER_COVER_CHASE_BREAK_DISTANCE_GRID + 1;
    const instance = buildingTestWildlifeInstance({
      position: { x: 0, y: 0, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'player-1',
      },
    });

    checkingWildlifePlayerOccludedByColumnRockMock.mockReturnValue(true);

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: farDistance, y: 0, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 0.05,
      nowMs: 50,
    });

    expect(nextAggro.activeTargetId).toBeNull();
    expect(
      nextAggro.threats.find((entry) => entry.targetId === 'player-1')
    ).toBeUndefined();
    expect(nextAggro.stalkLockedPreyTargetId ?? null).toBeNull();
  });

  it('keeps chase aggro when occluded but still close', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingTestWildlifeInstance({
      position: { x: 0, y: 0, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
      },
    });

    checkingWildlifePlayerOccludedByColumnRockMock.mockReturnValue(true);

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 3, y: 0, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 0.05,
      nowMs: 50,
    });

    expect(nextAggro.activeTargetId).toBe('player-1');
    expect(
      nextAggro.threats.find((entry) => entry.targetId === 'player-1')?.threat
    ).toBeGreaterThan(0);
  });
});
