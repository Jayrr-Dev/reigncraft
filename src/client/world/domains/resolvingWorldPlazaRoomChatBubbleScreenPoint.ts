import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaOnlineRoomChatBubble } from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_OFFSET_ABOVE_AVATAR_PX,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx,
  type DefiningWorldPlazaPlayerRenderPosition,
} from "@/components/world/domains/definingWorldPlazaPlayerRenderPosition";
import type { RefObject } from "react";

export interface ResolvingWorldPlazaRoomChatBubbleScreenPointParams {
  /** Chat bubble being positioned. */
  bubble: DefiningWorldPlazaOnlineRoomChatBubble;
  /** Authenticated local player id. */
  localUserId: string;
  /** Local avatar grid position ref. */
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  /** Authoritative remote positions from Colyseus. */
  remotePlayerRegistryRef: RefObject<Map<string, DefiningWorldPlazaRemotePlayer>>;
  /** Live avatar render positions for local and remote players. */
  playerRenderPositionRegistryRef: RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  /** Roster fallback when a remote is missing from the live registries. */
  remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
  /** Current camera translation. */
  cameraOffset: DefiningWorldPlazaCameraOffset;
  /** Effective world-container zoom for the current viewport. */
  cameraWorldZoom: number;
  /** Override vertical offset above the avatar feet (pixels). */
  offsetAboveAvatarPx?: number;
}

/**
 * Resolves the live grid position for a chat bubble's speaker.
 *
 * @param params - Bubble, identity refs, and roster fallbacks.
 */
function resolvingWorldPlazaRoomChatBubbleSpeakerGridPoint({
  bubble,
  localUserId,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
}: Omit<
  ResolvingWorldPlazaRoomChatBubbleScreenPointParams,
  "cameraOffset" | "cameraWorldZoom" | "offsetAboveAvatarPx"
>): DefiningWorldPlazaWorldPoint {
  const renderPosition = playerRenderPositionRegistryRef.current?.get(
    bubble.userId,
  );

  if (renderPosition) {
    return renderPosition;
  }

  if (bubble.userId === localUserId) {
    const localPosition = playerPositionRef.current;

    if (localPosition) {
      return localPosition;
    }

    return { x: bubble.anchorGridX, y: bubble.anchorGridY };
  }

  const remotePlayer = remotePlayerRegistryRef.current?.get(bubble.userId);

  if (remotePlayer) {
    return { x: remotePlayer.x, y: remotePlayer.y };
  }

  const rosterPlayer = remotePlayers.find(
    (player) => player.userId === bubble.userId,
  );

  if (rosterPlayer) {
    return { x: rosterPlayer.x, y: rosterPlayer.y };
  }

  return { x: bubble.anchorGridX, y: bubble.anchorGridY };
}

/**
 * Maps a chat bubble to screen coordinates above the speaking avatar.
 *
 * @param params - Bubble, identity refs, roster fallbacks, and camera offset.
 */
export function resolvingWorldPlazaRoomChatBubbleScreenPoint({
  bubble,
  localUserId,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffset,
  cameraWorldZoom,
  offsetAboveAvatarPx = DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_OFFSET_ABOVE_AVATAR_PX,
}: ResolvingWorldPlazaRoomChatBubbleScreenPointParams): {
  x: number;
  y: number;
} {
  const gridPoint = resolvingWorldPlazaRoomChatBubbleSpeakerGridPoint({
    bubble,
    localUserId,
    playerPositionRef,
    remotePlayerRegistryRef,
    playerRenderPositionRegistryRef,
    remotePlayers,
  });
  const renderPosition = playerRenderPositionRegistryRef.current?.get(
    bubble.userId,
  );
  const worldLocalPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const viewportPoint = projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
    worldLocalPoint,
    cameraOffset,
    cameraWorldZoom,
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
      avatarVerticalOffsetPx * cameraWorldZoom -
      offsetAboveAvatarPx * cameraWorldZoom,
  };
}
