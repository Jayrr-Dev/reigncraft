import {
  DEFINING_WORLD_PLAZA_COLYSEUS_FIRST_SHARD_INDEX,
  DEFINING_WORLD_PLAZA_COLYSEUS_ROOM_NAME,
  type DefiningWorldPlazaColyseusJoinOptions,
} from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";
import { creatingWorldPlazaColyseusClient } from "@/components/world/colyseus/domains/creatingWorldPlazaColyseusClient";
import { detectingWorldPlazaColyseusServerMisconfigurationForBrowser } from "@/components/world/colyseus/domains/detectingWorldPlazaColyseusServerMisconfigurationForBrowser";
import type { DefiningWorldPlazaColyseusRoomState } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { serializingWorldPlazaUserProfileAvatarUrlForNetworkSync } from "@/components/world/domains/parsingWorldPlazaUserProfileAvatarUrlForNetworkSync";
import { serializingWorldPlazaUserProfileStatusKindForNetworkSync } from "@/components/world/domains/parsingWorldPlazaUserProfileStatusKindForNetworkSync";
import { serializingWorldPlazaAvatarSkinIdForNetworkSync } from "@/components/world/domains/parsingWorldPlazaAvatarSkinIdForNetworkSync";
import type { CommunityMemberProfileStatusKind } from "@/components/community/domains/definingCommunityMemberProfileStatus";
import type { DefiningWorldPlazaAvatarSkinId } from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import type { Room } from "@colyseus/sdk";
import type { RefObject } from "react";

/** Thrown when production builds still target the local Colyseus default URL. */
export const JOINING_WORLD_PLAZA_COLYSEUS_MISCONFIGURED_URL_ERROR =
  "Plaza server URL is not configured for production. Set NEXT_PUBLIC_WORLD_PLAZA_COLYSEUS_URL on Vercel to your Colyseus Cloud endpoint, then redeploy." as const;

export interface JoiningWorldPlazaColyseusRoomParams {
  userId: string;
  displayName: string;
  profileStatusKind?: CommunityMemberProfileStatusKind | null;
  avatarUrl?: string | null;
  avatarSkinId?: DefiningWorldPlazaAvatarSkinId | null;
  preferredRoomIndex?: number | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
}

/**
 * Match-makes into a plaza shard via {@link Client.joinOrCreate}.
 *
 * @param params - Auth identity, shard index, and live local position ref.
 * @returns Connected Colyseus room.
 */
export async function joiningWorldPlazaColyseusRoom({
  userId,
  displayName,
  profileStatusKind = null,
  avatarUrl = null,
  avatarSkinId = null,
  preferredRoomIndex = null,
  playerPositionRef,
}: JoiningWorldPlazaColyseusRoomParams): Promise<
  Room<DefiningWorldPlazaColyseusRoomState>
> {
  if (detectingWorldPlazaColyseusServerMisconfigurationForBrowser()) {
    throw new Error(JOINING_WORLD_PLAZA_COLYSEUS_MISCONFIGURED_URL_ERROR);
  }

  const playerPosition = playerPositionRef.current;

  if (
    !playerPosition ||
    !Number.isFinite(playerPosition.x) ||
    !Number.isFinite(playerPosition.y)
  ) {
    throw new Error("Plaza Colyseus connect requires a valid local player position.");
  }

  const targetRoomIndex =
    preferredRoomIndex ?? DEFINING_WORLD_PLAZA_COLYSEUS_FIRST_SHARD_INDEX;

  const joinOptions: DefiningWorldPlazaColyseusJoinOptions = {
    roomIndex: targetRoomIndex,
    userId,
    displayName,
    profileStatusKind:
      serializingWorldPlazaUserProfileStatusKindForNetworkSync(profileStatusKind),
    avatarUrl: serializingWorldPlazaUserProfileAvatarUrlForNetworkSync(avatarUrl),
    avatarSkinId: serializingWorldPlazaAvatarSkinIdForNetworkSync(avatarSkinId),
    spawnX: playerPosition.x,
    spawnY: playerPosition.y,
  };

  const room = await creatingWorldPlazaColyseusClient().joinOrCreate<
    DefiningWorldPlazaColyseusRoomState
  >(DEFINING_WORLD_PLAZA_COLYSEUS_ROOM_NAME, joinOptions);

  playerPosition.layer = resolvingWorldPlazaPlayerWorldLayer(playerPosition);

  return room;
}
