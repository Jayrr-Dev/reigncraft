'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type {
  DefiningWorldPlazaOnlineRoomChatBubble,
  DefiningWorldPlazaOnlineRoomTypingUser,
} from '@/components/world/domains/definingWorldPlazaOnlineRoomChat';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaRoomChatBubbleScreenPoint } from '@/components/world/domains/resolvingWorldPlazaRoomChatBubbleScreenPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { useEffect, useRef } from 'react';

/** Off-screen default before the first animation frame positions an indicator. */
const RENDERING_WORLD_PLAZA_ROOM_TYPING_INDICATOR_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

/** Initial scale before the camera rig publishes live zoom. */
const RENDERING_WORLD_PLAZA_ROOM_TYPING_INDICATOR_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export interface RenderingWorldPlazaRoomTypingIndicatorsProps {
  typingUsers: readonly DefiningWorldPlazaOnlineRoomTypingUser[];
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
 * Builds a positioning-only pseudo bubble so typing indicators reuse the exact
 * speaker-anchoring logic used by chat bubbles.
 *
 * @param typingUser - The remote typist to anchor.
 */
function buildingTypingIndicatorAnchorBubble(
  typingUser: DefiningWorldPlazaOnlineRoomTypingUser
): DefiningWorldPlazaOnlineRoomChatBubble {
  return {
    id: `typing:${typingUser.userId}`,
    userId: typingUser.userId,
    displayName: typingUser.displayName,
    message: '',
    expiresAt: typingUser.expiresAt,
    anchorGridX: typingUser.anchorGridX,
    anchorGridY: typingUser.anchorGridY,
  };
}

/**
 * DOM overlay "..." indicators floating above plaza avatars who are typing.
 */
export function RenderingWorldPlazaRoomTypingIndicators({
  typingUsers,
  localUserId,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaRoomTypingIndicatorsProps): React.JSX.Element {
  const typingUsersRef = useRef(typingUsers);
  const localUserIdRef = useRef(localUserId);
  const remotePlayersRef = useRef(remotePlayers);
  const indicatorElementByUserIdRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );

  typingUsersRef.current = typingUsers;
  localUserIdRef.current = localUserId;
  remotePlayersRef.current = remotePlayers;

  useEffect(() => {
    if (typingUsers.length === 0) {
      return;
    }

    const updatingIndicatorPositions = (): void => {
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;

      for (const typingUser of typingUsersRef.current) {
        const indicatorElement = indicatorElementByUserIdRef.current.get(
          typingUser.userId
        );

        if (!indicatorElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaRoomChatBubbleScreenPoint({
          bubble: buildingTypingIndicatorAnchorBubble(typingUser),
          localUserId: localUserIdRef.current,
          playerPositionRef,
          remotePlayerRegistryRef,
          playerRenderPositionRegistryRef,
          remotePlayers: remotePlayersRef.current,
          cameraOffset,
          cameraWorldZoom,
        });

        applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
          indicatorElement,
          screenPoint.x,
          screenPoint.y
        );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          indicatorElement.firstElementChild as HTMLElement | null,
          cameraWorldZoom
        );
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingIndicatorPositions();
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
    typingUsers.length,
  ]);

  if (typingUsers.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {typingUsers.map((typingUser) => (
        <div
          key={typingUser.userId}
          ref={(element) => {
            if (element) {
              indicatorElementByUserIdRef.current.set(
                typingUser.userId,
                element
              );
              return;
            }

            indicatorElementByUserIdRef.current.delete(typingUser.userId);
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            transform:
              RENDERING_WORLD_PLAZA_ROOM_TYPING_INDICATOR_HIDDEN_TRANSFORM,
          }}
        >
          <div
            style={
              RENDERING_WORLD_PLAZA_ROOM_TYPING_INDICATOR_INITIAL_SCALE_STYLE
            }
            className="origin-bottom animate-in fade-in zoom-in-50 duration-200 ease-out flex items-center gap-1 rounded-full border border-white/25 bg-[#0d1b2a]/95 px-2 py-1 shadow-md"
          >
            <span className="size-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-white/80" />
          </div>
        </div>
      ))}
    </div>
  );
}
