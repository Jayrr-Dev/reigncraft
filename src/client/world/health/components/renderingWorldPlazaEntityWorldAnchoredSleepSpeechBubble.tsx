'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import type { DefiningWorldPlazaEntitySleepSpeechBubble } from '@/components/world/health/domains/advancingWorldPlazaEntitySleepSpeechBubble';
import { resolvingWorldPlazaEntityWorldAnchoredSleepSpeechBubbleScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityWorldAnchoredSleepSpeechBubbleScreenPoint';
import { RenderingWildlifeSpeechBubbleContent } from '@/components/world/wildlife/components/renderingWildlifeSpeechBubbleContent';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-20 will-change-transform pointer-events-none select-none' as const;

const RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_SCALE_CLASS_NAME =
  'origin-bottom' as const;

const RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaEntityWorldAnchoredSleepSpeechBubbleProps = {
  localUserId: string;
  anchorGridX: number;
  anchorGridY: number;
  isVisible: boolean;
  bubble: DefiningWorldPlazaEntitySleepSpeechBubble | null;
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
};

/**
 * Wildlife-style Zzz speech bubble anchored above a sleeping player.
 */
export function RenderingWorldPlazaEntityWorldAnchoredSleepSpeechBubble({
  localUserId,
  anchorGridX,
  anchorGridY,
  isVisible,
  bubble,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaEntityWorldAnchoredSleepSpeechBubbleProps): React.JSX.Element {
  const remotePlayersRef = useRef(remotePlayers);
  const bubbleWrapperRef = useRef<HTMLDivElement | null>(null);
  const bubbleScaleRef = useRef<HTMLDivElement | null>(null);

  remotePlayersRef.current = remotePlayers;

  useLayoutEffect(() => {
    if (!isVisible || bubble === null) {
      if (bubbleWrapperRef.current) {
        bubbleWrapperRef.current.style.transform =
          RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_HIDDEN_TRANSFORM;
      }

      return;
    }

    let isActive = true;

    const updatingBubblePosition = (): void => {
      if (!isActive || !bubbleWrapperRef.current) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const screenPoint =
        resolvingWorldPlazaEntityWorldAnchoredSleepSpeechBubbleScreenPoint({
          userId: localUserId,
          anchorGridX,
          anchorGridY,
          localUserId,
          playerPositionRef,
          remotePlayerRegistryRef,
          playerRenderPositionRegistryRef,
          remotePlayers: remotePlayersRef.current,
          cameraOffset,
          cameraWorldZoom,
        });

      bubbleWrapperRef.current.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          screenPoint.x,
          screenPoint.y
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        bubbleScaleRef.current,
        cameraWorldZoom
      );
    };

    updatingBubblePosition();
    const unsubscribe = subscribingWorldPlazaDomOverlayFrame(
      updatingBubblePosition
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [
    anchorGridX,
    anchorGridY,
    bubble,
    cameraOffsetRef,
    cameraWorldZoomRef,
    isVisible,
    localUserId,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (!isVisible || bubble === null) {
    return <></>;
  }

  return (
    <div
      ref={bubbleWrapperRef}
      className={
        RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_WRAPPER_CLASS_NAME
      }
      style={{
        transform:
          RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_HIDDEN_TRANSFORM,
      }}
    >
      <div
        ref={bubbleScaleRef}
        className={
          RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_SCALE_CLASS_NAME
        }
        style={
          RENDERING_WORLD_PLAZA_ENTITY_SLEEP_SPEECH_BUBBLE_INITIAL_SCALE_STYLE
        }
      >
        <RenderingWildlifeSpeechBubbleContent
          message={bubble.message}
          presentation={bubble.presentation}
        />
      </div>
    </div>
  );
}
