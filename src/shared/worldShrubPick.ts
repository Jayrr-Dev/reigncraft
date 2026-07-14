/**
 * Berry-shrub pick eligibility and mutation (player + wildlife share isPicked).
 *
 * @module shared/worldShrubPick
 */

/** Berries granted when an unpicked shrub is picked. */
export const WORLD_SHRUB_PICK_QUANTITY = 1;

/** Max Chebyshev distance from player to shrub tile center. */
export const WORLD_SHRUB_PICK_PLAYER_RANGE_TILES = 2;

/** Persisted pick state for one berry-shrub tile (only picked tiles are stored). */
export type WorldShrubPickTileState = {
  readonly isPicked: true;
};

/**
 * Builds a stable tile key for picked-shrub state maps.
 */
export function formattingWorldShrubPickTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

function computingWorldShrubPickChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

export type CheckingWorldShrubPickEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly existingTileState?: WorldShrubPickTileState;
};

export type CheckingWorldShrubPickEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Validates whether a berry shrub can be picked without mutating state.
 */
export function checkingWorldShrubPickEligibility(
  request: CheckingWorldShrubPickEligibilityRequest
): CheckingWorldShrubPickEligibilityResult {
  const targetCenterX = request.tileX + 0.5;
  const targetCenterY = request.tileY + 0.5;
  const playerDistance = computingWorldShrubPickChebyshevDistance(
    request.playerX,
    request.playerY,
    targetCenterX,
    targetCenterY
  );

  if (playerDistance > WORLD_SHRUB_PICK_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  if (request.existingTileState?.isPicked) {
    return { outcome: 'already-picked' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldShrubPickMutationResult =
  | {
      readonly outcome: 'picked';
      readonly nextTileState: WorldShrubPickTileState;
      readonly berryQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Computes the next pick state for one shrub tile without persisting it.
 */
export function computingWorldShrubPickMutation(
  request: CheckingWorldShrubPickEligibilityRequest
): ComputingWorldShrubPickMutationResult {
  const eligibility = checkingWorldShrubPickEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return { outcome: eligibility.outcome };
  }

  return {
    outcome: 'picked',
    nextTileState: { isPicked: true },
    berryQuantity: WORLD_SHRUB_PICK_QUANTITY,
  };
}

function checkingWorldShrubPickTileStateShape(
  value: unknown
): value is WorldShrubPickTileState {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  if (!('isPicked' in value)) {
    return false;
  }

  return value.isPicked === true;
}

/**
 * Parses one persisted picked-shrub tile row from localStorage.
 */
export function parsingWorldShrubPickTileState(
  rawValue: string
): WorldShrubPickTileState | null {
  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (checkingWorldShrubPickTileStateShape(parsed)) {
      return { isPicked: true };
    }

    return null;
  } catch {
    return null;
  }
}
