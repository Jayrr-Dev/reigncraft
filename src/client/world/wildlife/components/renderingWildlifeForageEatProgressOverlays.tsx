'use client';

/**
 * Chop-style meat progress ring above wildlife heads while forageEat is active.
 *
 * @module components/world/wildlife/components/renderingWildlifeForageEatProgressOverlays
 */

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaTimedInteractionProgressRing } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionProgressRing';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { DEFINING_WILDLIFE_FORAGE_EAT_PROGRESS_OVERLAY_ICON } from '@/components/world/wildlife/domains/definingWildlifeForageEatProgressOverlayConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { listingWildlifeForageEatProgressOverlays } from '@/components/world/wildlife/domains/listingWildlifeForageEatProgressOverlays';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import { resolvingWorldPlazaWildlifeNameTagScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeNameTagScreenPoint';
import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

const RENDERING_WILDLIFE_FORAGE_EAT_PROGRESS_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WILDLIFE_FORAGE_EAT_PROGRESS_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WILDLIFE_FORAGE_EAT_PROGRESS_SCALE_CLASS_NAME =
  'origin-bottom' as const;

export type RenderingWildlifeForageEatProgressOverlaysProps = {
  readonly wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  readonly cameraOffsetRef: RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: RefObject<number>;
};

type RenderingWildlifeForageEatProgressMountEntry = {
  readonly instanceId: string;
};

function buildingWildlifeForageEatProgressSnapshot(
  instanceId: string
): DefiningWorldPlazaTimedInteractionProgressSnapshot {
  return {
    isActive: true,
    isCancelling: false,
    progressRatio: 0,
    milestonePulse: null,
    pulseGeneration: 0,
    activeTargetKey: instanceId,
    activeProgressIcon: DEFINING_WILDLIFE_FORAGE_EAT_PROGRESS_OVERLAY_ICON,
  };
}

/**
 * Meat icon inside a depleting bite-cooldown ring, anchored above eating animals.
 */
export function RenderingWildlifeForageEatProgressOverlays({
  wildlifeStoreRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWildlifeForageEatProgressOverlaysProps): React.JSX.Element {
  const wrapperElementByInstanceIdRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const scaleElementByInstanceIdRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const progressRatioByInstanceIdRef = useRef<Map<string, { current: number }>>(
    new Map()
  );
  const [mountedOverlays, setMountedOverlays] = useState<
    readonly RenderingWildlifeForageEatProgressMountEntry[]
  >([]);

  useLayoutEffect(() => {
    let isActive = true;

    const updatingOverlays = (): void => {
      if (!isActive) {
        return;
      }

      // Wildlife sim stamps lastAttackAtMs with wall clock (Date.now()).
      const nowMs = Date.now();
      const overlays = listingWildlifeForageEatProgressOverlays(
        wildlifeStoreRef.current,
        nowMs
      );
      const nextInstanceIds = overlays.map((entry) => entry.instanceId);

      setMountedOverlays((current) => {
        if (
          current.length === nextInstanceIds.length &&
          current.every(
            (entry, index) => entry.instanceId === nextInstanceIds[index]
          )
        ) {
          return current;
        }

        return nextInstanceIds.map((instanceId) => ({ instanceId }));
      });

      const activeInstanceIds = new Set(nextInstanceIds);

      for (const instanceId of [
        ...progressRatioByInstanceIdRef.current.keys(),
      ]) {
        if (!activeInstanceIds.has(instanceId)) {
          progressRatioByInstanceIdRef.current.delete(instanceId);
        }
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const overlay of overlays) {
        let progressRatioRef =
          progressRatioByInstanceIdRef.current.get(overlay.instanceId);

        if (!progressRatioRef) {
          progressRatioRef = { current: overlay.progressRatio };
          progressRatioByInstanceIdRef.current.set(
            overlay.instanceId,
            progressRatioRef
          );
        } else {
          progressRatioRef.current = overlay.progressRatio;
        }

        const wrapperElement = wrapperElementByInstanceIdRef.current.get(
          overlay.instanceId
        );
        const scaleElement = scaleElementByInstanceIdRef.current.get(
          overlay.instanceId
        );

        if (!wrapperElement) {
          continue;
        }

        const instance = overlay.instance;
        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);
        const sizeScale = species
          ? resolvingWildlifeInstanceSizeScale(species, instance)
          : 1;
        const frameHeightPx = species
          ? resolvingWildlifeSpeciesSpritePresentation(species).frameHeightPx
          : undefined;
        const jumpArcOffsetPx =
          instance.aiState.jumpState && species
            ? computingWildlifeJumpArcLiftPx(
                species.jump.jumpArcPeakPx,
                instance.aiState.jumpState.progress
              )
            : 0;
        const screenPoint = resolvingWorldPlazaWildlifeNameTagScreenPoint({
          gridPoint: instance.position,
          sizeScale,
          cameraOffset,
          cameraWorldZoom,
          jumpArcOffsetPx,
          ...(frameHeightPx !== undefined ? { frameHeightPx } : {}),
        });

        wrapperElement.style.transform =
          computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
            screenPoint.x,
            screenPoint.y
          );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          scaleElement,
          cameraWorldZoom
        );
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingOverlays();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, wildlifeStoreRef]);

  if (mountedOverlays.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {mountedOverlays.map((entry) => {
        let progressRatioRef = progressRatioByInstanceIdRef.current.get(
          entry.instanceId
        );

        if (!progressRatioRef) {
          progressRatioRef = { current: 0 };
          progressRatioByInstanceIdRef.current.set(
            entry.instanceId,
            progressRatioRef
          );
        }

        return (
          <div
            key={entry.instanceId}
            ref={(element) => {
              if (element) {
                wrapperElementByInstanceIdRef.current.set(
                  entry.instanceId,
                  element
                );
                return;
              }

              wrapperElementByInstanceIdRef.current.delete(entry.instanceId);
            }}
            className={RENDERING_WILDLIFE_FORAGE_EAT_PROGRESS_WRAPPER_CLASS_NAME}
            style={{
              transform: RENDERING_WILDLIFE_FORAGE_EAT_PROGRESS_HIDDEN_TRANSFORM,
            }}
          >
            <div
              ref={(element) => {
                if (element) {
                  scaleElementByInstanceIdRef.current.set(
                    entry.instanceId,
                    element
                  );
                  return;
                }

                scaleElementByInstanceIdRef.current.delete(entry.instanceId);
              }}
              className={RENDERING_WILDLIFE_FORAGE_EAT_PROGRESS_SCALE_CLASS_NAME}
            >
              <RenderingWorldPlazaTimedInteractionProgressRing
                snapshot={buildingWildlifeForageEatProgressSnapshot(
                  entry.instanceId
                )}
                progressRatioRef={progressRatioRef}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
