/** Wood granted per world layer removed from a tree. */
export const WORLD_TREE_CHOP_WOOD_PER_LAYER = 2;

/** Visual layers removed per completed chop swing. */
export const WORLD_TREE_CHOP_LAYERS_PER_SWING = 3;

/** Max Chebyshev distance from player to tree tile center. */
export const WORLD_TREE_CHOP_PLAYER_RANGE_TILES = 2;

/** Persisted chop state for one tree tile. */
export type WorldTreeChopTileState = {
  readonly remainingVisualLayer: number;
  readonly isStump: boolean;
};

/**
 * Builds a stable tile key for chop state maps.
 */
export function formattingWorldTreeChopTileKey(
  tileX: number,
  tileY: number,
): string {
  return `${tileX},${tileY}`;
}

function computingWorldTreeChopChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

export type CheckingWorldTreeChopLayerEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
  readonly existingTileState?: WorldTreeChopTileState;
};

export type CheckingWorldTreeChopLayerEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-felled' };

/**
 * Validates whether a tree layer can be chopped without mutating state.
 */
export function checkingWorldTreeChopLayerEligibility(
  request: CheckingWorldTreeChopLayerEligibilityRequest,
): CheckingWorldTreeChopLayerEligibilityResult {
  const playerDistance = computingWorldTreeChopChebyshevDistance(
    request.playerX,
    request.playerY,
    request.tileX + 0.5,
    request.tileY + 0.5,
  );

  if (playerDistance > WORLD_TREE_CHOP_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  const existing = request.existingTileState;

  if (existing?.isStump) {
    return { outcome: 'already-felled' };
  }

  const currentRemaining =
    existing?.remainingVisualLayer ?? request.currentVisualLayer;

  if (currentRemaining <= request.standingSurfaceLayer) {
    return { outcome: 'already-felled' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldTreeChopLayerMutationRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
  readonly existingTileState?: WorldTreeChopTileState;
};

export type ComputingWorldTreeChopLayerMutationResult =
  | {
      readonly outcome: 'chopped';
      readonly nextTileState: WorldTreeChopTileState;
      readonly remainingVisualLayer: number;
      readonly layersRemoved: number;
      readonly woodQuantity: number;
      readonly isFullyFelled: boolean;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-felled' };

/**
 * Computes the next chop state for one tree tile without persisting it.
 */
export function computingWorldTreeChopLayerMutation(
  request: ComputingWorldTreeChopLayerMutationRequest,
): ComputingWorldTreeChopLayerMutationResult {
  const eligibility = checkingWorldTreeChopLayerEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return { outcome: eligibility.outcome };
  }

  const existing = request.existingTileState;
  const currentRemaining =
    existing?.remainingVisualLayer ?? request.currentVisualLayer;
  const choppableLayers = currentRemaining - request.standingSurfaceLayer;
  const layersRemoved = Math.min(
    WORLD_TREE_CHOP_LAYERS_PER_SWING,
    choppableLayers,
  );
  const nextRemaining = currentRemaining - layersRemoved;
  const isFullyFelled = nextRemaining <= request.standingSurfaceLayer;
  const nextTileState: WorldTreeChopTileState = isFullyFelled
    ? {
        remainingVisualLayer: request.standingSurfaceLayer,
        isStump: true,
      }
    : {
        remainingVisualLayer: nextRemaining,
        isStump: false,
      };

  return {
    outcome: 'chopped',
    nextTileState,
    remainingVisualLayer: isFullyFelled
      ? request.standingSurfaceLayer
      : nextRemaining,
    layersRemoved,
    woodQuantity: layersRemoved * WORLD_TREE_CHOP_WOOD_PER_LAYER,
    isFullyFelled,
  };
}

/**
 * Parses one persisted chopped-tree tile row from Redis or localStorage.
 */
export function parsingWorldTreeChopTileState(
  rawValue: string,
): WorldTreeChopTileState | null {
  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (typeof parsed === 'number' && Number.isFinite(parsed)) {
      return {
        remainingVisualLayer: Math.round(parsed),
        isStump: false,
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
        isStump:
          'isStump' in parsed && parsed.isStump === true ? true : false,
      };
    }

    return null;
  } catch {
    return null;
  }
}
