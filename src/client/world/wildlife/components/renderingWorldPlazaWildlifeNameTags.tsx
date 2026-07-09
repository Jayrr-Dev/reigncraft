'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  STYLING_WILDLIFE_NAME_TAG_FONT_CLASS_NAME,
  STYLING_WILDLIFE_NAME_TAG_REVEAL_TRANSITION_STYLE,
  STYLING_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME,
  STYLING_WILDLIFE_NAME_TAG_TEXT_STYLE,
} from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeNameTagOverlay } from '@/components/world/wildlife/domains/definingWildlifeNameTagTypes';
import { resolvingWorldPlazaWildlifeNameTagScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeNameTagScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-[9] will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_SCALE_CLASS_NAME =
  'origin-bottom' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME = [
  'whitespace-nowrap text-center leading-none',
  STYLING_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME,
  STYLING_WILDLIFE_NAME_TAG_FONT_CLASS_NAME,
].join(' ');

export type RenderingWorldPlazaWildlifeNameTagsProps = {
  /** Drives which name-tag elements mount (instance id / label). */
  nameTags: readonly DefiningWildlifeNameTagOverlay[];
  /** Live grid positions updated each wildlife sim tick. */
  nameTagsOutRef: React.RefObject<readonly DefiningWildlifeNameTagOverlay[]>;
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
};

/**
 * Size-tier name tags floating just above wildlife sprites.
 */
export function RenderingWorldPlazaWildlifeNameTags({
  nameTags,
  nameTagsOutRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaWildlifeNameTagsProps): React.JSX.Element {
  const tagElementByInstanceIdRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const lastOpacityByInstanceIdRef = useRef<Map<string, string>>(new Map());

  useLayoutEffect(() => {
    if (nameTags.length === 0) {
      return;
    }

    let isActive = true;

    const updatingTagPositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const liveNameTags = nameTagsOutRef.current ?? [];

      for (const entry of liveNameTags) {
        const tagElement = tagElementByInstanceIdRef.current.get(
          entry.instanceId
        );

        if (!tagElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaWildlifeNameTagScreenPoint({
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

        tagElement.style.transform =
          computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
            screenPoint.x,
            screenPoint.y
          );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          tagElement.firstElementChild as HTMLElement | null,
          cameraWorldZoom
        );

        const textElement = tagElement.firstElementChild
          ?.firstElementChild as HTMLElement | null;
        const nextOpacity = entry.isRevealed ? '1' : '0';
        const lastOpacity = lastOpacityByInstanceIdRef.current.get(
          entry.instanceId
        );

        if (textElement && lastOpacity !== nextOpacity) {
          textElement.style.opacity = nextOpacity;
          lastOpacityByInstanceIdRef.current.set(entry.instanceId, nextOpacity);
        }
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingTagPositions();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
      lastOpacityByInstanceIdRef.current.clear();
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, nameTags.length, nameTagsOutRef]);

  if (nameTags.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {nameTags.map((entry) => (
        <div
          key={entry.instanceId}
          ref={(element) => {
            if (element) {
              tagElementByInstanceIdRef.current.set(entry.instanceId, element);
              return;
            }

            tagElementByInstanceIdRef.current.delete(entry.instanceId);
            lastOpacityByInstanceIdRef.current.delete(entry.instanceId);
          }}
          className={RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_WRAPPER_CLASS_NAME}
          style={{
            transform: RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_HIDDEN_TRANSFORM,
          }}
        >
          <div
            className={RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_SCALE_CLASS_NAME}
            style={RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_INITIAL_SCALE_STYLE}
          >
            <span
              className={
                RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME
              }
              style={{
                color: entry.textColor,
                opacity: 0,
                ...STYLING_WILDLIFE_NAME_TAG_TEXT_STYLE,
                ...STYLING_WILDLIFE_NAME_TAG_REVEAL_TRANSITION_STYLE,
              }}
            >
              {entry.displayLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
