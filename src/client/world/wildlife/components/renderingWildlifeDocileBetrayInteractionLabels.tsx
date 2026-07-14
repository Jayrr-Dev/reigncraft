'use client';

/**
 * Outlined Pet the Cat / Pet the Dog / Name? / Petting.... label above a companion.
 *
 * @module components/world/wildlife/components/renderingWildlifeDocileBetrayInteractionLabels
 */

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { DEFINING_WORLD_PLAZA_COMPANION_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { DEFINING_WILDLIFE_DOCILE_PET_LABEL_OFFSET_ABOVE_NAME_TAG_PX } from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
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
import { resolvingWildlifePetIdleInteractionLabel } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetIdleInteractionLabel';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';

const RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

/** Poll so Familiar unlock / rename flips the overhead label without a remount. */
const RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_REFRESH_MS = 250;

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
  /** Familiar+ unnamed: open the one-shot Name? dialog. */
  readonly onNamePet: (instanceId: string) => void;
  /** Named companion: open the companion panel. */
  readonly onOpenPetModal: (instanceId: string) => void;
};

type RenderingWildlifeDocileBetrayLiveLabelSnapshot = {
  readonly label: string;
  /** Name? / named pet chrome (green hover). */
  readonly isCompanionNameAction: boolean;
  /** Named pet already has a permanent name (opens panel). */
  readonly hasPermanentName: boolean;
};

function formattingWildlifeDocileBetrayLiveLabelSnapshotKey(
  snapshot: RenderingWildlifeDocileBetrayLiveLabelSnapshot
): string {
  return `${snapshot.label}\0${snapshot.isCompanionNameAction ? '1' : '0'}\0${snapshot.hasPermanentName ? '1' : '0'}`;
}

function readingWildlifeDocileBetrayLiveLabelSnapshot(
  pending: ManagingWildlifeDocileAttackConfirmPending | null,
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>,
  isPetting: boolean
): RenderingWildlifeDocileBetrayLiveLabelSnapshot {
  if (!pending) {
    return {
      label: resolvingWildlifeDocilePettingLabel(),
      isCompanionNameAction: false,
      hasPermanentName: false,
    };
  }

  const pendingInstance = gettingWildlifeInstance(
    wildlifeStoreRef.current,
    pending.instanceId
  );
  const loyalty = pendingInstance?.petBond?.loyalty ?? 0;
  const hasPermanentName = Boolean(pendingInstance?.customDisplayName?.trim());
  const isNamable =
    loyalty > 0 && checkingWildlifePetHasCapability(loyalty, 'namable');

  // Familiar+: overhead is Name? / pet name only. Never show Pet or Petting.
  if (isNamable) {
    return {
      label: resolvingWildlifePetIdleInteractionLabel({
        speciesId: pendingInstance?.speciesId ?? pending.speciesId,
        loyalty,
        displayName: pendingInstance?.customDisplayName ?? null,
      }),
      isCompanionNameAction: true,
      hasPermanentName,
    };
  }

  if (isPetting) {
    return {
      label: resolvingWildlifeDocilePettingLabel(),
      isCompanionNameAction: false,
      hasPermanentName: false,
    };
  }

  if (pendingInstance?.petBond) {
    return {
      label: resolvingWildlifePetIdleInteractionLabel({
        speciesId: pendingInstance.speciesId,
        loyalty,
        displayName: pendingInstance.customDisplayName ?? null,
      }),
      isCompanionNameAction: false,
      hasPermanentName: false,
    };
  }

  return {
    label: resolvingWildlifeDocilePetIdleLabel(pending.petKind),
    isCompanionNameAction: false,
    hasPermanentName: false,
  };
}

/**
 * Chop-style outlined Pet / Name? label anchored above the selected companion.
 */
