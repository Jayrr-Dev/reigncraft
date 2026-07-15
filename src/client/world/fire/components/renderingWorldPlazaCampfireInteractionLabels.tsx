'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME,
} from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import { formattingWorldPlazaCampfireCookProgressTargetKey } from '@/components/world/fire/domains/formattingWorldPlazaCampfireCookProgressTargetKey';
import type {
  DefiningWorldPlazaCampfireInteractionAction,
  ListingWorldPlazaCampfireBlocksInInteractionRangeEntry,
} from '@/components/world/fire/domains/listingWorldPlazaCampfireBlocksInInteractionRange';
import { listingWorldPlazaCampfireBlocksInInteractionRange } from '@/components/world/fire/domains/listingWorldPlazaCampfireBlocksInInteractionRange';
import { resolvingWorldPlazaCampfireInteractionLabelScreenPoint } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireInteractionLabelScreenPoint';
import type { UsingWorldPlazaCampfireCookProgressSnapshot } from '@/components/world/fire/hooks/usingWorldPlazaCampfireCookProgress';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { LABELING_WORLD_PLAZA_TEA_BREWING_BREW } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey } from '@/components/world/tea-brewing/domains/formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey';
import { useLayoutEffect, useRef, useState } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

const RENDERING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaCampfireInteractionLabelsProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly fireCells: readonly WorldFireDevvitCell[];
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly inventorySlotsRef: React.RefObject<
    readonly { itemTypeId: string; quantity: number }[]
  >;
  readonly cookProgressSnapshot: UsingWorldPlazaCampfireCookProgressSnapshot;
  readonly cookProgressRatioRef: React.RefObject<number>;
  readonly teaBrewProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly teaBrewProgressRatioRef: React.RefObject<number>;
  readonly hasBrewableTeaPot: boolean;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onCampfireAction: (
    block: DefiningWorldBuildingPlacedBlock,
    action: DefiningWorldPlazaCampfireInteractionAction
  ) => void;
};

function formattingWorldPlazaCampfireInteractionLabelTileKey(
  entry: ListingWorldPlazaCampfireBlocksInInteractionRangeEntry
): string {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(entry.block);

  return `${entry.block.tilePosition.tileX}:${entry.block.tilePosition.tileY}:${worldLayer}`;
}

function resolvingWorldPlazaCampfireInteractionLabelText(
  action: Exclude<
    DefiningWorldPlazaCampfireInteractionAction,
    'cook' | 'brew-tea'
  >
): string {
  return action === 'add-wood' ? 'Add Wood' : 'Light';
}

function formattingCampfireActionsKey(
  actions: readonly DefiningWorldPlazaCampfireInteractionAction[]
): string {
  return actions.join(',');
}

/**
 * Outlined campfire actions with a timed cook progress ring on Cook.
 */
