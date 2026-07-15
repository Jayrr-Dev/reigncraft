'use client';

/**
 * Overhead eat / graze progress rings for wildlife (grass, flora, food stacks).
 *
 * @module components/world/wildlife/components/renderingWorldPlazaWildlifeForageEatOverlays
 */

import { Icon } from '@/components/ui/icon';
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
import {
  computingWorldPlazaTimedInteractionProgressRingLayout,
  computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset,
} from '@/components/world/interaction/domains/computingWorldPlazaTimedInteractionProgressRingLayout';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';
import { DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_LIFT_ABOVE_NAME_TAG_PX } from '@/components/world/wildlife/domains/definingWildlifeForageEatOverlayConstants';
import type { DefiningWildlifeForageEatOverlay } from '@/components/world/wildlife/domains/definingWildlifeForageEatOverlayTypes';
import { resolvingWorldPlazaWildlifeNameTagScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeNameTagScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RING_LAYOUT = computingWorldPlazaTimedInteractionProgressRingLayout();

const RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-[10] select-none pointer-events-none' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_SCALE_CLASS_NAME =
  'origin-bottom' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaWildlifeForageEatOverlaysProps = {
  overlays: readonly DefiningWildlifeForageEatOverlay[];
  overlaysOutRef: React.RefObject<readonly DefiningWildlifeForageEatOverlay[]>;
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
};

type ForageEatOverlayElements = {
  wrapper: HTMLDivElement;
  scaleShell: HTMLDivElement;
  progressCircle: SVGCircleElement;
};

/**
 * Eat / graze progress rings with center icons above foraging wildlife.
 */
export function RenderingWorldPlazaWildlifeForageEatOverlays({
  overlays,
  overlaysOutRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaWildlifeForageEatOverlaysProps): React.JSX.Element {
  const elementsByInstanceIdRef = useRef<Map<string, ForageEatOverlayElements>>(
    new Map()
  );
  const iterationStateRef = useRef(
    creatingWorldPlazaDomOverlayIterationState()
  );
  const lastUpdateTimeMsRef = useRef(0);

  useLayoutEffect(() => {
    if (overlays.length === 0) {
      return;
    }

    const iterationState = iterationStateRef.current;
    const elementsByInstanceId = elementsByInstanceIdRef.current;

    for (const overlay of overlays) {
      const progressCircle = elementsByInstanceId.get(
        overlay.instanceId
      )?.progressCircle;

      if (progressCircle) {
        progressCircle.style.strokeDasharray = `${RING_LAYOUT.ringCircumferencePx}`;
      }
    }

    return subscribingWorldPlazaDomOverlayFrame((_deltaMs, frameTimeMs) => {
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
      const liveOverlays = overlaysOutRef.current ?? [];
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;

      iteratingWorldPlazaDomOverlayEntriesWithinBudget({
        entries: liveOverlays,
        state: iterationState,
        timeBudgetMs: DEFINING_WORLD_PLAZA_TEXT_OVERLAY_FRAME_BUDGET_MS,
        visit: (overlay) => {
          const elements = elementsByInstanceId.get(overlay.instanceId);

          if (!elements) {
            return;
          }

          const screenPoint = resolvingWorldPlazaWildlifeNameTagScreenPoint({
            gridPoint: {
              x: overlay.gridX,
              y: overlay.gridY,
              layer: overlay.layer,
            },
            sizeScale: overlay.sizeScale,
            cameraOffset,
            cameraWorldZoom,
            frameHeightPx: overlay.frameHeightPx,
            jumpArcOffsetPx: overlay.jumpArcOffsetPx,
          });

          applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
            elements.wrapper,
            screenPoint.x,
            screenPoint.y -
              DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_LIFT_ABOVE_NAME_TAG_PX *
                cameraWorldZoom
          );
          applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
            elements.scaleShell,
            cameraWorldZoom
          );

          const strokeDashoffset =
            computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset(
              RING_LAYOUT.ringCircumferencePx,
              overlay.progressRatio
            );
          elements.progressCircle.style.strokeDashoffset = `${strokeDashoffset}`;
        },
      });
    });
  }, [overlays, overlaysOutRef, cameraOffsetRef, cameraWorldZoomRef]);

  if (overlays.length === 0) {
    return <></>;
  }

  return (
    <>
      {overlays.map((overlay) => (
        <div
          key={overlay.instanceId}
          ref={(element) => {
            const elementsByInstanceId = elementsByInstanceIdRef.current;

            if (!element) {
              elementsByInstanceId.delete(overlay.instanceId);
              return;
            }

            const scaleShell = element.firstElementChild;

            if (!(scaleShell instanceof HTMLDivElement)) {
              return;
            }

            const progressCircle = element.querySelector(
              '[data-wildlife-forage-eat-progress]'
            );

            if (!(progressCircle instanceof SVGCircleElement)) {
              return;
            }

            elementsByInstanceId.set(overlay.instanceId, {
              wrapper: element,
              scaleShell,
              progressCircle,
            });
          }}
          className={
            RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_WRAPPER_CLASS_NAME
          }
          style={{
            transform:
              RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_HIDDEN_TRANSFORM,
          }}
          aria-hidden="true"
        >
          <div
            className={
              RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_SCALE_CLASS_NAME
            }
            style={
              RENDERING_WORLD_PLAZA_WILDLIFE_FORAGE_EAT_INITIAL_SCALE_STYLE
            }
          >
            <div
              className="world-plaza-timed-interaction-progress-indicator"
              style={{
                width: `${RING_LAYOUT.ringSizePx}px`,
                height: `${RING_LAYOUT.ringSizePx}px`,
              }}
            >
              <svg
                className="world-plaza-timed-interaction-progress-ring"
                width={RING_LAYOUT.ringSizePx}
                height={RING_LAYOUT.ringSizePx}
                viewBox={`0 0 ${RING_LAYOUT.ringSizePx} ${RING_LAYOUT.ringSizePx}`}
                aria-hidden="true"
              >
                <circle
                  className="world-plaza-timed-interaction-progress-ring-track"
                  cx={RING_LAYOUT.ringCenterPx}
                  cy={RING_LAYOUT.ringCenterPx}
                  r={RING_LAYOUT.ringRadiusPx}
                  fill="none"
                  strokeWidth={
                    DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX
                  }
                />
                <circle
                  data-wildlife-forage-eat-progress=""
                  className="world-plaza-timed-interaction-progress-ring-progress"
                  cx={RING_LAYOUT.ringCenterPx}
                  cy={RING_LAYOUT.ringCenterPx}
                  r={RING_LAYOUT.ringRadiusPx}
                  fill="none"
                  strokeWidth={
                    DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX
                  }
                  transform={`rotate(-90 ${RING_LAYOUT.ringCenterPx} ${RING_LAYOUT.ringCenterPx})`}
                />
              </svg>
              <Icon
                icon={overlay.progressIcon}
                className="world-plaza-timed-interaction-progress-icon"
                style={{
                  width: `${DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX}px`,
                  height: `${DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX}px`,
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
