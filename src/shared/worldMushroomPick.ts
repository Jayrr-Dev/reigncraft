/**
 * Shared mushroom pick eligibility and mutation (client + tests).
 *
 * @module shared/worldMushroomPick
 */

/** Mushrooms granted when a world mushroom is picked. */
export const WORLD_MUSHROOM_PICK_QUANTITY = 1;

/** Max Chebyshev distance from player to mushroom tile center. */
export const WORLD_MUSHROOM_PICK_PLAYER_RANGE_TILES = 2;

/** Persisted pick state for one mushroom tile (only picked tiles are stored). */
export type WorldMushroomPickTileState = {
  readonly isPicked: true;
};

export function formattingWorldMushroomPickTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

function computingWorldMushroomPickChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

export type CheckingWorldMushroomPickEligibilityRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly existingTileState?: WorldMushroomPickTileState;
};

export type CheckingWorldMushroomPickEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

export function checkingWorldMushroomPickEligibility(
  request: CheckingWorldMushroomPickEligibilityRequest
): CheckingWorldMushroomPickEligibilityResult {
  const targetCenterX = request.tileX + 0.5;
  const targetCenterY = request.tileY + 0.5;
  const playerDistance = computingWorldMushroomPickChebyshevDistance(
    request.playerX,
    request.playerY,
    targetCenterX,
    targetCenterY
  );

  if (playerDistance > WORLD_MUSHROOM_PICK_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  if (request.existingTileState?.isPicked) {
    return { outcome: 'already-picked' };
  }

  return { outcome: 'eligible' };
}

export type ComputingWorldMushroomPickMutationRequest =
  CheckingWorldMushroomPickEligibilityRequest & {
    readonly speciesId: string;
  };

export type ComputingWorldMushroomPickMutationResult =
  | {
      readonly outcome: 'picked';
      readonly nextTileState: WorldMushroomPickTileState;
      readonly speciesId: string;
      readonly mushroomQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

export function computingWorldMushroomPickMutation(
  request: ComputingWorldMushroomPickMutationRequest
): ComputingWorldMushroomPickMutationResult {
  const eligibility = checkingWorldMushroomPickEligibility(request);

  if (eligibility.outcome !== 'eligible') {
    return { outcome: eligibility.outcome };
  }

  return {
    outcome: 'picked',
    nextTileState: { isPicked: true },
    speciesId: request.speciesId,
    mushroomQuantity: WORLD_MUSHROOM_PICK_QUANTITY,
  };
}

export function parsingWorldMushroomPickTileState(
  rawValue: string
): WorldMushroomPickTileState | null {
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