export function RenderingWorldPlazaCampfireInteractionLabels({
  placedBlocks,
  fireCells,
  selectedInteractableBlockKeysRef,
  inventorySlotsRef,
  cookProgressSnapshot,
  cookProgressRatioRef,
  teaBrewProgressSnapshot,
  teaBrewProgressRatioRef,
  hasBrewableTeaPot,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onCampfireAction,
}: RenderingWorldPlazaCampfireInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedCampfires, setSelectedCampfires] = useState<
    readonly ListingWorldPlazaCampfireBlocksInInteractionRangeEntry[]
  >([]);
  const selectedCampfiresRef = useRef(selectedCampfires);

  const placedBlocksRef = useRef(placedBlocks);
  const fireCellsRef = useRef(fireCells);
  const onCampfireActionRef = useRef(onCampfireAction);
  const hasBrewableTeaPotRef = useRef(hasBrewableTeaPot);

  selectedCampfiresRef.current = selectedCampfires;
  placedBlocksRef.current = placedBlocks;
  fireCellsRef.current = fireCells;
  onCampfireActionRef.current = onCampfireAction;
  hasBrewableTeaPotRef.current = hasBrewableTeaPot;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedCampfiresRef.current.length > 0) {
          selectedCampfiresRef.current = [];
          setSelectedCampfires([]);
        }
        return;
      }

      const nextSelectedCampfires =
        listingWorldPlazaCampfireBlocksInInteractionRange(
          placedBlocksRef.current,
          fireCellsRef.current,
          selectedInteractableBlockKeysRef.current,
          inventorySlotsRef.current ?? [],
          hasBrewableTeaPotRef.current
        );

      const currentEntries = selectedCampfiresRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedCampfires.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedCampfires[index];

          return (
            nextEntry !== undefined &&
            entry.block.blockId === nextEntry.block.blockId &&
            formattingCampfireActionsKey(entry.actions) ===
              formattingCampfireActionsKey(nextEntry.actions)
          );
        });

      if (didSelectionChange) {
        selectedCampfiresRef.current = nextSelectedCampfires;
        setSelectedCampfires(nextSelectedCampfires);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedCampfires) {
        const tileKey =
          formattingWorldPlazaCampfireInteractionLabelTileKey(entry);
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaCampfireInteractionLabelScreenPoint(
            entry.block,
            cameraOffset,
            cameraWorldZoom
          );

        applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
          labelElement,
          screenPoint.x,
          screenPoint.y
        );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          rowElement ?? labelElement,
          cameraWorldZoom
        );
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingLabels();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    fireCells,
    hasBrewableTeaPot,
    inventorySlotsRef,
    placedBlocks,
    selectedInteractableBlockKeysRef,
  ]);

  if (selectedCampfires.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedCampfires.map((entry) => {
        const tileKey =
          formattingWorldPlazaCampfireInteractionLabelTileKey(entry);
        const cookTargetKey = formattingWorldPlazaCampfireCookProgressTargetKey(
          entry.block
        );
        const teaBrewTargetKey =
          formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey(entry.block);

        return (
          <div
            key={tileKey}
            ref={(element) => {
              if (element) {
                labelElementByTileKeyRef.current.set(tileKey, element);
                return;
              }

              labelElementByTileKeyRef.current.delete(tileKey);
            }}
            className={
              RENDERING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <div
              ref={(element) => {
                if (element) {
                  rowElementByTileKeyRef.current.set(tileKey, element);
                  return;
                }

                rowElementByTileKeyRef.current.delete(tileKey);
              }}
              className={
                DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME
              }
            >
              {entry.actions.map((action) => {
                if (action === 'cook') {
                  return (
                    <RenderingWorldPlazaTimedInteractionLabelRow
                      key={`${tileKey}:cook`}
                      label="Cook"
                      targetKey={cookTargetKey}
                      progressSnapshot={cookProgressSnapshot}
                      progressRatioRef={cookProgressRatioRef}
                      onboardingAnchorId="cook-interaction"
                      onActivate={() => {
                        onCampfireActionRef.current(entry.block, 'cook');
                      }}
                    />
                  );
                }

                if (action === 'brew-tea') {
                  return (
                    <RenderingWorldPlazaTimedInteractionLabelRow
                      key={`${tileKey}:brew-tea`}
                      label={LABELING_WORLD_PLAZA_TEA_BREWING_BREW}
                      targetKey={teaBrewTargetKey}
                      progressSnapshot={teaBrewProgressSnapshot}
                      progressRatioRef={teaBrewProgressRatioRef}
                      onActivate={() => {
                        onCampfireActionRef.current(entry.block, 'brew-tea');
                      }}
                    />
                  );
                }

                const actionKey = `${tileKey}:${action}`;

                return (
                  <button
                    key={actionKey}
                    type="button"
                    {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                    className={
                      DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onCampfireActionRef.current(entry.block, action);
                    }}
                  >
                    {resolvingWorldPlazaCampfireInteractionLabelText(action)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
