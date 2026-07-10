/** Stone granted per world layer removed from a boulder. */
export const WORLD_ROCK_MINE_STONE_PER_LAYER = 2;

/** Visual layers removed per completed mine swing. */
export const WORLD_ROCK_MINE_LAYERS_PER_SWING = 3;

/** Max Chebyshev distance from player to boulder footprint center. */
export const WORLD_ROCK_MINE_PLAYER_RANGE_TILES = 2;

/** Persisted mine state for one column-rock anchor tile. */
export type WorldRockMineTileState = {
  readonly remainingVisualLayer: number;
  readonly isDepleted: boolean;
};

/**
 * Builds a stable tile key for mined-rock state maps (anchor tile).
 */
export function formattingWorldRockMineTileKey(
  tileX: number,
  tileY: number,
): string {
  return `${tileX},${tileY}`;
}

function computingWorldRockMineChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

export type CheckingWorldRockMineLayerEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  /** Footprint center used for range checks (may differ from anchor). */
  readonly targetCenterX: number;
  readonly targetCenterY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
  readonly existingTileState?: WorldRockMineTileState;
};

export type CheckingWorldRockMineLayerEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-depleted' };

/**
 * Validates whether a rock layer can be mined without mutating state.
 */
export function checkingWorldRockMineLayerEligibility(
  request: CheckingWorldRockMineLayerEligibilityRequest,
): CheckingWorldRockMineLayerEligibilityResult {
  const playerDistance = computingWorldRockMineChebyshevDistance(
    request.playerX,
    request.playerY,
    request.targetCenterX,
    request.targetCenterY,
  );

  if (playerDistance > WORLD_ROCK_MINE_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  const existing = request.existingTileState;

  if (existing?.isDepleted) {
    return { outcome: 'already-depleted' };
  }

  const currentRemaining =
    existing?.remainingVisualLayer ?? request.currentVisualLayer;

  if (currentRemaining <= request.standingSurfaceLayer) {
    return { outcome: 'already-depleted' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldRockMineLayerMutationRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
  readonly existingTileState?: WorldRockMineTileState;
};

export type ComputingWorldRockMineLayerMutationResult =
  | {
      readonly outcome: 'mined';
      readonly nextTileState: WorldRockMineTileState;
      readonly remainingVisualLayer: number;
      readonly layersRemoved: number;
      readonly stoneQuantity: number;
      readonly isFullyDepleted: boolean;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-depleted' };

/**
 * Computes the next mine state for one rock anchor without persisting it.
 */
export function computingWorldRockMineLayerMutation(
  request: ComputingWorldRockMineLayerMutationRequest,
): ComputingWorldRockMineLayerMutationResult {
  const eligibility = checkingWorldRockMineLayerEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return { outcome: eligibility.outcome };
  }

  const existing = request.existingTileState;
  const currentRemaining =
    existing?.remainingVisualLayer ?? request.currentVisualLayer;
  const mineableLayers = currentRemaining - request.standingSurfaceLayer;
  const layersRemoved = Math.min(
    WORLD_ROCK_MINE_LAYERS_PER_SWING,
    mineableLayers,
  );
  const nextRemaining = currentRemaining - layersRemoved;
  const isFullyDepleted = nextRemaining <= request.standingSurfaceLayer;
  const nextTileState: WorldRockMineTileState = isFullyDepleted
    ? {
        remainingVisualLayer: request.standingSurfaceLayer,
        isDepleted: true,
      }
    : {
        remainingVisualLayer: nextRemaining,
        isDepleted: false,
      };

  return {
    outcome: 'mined',
    nextTileState,
    remainingVisualLayer: isFullyDepleted
      ? request.standingSurfaceLayer
      : nextRemaining,
    layersRemoved,
    stoneQuantity: layersRemoved * WORLD_ROCK_MINE_STONE_PER_LAYER,
    isFullyDepleted,
  };
}

/**
 * Parses one persisted mined-rock tile row from Redis or localStorage.
 */
export function parsingWorldRockMineTileState(
  rawValue: string,
): WorldRockMineTileState | null {
  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (typeof parsed === 'number' && Number.isFinite(parsed)) {
      return {
        remainingVisualLayer: Math.round(parsed),
        isDepleted: false,
      };
    }

    if (
      parsed &&
      typeof parsed === 'object' &&
      'remainingVisualLayer' in parsed &&
      typeof parsed.remainingVisualLayer === 'number' &&
      Number.isFinite(parsed.remainingVisualLayer)
    ) {
      return {
        remainingVisualLayer: Math.round(parsed.remainingVisualLayer),
        isDepleted:
          'isDepleted' in parsed && parsed.isDepleted === true ? true : false,
      };
    }

    return null;
  } catch {
    return null;
  }
}
