'use client';

/**
 * Outlined Pet / Name? / care actions above a companion (campfire-style stack).
 *
 * Named Familiar+ pets: name opens the panel. After 5s near or 5s name hover/tap,
 * Pet, Feed, and yellow command labels appear under the name.
 *
 * @module components/world/wildlife/components/renderingWildlifeDocileBetrayInteractionLabels
 */

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_COMPANION_INTERACTION_LABEL_BUTTON_CLASS_NAME,
} from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
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
import {
  DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTIONS_REVEAL_MS,
  LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED,
  LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET,
  STYLING_WILDLIFE_PET_COMPANION_CARE_ACTION_STACK_CLASS_NAME,
  STYLING_WILDLIFE_PET_COMPANION_COMMAND_LABEL_BUTTON_CLASS_NAME,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetCompanionCareActionConstants';
import { DEFINING_WILDLIFE_PET_MODAL_COMMAND_OPTIONS } from '@/components/world/wildlife/pets/domains/definingWildlifePetModalConstants';
import type { DefiningWildlifePetCommandId } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { resolvingWildlifePetIdleInteractionLabel } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetIdleInteractionLabel';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

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
};

function formattingWildlifeDocileBetrayLiveLabelSnapshotKey(
  snapshot: RenderingWildlifeDocileBetrayLiveLabelSnapshot
): string {
  return `${snapshot.label}\0${snapshot.isCompanionNameAction ? '1' : '0'}\0${snapshot.hasPermanentName ? '1' : '0'}\0${snapshot.loyalty}\0${snapshot.activeCommand ?? ''}`;
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
      loyalty: 0,
      activeCommand: null,
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

  // Familiar+: overhead is Name? / pet name (+ delayed care stack when named).
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
    };
  }

  if (isPetting) {
    return {
      label: resolvingWildlifeDocilePettingLabel(),
      isCompanionNameAction: false,
      hasPermanentName: false,
      loyalty,
      activeCommand,
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
    };
  }

  return {
    label: resolvingWildlifeDocilePetIdleLabel(pending.petKind),
    isCompanionNameAction: false,
    hasPermanentName: false,
    loyalty,
    activeCommand,
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
    });
  const [areCareActionsRevealed, setAreCareActionsRevealed] = useState(false);
  const nameHoverRevealTimeoutRef = useRef<number | null>(null);

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
    setAreCareActionsRevealed(false);

    if (nameHoverRevealTimeoutRef.current !== null) {
      window.clearTimeout(nameHoverRevealTimeoutRef.current);
      nameHoverRevealTimeoutRef.current = null;
    }

    if (!pending) {
      return;
    }

    const nearRevealTimeoutId = window.setTimeout(() => {
      setAreCareActionsRevealed(true);
    }, DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTIONS_REVEAL_MS);

    return () => {
      window.clearTimeout(nearRevealTimeoutId);

      if (nameHoverRevealTimeoutRef.current !== null) {
        window.clearTimeout(nameHoverRevealTimeoutRef.current);
        nameHoverRevealTimeoutRef.current = null;
      }
    };
  }, [pending?.instanceId]);

  const startingNameHoverReveal = (): void => {
    if (areCareActionsRevealed || nameHoverRevealTimeoutRef.current !== null) {
      return;
    }

    nameHoverRevealTimeoutRef.current = window.setTimeout(() => {
      nameHoverRevealTimeoutRef.current = null;
      setAreCareActionsRevealed(true);
    }, DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTIONS_REVEAL_MS);
  };

  const cancellingNameHoverReveal = (): void => {
    if (nameHoverRevealTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(nameHoverRevealTimeoutRef.current);
    nameHoverRevealTimeoutRef.current = null;
  };

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

  const availableCommandOptions =
    liveLabelSnapshot.hasPermanentName && areCareActionsRevealed
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

  const showNamedCareStack =
    liveLabelSnapshot.hasPermanentName && areCareActionsRevealed;

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
            className={STYLING_WILDLIFE_PET_COMPANION_CARE_ACTION_STACK_CLASS_NAME}
          >
            <button
              type="button"
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
              className={
                DEFINING_WORLD_PLAZA_COMPANION_INTERACTION_LABEL_BUTTON_CLASS_NAME
              }
              onPointerEnter={startingNameHoverReveal}
              onPointerLeave={cancellingNameHoverReveal}
              onPointerDown={startingNameHoverReveal}
              onPointerUp={cancellingNameHoverReveal}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                activatingLegacyOrNameAction();
              }}
            >
              {liveLabelSnapshot.label}
            </button>

            {showNamedCareStack ? (
              <>
                <RenderingWorldPlazaTimedInteractionLabelRow
                  label={
                    isPetting
                      ? resolvingWildlifeDocilePettingLabel()
                      : LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET
                  }
                  targetKey={pending.instanceId}
                  progressSnapshot={timedInteractionProgressSnapshot}
                  progressRatioRef={timedInteractionProgressRatioRef}
                  onActivate={() => {
                    const currentPending = pendingRef.current;

                    if (!currentPending || isPetting) {
                      return;
                    }

                    onBetrayRef.current(currentPending);
                  }}
                />
                <button
                  type="button"
                  {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                  className={
                    DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME
                  }
                  disabled={!canFeedPet}
                  style={canFeedPet ? undefined : { opacity: 0.45 }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!canFeedPet) {
                      return;
                    }

                    onFeedPetRef.current(pending.instanceId);
                  }}
                >
                  {LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED}
                </button>
                {availableCommandOptions.map((option) => {
                  const isActive =
                    liveLabelSnapshot.activeCommand === option.commandId;

                  return (
                    <button
                      key={option.commandId}
                      type="button"
                      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                      className={
                        STYLING_WILDLIFE_PET_COMPANION_COMMAND_LABEL_BUTTON_CLASS_NAME
                      }
                      style={isActive ? { opacity: 1 } : { opacity: 0.82 }}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onSetPetCommandRef.current(
                          pending.instanceId,
                          option.commandId
                        );
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </>
            ) : null}
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
