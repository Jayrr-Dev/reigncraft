"use client";

import type { CommunityMemberProfileStatusKind } from "@/components/community/domains/definingCommunityMemberProfileStatus";
import { ProvidingWorldPlazaColyseusRoomContext } from "@/components/world/colyseus/domains/creatingWorldPlazaColyseusRoomContext";
import { joiningWorldPlazaColyseusRoom } from "@/components/world/colyseus/domains/joiningWorldPlazaColyseusRoom";
import {
  DEFINING_WORLD_PLAZA_COLYSEUS_FIRST_SHARD_INDEX,
} from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";
import { SyncingWorldPlazaColyseusPlayerProfileMetadata } from "@/components/world/components/syncingWorldPlazaColyseusPlayerProfileMetadata";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { usingWorldPlazaSelectedAvatarSkin } from "@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin";
import { useCallback, useMemo, useRef } from "react";

export interface ProvidingWorldPlazaColyseusRoomProps {
  /** Auth user id; skips connection when null. */
  userId: string | null;
  /** Display name sent in the join payload. */
  displayName: string;
  /** Public profile status badge sent in the join payload. */
  profileStatusKind?: CommunityMemberProfileStatusKind | null;
  /** Avatar URL sent in the join payload. */
  avatarUrl?: string | null;
  /** Shard from `?room=`; defaults to room 1. */
  preferredRoomIndex?: number | null;
  /** When false, disconnects from Colyseus. */
  enabled: boolean;
  /** Live local avatar position updated on join. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  children: React.ReactNode;
}

/**
 * Connects to a plaza Colyseus room using {@link createRoomContext} from
 * `@colyseus/react` (StrictMode-safe lifecycle).
 *
 * Join metadata that loads asynchronously (display name, avatar, status) is read
 * from refs at connect time and synced later via
 * {@link SyncingWorldPlazaColyseusPlayerProfileMetadata} so the room does not
 * reconnect when profile queries resolve.
 *
 * @see https://docs.colyseus.io/getting-started/react
 */
export function ProvidingWorldPlazaColyseusRoom({
  userId,
  displayName,
  profileStatusKind = null,
  avatarUrl = null,
  preferredRoomIndex = null,
  enabled,
  playerPositionRef,
  children,
}: ProvidingWorldPlazaColyseusRoomProps): React.JSX.Element {
  const targetRoomIndex =
    preferredRoomIndex ?? DEFINING_WORLD_PLAZA_COLYSEUS_FIRST_SHARD_INDEX;

  const displayNameRef = useRef(displayName);
  const profileStatusKindRef = useRef(profileStatusKind);
  const avatarUrlRef = useRef(avatarUrl);
  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const avatarSkinIdRef = useRef(selectedAvatarSkinId);

  displayNameRef.current = displayName;
  profileStatusKindRef.current = profileStatusKind;
  avatarUrlRef.current = avatarUrl;
  avatarSkinIdRef.current = selectedAvatarSkinId;

  const connectingWorldPlazaColyseusRoom = useCallback(() => {
    if (!userId) {
      throw new Error("Plaza Colyseus connect requires an authenticated user id.");
    }

    return joiningWorldPlazaColyseusRoom({
      userId,
      displayName: displayNameRef.current,
      profileStatusKind: profileStatusKindRef.current,
      avatarUrl: avatarUrlRef.current,
      avatarSkinId: avatarSkinIdRef.current,
      preferredRoomIndex: targetRoomIndex,
      playerPositionRef,
    });
  }, [playerPositionRef, targetRoomIndex, userId]);

  const roomProviderDeps = useMemo(
    () => [userId, targetRoomIndex, enabled] as const,
    [enabled, targetRoomIndex, userId],
  );

  const connect = enabled && userId ? connectingWorldPlazaColyseusRoom : null;

  return (
    <ProvidingWorldPlazaColyseusRoomContext connect={connect} deps={roomProviderDeps}>
      <SyncingWorldPlazaColyseusPlayerProfileMetadata
        enabled={enabled && userId !== null}
        displayName={displayName}
        profileStatusKind={profileStatusKind}
        avatarUrl={avatarUrl}
        avatarSkinId={selectedAvatarSkinId}
      />
      {children}
    </ProvidingWorldPlazaColyseusRoomContext>
  );
}
