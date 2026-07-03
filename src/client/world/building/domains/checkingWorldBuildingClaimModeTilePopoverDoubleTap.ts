import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_DISTANCE_PX,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_INTERVAL_MS,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";

/**
 * Detects claim-mode double taps that should open the tile popover.
 *
 * @module components/world/building/domains/checkingWorldBuildingClaimModeTilePopoverDoubleTap
 */

/** Pointer client position in viewport pixels. */
export interface CheckingWorldBuildingClaimModeTilePopoverDoubleTapClientPoint {
  readonly clientX: number;
  readonly clientY: number;
}

/** Previous primary tap used for double-tap matching. */
export interface CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap {
  readonly atMs: number;
  readonly clientPoint: CheckingWorldBuildingClaimModeTilePopoverDoubleTapClientPoint;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
}

/** Input for {@link checkingWorldBuildingClaimModeTilePopoverDoubleTap}. */
export interface CheckingWorldBuildingClaimModeTilePopoverDoubleTapInput {
  readonly eventDetail: number;
  readonly nowMs: number;
  readonly clientPoint: CheckingWorldBuildingClaimModeTilePopoverDoubleTapClientPoint;
  readonly tilePosition: DefiningWorldBuildingTilePosition | null;
  readonly previousTap: CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap | null;
}

const CHECKING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_DISTANCE_SQ =
  DEFINING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_DISTANCE_PX *
  DEFINING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_DISTANCE_PX;

/**
 * Returns true when the pointer press should open the claim tile popover.
 *
 * Supports mouse double-click (`event.detail >= 2`) and touch double-tap on
 * the same tile within the configured interval and distance.
 *
 * @param input - Current pointer press and the previous primary tap, if any.
 */
export function checkingWorldBuildingClaimModeTilePopoverDoubleTap(
  input: CheckingWorldBuildingClaimModeTilePopoverDoubleTapInput,
): boolean {
  if (!input.tilePosition) {
    return false;
  }

  if (input.eventDetail >= 2) {
    return true;
  }

  if (!input.previousTap) {
    return false;
  }

  const isSameTile =
    input.previousTap.tilePosition.tileX === input.tilePosition.tileX &&
    input.previousTap.tilePosition.tileY === input.tilePosition.tileY;
  const elapsedMs = input.nowMs - input.previousTap.atMs;
  const deltaClientX =
    input.clientPoint.clientX - input.previousTap.clientPoint.clientX;
  const deltaClientY =
    input.clientPoint.clientY - input.previousTap.clientPoint.clientY;
  const distanceSq = deltaClientX * deltaClientX + deltaClientY * deltaClientY;

  return (
    isSameTile &&
    elapsedMs <=
      DEFINING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_INTERVAL_MS &&
    distanceSq <=
      CHECKING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_DISTANCE_SQ
  );
}
