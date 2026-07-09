/**
 * Jump planning and arc advancement for wildlife.
 *
 * Gap jumps clear water or jumpable terrain ahead of a moving animal. Predators
 * may also pounce at a chase target. Species tuning lives in the species
 * registry's `jump` config.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeJumpPlan
 */

import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeJumpState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

/** Forward scan step used to find a gap and a clear landing beyond it. */
const DEFINING_WILDLIFE_GAP_SCAN_STEP_GRID = 0.25;

/**
 * Furthest distance ahead to look for the start of a jumpable gap. Keeps animals
 * from committing while still several tiles from the obstacle.
 */
const DEFINING_WILDLIFE_GAP_DETECT_MAX_GRID = 2.5;

/** Shortest landing distance considered for a gap jump. */
const DEFINING_WILDLIFE_GAP_MIN_JUMP_DISTANCE_GRID = 1.25;

/** Extra clearance past the last water sample before accepting a landing. */
const DEFINING_WILDLIFE_GAP_LANDING_CLEARANCE_GRID = 0.35;

/** Jumpable gap kinds shared with Safe-terrain seeking. */
export type DefiningWildlifeGapKind = 'water' | 'terrain';

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

function resolvingWildlifeJumpLandingPoint(
  origin: DefiningWorldPlazaWorldPoint,
  direction: { x: number; y: number },
  landingDistance: number,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): DefiningWorldPlazaWorldPoint {
  const landingX = origin.x + direction.x * landingDistance;
  const landingY = origin.y + direction.y * landingDistance;
  const landingTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint({
    x: landingX,
    y: landingY,
    layer: origin.layer,
  });
  const landingLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    landingTile.tileX,
    landingTile.tileY,
    hazardSampling.placedBlocks,
    hazardSampling.placedBlocksByTile
  );

  return {
    x: landingX,
    y: landingY,
    layer: landingLayer,
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

/**
 * Classifies a forward sample as a jumpable gap, an unjumpable wall, or clear.
 * Shared by the jump planner and Safe-terrain seeking.
 */
export function resolvingWildlifeGapSampleKind(
  point: DefiningWorldPlazaWorldPoint,
  originLayer: number,
  species: DefiningWildlifeSpeciesDefinition,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): DefiningWildlifeGapKind | 'unjumpable' | null {
  const waterKind = resolvingWorldPlazaWaterAtTileIndex(
    Math.floor(point.x),
    Math.floor(point.y)
  );

  if (waterKind) {
    const waterVerdict = checkingWildlifeHazardAtPoint({
      point,
      species,
      placedBlocks: hazardSampling.placedBlocks,
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
      isDaytime: hazardSampling.isDaytime,
    });

    // Species that treat this water as safe (e.g. crocodiles in swamp) wade instead.
    return waterVerdict === 'safe' ? null : 'water';
  }

  const verdict = checkingWildlifeHazardAtPoint({
    point,
    species,
    placedBlocks: hazardSampling.placedBlocks,
    placedBlocksByTile: hazardSampling.placedBlocksByTile,
    isDaytime: hazardSampling.isDaytime,
  });

  if (verdict === 'lethal') {
    return 'unjumpable';
  }

  if (verdict !== 'blocked') {
    return null;
  }

  const sampleTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(point);
  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    sampleTile.tileX,
    sampleTile.tileY,
    hazardSampling.placedBlocks,
    hazardSampling.placedBlocksByTile
  );
  const layerDelta = surfaceLayer - originLayer;

  if (layerDelta > DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX) {
    return 'unjumpable';
  }

  // One-layer stairs are walked, not jumped.
  if (
    layerDelta === DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA
  ) {
    return null;
  }

  return 'terrain';
}

export type ResolvingWildlifeTerrainGapJumpPlanParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  desiredDirection: { x: number; y: number };
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
};

/** @deprecated Prefer `resolvingWildlifeTerrainGapJumpPlan`. */
export type ResolvingWildlifeWaterGapJumpPlanParams =
  ResolvingWildlifeTerrainGapJumpPlanParams;

/**
 * Plans a jump over water or jumpable terrain ahead, or null when not possible.
 *
 * Scans forward within detect range for a gap, then picks the nearest safe
 * landing at the destination tile surface layer.
 */
