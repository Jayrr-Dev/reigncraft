/**
 * DOM interaction labels for selected world chests (Open / Locked).
 *
 * @module components/world/chest/components/renderingWorldPlazaChestInteractionLabels
 */

'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_DISABLED_BUTTON_CLASS_NAME,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_ACTION,
  LABELING_WORLD_PLAZA_CHEST_OPEN_ACTION,
  LABELING_WORLD_PLAZA_CHEST_UNLOCK_ACTION,
} from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import {
  listingWorldPlazaChestsInInteractionRange,
  type ListingWorldPlazaChestsInInteractionRangeEntry,
} from '@/components/world/chest/domains/listingWorldPlazaChestsInInteractionRange';
import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { resolvingWorldPlazaFlowerInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaFlowerInteractionLabelScreenPoint';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT,
  type DefiningWorldPlazaTimedInteractionProgressSnapshot,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { countingWorldPlazaInventoryItemQuantityByTypeId } from '@/components/world/inventory/domains/countingWorldPlazaInventoryItemQuantityByTypeId';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaChestInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly inventoryStateRef: React.RefObject<DefiningInventoryState | null>;
  readonly onOpenChest: (
    entry: ListingWorldPlazaChestsInInteractionRangeEntry
  ) => void;
  readonly onLockedChestHint: (
    entry: ListingWorldPlazaChestsInInteractionRangeEntry
  ) => void;
};

/**
 * Campfire-style Open / Locked labels above selected chests.
 */
export function RenderingWorldPlazaChestInteractionLabels({
  selectedInteractableBlockKeysRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  inventoryStateRef,
  onOpenChest,
  onLockedChestHint,
}: RenderingWorldPlazaChestInteractionLabelsProps): React.JSX.Element {
  const enabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.CHESTS
  );
  const labelElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedChests, setSelectedChests] = useState<
    readonly ListingWorldPlazaChestsInInteractionRangeEntry[]
  >([]);
  const selectedChestsRef = useRef(selectedChests);
  const onOpenChestRef = useRef(onOpenChest);
  const onLockedChestHintRef = useRef(onLockedChestHint);
  const idleProgressSnapshotRef =
    useRef<DefiningWorldPlazaTimedInteractionProgressSnapshot>(
      DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
    );
  const idleProgressRatioRef = useRef(0);

  selectedChestsRef.current = selectedChests;
  onOpenChestRef.current = onOpenChest;
  onLockedChestHintRef.current = onLockedChestHint;

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedChestsRef.current.length > 0) {
          selectedChestsRef.current = [];
          setSelectedChests([]);
        }
        return;
      }

      const inventoryState = inventoryStateRef.current;

      const playerHasChestKey =
        inventoryState !== null &&
        countingWorldPlazaInventoryItemQuantityByTypeId(
          inventoryState,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY
        ) > 0;

      const nextSelectedChests = listingWorldPlazaChestsInInteractionRange(
        selectedInteractableBlockKeysRef.current,
        playerHasChestKey
      );

      const currentEntries = selectedChestsRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedChests.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedChests[index];

          return (
            nextEntry !== undefined &&
            entry.chestId === nextEntry.chestId &&
            entry.action === nextEntry.action
          );
        });

      if (didSelectionChange) {
        selectedChestsRef.current = nextSelectedChests;
        setSelectedChests(nextSelectedChests);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedChests) {
        const labelElement = labelElementByKeyRef.current.get(
          entry.selectionKey
        );
        const rowElement = rowElementByKeyRef.current.get(entry.selectionKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaFlowerInteractionLabelScreenPoint(
            Math.floor(entry.worldX),
            Math.floor(entry.worldY),
            cameraOffset,
            cameraWorldZoom
          );

        applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
          labelElement,
          screenPoint.x,
          screenPoint.y
        );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          rowElement,
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
    enabled,
    inventoryStateRef,
    selectedInteractableBlockKeysRef,
  ]);

  if (!enabled || selectedChests.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedChests.map((entry) => {
        const label =
          entry.action === 'locked'
            ? LABELING_WORLD_PLAZA_CHEST_LOCKED_ACTION
            : entry.action === 'unlock'
              ? LABELING_WORLD_PLAZA_CHEST_UNLOCK_ACTION
              : LABELING_WORLD_PLAZA_CHEST_OPEN_ACTION;
        const buttonClassName = entry.isDisabled
          ? DEFINING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_DISABLED_BUTTON_CLASS_NAME
          : DEFINING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_BUTTON_CLASS_NAME;
        const isButtonDisabled = entry.isDisabled && entry.action !== 'locked';

        return (
          <div
            key={entry.selectionKey}
            ref={(element) => {
              if (element) {
                labelElementByKeyRef.current.set(entry.selectionKey, element);
                return;
              }

              labelElementByKeyRef.current.delete(entry.selectionKey);
            }}
            className={
              RENDERING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label={label}
              targetKey={entry.selectionKey}
              progressSnapshot={idleProgressSnapshotRef.current}
              progressRatioRef={idleProgressRatioRef}
              buttonClassName={buttonClassName}
              disabled={isButtonDisabled}
              rowRef={(element) => {
                if (element) {
                  rowElementByKeyRef.current.set(entry.selectionKey, element);
                  return;
                }

                rowElementByKeyRef.current.delete(entry.selectionKey);
              }}
              onActivate={() => {
                if (entry.action === 'locked') {
                  onLockedChestHintRef.current(entry);
                  return;
                }

                if (entry.isDisabled) {
                  return;
                }

                onOpenChestRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
