'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_TEXT_OVERLAY_FRAME_BUDGET_MS } from '@/components/world/domains/definingWorldPlazaDomOverlayPerformanceConstants';
import {
  creatingWorldPlazaDomOverlayIterationState,
  iteratingWorldPlazaDomOverlayEntriesWithinBudget,
} from '@/components/world/domains/iteratingWorldPlazaDomOverlayEntriesWithinBudget';
import {
  checkingWorldPlazaDomOverlayFrameShouldUpdate,
  subscribingWorldPlazaDomOverlayFrame,
} from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWildlifeSpeechBubbleContent } from '@/components/world/wildlife/components/renderingWildlifeSpeechBubbleContent';
import type { DefiningWildlifeSpeechBubbleOverlay } from '@/components/world/wildlife/domains/definingWildlifeSpeechBubbleTypes';
import { resolvingWorldPlazaWildlifeSpeechBubbleScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeSpeechBubbleScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_SCALE_CLASS_NAME =
  'origin-bottom' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaWildlifeSpeechBubblesProps = {
  /** Drives which bubble elements mount (message / instance id). */
  speechBubbles: readonly DefiningWildlifeSpeechBubbleOverlay[];
  /** Live grid positions updated each wildlife sim tick. */
  speechBubblesOutRef: React.RefObject<
    readonly DefiningWildlifeSpeechBubbleOverlay[]
  >;
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
};

/**
 * Styled speech text above wildlife sprites.
 */
export function RenderingWorldPlazaWildlifeSpeechBubbles({
  speechBubbles,
  speechBubblesOutRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaWildlifeSpeechBubblesProps): React.JSX.Element {
  const speechBubblesRef = useRef(speechBubbles);
  const bubbleElementByInstanceIdRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const iterationStateRef = useRef(
    creatingWorldPlazaDomOverlayIterationState()
  );
  const lastUpdateTimeMsRef = useRef(0);

  speechBubblesRef.current = speechBubbles;

  useLayoutEffect(() => {
    if (speechBubbles.length === 0) {
      return;
    }

    let isActive = true;
    const iterationState = iterationStateRef.current;

    const updatingBubblePositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const liveSpeechBubbles = speechBubblesOutRef.current ?? [];

      iteratingWorldPlazaDomOverlayEntriesWithinBudget({
        entries: liveSpeechBubbles,
        state: iterationState,
        timeBudgetMs: DEFINING_WORLD_PLAZA_TEXT_OVERLAY_FRAME_BUDGET_MS,
        visit: (entry) => {
          const bubbleElement = bubbleElementByInstanceIdRef.current.get(
            entry.instanceId
          );

          if (!bubbleElement) {
            return;
          }

          const screenPoint =
            resolvingWorldPlazaWildlifeSpeechBubbleScreenPoint({
              gridPoint: {
                x: entry.gridX,
                y: entry.gridY,
                layer: entry.layer,
              },
              sizeScale: entry.sizeScale,
              frameHeightPx: entry.frameHeightPx,
              cameraOffset,
              cameraWorldZoom,
              jumpArcOffsetPx: entry.jumpArcOffsetPx,
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
        },
      });
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      (_deltaMs, frameTimeMs) => {
        if (
          !checkingWorldPlazaDomOverlayFrameShouldUpdate(
            0,
            lastUpdateTimeMsRef.current,
            frameTimeMs,
            false
          )
        ) {
          return;
        }

        lastUpdateTimeMsRef.current = frameTimeMs;
        updatingBubblePositions();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
      iterationState.nextIndex = 0;
      lastUpdateTimeMsRef.current = 0;
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    speechBubbles.length,
    speechBubblesOutRef,
  ]);

  if (speechBubbles.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {speechBubbles.map((entry) => (
        <div
          key={entry.instanceId}
          ref={(element) => {
            if (element) {
              bubbleElementByInstanceIdRef.current.set(
                entry.instanceId,
                element
              );
              return;
            }

            bubbleElementByInstanceIdRef.current.delete(entry.instanceId);
          }}
          className={
            RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_WRAPPER_CLASS_NAME
          }
          style={{
            transform:
              RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_HIDDEN_TRANSFORM,
          }}
        >
          <div
            className={
              RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_SCALE_CLASS_NAME
            }
            style={
              RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_INITIAL_SCALE_STYLE
            }
          >
            <RenderingWildlifeSpeechBubbleContent
              message={entry.message}
              presentation={entry.presentation}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
