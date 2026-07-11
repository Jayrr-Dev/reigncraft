'use client';

import { RenderingWorldPlazaRemoteAvatar } from '@/components/world/components/renderingWorldPlazaRemoteAvatar';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

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
  /** Local player grid position for presentation culling. */
  localPlayerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
}

/**
 * Renders other online players with synced avatar skins and isometric depth sorting.
 */
export function RenderingWorldPlazaRemotePlayers({
  remotePlayers,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  localPlayerPositionRef,
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
          localPlayerPositionRef={localPlayerPositionRef}
        />
      ))}
    </>
  );
}
