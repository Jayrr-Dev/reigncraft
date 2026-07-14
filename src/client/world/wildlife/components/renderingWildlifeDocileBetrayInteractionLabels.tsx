'use client';

/**
 * Outlined Name? / companion name with care + command badges above.
 *
 * Named Familiar+ pets: name opens the panel. When near, Pet and Feed circle
 * icons appear immediately when those actions are triggerable. Command badges
 * stay in the same strip when unlocked.
 *
 * @module components/world/wildlife/components/renderingWildlifeDocileBetrayInteractionLabels
 */

import { Icon } from '@/components/ui/icon';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { DEFINING_WORLD_PLAZA_COMPANION_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import { RenderingWorldPlazaTimedInteractionProgressRing } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionProgressRing';
import { checkingWorldPlazaTimedInteractionProgressRingVisible } from '@/components/world/interaction/domains/checkingWorldPlazaTimedInteractionProgressMatchesTarget';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_RING_SLOT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_ROW_CLASS_NAME,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionLabelUiConstants';
import { DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_LABEL_GAP_PX } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { checkingWildlifeDocilePetIsReady } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
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
import { checkingWildlifePetNeedsOwnerFeed } from '@/components/world/wildlife/pets/domains/checkingWildlifePetNeedsOwnerFeed';
import {
  DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED_ICON_ID,
  DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET_ICON_ID,
  DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX,
  DEFINING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ICON_SIZE_PX,
  LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED,
  LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET,
  LABELING_WILDLIFE_PET_COMPANION_CARE_BADGE_TOOLBAR,
  STYLING_WILDLIFE_PET_COMPANION_CARE_ACTION_STACK_CLASS_NAME,
  STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_CLASS_NAME,
  STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_CLASS_NAME,
  STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ROW_CLASS_NAME,
  STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ACTIVE_CLASS_NAME,
  STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetCompanionCareActionConstants';
import { DEFINING_WILDLIFE_PET_MODAL_COMMAND_OPTIONS } from '@/components/world/wildlife/pets/domains/definingWildlifePetModalConstants';
import type { DefiningWildlifePetCommandId } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { resolvingWildlifePetIdleInteractionLabel } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetIdleInteractionLabel';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

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
  readonly canFeedPet: boolean;
  readonly onBetray: (
    pending: ManagingWildlifeDocileAttackConfirmPending
  ) => void;
  /** Familiar+ unnamed: open the one-shot Name? dialog. */
  readonly onNamePet: (instanceId: string) => void;
  /** Named companion: open the companion panel. */
  readonly onOpenPetModal: (instanceId: string) => void;
  /** Named companion care: feed from the first bag food slot. */
  readonly onFeedPet: (instanceId: string) => void;
  /** Named companion care: set Follow / Stay / Attack / Defend. */
  readonly onSetPetCommand: (
    instanceId: string,
    command: DefiningWildlifePetCommandId
  ) => void;
};

type RenderingWildlifeDocileBetrayLiveLabelSnapshot = {
  readonly label: string;
  /** Name? / named pet chrome (green hover). */
  readonly isCompanionNameAction: boolean;
  /** Named pet already has a permanent name (opens panel + care stack). */
  readonly hasPermanentName: boolean;
  readonly loyalty: number;
  readonly activeCommand: DefiningWildlifePetCommandId | null;
  /** True when hunger is below the owner-feed threshold. */
  readonly needsOwnerFeed: boolean;
  /** True when Pet cooldown has elapsed. */
  readonly isPetReady: boolean;
};

function formattingWildlifeDocileBetrayLiveLabelSnapshotKey(
  snapshot: RenderingWildlifeDocileBetrayLiveLabelSnapshot
): string {
  return `${snapshot.label}\0${snapshot.isCompanionNameAction ? '1' : '0'}\0${snapshot.hasPermanentName ? '1' : '0'}\0${Math.round(snapshot.loyalty)}\0${snapshot.activeCommand ?? ''}\0${snapshot.needsOwnerFeed ? '1' : '0'}\0${snapshot.isPetReady ? '1' : '0'}`;
}

function readingWildlifeDocileBetrayLiveLabelSnapshot(
  pending: ManagingWildlifeDocileAttackConfirmPending | null,
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>,
  isPetting: boolean,
  nowMs: number
): RenderingWildlifeDocileBetrayLiveLabelSnapshot {
  if (!pending) {
    return {
      label: resolvingWildlifeDocilePettingLabel(),
      isCompanionNameAction: false,
      hasPermanentName: false,
      loyalty: 0,
      activeCommand: null,
      needsOwnerFeed: false,
      isPetReady: false,
    };
  }

  const pendingInstance = gettingWildlifeInstance(
    wildlifeStoreRef.current,
    pending.instanceId
  );
  const loyalty = pendingInstance?.petBond?.loyalty ?? 0;
  const activeCommand = pendingInstance?.petBond?.command ?? null;
  const hasPermanentName = Boolean(pendingInstance?.customDisplayName?.trim());
  const isNamable =
    loyalty > 0 && checkingWildlifePetHasCapability(loyalty, 'namable');
  const needsOwnerFeed = checkingWildlifePetNeedsOwnerFeed(
    pendingInstance?.hungerState.hungerRatio ?? 1
  );
  const isPetReady = checkingWildlifeDocilePetIsReady(pendingInstance, nowMs);

  // Familiar+: overhead is Name? / pet name (+ care stack when named).
  if (isNamable) {
    return {
      label: resolvingWildlifePetIdleInteractionLabel({
        speciesId: pendingInstance?.speciesId ?? pending.speciesId,
        loyalty,
        displayName: pendingInstance?.customDisplayName ?? null,
      }),
      isCompanionNameAction: true,
      hasPermanentName,
      loyalty,
      activeCommand,
      needsOwnerFeed,
      isPetReady,
    };
  }

  if (isPetting) {
    return {
      label: resolvingWildlifeDocilePettingLabel(),
      isCompanionNameAction: false,
      hasPermanentName: false,
      loyalty,
      activeCommand,
      needsOwnerFeed,
      isPetReady,
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
      loyalty,
      activeCommand,
      needsOwnerFeed,
      isPetReady,
    };
  }

  return {
    label: resolvingWildlifeDocilePetIdleLabel(pending.petKind),
    isCompanionNameAction: false,
    hasPermanentName: false,
    loyalty,
    activeCommand,
    needsOwnerFeed,
    isPetReady,
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
  canFeedPet,
  onBetray,
  onNamePet,
  onOpenPetModal,
  onFeedPet,
  onSetPetCommand,
}: RenderingWildlifeDocileBetrayInteractionLabelsProps): React.JSX.Element {
  const labelElementRef = useRef<HTMLDivElement | null>(null);
  const rowElementRef = useRef<HTMLDivElement | null>(null);
  const onBetrayRef = useRef(onBetray);
  const onNamePetRef = useRef(onNamePet);
  const onOpenPetModalRef = useRef(onOpenPetModal);
  const onFeedPetRef = useRef(onFeedPet);
  const onSetPetCommandRef = useRef(onSetPetCommand);
  const pendingRef = useRef(pending);
  const liveLabelCacheRef =
    useRef<RenderingWildlifeDocileBetrayLiveLabelSnapshot>({
      label: resolvingWildlifeDocilePettingLabel(),
      isCompanionNameAction: false,
      hasPermanentName: false,
      loyalty: 0,
      activeCommand: null,
      needsOwnerFeed: false,
      isPetReady: false,
    });
  const [liveLabelSnapshot, setLiveLabelSnapshot] =
    useState<RenderingWildlifeDocileBetrayLiveLabelSnapshot>(
      liveLabelCacheRef.current
    );

  onBetrayRef.current = onBetray;
  onNamePetRef.current = onNamePet;
  onOpenPetModalRef.current = onOpenPetModal;
  onFeedPetRef.current = onFeedPet;
  onSetPetCommandRef.current = onSetPetCommand;
  pendingRef.current = pending;

  const isPetting =
    timedInteractionProgressSnapshot.isActive &&
    timedInteractionProgressSnapshot.activeTargetKey === pending?.instanceId;

  useEffect(() => {
    const syncingLiveLabelSnapshot = (): void => {
      const nextSnapshot = readingWildlifeDocileBetrayLiveLabelSnapshot(
        pendingRef.current,
        wildlifeStoreRef,
        isPetting,
        Date.now()
      );
      const nextKey =
        formattingWildlifeDocileBetrayLiveLabelSnapshotKey(nextSnapshot);
      const cachedKey = formattingWildlifeDocileBetrayLiveLabelSnapshotKey(
        liveLabelCacheRef.current
      );

      if (nextKey === cachedKey) {
        return;
      }

      liveLabelCacheRef.current = nextSnapshot;
      setLiveLabelSnapshot(nextSnapshot);
    };

    syncingLiveLabelSnapshot();

    if (!pending) {
      return;
    }

    const intervalId = window.setInterval(
      syncingLiveLabelSnapshot,
      RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_REFRESH_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPetting, pending, wildlifeStoreRef]);

  const availableCommandOptions = liveLabelSnapshot.hasPermanentName
    ? DEFINING_WILDLIFE_PET_MODAL_COMMAND_OPTIONS.filter((option) =>
        checkingWildlifePetHasCapability(
          liveLabelSnapshot.loyalty,
          option.requiredCapability
        )
      )
    : [];

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

  const activatingLegacyOrNameAction = (): void => {
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

    const hasPermanentName = Boolean(liveInstance?.customDisplayName?.trim());

    if (!hasPermanentName) {
      onNamePetRef.current(currentPending.instanceId);
      return;
    }

    onOpenPetModalRef.current(currentPending.instanceId);
  };

  const canActivateFeed = canFeedPet && liveLabelSnapshot.needsOwnerFeed;
  const showPetAction = isPetting || liveLabelSnapshot.isPetReady;
  const showFeedAction = canActivateFeed;
  const showNamedCareStack =
    liveLabelSnapshot.hasPermanentName &&
    (showPetAction || showFeedAction || availableCommandOptions.length > 0);
  const isPetProgressRingVisible =
    checkingWorldPlazaTimedInteractionProgressRingVisible(
      timedInteractionProgressSnapshot,
      pending.instanceId
    );
  const petBadgeLabel = isPetting
    ? resolvingWildlifeDocilePettingLabel()
    : LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      <div
        ref={labelElementRef}
        className={RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_WRAPPER_CLASS_NAME}
        style={{
          transform: RENDERING_WILDLIFE_DOCILE_BETRAY_LABEL_HIDDEN_TRANSFORM,
        }}
      >
        {liveLabelSnapshot.hasPermanentName ? (
          <div
            ref={rowElementRef}
            className={
              STYLING_WILDLIFE_PET_COMPANION_CARE_ACTION_STACK_CLASS_NAME
            }
          >
            {showNamedCareStack ? (
              <div
                role="toolbar"
                aria-label={LABELING_WILDLIFE_PET_COMPANION_CARE_BADGE_TOOLBAR}
                className={
                  STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ROW_CLASS_NAME
                }
              >
                {showPetAction ? (
                  <div
                    className={
                      DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_ROW_CLASS_NAME
                    }
                  >
                    <button
                      type="button"
                      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                      className={
                        STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_CLASS_NAME
                      }
                      aria-label={petBadgeLabel}
                      title={petBadgeLabel}
                      disabled={isPetting}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const currentPending = pendingRef.current;

                        if (!currentPending || isPetting) {
                          return;
                        }

                        onBetrayRef.current(currentPending);
                      }}
                    >
                      <Icon
                        icon={
                          DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET_ICON_ID
                        }
                        width={
                          DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX
                        }
                        height={
                          DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX
                        }
                        className={
                          STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_CLASS_NAME
                        }
                        aria-hidden
                      />
                    </button>
                    {isPetProgressRingVisible ? (
                      <div
                        className={
                          DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_RING_SLOT_CLASS_NAME
                        }
                        style={{
                          marginLeft: `${DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_LABEL_GAP_PX}px`,
                        }}
                      >
                        <RenderingWorldPlazaTimedInteractionProgressRing
                          snapshot={timedInteractionProgressSnapshot}
                          progressRatioRef={timedInteractionProgressRatioRef}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {showFeedAction ? (
                  <button
                    type="button"
                    {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                    className={
                      STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_CLASS_NAME
                    }
                    aria-label={LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED}
                    title={LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onFeedPetRef.current(pending.instanceId);
                    }}
                  >
                    <Icon
                      icon={
                        DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED_ICON_ID
                      }
                      width={
                        DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX
                      }
                      height={
                        DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX
                      }
                      className={
                        STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_CLASS_NAME
                      }
                      aria-hidden
                    />
                  </button>
                ) : null}

                {availableCommandOptions.map((option) => {
                  const isActive =
                    liveLabelSnapshot.activeCommand === option.commandId;

                  return (
                    <button
                      key={option.commandId}
                      type="button"
                      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                      className={
                        isActive
                          ? `${STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME} ${STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ACTIVE_CLASS_NAME}`
                          : STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME
                      }
                      aria-label={option.label}
                      aria-pressed={isActive}
                      title={option.label}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onSetPetCommandRef.current(
                          pending.instanceId,
                          option.commandId
                        );
                      }}
                    >
                      <Icon
                        icon={option.iconId}
                        width={
                          DEFINING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ICON_SIZE_PX
                        }
                        height={
                          DEFINING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ICON_SIZE_PX
                        }
                        className={
                          STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_CLASS_NAME
                        }
                        aria-hidden
                      />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            <button
              type="button"
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
              className={
                DEFINING_WORLD_PLAZA_COMPANION_INTERACTION_LABEL_BUTTON_CLASS_NAME
              }
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                activatingLegacyOrNameAction();
              }}
            >
              {liveLabelSnapshot.label}
            </button>
          </div>
        ) : (
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
            onActivate={activatingLegacyOrNameAction}
          />
        )}
      </div>
    </div>
  );
}