export function RenderingWildlifeDocileBetrayInteractionLabels({
  pending,
  wildlifeStoreRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onBetray,
  onNamePet,
  onOpenPetModal,
}: RenderingWildlifeDocileBetrayInteractionLabelsProps): React.JSX.Element {
  const labelElementRef = useRef<HTMLDivElement | null>(null);
  const rowElementRef = useRef<HTMLDivElement | null>(null);
  const onBetrayRef = useRef(onBetray);
  const onNamePetRef = useRef(onNamePet);
  const onOpenPetModalRef = useRef(onOpenPetModal);
  const pendingRef = useRef(pending);
  const liveLabelCacheRef =
    useRef<RenderingWildlifeDocileBetrayLiveLabelSnapshot>({
      label: resolvingWildlifeDocilePettingLabel(),
      isCompanionNameAction: false,
      hasPermanentName: false,
    });

  onBetrayRef.current = onBetray;
  onNamePetRef.current = onNamePet;
  onOpenPetModalRef.current = onOpenPetModal;
  pendingRef.current = pending;

  const isPetting =
    timedInteractionProgressSnapshot.isActive &&
    timedInteractionProgressSnapshot.activeTargetKey === pending?.instanceId;

  const liveLabelSnapshotKey = useSyncExternalStore(
    (onStoreChange) => {
      if (!pending) {
        return () => undefined;
      }

      const intervalId = window.setInterval(
        onStoreChange,
        RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_REFRESH_MS
      );

      return () => {
        window.clearInterval(intervalId);
      };
    },
    () => {
      const nextSnapshot = readingWildlifeDocileBetrayLiveLabelSnapshot(
        pending,
        wildlifeStoreRef,
        isPetting
      );
      const nextKey =
        formattingWildlifeDocileBetrayLiveLabelSnapshotKey(nextSnapshot);
      const cachedKey = formattingWildlifeDocileBetrayLiveLabelSnapshotKey(
        liveLabelCacheRef.current
      );

      if (nextKey !== cachedKey) {
        liveLabelCacheRef.current = nextSnapshot;
      }

      return formattingWildlifeDocileBetrayLiveLabelSnapshotKey(
        liveLabelCacheRef.current
      );
    },
    () =>
      formattingWildlifeDocileBetrayLiveLabelSnapshotKey(
        liveLabelCacheRef.current
      )
  );

  const liveLabelSnapshot = liveLabelCacheRef.current;
  void liveLabelSnapshotKey;

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
      const nameTagScreenPoint = resolvingWorldPlazaWildlifeNameTagScreenPoint({
        gridPoint: instance.position,
        sizeScale,
        cameraOffset,
        cameraWorldZoom,
        ...(frameHeightPx !== undefined ? { frameHeightPx } : {}),
      });
      // Named Familiar+ label sits on the name-tag slot (name tag hidden while selected).
      const labelLiftPx = liveLabelCacheRef.current.hasPermanentName
        ? 0
        : DEFINING_WILDLIFE_DOCILE_PET_LABEL_OFFSET_ABOVE_NAME_TAG_PX;
      const screenPoint = {
        x: nameTagScreenPoint.x,
        y: nameTagScreenPoint.y - labelLiftPx * cameraWorldZoom,
      };

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
          label={liveLabelSnapshot.label}
          targetKey={pending.instanceId}
          progressSnapshot={timedInteractionProgressSnapshot}
          progressRatioRef={timedInteractionProgressRatioRef}
          rowRef={rowElementRef}
          buttonClassName={
            liveLabelSnapshot.isCompanionNameAction
              ? DEFINING_WORLD_PLAZA_COMPANION_INTERACTION_LABEL_BUTTON_CLASS_NAME
              : undefined
          }
          onActivate={() => {
            const currentPending = pendingRef.current;

            if (!currentPending || isPetting) {
              return;
            }

            const liveInstance = gettingWildlifeInstance(
              wildlifeStoreRef.current,
              currentPending.instanceId
            );
            const liveLoyalty = liveInstance?.petBond?.loyalty ?? 0;
            const isNamable =
              liveLoyalty > 0 &&
              checkingWildlifePetHasCapability(liveLoyalty, 'namable');

            if (!isNamable) {
              onBetrayRef.current(currentPending);
              return;
            }

            const hasPermanentName = Boolean(
              liveInstance?.customDisplayName?.trim()
            );

            if (!hasPermanentName) {
              onNamePetRef.current(currentPending.instanceId);
              return;
            }

            onOpenPetModalRef.current(currentPending.instanceId);
          }}
        />
      </div>
    </div>
  );
}
