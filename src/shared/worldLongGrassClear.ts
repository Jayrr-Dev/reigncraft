/**
 * Shared long-grass tile state (player search + wildlife eat).
 *
 * @module shared/worldLongGrassClear
 */

/** Max Chebyshev distance from player to grass tile center. */
export const WORLD_LONG_GRASS_SEARCH_PLAYER_RANGE_TILES = 2;

/** Persisted per-tile long-grass mutations (only mutated tiles stored). */
export type WorldLongGrassTileState = {
  /** Player finished Search on this clump; grass stays visible. */
  readonly isSearched?: true;
  /** Wildlife ate this clump; grass is removed from the floor. */
  readonly isEaten?: true;
};

/** @deprecated Use {@link WorldLongGrassTileState}. */
export type WorldLongGrassClearTileState = WorldLongGrassTileState;

/**
 * Builds a stable tile key for long-grass state maps.
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

export type CheckingWorldLongGrassSearchEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly existingTileState?: WorldLongGrassTileState;
};

export type CheckingWorldLongGrassSearchEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-searched' }
  | { readonly outcome: 'already-eaten' };

/**
 * Validates whether a long-grass clump can be searched without mutating state.
 */
export function checkingWorldLongGrassSearchEligibility(
  request: CheckingWorldLongGrassSearchEligibilityRequest
): CheckingWorldLongGrassSearchEligibilityResult {
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

  if (request.existingTileState?.isEaten) {
    return { outcome: 'already-eaten' };
  }

  if (request.existingTileState?.isSearched) {
    return { outcome: 'already-searched' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldLongGrassSearchMutationRequest =
  CheckingWorldLongGrassSearchEligibilityRequest;

export type ComputingWorldLongGrassSearchMutationResult =
  | {
      readonly outcome: 'searched';
      readonly nextTileState: WorldLongGrassTileState;
    }
  | Exclude<
      CheckingWorldLongGrassSearchEligibilityResult,
      { outcome: 'eligible' }
    >;

/**
 * Computes the next tile state when a player Search succeeds.
 * Grass remains visible; only loot eligibility is consumed.
 */
export function computingWorldLongGrassSearchMutation(
  request: ComputingWorldLongGrassSearchMutationRequest
): ComputingWorldLongGrassSearchMutationResult {
  const eligibility = checkingWorldLongGrassSearchEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return eligibility;
  }

  return {
    outcome: 'searched',
    nextTileState: {
      ...request.existingTileState,
      isSearched: true,
    },
  };
}

export type ComputingWorldLongGrassEatMutationRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly existingTileState?: WorldLongGrassTileState;
};

export type ComputingWorldLongGrassEatMutationResult =
  | {
      readonly outcome: 'eaten';
      readonly nextTileState: WorldLongGrassTileState;
    }
  | { readonly outcome: 'already-eaten' };

/**
 * Computes the next tile state when wildlife finishes eating a grass clump.
 */
export function computingWorldLongGrassEatMutation(
  request: ComputingWorldLongGrassEatMutationRequest
): ComputingWorldLongGrassEatMutationResult {
  if (request.existingTileState?.isEaten) {
    return { outcome: 'already-eaten' };
  }

  return {
    outcome: 'eaten',
    nextTileState: {
      ...request.existingTileState,
      isEaten: true,
    },
  };
}

/**
 * Parses persisted long-grass tile state from JSON.
 */
export function parsingWorldLongGrassTileState(
  raw: string
): WorldLongGrassTileState | null {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const isSearched =
      record.isSearched === true || record.isCleared === true
        ? true
        : undefined;
    const isEaten = record.isEaten === true ? true : undefined;

    if (!isSearched && !isEaten) {
      return null;
    }

    return {
      ...(isSearched ? { isSearched: true } : {}),
      ...(isEaten ? { isEaten: true } : {}),
    };
  } catch {
    return null;
  }
}

/** @deprecated Use {@link parsingWorldLongGrassTileState}. */
export function parsingWorldLongGrassClearTileState(
  raw: string
): WorldLongGrassTileState | null {
  return parsingWorldLongGrassTileState(raw);
}

/** @deprecated Use {@link checkingWorldLongGrassSearchEligibility}. */
export function checkingWorldLongGrassClearEligibility(
  request: CheckingWorldLongGrassSearchEligibilityRequest
):
  | CheckingWorldLongGrassSearchEligibilityResult
  | { outcome: 'already-cleared' } {
  const result = checkingWorldLongGrassSearchEligibility(request);

  if (
    result.outcome === 'already-searched' ||
    result.outcome === 'already-eaten'
  ) {
    return { outcome: 'already-cleared' };
  }

  return result;
}

/** @deprecated Use {@link computingWorldLongGrassSearchMutation}. */
export function computingWorldLongGrassClearMutation(
  request: ComputingWorldLongGrassSearchMutationRequest
):
  | {
      readonly outcome: 'cleared';
      readonly nextTileState: WorldLongGrassTileState;
    }
  | Exclude<
      CheckingWorldLongGrassSearchEligibilityResult,
      { outcome: 'eligible' }
    >
  | { outcome: 'already-cleared' } {
  const result = computingWorldLongGrassSearchMutation(request);

  if (result.outcome === 'searched') {
    return {
      outcome: 'cleared',
      nextTileState: result.nextTileState,
    };
  }

  if (result.outcome === 'already-searched') {
    return { outcome: 'already-cleared' };
  }

  return result;
}
