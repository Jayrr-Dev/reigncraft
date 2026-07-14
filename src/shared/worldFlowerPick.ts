import type { WorldFlowerSpeciesId } from './worldFlowerRarity';

/** Flowers granted when a biome flower dot is picked. */
export const WORLD_FLOWER_PICK_QUANTITY = 1;

/** Max Chebyshev distance from player to flower tile center. */
export const WORLD_FLOWER_PICK_PLAYER_RANGE_TILES = 2;

/** Persisted pick state for one floor-flower tile (only picked tiles are stored). */
export type WorldFlowerPickTileState = {
  readonly isPicked: true;
};

/**
 * Builds a stable tile key for picked-flower state maps.
 */
export function formattingWorldFlowerPickTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

function computingWorldFlowerPickChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

export type CheckingWorldFlowerPickEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly existingTileState?: WorldFlowerPickTileState;
};

export type CheckingWorldFlowerPickEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Validates whether a biome flower dot can be picked without mutating state.
 */
export function checkingWorldFlowerPickEligibility(
  request: CheckingWorldFlowerPickEligibilityRequest
): CheckingWorldFlowerPickEligibilityResult {
  const targetCenterX = request.tileX + 0.5;
  const targetCenterY = request.tileY + 0.5;
  const playerDistance = computingWorldFlowerPickChebyshevDistance(
    request.playerX,
    request.playerY,
    targetCenterX,
    targetCenterY
  );

  if (playerDistance > WORLD_FLOWER_PICK_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  if (request.existingTileState?.isPicked) {
    return { outcome: 'already-picked' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldFlowerPickMutationRequest =
  CheckingWorldFlowerPickEligibilityRequest & {
    readonly speciesId: WorldFlowerSpeciesId;
  };

export type ComputingWorldFlowerPickMutationResult =
  | {
      readonly outcome: 'picked';
      readonly nextTileState: WorldFlowerPickTileState;
      readonly speciesId: WorldFlowerSpeciesId;
      readonly flowerQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Computes the next pick state for one flower tile without persisting it.
 */
export function computingWorldFlowerPickMutation(
  request: ComputingWorldFlowerPickMutationRequest
): ComputingWorldFlowerPickMutationResult {
  const eligibility = checkingWorldFlowerPickEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return { outcome: eligibility.outcome };
  }

  return {
    outcome: 'picked',
    nextTileState: { isPicked: true },
    speciesId: request.speciesId,
    flowerQuantity: WORLD_FLOWER_PICK_QUANTITY,
  };
}

/**
 * Parses one persisted picked-flower tile row from Redis or localStorage.
 */
export function parsingWorldFlowerPickTileState(
  rawValue: string
): WorldFlowerPickTileState | null {
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
