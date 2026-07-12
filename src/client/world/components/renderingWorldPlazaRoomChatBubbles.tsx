'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaOnlineRoomChatBubble } from '@/components/world/domains/definingWorldPlazaOnlineRoomChat';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import { DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_PREVIEW_MAX_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaRoomChatGifConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaRoomChatGifPreviewUrlFromMessage } from '@/components/world/domains/encodingWorldPlazaRoomChatGifMessage';
import { resolvingWorldPlazaRoomChatBubbleScreenPoint } from '@/components/world/domains/resolvingWorldPlazaRoomChatBubbleScreenPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { useEffect, useRef } from 'react';

/** Max width for text avatar chat bubbles. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_MAX_WIDTH_CLASS_NAME =
  'max-w-[8rem]' as const;

/** Fixed width for GIF avatar chat bubbles (includes padding). */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_BUBBLE_WIDTH_CLASS_NAME =
  'w-[5.5rem] min-w-0 max-w-[5.5rem]' as const;

/** GIF bubble inner layout: clip media and keep padding inside the fixed width. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_BUBBLE_CONTENT_CLASS_NAME =
  'overflow-hidden px-1 py-0.5' as const;

/** GIF preview image classes (width comes from the bubble container). */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PREVIEW_IMAGE_CLASS_NAME =
  'mx-auto block h-auto w-full max-w-full rounded-sm object-contain' as const;

/** Shared bubble content classes. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_CONTENT_BASE_CLASS_NAME =
  'origin-bottom animate-in fade-in zoom-in-50 duration-200 ease-out rounded-md border px-1.5 py-0.5 text-center text-[10px] leading-tight shadow-md' as const;

/** Off-screen default before the first animation frame positions a bubble. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

/** Initial scale before the camera rig publishes live zoom. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export interface RenderingWorldPlazaRoomChatBubblesProps {
  bubbles: readonly DefiningWorldPlazaOnlineRoomChatBubble[];
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
 * DOM overlay chat bubbles positioned above plaza avatars.
 */
export function RenderingWorldPlazaRoomChatBubbles({
  bubbles,
  localUserId,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaRoomChatBubblesProps): React.JSX.Element {
  const bubblesRef = useRef(bubbles);
  const localUserIdRef = useRef(localUserId);
  const remotePlayersRef = useRef(remotePlayers);
  const bubbleElementByIdRef = useRef<Map<string, HTMLDivElement>>(new Map());

  bubblesRef.current = bubbles;
  localUserIdRef.current = localUserId;
  remotePlayersRef.current = remotePlayers;

  useEffect(() => {
    if (bubbles.length === 0) {
      return;
    }

    const updatingBubblePositions = (): void => {
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;

      for (const bubble of bubblesRef.current) {
        const bubbleElement = bubbleElementByIdRef.current.get(bubble.id);

        if (!bubbleElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaRoomChatBubbleScreenPoint({
          bubble,
          localUserId: localUserIdRef.current,
          playerPositionRef,
          remotePlayerRegistryRef,
          playerRenderPositionRegistryRef,
          remotePlayers: remotePlayersRef.current,
          cameraOffset,
          cameraWorldZoom,
        });

        applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
          bubbleElement,
          screenPoint.x,
          screenPoint.y
        );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          bubbleElement.firstElementChild as HTMLElement | null,
          cameraWorldZoom
        );
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingBubblePositions();
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
    };
  }, [
    bubbles.length,
    cameraOffsetRef,
    cameraWorldZoomRef,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (bubbles.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((bubble) => {
        const isLocalBubble = bubble.userId === localUserId;
        const gifPreviewUrl =
          resolvingWorldPlazaRoomChatGifPreviewUrlFromMessage(bubble.message);

        return (
          <div
            key={bubble.id}
            ref={(element) => {
              if (element) {
                bubbleElementByIdRef.current.set(bubble.id, element);
                return;
              }

              bubbleElementByIdRef.current.delete(bubble.id);
            }}
            className={`absolute left-0 top-0 ${
              gifPreviewUrl
                ? RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_BUBBLE_WIDTH_CLASS_NAME
                : RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_MAX_WIDTH_CLASS_NAME
            } will-change-transform`}
            style={{
              transform:
                RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_HIDDEN_TRANSFORM,
            }}
          >
            <div
              style={RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_INITIAL_SCALE_STYLE}
              className={`${RENDERING_WORLD_PLAZA_ROOM_CHAT_BUBBLE_CONTENT_BASE_CLASS_NAME} ${
                gifPreviewUrl
                  ? RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_BUBBLE_CONTENT_CLASS_NAME
                  : ''
              } ${
                isLocalBubble
                  ? 'border-[#f4d35e]/60 bg-[#1b263b] text-[#f4d35e]'
                  : 'border-white/25 bg-[#0d1b2a]/95 text-white'
              }`}
            >
              <p className="truncate font-medium opacity-75">
                {bubble.displayName}
              </p>
              {gifPreviewUrl ? (
                <img
                  src={gifPreviewUrl}
                  alt={`GIF from ${bubble.displayName}`}
                  className={
                    RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PREVIEW_IMAGE_CLASS_NAME
                  }
                  style={{
                    maxHeight:
                      DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_PREVIEW_MAX_HEIGHT_PX,
                  }}
                />
              ) : (
                <p className="break-words">{bubble.message}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
