/** Stone granted when a floor pebble is picked. */
export const WORLD_PEBBLE_PICK_STONE_QUANTITY = 1;

/** Max Chebyshev distance from player to pebble tile center. */
export const WORLD_PEBBLE_PICK_PLAYER_RANGE_TILES = 2;

/** Persisted pick state for one floor-pebble tile (only picked tiles are stored). */
export type WorldPebblePickTileState = {
  readonly isPicked: true;
};

/**
 * Builds a stable tile key for picked-pebble state maps.
 */
export function formattingWorldPebblePickTileKey(
  tileX: number,
  tileY: number,
): string {
  return `${tileX},${tileY}`;
}

function computingWorldPebblePickChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

export type CheckingWorldPebblePickEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly existingTileState?: WorldPebblePickTileState;
};

export type CheckingWorldPebblePickEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Validates whether a floor pebble can be picked without mutating state.
 */
export function checkingWorldPebblePickEligibility(
  request: CheckingWorldPebblePickEligibilityRequest,
): CheckingWorldPebblePickEligibilityResult {
  const targetCenterX = request.tileX + 0.5;
  const targetCenterY = request.tileY + 0.5;
  const playerDistance = computingWorldPebblePickChebyshevDistance(
    request.playerX,
    request.playerY,
    targetCenterX,
    targetCenterY,
  );

  if (playerDistance > WORLD_PEBBLE_PICK_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  if (request.existingTileState?.isPicked) {
    return { outcome: 'already-picked' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldPebblePickMutationRequest =
  CheckingWorldPebblePickEligibilityRequest;

export type ComputingWorldPebblePickMutationResult =
  | {
      readonly outcome: 'picked';
      readonly nextTileState: WorldPebblePickTileState;
      readonly stoneQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Computes the next pick state for one pebble tile without persisting it.
 */
export function computingWorldPebblePickMutation(
  request: ComputingWorldPebblePickMutationRequest,
): ComputingWorldPebblePickMutationResult {
  const eligibility = checkingWorldPebblePickEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return { outcome: eligibility.outcome };
  }

  return {
    outcome: 'picked',
    nextTileState: { isPicked: true },
    stoneQuantity: WORLD_PEBBLE_PICK_STONE_QUANTITY,
  };
}

/**
 * Parses one persisted picked-pebble tile row from Redis or localStorage.
 */
export function parsingWorldPebblePickTileState(
  rawValue: string,
): WorldPebblePickTileState | null {
  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (
      parsed &&
      typeof parsed === 'object' &&
      'isPicked' in parsed &&
      parsed.isPicked === true
    ) {
      return { isPicked: true };
    }

    return null;
  } catch {
    return null;
  }
}
