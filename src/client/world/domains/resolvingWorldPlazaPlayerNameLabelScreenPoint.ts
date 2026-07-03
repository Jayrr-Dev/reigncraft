import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import { DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_OFFSET_ABOVE_AVATAR_PX } from "@/components/world/domains/definingWorldPlazaPlayerNameLabelConstants";
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx,
  type DefiningWorldPlazaPlayerRenderPosition,
} from "@/components/world/domains/definingWorldPlazaPlayerRenderPosition";
import type { RefObject } from "react";

export interface ResolvingWorldPlazaPlayerNameLabelScreenPointParams {
  /** Player to anchor the label above. */
  userId: string;
  /** Grid fallback when live registries are empty. */
  anchorGridX: number;
  /** Grid fallback when live registries are empty. */
  anchorGridY: number;
  /** Authenticated local player id. */
  localUserId: string;
  /** Local avatar grid position ref. */
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  /** Authoritative remote positions from Colyseus. */
  remotePlayerRegistryRef: RefObject<Map<string, DefiningWorldPlazaRemotePlayer>>;
  /** Smoothed avatar render positions from Pixi ticks. */
  playerRenderPositionRegistryRef: RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  /** Roster fallback when a player is missing from live registries. */
  remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
  /** Current camera translation. */
  cameraOffset: DefiningWorldPlazaCameraOffset;
  /** Effective world-container zoom for the current viewport. */
  cameraWorldZoom: number;
}

/**
 * Resolves the live grid position for a plaza name label.
 *
 * Local players read {@link playerPositionRef} first so labels track movement
 * even before the Pixi render registry is populated.
 *
 * @param params - Identity refs, roster fallbacks, and camera offset.
 */
function resolvingWorldPlazaPlayerNameLabelGridPoint({
  userId,
  anchorGridX,
  anchorGridY,
  localUserId,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
}: Omit<
  ResolvingWorldPlazaPlayerNameLabelScreenPointParams,
  "cameraOffset" | "cameraWorldZoom"
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
 * Maps a player name label to screen coordinates above their avatar.
 *
 * @param params - Identity refs, roster fallbacks, and camera offset.
 */
export function resolvingWorldPlazaPlayerNameLabelScreenPoint(
  params: ResolvingWorldPlazaPlayerNameLabelScreenPointParams,
): {
  x: number;
  y: number;
} {
  const gridPoint = resolvingWorldPlazaPlayerNameLabelGridPoint(params);
  const renderPosition = params.playerRenderPositionRegistryRef.current?.get(
    params.userId,
  );
  const worldLocalPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const viewportPoint = projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
    worldLocalPoint,
    params.cameraOffset,
    params.cameraWorldZoom,
  );
  const avatarVerticalOffsetPx =
    computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx(
      gridPoint,
      renderPosition,
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y +
      avatarVerticalOffsetPx * params.cameraWorldZoom -
      DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_OFFSET_ABOVE_AVATAR_PX *
        params.cameraWorldZoom,
  };
}
