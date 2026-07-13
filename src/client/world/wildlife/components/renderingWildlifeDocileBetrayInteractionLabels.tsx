'use client';

/**
 * Outlined Pet the Cat / Pet the Dog / Petting.... label above a selected companion.
 *
 * @module components/world/wildlife/components/renderingWildlifeDocileBetrayInteractionLabels
 */

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { ManagingWildlifeDocileAttackConfirmPending } from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  resolvingWildlifeDocilePetIdleLabel,
  resolvingWildlifeDocilePettingLabel,
} from '@/components/world/wildlife/domains/resolvingWildlifeDocilePetLabel';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import { resolvingWorldPlazaWildlifeNameTagScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeNameTagScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWildlifeDocileBetrayInteractionLabelsProps = {
  readonly pending: ManagingWildlifeDocileAttackConfirmPending | null;
  readonly wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onBetray: (
    pending: ManagingWildlifeDocileAttackConfirmPending
  ) => void;
};

/**
 * Chop-style outlined Pet label anchored above the selected companion animal.
 */
export function RenderingWildlifeDocileBetrayInteractionLabels({
  pending,
  wildlifeStoreRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onBetray,
}: RenderingWildlifeDocileBetrayInteractionLabelsProps): React.JSX.Element {
  const labelElementRef = useRef<HTMLDivElement | null>(null);
  const rowElementRef = useRef<HTMLDivElement | null>(null);
  const onBetrayRef = useRef(onBetray);
  const pendingRef = useRef(pending);

  onBetrayRef.current = onBetray;
  pendingRef.current = pending;

  const isPetting =
    timedInteractionProgressSnapshot.isActive &&
    timedInteractionProgressSnapshot.activeTargetKey === pending?.instanceId;
  const label = isPetting
    ? resolvingWildlifeDocilePettingLabel()
    : pending
      ? resolvingWildlifeDocilePetIdleLabel(pending.petKind)
      : resolvingWildlifeDocilePettingLabel();

  useLayoutEffect(() => {
    if (!pending) {
      return;
    }

    let isActive = true;

    const updatingLabel = (): void => {
      if (!isActive) {
        return;
      }

      const currentPending = pendingRef.current;
      const labelElement = labelElementRef.current;
      const rowElement = rowElementRef.current;
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!currentPending || !labelElement || !cameraOffset) {
        return;
      }

      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        currentPending.instanceId
      );

      if (!instance || instance.isDead) {
        labelElement.style.transform =
          RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_HIDDEN_TRANSFORM;
        return;
      }

      const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);
      const sizeScale = species
        ? resolvingWildlifeInstanceSizeScale(species, instance)
        : 1;
      const frameHeightPx = species
        ? resolvingWildlifeSpeciesSpritePresentation(species).frameHeightPx
        : undefined;
      const screenPoint = resolvingWorldPlazaWildlifeNameTagScreenPoint({
        gridPoint: instance.position,
        sizeScale,
        cameraOffset,
        cameraWorldZoom,
        ...(frameHeightPx !== undefined ? { frameHeightPx } : {}),
      });

      labelElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          screenPoint.x,
          screenPoint.y
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        rowElement,
        cameraWorldZoom
      );
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingLabel();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    pending?.instanceId,
    wildlifeStoreRef,
  ]);

  if (!pending) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      <div
        ref={labelElementRef}
        className={RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_WRAPPER_CLASS_NAME}
        style={{
          transform: RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_HIDDEN_TRANSFORM,
        }}
      >
        <RenderingWorldPlazaTimedInteractionLabelRow
          label={label}
          targetKey={pending.instanceId}
          progressSnapshot={timedInteractionProgressSnapshot}
          progressRatioRef={timedInteractionProgressRatioRef}
          rowRef={rowElementRef}
          onActivate={() => {
            const currentPending = pendingRef.current;

            if (!currentPending || isPetting) {
              return;
            }

            onBetrayRef.current(currentPending);
          }}
        />
      </div>
    </div>
  );
}
