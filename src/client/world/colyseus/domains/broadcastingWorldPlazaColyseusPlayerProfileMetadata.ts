import {
  DEFINING_WORLD_PLAZA_COLYSEUS_PROFILE_MESSAGE,
  type DefiningWorldPlazaColyseusProfileSendPayload,
} from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";
import type { DefiningWorldPlazaColyseusRoomState } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type { CommunityMemberProfileStatusKind } from "@/components/community/domains/definingCommunityMemberProfileStatus";
import { serializingWorldPlazaUserProfileAvatarUrlForNetworkSync } from "@/components/world/domains/parsingWorldPlazaUserProfileAvatarUrlForNetworkSync";
import { serializingWorldPlazaUserProfileStatusKindForNetworkSync } from "@/components/world/domains/parsingWorldPlazaUserProfileStatusKindForNetworkSync";
import { serializingWorldPlazaAvatarSkinIdForNetworkSync } from "@/components/world/domains/parsingWorldPlazaAvatarSkinIdForNetworkSync";
import type { DefiningWorldPlazaAvatarSkinId } from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import type { Room } from "@colyseus/sdk";

export interface BroadcastingWorldPlazaColyseusPlayerProfileMetadataParams {
  /** Active Colyseus room after join. */
  room: Room<DefiningWorldPlazaColyseusRoomState>;
  /** Resolved display label for the local player. */
  displayName: string;
  /** Public profile status badge, if any. */
  profileStatusKind?: CommunityMemberProfileStatusKind | null;
  /** Profile avatar URL, if any. */
  avatarUrl?: string | null;
  /** Selected plaza avatar skin id. */
  avatarSkinId?: DefiningWorldPlazaAvatarSkinId | null;
}

/**
 * Sends profile metadata to the plaza server without reconnecting.
 *
 * Used when display name or name-tag fields resolve after the initial join.
 *
 * @param params - Active room and metadata to broadcast to other clients.
 */
export function broadcastingWorldPlazaColyseusPlayerProfileMetadata({
  room,
  displayName,
  profileStatusKind = null,
  avatarUrl = null,
  avatarSkinId = null,
}: BroadcastingWorldPlazaColyseusPlayerProfileMetadataParams): void {
  const payload: DefiningWorldPlazaColyseusProfileSendPayload = {
    displayName: displayName.trim() || "Member",
    profileStatusKind:
      serializingWorldPlazaUserProfileStatusKindForNetworkSync(profileStatusKind),
    avatarUrl: serializingWorldPlazaUserProfileAvatarUrlForNetworkSync(avatarUrl),
    avatarSkinId: serializingWorldPlazaAvatarSkinIdForNetworkSync(avatarSkinId),
  };

  room.send(DEFINING_WORLD_PLAZA_COLYSEUS_PROFILE_MESSAGE, payload);
}
