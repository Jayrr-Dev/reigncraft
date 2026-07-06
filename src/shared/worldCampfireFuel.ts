import { checkingWorldBurnStageMetadataIsBurnt } from './worldBurnStage';
import {
  buildingWorldFireDevvitTileKey,
  WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID,
  WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES,
  WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID,
} from './worldFireDevvit';

/**
 * Campfire fuel duration and flame heat from wood blocks placed near the pit.
 *
 * Wood within {@link WORLD_CAMPFIRE_FUEL_RADIUS_TILES} (same as lava temperature
 * neighbor ring 2) sets burn tier and how long the fire lasts. Inventory wood
 * consumed when lighting or refueling counts as one wood unit toward duration.
 *
 * @module shared/worldCampfireFuel
 */

/** Chebyshev tile radius for counting fuel wood around a campfire. */
export const WORLD_CAMPFIRE_FUEL_RADIUS_TILES =
  WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES;

/** 3 minutes of burn per wood while in the small tier (1–3 wood total). */
export const WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_SMALL_TIER = 180_000;

/** 1 minute of burn per wood while in the big tier (4+ wood total). */
export const WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_BIG_TIER = 60_000;

/** Wood count where fuel switches from 3 min/wood to 1 min/wood. */
export const WORLD_CAMPFIRE_FUEL_BIG_TIER_MIN_WOOD_COUNT = 4;

/** Max stored campfire fuel (20 minutes). */
export const WORLD_CAMPFIRE_FUEL_MAX_MS = 1_200_000;

/** Visual burn tier driven by nearby placed wood blocks. */
export type WorldCampfireBurnTier = 'weak' | 'small' | 'mid' | 'big';

/** Lightmap hole radius scale per burn tier (1 ≈ player torch). */
export const WORLD_CAMPFIRE_BURN_TIER_LIGHT_RADIUS_SCALE: Record<
  WorldCampfireBurnTier,
  number
> = {
  weak: 0.62,
  small: 0.95,
  mid: 1.35,
  big: 2.2,
};

/** Light hole brightness per burn tier before fuel dimming (0..1). */
export const WORLD_CAMPFIRE_BURN_TIER_LIGHT_BRIGHTNESS: Record<
  WorldCampfireBurnTier,
  number
> = {
  weak: 0.32,
  small: 0.55,
  mid: 0.82,
  big: 1,
};

/** Extra flame sprite scale per burn tier on top of intensity tier sheets. */
export const WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER: Record<
  WorldCampfireBurnTier,
  number
> = {
  weak: 0.55,
  small: 0.68,
  mid: 0.82,
  big: 0.95,
};

/** Campfire flame sheets (group 5) are authored large; shrink relative to spreading fire. */
export const WORLD_CAMPFIRE_FLAME_BASE_DISPLAY_SCALE = 0.58;

/** Minimal placed-block data needed to count nearby fuel wood. */
export type WorldCampfireFuelPlacedBlockAtTile = {
  readonly definitionId: string;
  readonly isBurnt: boolean;
};

const WORLD_CAMPFIRE_FUEL_WOOD_BLOCK_DEFINITION_IDS = new Set([
  WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID,
  'functional:door:wooden',
  'functional:sign:wooden',
]);

/**
 * Returns true when a placed block definition counts as campfire fuel wood.
 */
export function checkingWorldCampfireFuelWoodBlockDefinitionId(
  definitionId: string
): boolean {
  return WORLD_CAMPFIRE_FUEL_WOOD_BLOCK_DEFINITION_IDS.has(definitionId);
}

function computingWorldCampfireChebyshevTileDistance(
  fromTileX: number,
  fromTileY: number,
  toTileX: number,
  toTileY: number
): number {
  return Math.max(Math.abs(fromTileX - toTileX), Math.abs(fromTileY - toTileY));
}

/**
 * Counts unburnt wood fuel blocks within the campfire fuel radius.
 *
 * The campfire tile itself is excluded; only surrounding placed wood counts
 * toward flame heat (inventory wood is handled separately for duration).
 */
