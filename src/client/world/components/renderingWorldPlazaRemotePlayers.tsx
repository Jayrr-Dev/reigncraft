"use client";

import { RenderingWorldPlazaRemoteAvatar } from "@/components/world/components/renderingWorldPlazaRemoteAvatar";
import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaPlayerRenderPosition } from "@/components/world/domains/definingWorldPlazaPlayerRenderPosition";

export interface RenderingWorldPlazaRemotePlayersProps {
  /** Other players in the room (excluding local user). */
  remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
  /** Live positions from Colyseus broadcast; read every Pixi frame. */
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  /** Live avatar render positions shared with chat bubbles. */
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
}

/**
 * Renders other online players with synced avatar skins and isometric depth sorting.
 */
export function RenderingWorldPlazaRemotePlayers({
  remotePlayers,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
}: RenderingWorldPlazaRemotePlayersProps): React.JSX.Element | null {
  if (remotePlayers.length === 0) {
    return null;
  }

  return (
    <>
      {remotePlayers.map((player) => (
        <RenderingWorldPlazaRemoteAvatar
          key={`${player.userId}:${player.avatarSkinId}`}
          player={player}
          remotePlayerRegistryRef={remotePlayerRegistryRef}
          playerRenderPositionRegistryRef={playerRenderPositionRegistryRef}
        />
      ))}
    </>
  );
}
