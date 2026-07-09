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
import { RenderingWorldPlazaTimedInteractionProgressRing } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionProgressRing';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { computingWorldPlazaInventoryFoodEatSoundRevealText } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodEatFlavorTextConstants';
import { resolvingWorldPlazaInventoryFoodEatOverlayScreenPoint } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatOverlayScreenPoint';
import type { UsingWorldPlazaInventoryFoodEatOverlaySnapshot } from '@/components/world/inventory/hooks/usingWorldPlazaInventoryFoodEatProgress';
import { useLayoutEffect, useRef, type RefObject } from 'react';

const RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-20 will-change-transform select-none pointer-events-none' as const;

const RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_CONTENT_CLASS_NAME =
  'flex flex-col items-center gap-1 origin-bottom' as const;

/** Matches the wildlife eating speech text (font-body, 10px). */
const RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_SOUND_CLASS_NAME =
  'font-body text-[10px] text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]' as const;

const RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaInventoryFoodEatOverlayProps = {
  readonly localUserId: string;
  readonly overlaySnapshot: UsingWorldPlazaInventoryFoodEatOverlaySnapshot;
  readonly progressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly playerRenderPositionRegistryRef?: RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  readonly cameraOffsetRef: RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: RefObject<number>;
};

/**
 * Eating sound text ("nom nom nom") and eat progress ring anchored above the
 * local player. Sound words appear one at a time while the channel runs.
 */
export function RenderingWorldPlazaInventoryFoodEatOverlay({
  localUserId,
  overlaySnapshot,
  progressSnapshot,
  progressRatioRef,
  playerPositionRef,
  playerRenderPositionRegistryRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaInventoryFoodEatOverlayProps): React.JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const soundTextRef = useRef<HTMLSpanElement | null>(null);
  const progressSnapshotRef = useRef(progressSnapshot);
  const flavorLineRef = useRef(overlaySnapshot.flavorLine);

  progressSnapshotRef.current = progressSnapshot;
  flavorLineRef.current = overlaySnapshot.flavorLine;

  const isVisible = overlaySnapshot.isVisible;

  useLayoutEffect(() => {
    if (!isVisible) {
      return;
    }

    let isActive = true;
    const channelStartedAtMs = performance.now();

    const updatingOverlayPosition = (): void => {
      if (!isActive) {
        return;
      }

      const wrapperElement = wrapperRef.current;

      if (!wrapperElement) {
        return;
      }

      const screenPoint = resolvingWorldPlazaInventoryFoodEatOverlayScreenPoint(
        {
          playerPositionRef,
          playerRenderPositionRegistryRef,
          localUserId,
          cameraOffset: cameraOffsetRef.current,
          cameraWorldZoom: cameraWorldZoomRef.current,
        }
      );

      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          screenPoint.x,
          screenPoint.y
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        contentRef.current,
        cameraWorldZoomRef.current
      );

      const soundTextElement = soundTextRef.current;

      if (soundTextElement) {
        soundTextElement.textContent =
          computingWorldPlazaInventoryFoodEatSoundRevealText(
            flavorLineRef.current,
            performance.now() - channelStartedAtMs
          );
      }

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
      className={RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_WRAPPER_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_HIDDEN_TRANSFORM,
        transition: 'opacity 180ms ease-out',
      }}
      aria-hidden="true"
    >
      <div
        ref={contentRef}
        className={RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_CONTENT_CLASS_NAME}
        style={RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_INITIAL_SCALE_STYLE}
      >
        <span
          ref={soundTextRef}
          className={RENDERING_WORLD_PLAZA_FOOD_EAT_OVERLAY_SOUND_CLASS_NAME}
        />
        <RenderingWorldPlazaTimedInteractionProgressRing
          snapshot={progressSnapshot}
          progressRatioRef={progressRatioRef}
        />
      </div>
    </div>
  );
}
