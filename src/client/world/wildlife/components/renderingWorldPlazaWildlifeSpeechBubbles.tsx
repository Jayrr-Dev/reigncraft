'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
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

  speechBubblesRef.current = speechBubbles;

  useLayoutEffect(() => {
    if (speechBubbles.length === 0) {
      return;
    }

    let isActive = true;

    const updatingBubblePositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const liveSpeechBubbles = speechBubblesOutRef.current ?? [];

      for (const entry of liveSpeechBubbles) {
        const bubbleElement = bubbleElementByInstanceIdRef.current.get(
          entry.instanceId
        );

        if (!bubbleElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaWildlifeSpeechBubbleScreenPoint({
          gridPoint: {
            x: entry.gridX,
            y: entry.gridY,
            layer: entry.layer,
          },
          sizeScale: entry.sizeScale,
          cameraOffset,
          cameraWorldZoom,
          jumpArcOffsetPx: entry.jumpArcOffsetPx,
        });

        bubbleElement.style.transform =
          computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
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
      isActive = false;
      unsubscribeDomOverlayFrame();
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
            className={RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_SCALE_CLASS_NAME}
            style={RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_INITIAL_SCALE_STYLE}
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