export function resolvingWildlifeTerrainGapJumpPlan({
  instance,
  species,
  desiredDirection,
  hazardSampling,
  nowMs,
}: ResolvingWildlifeTerrainGapJumpPlanParams): DefiningWildlifeJumpState | null {
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
  const originLayer = origin.layer ?? 1;
  const detectMax = Math.min(
    DEFINING_WILDLIFE_GAP_DETECT_MAX_GRID,
    species.jump.maxJumpDistanceGrid
  );

  let gapKind: DefiningWildlifeGapKind | null = null;
  let gapStartDistance: number | null = null;
  let gapEndDistance: number | null = null;

  for (
    let sampleDistance = DEFINING_WILDLIFE_GAP_SCAN_STEP_GRID;
    sampleDistance <= detectMax + DEFINING_WILDLIFE_GAP_SCAN_STEP_GRID;
    sampleDistance += DEFINING_WILDLIFE_GAP_SCAN_STEP_GRID
  ) {
    const samplePoint = {
      x: origin.x + direction.x * sampleDistance,
      y: origin.y + direction.y * sampleDistance,
      layer: originLayer,
    };
    const sampleKind = resolvingWildlifeGapSampleKind(
      samplePoint,
      originLayer,
      species,
      hazardSampling
    );

    if (sampleKind === 'unjumpable') {
      if (gapStartDistance === null) {
        return null;
      }

      break;
    }

    if (sampleKind === 'water' || sampleKind === 'terrain') {
      if (gapStartDistance === null) {
        if (sampleDistance > detectMax) {
          break;
        }

        gapKind = sampleKind;
        gapStartDistance = sampleDistance;
      } else if (gapKind !== sampleKind) {
        break;
      }

      gapEndDistance = sampleDistance;
      continue;
    }

    if (gapStartDistance !== null) {
      break;
    }
  }

  if (
    gapKind === null ||
    gapStartDistance === null ||
    gapEndDistance === null
  ) {
    return null;
  }

  const minLandingDistance = Math.max(
    DEFINING_WILDLIFE_GAP_MIN_JUMP_DISTANCE_GRID,
    gapKind === 'water'
      ? gapEndDistance + DEFINING_WILDLIFE_GAP_LANDING_CLEARANCE_GRID
      : gapStartDistance
  );

  for (
    let landingDistance = minLandingDistance;
    landingDistance <= species.jump.maxJumpDistanceGrid;
    landingDistance += DEFINING_WILDLIFE_GAP_SCAN_STEP_GRID
  ) {
    const landingPoint = resolvingWildlifeJumpLandingPoint(
      origin,
      direction,
      landingDistance,
      hazardSampling
    );
    const landingLayerDelta = (landingPoint.layer ?? originLayer) - originLayer;

    if (
      landingLayerDelta > DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX
    ) {
      continue;
    }

    if (gapKind === 'water') {
      const landingWater = resolvingWorldPlazaWaterAtTileIndex(
        Math.floor(landingPoint.x),
        Math.floor(landingPoint.y)
      );

      if (landingWater) {
        const waterVerdict = checkingWildlifeHazardAtPoint({
          point: landingPoint,
          species,
          placedBlocks: hazardSampling.placedBlocks,
          placedBlocksByTile: hazardSampling.placedBlocksByTile,
          isDaytime: hazardSampling.isDaytime,
        });

        if (waterVerdict !== 'safe') {
          continue;
        }
      }
    }

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
      continue;
    }

    return buildingWildlifeJumpState(origin, landingPoint, species, nowMs);
  }

  return null;
}

/**
 * Plans a jump over a water or terrain gap ahead (alias of terrain gap planner).
 */
export function resolvingWildlifeWaterGapJumpPlan(
  params: ResolvingWildlifeWaterGapJumpPlanParams
): DefiningWildlifeJumpState | null {
  return resolvingWildlifeTerrainGapJumpPlan(params);
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
  const landingPoint = resolvingWildlifeJumpLandingPoint(
    origin,
    direction,
    landingDistance,
    hazardSampling
  );
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

  const isComplete = progress >= 1;

  return {
    jumpState: { ...jumpState, progress },
    position: {
      x:
        jumpState.fromPoint.x +
        (jumpState.toPoint.x - jumpState.fromPoint.x) * progress,
      y:
        jumpState.fromPoint.y +
        (jumpState.toPoint.y - jumpState.fromPoint.y) * progress,
      // Hold takeoff layer mid-arc; snap to planned landing layer on complete.
      layer: isComplete ? jumpState.toPoint.layer : jumpState.fromPoint.layer,
    },
    isComplete,
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