export function countingWorldCampfireNearbyFuelWoodBlocks(
  campfireTileX: number,
  campfireTileY: number,
  campfireWorldLayer: number,
  placedBlocksByTile: ReadonlyMap<string, WorldCampfireFuelPlacedBlockAtTile>
): number {
  let woodCount = 0;

  for (
    let offsetTileY = -WORLD_CAMPFIRE_FUEL_RADIUS_TILES;
    offsetTileY <= WORLD_CAMPFIRE_FUEL_RADIUS_TILES;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX = -WORLD_CAMPFIRE_FUEL_RADIUS_TILES;
      offsetTileX <= WORLD_CAMPFIRE_FUEL_RADIUS_TILES;
      offsetTileX += 1
    ) {
      if (offsetTileX === 0 && offsetTileY === 0) {
        continue;
      }

      const tileKey = buildingWorldFireDevvitTileKey(
        campfireTileX + offsetTileX,
        campfireTileY + offsetTileY,
        campfireWorldLayer
      );
      const block = placedBlocksByTile.get(tileKey);

      if (
        !block ||
        block.isBurnt ||
        !checkingWorldCampfireFuelWoodBlockDefinitionId(block.definitionId) ||
        block.definitionId === WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID
      ) {
        continue;
      }

      woodCount += 1;
    }
  }

  return woodCount;
}

/**
 * Counts nearby fuel wood from a placed-block list (client-side).
 */
export function countingWorldCampfireNearbyFuelWoodBlocksFromPlacedBlocks(
  campfireTileX: number,
  campfireTileY: number,
  campfireWorldLayer: number,
  placedBlocks: readonly {
    readonly definitionId: string;
    readonly tilePosition: { readonly tileX: number; readonly tileY: number };
    readonly worldLayer?: number;
    readonly metadata: Readonly<
      Record<string, string | number | boolean | null>
    >;
  }[]
): number {
  let woodCount = 0;

  for (const block of placedBlocks) {
    const blockWorldLayer =
      typeof block.worldLayer === 'number' && Number.isFinite(block.worldLayer)
        ? block.worldLayer
        : 0;

    if (blockWorldLayer !== campfireWorldLayer) {
      continue;
    }

    if (
      block.definitionId === WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID ||
      checkingWorldBurnStageMetadataIsBurnt(block.metadata) ||
      !checkingWorldCampfireFuelWoodBlockDefinitionId(block.definitionId)
    ) {
      continue;
    }

    if (
      block.tilePosition.tileX === campfireTileX &&
      block.tilePosition.tileY === campfireTileY
    ) {
      continue;
    }

    if (
      computingWorldCampfireChebyshevTileDistance(
        campfireTileX,
        campfireTileY,
        block.tilePosition.tileX,
        block.tilePosition.tileY
      ) > WORLD_CAMPFIRE_FUEL_RADIUS_TILES
    ) {
      continue;
    }

    woodCount += 1;
  }

  return woodCount;
}

/**
 * Total burn duration from a wood count (placed + inventory).
 *
 * - 1 wood → 3 min (small)
 * - 3 wood → 9 min (mid)
 * - 4+ wood → 1 min per wood (big)
 */
export function computingWorldCampfireFuelMsFromWoodCount(
  totalWoodCount: number
): number {
  if (totalWoodCount <= 0) {
    return 0;
  }

  if (totalWoodCount < WORLD_CAMPFIRE_FUEL_BIG_TIER_MIN_WOOD_COUNT) {
    return totalWoodCount * WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_SMALL_TIER;
  }

  return totalWoodCount * WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_BIG_TIER;
}

/**
 * Fuel added when consuming one inventory wood while refueling.
 *
 * Uses the current nearby placed-wood tier to pick 3 min vs 1 min per wood.
 */
export function computingWorldCampfireFuelMsFromInventoryWoodRefuel(
  nearbyPlacedWoodCount: number
): number {
  if (nearbyPlacedWoodCount >= WORLD_CAMPFIRE_FUEL_BIG_TIER_MIN_WOOD_COUNT) {
    return WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_BIG_TIER;
  }

  return WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_SMALL_TIER;
}

/**
 * Maps nearby placed wood count to a visual burn tier label.
 */
export function resolvingWorldCampfireBurnTierFromNearbyWoodCount(
  nearbyPlacedWoodCount: number
): WorldCampfireBurnTier {
  if (nearbyPlacedWoodCount <= 0) {
    return 'weak';
  }

  if (nearbyPlacedWoodCount < 3) {
    return 'small';
  }

  if (nearbyPlacedWoodCount === 3) {
    return 'mid';
  }

  return 'big';
}

/**
 * Maps nearby placed wood to flame intensity (0..1) for sprite tier selection.
 *
 * Starts as a weak ember with no surrounding wood and ramps to a roaring fire
 * as more wood blocks are placed within two tile radii.
 */
