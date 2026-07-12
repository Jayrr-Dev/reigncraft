'use client';

import type { CommunityMemberProfileStatusKind } from '@/components/community/domains/definingCommunityMemberProfileStatus';
import { RenderingWorldPlazaPlayerNameLabelRowWithProfilePopover } from '@/components/world/components/renderingWorldPlazaPlayerNameLabelRowWithProfilePopover';
import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerNameLabelScreenPoint } from '@/components/world/domains/resolvingWorldPlazaPlayerNameLabelScreenPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { useLayoutEffect, useRef } from 'react';

/** Off-screen default before the first animation frame positions a label. */
const RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

/** Initial scale before the camera rig publishes live zoom. */
const RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

/** Wrapper for a camera-tracked name label. */
const RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export interface RenderingWorldPlazaPlayerNameLabelEntry {
  /** Stable user id for keys and registry lookups. */
  userId: string;
  /** Label shown above the avatar. */
  displayName: string;
  /** Lucide profile status badge shown to the right of the name. */
  profileStatusKind: CommunityMemberProfileStatusKind | null;
  /** Profile avatar shown to the left of the name. */
  avatarUrl: string | null;
  /** Grid X fallback when live position registries are empty. */
  anchorGridX: number;
  /** Grid Y fallback when live position registries are empty. */
  anchorGridY: number;
}

export interface RenderingWorldPlazaPlayerNameLabelsProps {
  /** Local and remote players to label. */
  nameLabelEntries: readonly RenderingWorldPlazaPlayerNameLabelEntry[];
  localUserId: string;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
}

/**
 * DOM overlay name tags floating above plaza avatars.
 */
export function RenderingWorldPlazaPlayerNameLabels({
  nameLabelEntries,
  localUserId,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaPlayerNameLabelsProps): React.JSX.Element {
  const nameLabelEntriesRef = useRef(nameLabelEntries);
  const localUserIdRef = useRef(localUserId);
  const remotePlayersRef = useRef(remotePlayers);
  const labelElementByUserIdRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );

  nameLabelEntriesRef.current = nameLabelEntries;
  localUserIdRef.current = localUserId;
  remotePlayersRef.current = remotePlayers;

  useLayoutEffect(() => {
    if (nameLabelEntries.length === 0) {
      return;
    }

    let isActive = true;

    const updatingLabelPositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;

      for (const entry of nameLabelEntriesRef.current) {
        const labelElement = labelElementByUserIdRef.current.get(entry.userId);

        if (!labelElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaPlayerNameLabelScreenPoint({
          userId: entry.userId,
          anchorGridX: entry.anchorGridX,
          anchorGridY: entry.anchorGridY,
          localUserId: localUserIdRef.current,
          playerPositionRef,
          remotePlayerRegistryRef,
          playerRenderPositionRegistryRef,
          remotePlayers: remotePlayersRef.current,
          cameraOffset,
          cameraWorldZoom,
        });

        applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
          labelElement,
          screenPoint.x,
          screenPoint.y
        );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          labelElement.firstElementChild
            ?.firstElementChild as HTMLElement | null,
          cameraWorldZoom
        );
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingLabelPositions();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    nameLabelEntries.length,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (nameLabelEntries.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {nameLabelEntries.map((entry) => (
        <div
          key={entry.userId}
          ref={(element) => {
            if (element) {
              labelElementByUserIdRef.current.set(entry.userId, element);
              return;
            }

            labelElementByUserIdRef.current.delete(entry.userId);
          }}
          className={RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_WRAPPER_CLASS_NAME}
          style={{
            transform: RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_HIDDEN_TRANSFORM,
          }}
        >
          <RenderingWorldPlazaPlayerNameLabelRowWithProfilePopover
            userId={entry.userId}
            displayName={entry.displayName}
            profileStatusKind={entry.profileStatusKind}
            avatarUrl={entry.avatarUrl}
            opensProfilePopover={entry.userId !== localUserId}
            scaleStyle={
              RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_INITIAL_SCALE_STYLE
            }
          />
        </div>
      ))}
    </div>
  );
}
