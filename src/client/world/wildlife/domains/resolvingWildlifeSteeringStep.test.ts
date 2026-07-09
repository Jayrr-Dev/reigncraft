import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STEERING_WEIGHTS } from '@/components/world/wildlife/domains/definingWildlifeSteeringWeights';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSteeringStep } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalHazardAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn((tileX: number) => tileX === 5),
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

function buildingSteeringInstance(position: {
  x: number;
  y: number;
}): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:4:4:0',
    speciesId: 'deer',
    anchorId: 'wildlife:4:4:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 4.5, y: 4.5, layer: 1 },
    position: { x: position.x, y: position.y, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.8,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'wander', targetPoint: { x: 10, y: 4.5, layer: 1 } },
      facingDirection: 'Down',
      motionClip: 'walk',
      isMoving: true,
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
}

describe('resolvingWildlifeSteeringStep', () => {
  it('avoids stepping into a lethal lava tile ahead', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const instance = buildingSteeringInstance({ x: 4.5, y: 4.5 });

    const result = resolvingWildlifeSteeringStep({
      instance,
      species,
      desiredDirection: { x: 1, y: 0 },
      speedGridPerSecond: 2,
      deltaSeconds: 0.5,
      nearbyInstances: [],
      hazardSampling: {
        placedBlocks: [],
        isDaytime: true,
      },
      distanceToPlayerGrid: 5,
      nowMs: 1000,
      intentKey: 'wander:10.00:4.50',
      steeringCache: null,
    });

    expect(Math.floor(result.nextPosition.x)).not.toBe(5);
  });

  it('reports lava as lethal for standard species', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    expect(
      checkingWildlifeHazardAtPoint({
        point: { x: 5.5, y: 4.5, layer: 1 },
        species,
        isDaytime: true,
      })
    ).toBe('lethal');
  });

  it('curves toward a reverse heading instead of snapping 180 degrees', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const instance = buildingSteeringInstance({ x: 10.5, y: 10.5 });
    const deltaSeconds = 1 / 60;

    const result = resolvingWildlifeSteeringStep({
      instance,
      species,
      desiredDirection: { x: -1, y: 0 },
      speedGridPerSecond: 4,
      deltaSeconds,
      nearbyInstances: [],
      hazardSampling: {
        placedBlocks: [],
        isDaytime: true,
      },
      distanceToPlayerGrid: 5,
      nowMs: 1000,
      intentKey: 'flee:0.00:10.50',
      steeringCache: {
        directionX: 1,
        directionY: 0,
        cachedAtMs: 0,
        intentKey: 'flee:1.00:10.50',
      },
    });

    expect(result.moved).toBe(true);
    expect(result.steeringCache).not.toBeNull();

    const nextHeadingX = result.steeringCache!.directionX;
    const nextHeadingY = result.steeringCache!.directionY;
    const turnRadians = Math.atan2(nextHeadingY, nextHeadingX);
    const maxTurnRadians =
      DEFINING_WILDLIFE_STEERING_WEIGHTS.maxTurnRadiansPerSecond * deltaSeconds;

    // Still mostly heading right after one frame; not a full reverse snap.
    expect(nextHeadingX).toBeGreaterThan(0.9);
    expect(Math.abs(turnRadians)).toBeLessThanOrEqual(maxTurnRadians + 0.001);
  });

  it('keeps heading continuity across chase intent-key churn', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    let instance = buildingSteeringInstance({ x: 10.5, y: 10.5 });
    let steeringCache = {
      directionX: 1,
      directionY: 0,
      cachedAtMs: 0,
      intentKey: 'chase:player:11.00:10.50',
    };
    const deltaSeconds = 1 / 60;
    const headings: number[] = [];

    for (let step = 0; step < 12; step += 1) {
      const result = resolvingWildlifeSteeringStep({
        instance,
        species,
        desiredDirection: { x: 0, y: 1 },
        speedGridPerSecond: 4,
        deltaSeconds,
        nearbyInstances: [],
        hazardSampling: {
          placedBlocks: [],
          isDaytime: true,
        },
        distanceToPlayerGrid: 5,
        nowMs: 1000 + step * 16,
        intentKey: `chase:player:${(11 + step * 0.03).toFixed(2)}:10.50`,
        steeringCache,
      });

      expect(result.moved).toBe(true);
      expect(result.steeringCache).not.toBeNull();

      steeringCache = result.steeringCache!;
      headings.push(Math.atan2(steeringCache.directionY, steeringCache.directionX));
      instance = {
        ...instance,
        position: result.nextPosition,
      };
    }

    for (let index = 1; index < headings.length; index += 1) {
      const delta = Math.abs(headings[index]! - headings[index - 1]!);
      const wrapped = Math.min(delta, Math.PI * 2 - delta);
      expect(wrapped).toBeLessThanOrEqual(
        DEFINING_WILDLIFE_STEERING_WEIGHTS.maxTurnRadiansPerSecond *
          deltaSeconds +
          0.001
      );
    }

    // After ~200ms of capped turns, heading has rotated toward +Y.
    expect(headings[headings.length - 1]!).toBeGreaterThan(0.4);
  });
});