export function computingWorldCampfireIntensityFromNearbyWoodCount(
  nearbyPlacedWoodCount: number
): number {
  if (nearbyPlacedWoodCount <= 0) {
    return 0.24;
  }

  if (nearbyPlacedWoodCount === 1) {
    return 0.38;
  }

  if (nearbyPlacedWoodCount === 2) {
    return 0.5;
  }

  if (nearbyPlacedWoodCount === 3) {
    return 0.68;
  }

  if (nearbyPlacedWoodCount === 4) {
    return 0.86;
  }

  return 1;
}

/**
 * Total wood units that drive campfire flame size (placed nearby + inventory fed).
 */
export function computingWorldCampfireEffectiveWoodCount(
  nearbyPlacedWoodCount: number,
  inventoryFuelWoodCount: number
): number {
  return nearbyPlacedWoodCount + Math.max(0, inventoryFuelWoodCount);
}

/**
 * Maps total fuel wood (placed nearby + inventory fed) to a campfire flame sprite tier.
 *
 * One inventory wood advances one tier so flames grow visibly with each refuel.
 */
export function resolvingWorldCampfireFlameIntensityTierFromEffectiveWoodCount(
  effectiveWoodCount: number
): 1 | 2 | 3 | 4 | 5 {
  if (effectiveWoodCount <= 0) {
    return 1;
  }

  if (effectiveWoodCount >= 5) {
    return 5;
  }

  return effectiveWoodCount as 1 | 2 | 3 | 4;
}

/**
 * Softens campfire flame scale as fuel depletes (0.65..1).
 */
export function computingWorldCampfireFlameFuelDimmingScale(
  fuelRemainingMs: number,
  initialFuelMs: number
): number {
  if (initialFuelMs <= 0) {
    return fuelRemainingMs > 0 ? 1 : 0;
  }

  const fuelRatio = Math.max(0, Math.min(1, fuelRemainingMs / initialFuelMs));

  return 0.65 + fuelRatio * 0.35;
}

/**
 * Blends wood-driven heat with fuel depletion so flames dim as fuel runs out.
 */
export function computingWorldCampfireEffectiveIntensity(
  nearbyPlacedWoodCount: number,
  fuelRemainingMs: number,
  initialFuelMs: number,
  inventoryFuelWoodCount = 0
): number {
  const woodIntensity = computingWorldCampfireIntensityFromNearbyWoodCount(
    computingWorldCampfireEffectiveWoodCount(
      nearbyPlacedWoodCount,
      inventoryFuelWoodCount
    )
  );

  if (initialFuelMs <= 0) {
    return fuelRemainingMs > 0 ? woodIntensity : 0;
  }

  const fuelRatio = Math.max(0, Math.min(1, fuelRemainingMs / initialFuelMs));
  const fuelDimming = 0.5 + fuelRatio * 0.5;

  return Math.min(1, woodIntensity * fuelDimming);
}

/**
 * Lightmap erase radius for a campfire burn tier, softened as fuel runs out.
 */
export function computingWorldCampfireLightRadiusScaleFromBurnTier(
  burnTier: WorldCampfireBurnTier,
  fuelRemainingMs: number,
  initialFuelMs: number
): number {
  const baseRadiusScale = WORLD_CAMPFIRE_BURN_TIER_LIGHT_RADIUS_SCALE[burnTier];

  if (initialFuelMs <= 0) {
    return fuelRemainingMs > 0 ? baseRadiusScale : 0;
  }

  const fuelRatio = Math.max(0, Math.min(1, fuelRemainingMs / initialFuelMs));

  return baseRadiusScale * (0.7 + fuelRatio * 0.3);
}

/**
 * Lightmap hole brightness for a campfire burn tier, dimmed as fuel runs out.
 */
export function computingWorldCampfireLightBrightnessFromBurnTier(
  burnTier: WorldCampfireBurnTier,
  fuelRemainingMs: number,
  initialFuelMs: number
): number {
  const baseBrightness = WORLD_CAMPFIRE_BURN_TIER_LIGHT_BRIGHTNESS[burnTier];

  if (initialFuelMs <= 0) {
    return fuelRemainingMs > 0 ? baseBrightness : 0;
  }

  const fuelRatio = Math.max(0, Math.min(1, fuelRemainingMs / initialFuelMs));

  return baseBrightness * (0.45 + fuelRatio * 0.55);
}
