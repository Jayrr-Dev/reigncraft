/**
 * Shared long-grass clear / search eligibility (player + wildlife).
 *
 * @module shared/worldLongGrassClear
 */

/** Max Chebyshev distance from player to grass tile center. */
export const WORLD_LONG_GRASS_SEARCH_PLAYER_RANGE_TILES = 2;

/** Persisted clear state for one long-grass tile (only cleared tiles stored). */
export type WorldLongGrassClearTileState = {
  readonly isCleared: true;
};

/**
 * Builds a stable tile key for cleared long-grass state maps.
 */
export function formattingWorldLongGrassClearTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

function computingWorldLongGrassClearChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

export type CheckingWorldLongGrassClearEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly existingTileState?: WorldLongGrassClearTileState;
};

export type CheckingWorldLongGrassClearEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-cleared' };

/**
 * Validates whether a long-grass clump can be searched without mutating state.
 */
export function checkingWorldLongGrassClearEligibility(
  request: CheckingWorldLongGrassClearEligibilityRequest
): CheckingWorldLongGrassClearEligibilityResult {
  const targetCenterX = request.tileX + 0.5;
  const targetCenterY = request.tileY + 0.5;
  const playerDistance = computingWorldLongGrassClearChebyshevDistance(
    request.playerX,
    request.playerY,
    targetCenterX,
    targetCenterY
  );

  if (playerDistance > WORLD_LONG_GRASS_SEARCH_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  if (request.existingTileState?.isCleared) {
    return { outcome: 'already-cleared' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldLongGrassClearMutationRequest =
  CheckingWorldLongGrassClearEligibilityRequest;

export type ComputingWorldLongGrassClearMutationResult =
  | {
      readonly outcome: 'cleared';
      readonly nextTileState: WorldLongGrassClearTileState;
    }
  | Exclude<CheckingWorldLongGrassClearEligibilityResult, { outcome: 'eligible' }>;

/**
 * Computes the next cleared-tile state when search succeeds.
 */
export function computingWorldLongGrassClearMutation(
  request: ComputingWorldLongGrassClearMutationRequest
): ComputingWorldLongGrassClearMutationResult {
  const eligibility = checkingWorldLongGrassClearEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return eligibility;
  }

  return {
    outcome: 'cleared',
    nextTileState: { isCleared: true },
  };
}

/**
 * Parses persisted clear tile state from JSON.
 */
export function parsingWorldLongGrassClearTileState(
  raw: string
): WorldLongGrassClearTileState | null {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (
      parsed &&
      typeof parsed === 'object' &&
      (parsed as WorldLongGrassClearTileState).isCleared === true
    ) {
      return { isCleared: true };
    }
  } catch {
    return null;
  }

  return null;
}
