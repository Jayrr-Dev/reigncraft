"use client";

import { usingWorldPlazaColyseusRoomContext } from "@/components/world/colyseus/domains/creatingWorldPlazaColyseusRoomContext";
import { broadcastingWorldPlazaColyseusPlayerProfileMetadata } from "@/components/world/colyseus/domains/broadcastingWorldPlazaColyseusPlayerProfileMetadata";
import type { CommunityMemberProfileStatusKind } from "@/components/community/domains/definingCommunityMemberProfileStatus";
import type { DefiningWorldPlazaAvatarSkinId } from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import { useEffect, useRef } from "react";

export interface SyncingWorldPlazaColyseusPlayerProfileMetadataProps {
  /** When false, skips profile sync. */
  enabled: boolean;
  /** Display name sent to other players. */
  displayName: string;
  /** Public profile status badge shown on name tags. */
  profileStatusKind?: CommunityMemberProfileStatusKind | null;
  /** Profile avatar URL shown on name tags. */
  avatarUrl?: string | null;
  /** Selected plaza avatar skin id shown to other players. */
  avatarSkinId?: DefiningWorldPlazaAvatarSkinId | null;
}

/**
 * Pushes display name and name-tag profile fields to Colyseus after they resolve,
 * without tearing down the room connection.
 */
export function SyncingWorldPlazaColyseusPlayerProfileMetadata({
  enabled,
  displayName,
  profileStatusKind = null,
  avatarUrl = null,
  avatarSkinId = null,
}: SyncingWorldPlazaColyseusPlayerProfileMetadataProps): null {
  const { room } = usingWorldPlazaColyseusRoomContext();
  const lastSentPayloadKeyRef = useRef("");

  useEffect(() => {
    if (!enabled || !room) {
      return;
    }

    const payloadKey = JSON.stringify({
      displayName: displayName.trim() || "Member",
      profileStatusKind: profileStatusKind ?? "",
      avatarUrl: avatarUrl ?? "",
      avatarSkinId: avatarSkinId ?? "",
    });

    if (payloadKey === lastSentPayloadKeyRef.current) {
      return;
    }

    lastSentPayloadKeyRef.current = payloadKey;

    broadcastingWorldPlazaColyseusPlayerProfileMetadata({
      room,
      displayName,
      profileStatusKind,
      avatarUrl,
      avatarSkinId,
    });
  }, [avatarSkinId, avatarUrl, displayName, enabled, profileStatusKind, room]);

  return null;
}
