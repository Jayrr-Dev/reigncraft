'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import type { DefiningWildlifeSpeechBubbleOverlay } from '@/components/world/wildlife/domains/definingWildlifeSpeechBubbleTypes';
import {
  STYLING_WILDLIFE_SPEECH_BUBBLE_CONTENT_CLASS_NAME,
  STYLING_WILDLIFE_SPEECH_BUBBLE_TEXT_STYLE,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import { resolvingWorldPlazaWildlifeHealthFloatTextScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeHealthFloatTextScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaWildlifeSpeechBubblesProps = {
  speechBubbles: readonly DefiningWildlifeSpeechBubbleOverlay[];
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
};

/**
 * Small outlined speech text above wildlife sprites.
 */
export function RenderingWorldPlazaWildlifeSpeechBubbles({
  speechBubbles,
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

      for (const entry of speechBubblesRef.current) {
        const bubbleElement = bubbleElementByInstanceIdRef.current.get(
          entry.instanceId
        );

        if (!bubbleElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaWildlifeHealthFloatTextScreenPoint({
            gridPoint: {
              x: entry.gridX,
              y: entry.gridY,
              layer: entry.layer,
            },
            sizeScale: entry.sizeScale,
            cameraOffset,
            cameraWorldZoom,
            stackIndex: 0,
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
  }, [cameraOffsetRef, cameraWorldZoomRef, speechBubbles.length]);

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
            className={STYLING_WILDLIFE_SPEECH_BUBBLE_CONTENT_CLASS_NAME}
            style={{
              ...RENDERING_WORLD_PLAZA_WILDLIFE_SPEECH_BUBBLE_INITIAL_SCALE_STYLE,
              ...STYLING_WILDLIFE_SPEECH_BUBBLE_TEXT_STYLE,
            }}
          >
            {entry.message}
          </div>
        </div>
      ))}
    </div>
  );
}
