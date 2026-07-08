'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_HUD_GOLD_BRIGHT_HEX } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { computingWorldPlazaEntityStunDotsOrbitLayout } from '@/components/world/health/domains/computingWorldPlazaEntityStunDotsOrbitLayout';
import { DEFINING_WORLD_PLAZA_STUN_DOT_COUNT, DEFINING_WORLD_PLAZA_STUN_DOT_SIZE_PX } from '@/components/world/health/domains/definingWorldPlazaEntityStunConstants';
import { resolvingWorldPlazaEntityWorldAnchoredStunDotsScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityWorldAnchoredStunDotsScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_STUN_DOTS_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_STUN_DOTS_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-20 will-change-transform pointer-events-none select-none' as const;

const RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_STUN_DOTS_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaEntityWorldAnchoredStunDotsProps = {
  localUserId: string;
  anchorGridX: number;
  anchorGridY: number;
  isVisible: boolean;
  phaseSeed: number;
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
 * Spinning gold dots anchored above a stunned player's head.
 */
export function RenderingWorldPlazaEntityWorldAnchoredStunDots({
  localUserId,
  anchorGridX,
  anchorGridY,
  isVisible,
  phaseSeed,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaEntityWorldAnchoredStunDotsProps): React.JSX.Element {
  const remotePlayersRef = useRef(remotePlayers);
  const dotElementsRef = useRef<HTMLDivElement[]>([]);
  const orbitWrapperRef = useRef<HTMLDivElement | null>(null);

  remotePlayersRef.current = remotePlayers;

  useLayoutEffect(() => {
    if (!isVisible) {
      if (orbitWrapperRef.current) {
        orbitWrapperRef.current.style.transform =
          RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_STUN_DOTS_HIDDEN_TRANSFORM;
      }

      return;
    }

    let isActive = true;

    const updatingDotPositions = (): void => {
      if (!isActive || !orbitWrapperRef.current) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const nowMs = performance.now();
      const centerPoint = resolvingWorldPlazaEntityWorldAnchoredStunDotsScreenPoint(
        {
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
        }
      );
      const dotLayout = computingWorldPlazaEntityStunDotsOrbitLayout({
        nowMs,
        phaseSeed,
        cameraWorldZoom,
      });
      const dotSizePx = DEFINING_WORLD_PLAZA_STUN_DOT_SIZE_PX * cameraWorldZoom;

      orbitWrapperRef.current.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          centerPoint.x,
          centerPoint.y
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        orbitWrapperRef.current,
        cameraWorldZoom
      );

      for (const [index, dotElement] of dotElementsRef.current.entries()) {
        const dotPosition = dotLayout[index];

        if (!dotElement || !dotPosition) {
          continue;
        }

        dotElement.style.width = `${dotSizePx}px`;
        dotElement.style.height = `${dotSizePx}px`;
        dotElement.style.transform = `translate(${dotPosition.x - dotSizePx / 2}px, ${dotPosition.y - dotSizePx / 2}px)`;
      }
    };

    updatingDotPositions();
    const unsubscribe = subscribingWorldPlazaDomOverlayFrame(updatingDotPositions);

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [
    anchorGridX,
    anchorGridY,
    cameraOffsetRef,
    cameraWorldZoomRef,
    isVisible,
    localUserId,
    phaseSeed,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (!isVisible) {
    return <></>;
  }

  return (
    <div
      ref={orbitWrapperRef}
      className={RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_STUN_DOTS_WRAPPER_CLASS_NAME}
      style={RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_STUN_DOTS_INITIAL_SCALE_STYLE}
    >
      {Array.from({ length: DEFINING_WORLD_PLAZA_STUN_DOT_COUNT }).map((_, index) => (
        <div
          key={index}
          ref={(element) => {
            if (element) {
              dotElementsRef.current[index] = element;
            }
          }}
          className="absolute left-0 top-0 rounded-full shadow-[0_0_6px_rgba(244,211,94,0.75)]"
          style={{
            backgroundColor: DEFINING_WORLD_PLAZA_HUD_GOLD_BRIGHT_HEX,
          }}
        />
      ))}
    </div>
  );
}
