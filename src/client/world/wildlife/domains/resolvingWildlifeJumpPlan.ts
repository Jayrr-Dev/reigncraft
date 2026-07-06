/**
 * Jump planning and arc advancement for wildlife.
 *
 * Two triggers produce a jump: a water gap directly ahead of a moving animal
 * (rivers, streams) and a predator pounce at a chase target. Species tuning
 * lives in the species registry's `jump` config.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeJumpPlan
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeJumpState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

/** Probe distance ahead of the animal that must be water to trigger a gap jump. */
const DEFINING_WILDLIFE_GAP_PROBE_DISTANCE_GRID = 0.9;

/** Shortest landing distance considered for a gap jump. */
const DEFINING_WILDLIFE_GAP_MIN_JUMP_DISTANCE_GRID = 1.5;

/** Landing scan increment along the jump direction. */
const DEFINING_WILDLIFE_GAP_LANDING_SCAN_STEP_GRID = 0.5;

/** Path sampling increment used to reject jumps over lethal tiles. */
const DEFINING_WILDLIFE_JUMP_PATH_PROBE_STEP_GRID = 0.5;

/** Minimum distance to a chase target before a pounce is worth it. */
const DEFINING_WILDLIFE_POUNCE_MIN_DISTANCE_GRID = 1.8;

/** Pounces land slightly short of the target instead of on top of it. */
const DEFINING_WILDLIFE_POUNCE_LANDING_BACKOFF_GRID = 0.7;

/**
 * Returns whether the species can jump and its cooldown has elapsed.
 */
export function checkingWildlifeJumpReady(
  species: DefiningWildlifeSpeciesDefinition,
  lastJumpEndedAtMs: number | null,
  nowMs: number
): boolean {
  if (!species.jump.canJump) {
    return false;
  }

  return (
    lastJumpEndedAtMs === null ||
    nowMs - lastJumpEndedAtMs >= species.jump.jumpCooldownMs
  );
}

function buildingWildlifeJumpState(
  fromPoint: DefiningWorldPlazaWorldPoint,
  toPoint: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeJumpState {
  const distance = Math.hypot(toPoint.x - fromPoint.x, toPoint.y - fromPoint.y);
  const durationMs =
    (distance / Math.max(species.jump.jumpSpeedGridPerSecond, 0.1)) * 1000;

  return {
    fromPoint,
    toPoint,
    startedAtMs: nowMs,
    durationMs: Math.max(durationMs, 100),
    progress: 0,
  };
}

function checkingWildlifeJumpPathLethal(
  origin: DefiningWorldPlazaWorldPoint,
  direction: { x: number; y: number },
  landingDistance: number,
  species: DefiningWildlifeSpeciesDefinition,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): boolean {
  for (
    let step = DEFINING_WILDLIFE_JUMP_PATH_PROBE_STEP_GRID;
    step < landingDistance;
    step += DEFINING_WILDLIFE_JUMP_PATH_PROBE_STEP_GRID
  ) {
    const verdict = checkingWildlifeHazardAtPoint({
      point: {
        x: origin.x + direction.x * step,
        y: origin.y + direction.y * step,
        layer: origin.layer,
      },
      species,
      placedBlocks: hazardSampling.placedBlocks,
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
      isDaytime: hazardSampling.isDaytime,
    });

    if (verdict === 'lethal') {
      return true;
    }
  }

  return false;
}

export type ResolvingWildlifeWaterGapJumpPlanParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  desiredDirection: { x: number; y: number };
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
};

/**
 * Plans a jump over a water gap directly ahead, or null when not possible.
 */
