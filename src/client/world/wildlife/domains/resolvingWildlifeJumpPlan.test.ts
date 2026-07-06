import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  advancingWildlifeJumpState,
  checkingWildlifeJumpReady,
  computingWildlifeJumpArcLiftPx,
  resolvingWildlifePounceJumpPlan,
  resolvingWildlifeWaterGapJumpPlan,
} from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
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

// A two-tile river covers tile x = 5 and x = 6; everything else is land.
vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn((tileX: number) =>
      tileX === 5 || tileX === 6 ? 'river' : null
    ),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex',
  () => ({
    resolvingWorldPlazaBiomeAtTileIndex: vi.fn(() => ({ kind: 'plains' })),
  })
);

vi.mock('@/components/world/collision', () => ({
  checkingWorldCollisionBlockedAtPoint: vi.fn(() => false),
}));

function buildingJumpInstance(position: {
  x: number;
  y: number;
}): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:4:4:0',
    speciesId: 'deer',
    anchorId: 'wildlife:4:4:0',
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
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
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
}

const HAZARD_SAMPLING = { placedBlocks: [], isDaytime: true } as const;

describe('resolvingWildlifeWaterGapJumpPlan', () => {
  it('plans a jump over a river gap onto the far bank', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const instance = buildingJumpInstance({ x: 4.5, y: 4.5 });

    const plan = resolvingWildlifeWaterGapJumpPlan({
      instance,
      species,
      desiredDirection: { x: 1, y: 0 },
      hazardSampling: HAZARD_SAMPLING,
      nowMs: 1000,
    });

    expect(plan).not.toBeNull();
    expect(plan!.toPoint.x).toBeGreaterThanOrEqual(7);
    expect(plan!.durationMs).toBeGreaterThan(0);
  });

  it('returns null when no water is ahead', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const instance = buildingJumpInstance({ x: 4.5, y: 4.5 });

    const plan = resolvingWildlifeWaterGapJumpPlan({
      instance,
      species,
      desiredDirection: { x: -1, y: 0 },
      hazardSampling: HAZARD_SAMPLING,
      nowMs: 1000,
    });

    expect(plan).toBeNull();
  });

  it('returns null for species that cannot jump', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.cow;
    const instance = buildingJumpInstance({ x: 4.5, y: 4.5 });

    const plan = resolvingWildlifeWaterGapJumpPlan({
      instance,
      species,
      desiredDirection: { x: 1, y: 0 },
      hazardSampling: HAZARD_SAMPLING,
      nowMs: 1000,
    });

    expect(plan).toBeNull();
  });

  it('respects the jump cooldown', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    expect(checkingWildlifeJumpReady(species, 1000, 1500)).toBe(false);
    expect(
      checkingWildlifeJumpReady(
        species,
        1000,
        1000 + species.jump.jumpCooldownMs
      )
    ).toBe(true);
  });
});

describe('resolvingWildlifePounceJumpPlan', () => {
  it('plans a pounce toward a target inside the pounce window', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingJumpInstance({ x: 1, y: 4.5 });

    const plan = resolvingWildlifePounceJumpPlan({
      instance,
      species,
      targetPoint: { x: 4, y: 4.5, layer: 1 },
      hazardSampling: HAZARD_SAMPLING,
      nowMs: 1000,
    });

    expect(plan).not.toBeNull();
    // Lands short of the target, not on top of it.
    expect(plan!.toPoint.x).toBeLessThan(4);
    expect(plan!.toPoint.x).toBeGreaterThan(2);
  });

  it('returns null when the target is closer than the pounce window', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingJumpInstance({ x: 1, y: 4.5 });

    const plan = resolvingWildlifePounceJumpPlan({
      instance,
      species,
      targetPoint: { x: 2, y: 4.5, layer: 1 },
      hazardSampling: HAZARD_SAMPLING,
      nowMs: 1000,
    });

    expect(plan).toBeNull();
  });

  it('returns null for species without pounce', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const instance = buildingJumpInstance({ x: 1, y: 4.5 });

    const plan = resolvingWildlifePounceJumpPlan({
      instance,
      species,
      targetPoint: { x: 4, y: 4.5, layer: 1 },
      hazardSampling: HAZARD_SAMPLING,
      nowMs: 1000,
    });

    expect(plan).toBeNull();
  });
});

describe('advancingWildlifeJumpState', () => {
  it('interpolates the arc and completes at the landing point', () => {
    const jumpState = {
      fromPoint: { x: 0, y: 0, layer: 1 },
      toPoint: { x: 4, y: 0, layer: 1 },
      startedAtMs: 0,
      durationMs: 1000,
      progress: 0,
    };

    const midway = advancingWildlifeJumpState(jumpState, 500);

    expect(midway.position.x).toBeCloseTo(2);
    expect(midway.isComplete).toBe(false);
    expect(midway.jumpState.progress).toBeCloseTo(0.5);

    const landed = advancingWildlifeJumpState(jumpState, 1200);

    expect(landed.position.x).toBeCloseTo(4);
    expect(landed.isComplete).toBe(true);
  });

  it('peaks the arc lift at mid-jump and grounds it at both ends', () => {
    expect(computingWildlifeJumpArcLiftPx(20, 0)).toBe(0);
    expect(computingWildlifeJumpArcLiftPx(20, 0.5)).toBe(20);
    expect(computingWildlifeJumpArcLiftPx(20, 1)).toBe(0);
  });
});
