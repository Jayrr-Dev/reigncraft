import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import {
  computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx,
  type DefiningWorldPlazaPlayerRenderPosition,
} from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import {
  DEFINING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_OFFSET_ABOVE_AVATAR_PX,
  DEFINING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_OFFSET_LEFT_OF_CENTER_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityWorldAnchoredBleedStackConstants';
import type { RefObject } from 'react';

export type ResolvingWorldPlazaEntityWorldAnchoredBleedStackScreenPointParams =
  {
    userId: string;
    anchorGridX: number;
    anchorGridY: number;
    localUserId: string;
    playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
    remotePlayerRegistryRef: RefObject<
      Map<string, DefiningWorldPlazaRemotePlayer>
    >;
    playerRenderPositionRegistryRef: RefObject<
      Map<string, DefiningWorldPlazaPlayerRenderPosition>
    >;
    remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
    cameraOffset: DefiningWorldPlazaCameraOffset;
    cameraWorldZoom: number;
  };

function resolvingWorldPlazaEntityWorldAnchoredBleedStackGridPoint({
  userId,
  anchorGridX,
  anchorGridY,
  localUserId,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
}: Omit<
  ResolvingWorldPlazaEntityWorldAnchoredBleedStackScreenPointParams,
  'cameraOffset' | 'cameraWorldZoom'
>): DefiningWorldPlazaWorldPoint {
  if (userId === localUserId) {
    const localPosition = playerPositionRef.current;

    if (localPosition) {
      return localPosition;
    }
  }

  const renderPosition = playerRenderPositionRegistryRef.current?.get(userId);

  if (renderPosition) {
    return renderPosition;
  }

  const remotePlayer = remotePlayerRegistryRef.current?.get(userId);

  if (remotePlayer) {
    return { x: remotePlayer.x, y: remotePlayer.y };
  }

  const rosterPlayer = remotePlayers.find((player) => player.userId === userId);

  if (rosterPlayer) {
    return { x: rosterPlayer.x, y: rosterPlayer.y };
  }

  return { x: anchorGridX, y: anchorGridY };
}

/**
 * Maps the bleed stack badge to screen coordinates above the avatar head.
 */
export function resolvingWorldPlazaEntityWorldAnchoredBleedStackScreenPoint(
  params: ResolvingWorldPlazaEntityWorldAnchoredBleedStackScreenPointParams
): {
  x: number;
  y: number;
} {
  const gridPoint =
    resolvingWorldPlazaEntityWorldAnchoredBleedStackGridPoint(params);
  const renderPosition = params.playerRenderPositionRegistryRef.current?.get(
    params.userId
  );
  const worldLocalPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      worldLocalPoint,
      params.cameraOffset,
      params.cameraWorldZoom
    );
  const avatarVerticalOffsetPx =
    computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx(
      gridPoint,
      renderPosition
    );

  return {
    x:
      viewportPoint.x -
      DEFINING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_OFFSET_LEFT_OF_CENTER_PX *
        params.cameraWorldZoom,
    y:
      viewportPoint.y +
      avatarVerticalOffsetPx * params.cameraWorldZoom -
      DEFINING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_OFFSET_ABOVE_AVATAR_PX *
        params.cameraWorldZoom,
  };
}
