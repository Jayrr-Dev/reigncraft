import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint } from '@/components/world/collision';
import type { DefiningWorldPlazaAvatarMotionState } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import type { RefObject } from 'react';

/**
 * Instantly moves the local avatar to a grid point and clears click-walk state.
 *
 * @module components/world/domains/applyingWorldPlazaPlayerTeleportToWorldPoint
 */

/** Input for {@link applyingWorldPlazaPlayerTeleportToWorldPoint}. */
export interface ApplyingWorldPlazaPlayerTeleportToWorldPointInput {
  destinationWorldPoint: DefiningWorldPlazaWorldPoint;
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  walkTargetRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  isWalkingRef: RefObject<boolean>;
  isJumpingRef: RefObject<boolean>;
  localAvatarMotionStateRef: RefObject<DefiningWorldPlazaAvatarMotionState>;
  syncingMovePositionRef: RefObject<(() => void) | null>;
  playerHeightWorldLayers?: number;
}

/**
 * Teleports the local player to a grid point and syncs online presence when connected.
 *
 * @param input - Destination point and live movement refs from the plaza scene.
 */
export function applyingWorldPlazaPlayerTeleportToWorldPoint(
  input: ApplyingWorldPlazaPlayerTeleportToWorldPointInput
): void {
  const playerPosition = input.playerPositionRef.current;

  if (!playerPosition) {
    return;
  }

  const destinationLayer = resolvingWorldPlazaPlayerWorldLayer(
    input.destinationWorldPoint
  );
  const ejectedPosition =
    resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint(
      {
        ...input.destinationWorldPoint,
        layer: destinationLayer,
      },
      {
        placedBlocks: [...input.placedBlocks],
        playerLayer: destinationLayer,
        playerHeightWorldLayers: input.playerHeightWorldLayers,
      }
    );
  // Collision ejection returns grid x/y only; snap layer to the walkable surface
  // under the final tile so elevated biomes (e.g. Firelands) do not default to 1.
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(ejectedPosition);
  const resolvedLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
    [...input.placedBlocks]
  );

  playerPosition.x = ejectedPosition.x;
  playerPosition.y = ejectedPosition.y;
  playerPosition.layer = resolvedLayer;

  input.walkTargetRef.current = null;
  input.isWalkingRef.current = false;
  input.isJumpingRef.current = false;
  input.localAvatarMotionStateRef.current = {
    ...DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
    layer: resolvedLayer,
  };

  input.syncingMovePositionRef.current?.();
}
