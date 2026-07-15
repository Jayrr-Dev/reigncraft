'use client';

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
  DEFINING_WILDLIFE_STATUS_HUD_ICON_SIZE_PX,
  DEFINING_WILDLIFE_STATUS_HUD_LIFT_ABOVE_NAME_TAG_PX,
} from '@/components/world/wildlife/domains/definingWildlifeStatusHudOverlayConstants';
import type { DefiningWildlifeStatusHudOverlay } from '@/components/world/wildlife/domains/definingWildlifeStatusHudOverlayTypes';
import { resolvingWorldPlazaWildlifeNameTagScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeNameTagScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WILDLIFE_STATUS_HUD_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WILDLIFE_STATUS_HUD_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-[10] select-none' as const;

const RENDERING_WILDLIFE_STATUS_HUD_SCALE_CLASS_NAME =
  'origin-bottom' as const;

const RENDERING_WILDLIFE_STATUS_HUD_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaWildlifeStatusHudOverlaysProps = {
  readonly overlays: readonly DefiningWildlifeStatusHudOverlay[];
  readonly overlaysOutRef: React.RefObject<
    readonly DefiningWildlifeStatusHudOverlay[]
  >;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
};

/**
 * Compact status / debuff icons above engaged wildlife (player-attacked, locked, hovered).
 */
export function RenderingWorldPlazaWildlifeStatusHudOverlays({
  overlays,
  overlaysOutRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaWildlifeStatusHudOverlaysProps): React.JSX.Element {
  const elementByInstanceIdRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const iterationStateRef = useRef(
    creatingWorldPlazaDomOverlayIterationState()
  );
  const lastUpdateTimeMsRef = useRef(0);

  useLayoutEffect(() => {
    if (overlays.length === 0) {
      return;
    }

    let isActive = true;
    const iterationState = iterationStateRef.current;

    const updatingOverlayPositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const liveOverlays = overlaysOutRef.current ?? [];

      iteratingWorldPlazaDomOverlayEntriesWithinBudget({
        entries: liveOverlays,
        state: iterationState,
        timeBudgetMs: DEFINING_WORLD_PLAZA_TEXT_OVERLAY_FRAME_BUDGET_MS,
        visit: (entry) => {
          const element = elementByInstanceIdRef.current.get(entry.instanceId);

          if (!element) {
            return;
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

          applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
            element,
            screenPoint.x,
            screenPoint.y -
              DEFINING_WILDLIFE_STATUS_HUD_LIFT_ABOVE_NAME_TAG_PX *
                cameraWorldZoom
          );
          applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
            element.firstElementChild as HTMLElement | null,
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
        updatingOverlayPositions();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
      iterationState.nextIndex = 0;
      lastUpdateTimeMsRef.current = 0;
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, overlays.length, overlaysOutRef]);

  if (overlays.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {overlays.map((entry) => (
        <div
          key={entry.instanceId}
          ref={(element) => {
            if (element) {
              elementByInstanceIdRef.current.set(entry.instanceId, element);
              return;
            }

            elementByInstanceIdRef.current.delete(entry.instanceId);
          }}
          className={RENDERING_WILDLIFE_STATUS_HUD_WRAPPER_CLASS_NAME}
          style={{
            transform: RENDERING_WILDLIFE_STATUS_HUD_HIDDEN_TRANSFORM,
          }}
        >
          <div
            className={RENDERING_WILDLIFE_STATUS_HUD_SCALE_CLASS_NAME}
            style={RENDERING_WILDLIFE_STATUS_HUD_INITIAL_SCALE_STYLE}
          >
            <div className="flex max-w-[88px] flex-wrap items-center justify-center gap-0.5">
              {entry.icons.map((icon) => (
                <div
                  key={icon.id}
                  title={icon.label}
                  className={`relative flex items-center justify-center rounded-[2px] border p-px shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] ${icon.borderClassName}`}
                >
                  <Icon
                    icon={icon.icon}
                    className="shrink-0 text-white"
                    style={{
                      width: DEFINING_WILDLIFE_STATUS_HUD_ICON_SIZE_PX,
                      height: DEFINING_WILDLIFE_STATUS_HUD_ICON_SIZE_PX,
                    }}
                  />
                  {icon.numericLabel ? (
                    <span className="absolute -bottom-1 -right-1 rounded bg-black/85 px-0.5 text-[8px] leading-none text-white">
                      {icon.numericLabel}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
