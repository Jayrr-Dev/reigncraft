'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaFishingCastProgressRing } from '@/components/world/fishing/components/renderingWorldPlazaFishingCastProgressRing';
import { resolvingWorldPlazaFishingCastOverlayScreenPoint } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCastOverlayScreenPoint';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { useLayoutEffect, useRef, type RefObject } from 'react';

const RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-20 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_CONTENT_CLASS_NAME =
  'flex flex-col items-center origin-bottom pointer-events-auto' as const;

const RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaFishingCastOverlayProps = {
  readonly localUserId: string;
  readonly progressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly reelOpportunityActiveRef: RefObject<boolean>;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly playerRenderPositionRegistryRef?: RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  readonly cameraOffsetRef: RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: RefObject<number>;
  readonly onReel: () => void;
  readonly onReelHoldStart: () => void;
  readonly onReelHoldEnd: () => void;
};

/**
 * Fishing cast progress ring anchored above the local player's head.
 */
export function RenderingWorldPlazaFishingCastOverlay({
  localUserId,
  progressSnapshot,
  progressRatioRef,
  reelOpportunityActiveRef,
  playerPositionRef,
  playerRenderPositionRegistryRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onReel,
  onReelHoldStart,
  onReelHoldEnd,
}: RenderingWorldPlazaFishingCastOverlayProps): React.JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const progressSnapshotRef = useRef(progressSnapshot);

  progressSnapshotRef.current = progressSnapshot;

  const isVisible =
    progressSnapshot.isActive ||
    progressSnapshot.isCancelling ||
    progressSnapshot.progressRatio > 0;

  useLayoutEffect(() => {
    if (!isVisible) {
      return;
    }

    let isActive = true;

    const updatingOverlayPosition = (): void => {
      if (!isActive) {
        return;
      }

      const wrapperElement = wrapperRef.current;

      if (!wrapperElement) {
        return;
      }

      const screenPoint = resolvingWorldPlazaFishingCastOverlayScreenPoint({
        playerPositionRef,
        playerRenderPositionRegistryRef,
        localUserId,
        cameraOffset: cameraOffsetRef.current,
        cameraWorldZoom: cameraWorldZoomRef.current,
      });

      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          screenPoint.x,
          screenPoint.y
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        contentRef.current,
        cameraWorldZoomRef.current
      );

      wrapperElement.style.opacity = progressSnapshotRef.current.isCancelling
        ? '0'
        : '1';
    };

    updatingOverlayPosition();

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingOverlayPosition();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    isVisible,
    localUserId,
    playerPositionRef,
    playerRenderPositionRegistryRef,
  ]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_WRAPPER_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_HIDDEN_TRANSFORM,
        transition: 'opacity 180ms ease-out',
      }}
    >
      <div
        ref={contentRef}
        className={
          RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_CONTENT_CLASS_NAME
        }
        style={RENDERING_WORLD_PLAZA_FISHING_CAST_OVERLAY_INITIAL_SCALE_STYLE}
      >
        <RenderingWorldPlazaFishingCastProgressRing
          snapshot={progressSnapshot}
          progressRatioRef={progressRatioRef}
          reelOpportunityActiveRef={reelOpportunityActiveRef}
          onReel={onReel}
          onReelHoldStart={onReelHoldStart}
          onReelHoldEnd={onReelHoldEnd}
        />
      </div>
    </div>
  );
}
