'use client';

import {
  computingWorldPlazaCameraZoomedDomOverlayTrackedTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  checkingWorldPlazaDomOverlayFrameShouldUpdate,
  subscribingWorldPlazaDomOverlayFrame,
} from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  STYLING_WILDLIFE_NAME_TAG_FONT_CLASS_NAME,
  STYLING_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME,
  STYLING_WILDLIFE_NAME_TAG_TEXT_STYLE,
} from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeNameTagOverlay } from '@/components/world/wildlife/domains/definingWildlifeNameTagTypes';
import { resolvingWorldPlazaWildlifeNameTagScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeNameTagScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-[9] origin-bottom will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME = [
  'whitespace-nowrap text-center leading-none',
  STYLING_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME,
  STYLING_WILDLIFE_NAME_TAG_FONT_CLASS_NAME,
].join(' ');

type RenderingWorldPlazaWildlifeNameTagMotionSnapshot = {
  gridX: number;
  gridY: number;
  layer: number;
  jumpArcOffsetPx: number;
};

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
  const lastTransformByInstanceIdRef = useRef<Map<string, string>>(new Map());
  const lastMotionSnapshotByInstanceIdRef = useRef<
    Map<string, RenderingWorldPlazaWildlifeNameTagMotionSnapshot>
  >(new Map());
  const lastCameraOffsetRef = useRef<DefiningWorldPlazaCameraOffset | null>(
    null
  );
  const lastCameraWorldZoomRef = useRef<number | null>(null);
  const lastOverlayUpdateTimeMsRef = useRef(0);

  useLayoutEffect(() => {
    if (nameTags.length === 0) {
      return;
    }

    let isActive = true;

    const updatingTagPositions = (
      deltaMs: number,
      frameTimeMs: number
    ): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const liveNameTags = nameTagsOutRef.current ?? [];
      const lastCameraOffset = lastCameraOffsetRef.current;
      const lastCameraWorldZoom = lastCameraWorldZoomRef.current;
      let isOverlayActive =
        lastCameraOffset?.x !== cameraOffset.x ||
        lastCameraOffset?.y !== cameraOffset.y ||
        lastCameraWorldZoom !== cameraWorldZoom;

      if (!isOverlayActive) {
        for (const entry of liveNameTags) {
          if (entry.jumpArcOffsetPx > 0) {
            isOverlayActive = true;
            break;
          }

          const lastMotion = lastMotionSnapshotByInstanceIdRef.current.get(
            entry.instanceId
          );

          if (
            !lastMotion ||
            lastMotion.gridX !== entry.gridX ||
            lastMotion.gridY !== entry.gridY ||
            lastMotion.layer !== entry.layer ||
            lastMotion.jumpArcOffsetPx !== entry.jumpArcOffsetPx
          ) {
            isOverlayActive = true;
            break;
          }
        }
      }

      if (
        !checkingWorldPlazaDomOverlayFrameShouldUpdate(
          deltaMs,
          lastOverlayUpdateTimeMsRef.current,
          frameTimeMs,
          isOverlayActive
        )
      ) {
        return;
      }

      lastOverlayUpdateTimeMsRef.current = frameTimeMs;
      lastCameraOffsetRef.current = cameraOffset;
      lastCameraWorldZoomRef.current = cameraWorldZoom;

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
          cameraOffset,
          cameraWorldZoom,
          jumpArcOffsetPx: entry.jumpArcOffsetPx,
        });
        const nextTransform =
          computingWorldPlazaCameraZoomedDomOverlayTrackedTransform(
            screenPoint.x,
            screenPoint.y,
            cameraWorldZoom
          );
        const lastTransform = lastTransformByInstanceIdRef.current.get(
          entry.instanceId
        );

        if (lastTransform !== nextTransform) {
          tagElement.style.transform = nextTransform;
          lastTransformByInstanceIdRef.current.set(
            entry.instanceId,
            nextTransform
          );
        }

        lastMotionSnapshotByInstanceIdRef.current.set(entry.instanceId, {
          gridX: entry.gridX,
          gridY: entry.gridY,
          layer: entry.layer,
          jumpArcOffsetPx: entry.jumpArcOffsetPx,
        });
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      (deltaMs, frameTimeMs) => {
        updatingTagPositions(deltaMs, frameTimeMs);
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
      lastTransformByInstanceIdRef.current.clear();
      lastMotionSnapshotByInstanceIdRef.current.clear();
      lastCameraOffsetRef.current = null;
      lastCameraWorldZoomRef.current = null;
      lastOverlayUpdateTimeMsRef.current = 0;
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
            lastTransformByInstanceIdRef.current.delete(entry.instanceId);
            lastMotionSnapshotByInstanceIdRef.current.delete(entry.instanceId);
          }}
          className={RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_WRAPPER_CLASS_NAME}
          style={{
            transform: RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_HIDDEN_TRANSFORM,
          }}
        >
          <span
            className={RENDERING_WORLD_PLAZA_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME}
            style={{
              color: entry.textColor,
              ...STYLING_WILDLIFE_NAME_TAG_TEXT_STYLE,
            }}
          >
            {entry.displayLabel}
          </span>
        </div>
      ))}
    </div>
  );
}
