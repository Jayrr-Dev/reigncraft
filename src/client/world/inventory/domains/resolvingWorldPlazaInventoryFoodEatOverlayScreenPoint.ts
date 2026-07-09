/**
 * Screen anchor for the local player's eat channel overlay.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatOverlayScreenPoint
 */

import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx,
  type DefiningWorldPlazaPlayerRenderPosition,
} from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import type { RefObject } from 'react';

/** Extra lift above the avatar head for munching text + ring (world-local px). */
export const RESOLVING_WORLD_PLAZA_FOOD_EAT_OVERLAY_OFFSET_ABOVE_AVATAR_PX = 52;

export type ResolvingWorldPlazaInventoryFoodEatOverlayScreenPointParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly playerRenderPositionRegistryRef?: RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  readonly localUserId: string;
  readonly cameraOffset: DefiningWorldPlazaCameraOffset;
  readonly cameraWorldZoom: number;
};

/**
 * Maps the local player to viewport coordinates for the eat overlay.
 */
export function resolvingWorldPlazaInventoryFoodEatOverlayScreenPoint({
  playerPositionRef,
  playerRenderPositionRegistryRef,
  localUserId,
  cameraOffset,
  cameraWorldZoom,
}: ResolvingWorldPlazaInventoryFoodEatOverlayScreenPointParams): {
  x: number;
  y: number;
} {
  const gridPoint = playerPositionRef.current;
  const renderPosition =
    playerRenderPositionRegistryRef?.current?.get(localUserId);
  const worldLocalPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      worldLocalPoint,
      cameraOffset,
      cameraWorldZoom
    );
  const avatarVerticalOffsetPx =
    computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx(
      gridPoint,
      renderPosition
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y +
      avatarVerticalOffsetPx * cameraWorldZoom -
      RESOLVING_WORLD_PLAZA_FOOD_EAT_OVERLAY_OFFSET_ABOVE_AVATAR_PX *
        cameraWorldZoom,
  };
}