export function resolvingWildlifeWaterGapJumpPlan({
  instance,
  species,
  desiredDirection,
  hazardSampling,
  nowMs,
}: ResolvingWildlifeWaterGapJumpPlanParams): DefiningWildlifeJumpState | null {
  if (
    !checkingWildlifeJumpReady(
      species,
      instance.aiState.lastJumpEndedAtMs,
      nowMs
    )
  ) {
    return null;
  }

  const length = Math.hypot(desiredDirection.x, desiredDirection.y);

  if (length <= 0.0001) {
    return null;
  }

  const direction = {
    x: desiredDirection.x / length,
    y: desiredDirection.y / length,
  };
  const origin = instance.position;
  const probeX =
    origin.x + direction.x * DEFINING_WILDLIFE_GAP_PROBE_DISTANCE_GRID;
  const probeY =
    origin.y + direction.y * DEFINING_WILDLIFE_GAP_PROBE_DISTANCE_GRID;
  const probeWater = resolvingWorldPlazaWaterAtTileIndex(
    Math.floor(probeX),
    Math.floor(probeY)
  );

  // Only water gaps are jumpable; walls and cliffs stay blocking.
  if (!probeWater) {
    return null;
  }

  const probeVerdict = checkingWildlifeHazardAtPoint({
    point: { x: probeX, y: probeY, layer: origin.layer },
    species,
    placedBlocks: hazardSampling.placedBlocks,
    placedBlocksByTile: hazardSampling.placedBlocksByTile,
    isDaytime: hazardSampling.isDaytime,
  });

  // Species that treat this water as safe (e.g. crocodiles in swamp) wade instead.
  if (probeVerdict === 'safe') {
    return null;
  }

  for (
    let landingDistance = DEFINING_WILDLIFE_GAP_MIN_JUMP_DISTANCE_GRID;
    landingDistance <= species.jump.maxJumpDistanceGrid;
    landingDistance += DEFINING_WILDLIFE_GAP_LANDING_SCAN_STEP_GRID
  ) {
    const landingPoint = {
      x: origin.x + direction.x * landingDistance,
      y: origin.y + direction.y * landingDistance,
      layer: origin.layer,
    };
    const landingVerdict = checkingWildlifeHazardAtPoint({
      point: landingPoint,
      species,
      placedBlocks: hazardSampling.placedBlocks,
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
      isDaytime: hazardSampling.isDaytime,
    });

    if (landingVerdict !== 'safe') {
      continue;
    }

    if (
      checkingWildlifeJumpPathLethal(
        origin,
        direction,
        landingDistance,
        species,
        hazardSampling
      )
    ) {
      return null;
    }

    return buildingWildlifeJumpState(origin, landingPoint, species, nowMs);
  }

  return null;
}

export type ResolvingWildlifePounceJumpPlanParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  targetPoint: DefiningWorldPlazaWorldPoint;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
};

/**
 * Plans a pounce jump at a chase target, or null when out of the pounce window.
 */
export function resolvingWildlifePounceJumpPlan({
  instance,
  species,
  targetPoint,
  hazardSampling,
  nowMs,
}: ResolvingWildlifePounceJumpPlanParams): DefiningWildlifeJumpState | null {
  if (
    !species.jump.canPounce ||
    !checkingWildlifeJumpReady(
      species,
      instance.aiState.lastJumpEndedAtMs,
      nowMs
    )
  ) {
    return null;
  }

  const origin = instance.position;
  const deltaX = targetPoint.x - origin.x;
  const deltaY = targetPoint.y - origin.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (
    distance < DEFINING_WILDLIFE_POUNCE_MIN_DISTANCE_GRID ||
    distance > species.jump.maxJumpDistanceGrid
  ) {
    return null;
  }

  const direction = { x: deltaX / distance, y: deltaY / distance };
  const landingDistance =
    distance - DEFINING_WILDLIFE_POUNCE_LANDING_BACKOFF_GRID;
  const landingPoint = {
    x: origin.x + direction.x * landingDistance,
    y: origin.y + direction.y * landingDistance,
    layer: origin.layer,
  };
  const landingVerdict = checkingWildlifeHazardAtPoint({
    point: landingPoint,
    species,
    placedBlocks: hazardSampling.placedBlocks,
    placedBlocksByTile: hazardSampling.placedBlocksByTile,
    isDaytime: hazardSampling.isDaytime,
  });

  if (landingVerdict !== 'safe') {
    return null;
  }

  if (
    checkingWildlifeJumpPathLethal(
      origin,
      direction,
      landingDistance,
      species,
      hazardSampling
    )
  ) {
    return null;
  }

  return buildingWildlifeJumpState(origin, landingPoint, species, nowMs);
}

export type AdvancingWildlifeJumpStateResult = {
  jumpState: DefiningWildlifeJumpState;
  position: DefiningWorldPlazaWorldPoint;
  isComplete: boolean;
};

/**
 * Advances an active jump to the current time and returns the arc position.
 */
export function advancingWildlifeJumpState(
  jumpState: DefiningWildlifeJumpState,
  nowMs: number
): AdvancingWildlifeJumpStateResult {
  const progress = Math.min(
    1,
    Math.max(0, (nowMs - jumpState.startedAtMs) / jumpState.durationMs)
  );

  return {
    jumpState: { ...jumpState, progress },
    position: {
      x:
        jumpState.fromPoint.x +
        (jumpState.toPoint.x - jumpState.fromPoint.x) * progress,
      y:
        jumpState.fromPoint.y +
        (jumpState.toPoint.y - jumpState.fromPoint.y) * progress,
      layer: jumpState.fromPoint.layer,
    },
    isComplete: progress >= 1,
  };
}

/**
 * Parabolic vertical lift for the sprite at a given arc progress.
 */
export function computingWildlifeJumpArcLiftPx(
  jumpArcPeakPx: number,
  progress: number
): number {
  return jumpArcPeakPx * 4 * progress * (1 - progress);
}
