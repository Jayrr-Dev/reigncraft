"use client";

import { RenderingWorldPlazaGirlSampleRemoteAvatar } from "@/components/world/components/renderingWorldPlazaGirlSampleRemoteAvatar";
import { creatingWorldPlazaGirlSampleMotionFrameTextures } from "@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures";
import { resolvingWorldPlazaAvatarCharacterDefinition } from "@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition";
import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaPlayerRenderPosition } from "@/components/world/domains/definingWorldPlazaPlayerRenderPosition";
import { parsingWorldPlazaAvatarSkinIdForNetworkSync } from "@/components/world/domains/parsingWorldPlazaAvatarSkinIdForNetworkSync";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface RenderingWorldPlazaRemoteAvatarProps {
  /** Other player record from the room roster. */
  player: DefiningWorldPlazaRemotePlayer;
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
 * Loads textures for one remote player's synced skin and renders their avatar.
 */
export function RenderingWorldPlazaRemoteAvatar({
  player,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
}: RenderingWorldPlazaRemoteAvatarProps): React.JSX.Element | null {
  const characterDefinition = useMemo(
    () =>
      resolvingWorldPlazaAvatarCharacterDefinition(
        parsingWorldPlazaAvatarSkinIdForNetworkSync(player.avatarSkinId),
      ),
    [player.avatarSkinId],
  );

  const { data: characterTextures } = useQuery({
    queryKey: characterDefinition.texturesQueryKey,
    queryFn: characterDefinition.loadTextures,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const walkFrameTextures = useMemo(() => {
    if (!characterTextures) {
      return null;
    }

    return creatingWorldPlazaGirlSampleMotionFrameTextures(
      characterTextures.walk,
      characterDefinition.walkSheetLayout,
    );
  }, [characterDefinition.walkSheetLayout, characterTextures]);

  const runFrameTextures = useMemo(() => {
    if (!characterTextures) {
      return null;
    }

    return creatingWorldPlazaGirlSampleMotionFrameTextures(
      characterTextures.run,
      characterDefinition.runSheetLayout,
    );
  }, [characterDefinition.runSheetLayout, characterTextures]);

  const jumpFrameTextures = useMemo(() => {
    if (!characterTextures) {
      return null;
    }

    return creatingWorldPlazaGirlSampleMotionFrameTextures(
      characterTextures.jump,
      characterDefinition.jumpSheetLayout,
    );
  }, [characterDefinition.jumpSheetLayout, characterTextures]);

  const idleFrameTextures = useMemo(() => {
    if (!characterTextures) {
      return null;
    }

    return creatingWorldPlazaGirlSampleMotionFrameTextures(
      characterTextures.idle,
      characterDefinition.idleSheetLayout,
    );
  }, [characterDefinition.idleSheetLayout, characterTextures]);

  if (
    !walkFrameTextures ||
    !runFrameTextures ||
    !jumpFrameTextures ||
    !idleFrameTextures
  ) {
    return null;
  }

  return (
    <RenderingWorldPlazaGirlSampleRemoteAvatar
      userId={player.userId}
      initialPlayer={player}
      remotePlayerRegistryRef={remotePlayerRegistryRef}
      playerRenderPositionRegistryRef={playerRenderPositionRegistryRef}
      walkFrameTextures={walkFrameTextures}
      runFrameTextures={runFrameTextures}
      jumpFrameTextures={jumpFrameTextures}
      idleFrameTextures={idleFrameTextures}
      characterDefinition={characterDefinition}
    />
  );
}
