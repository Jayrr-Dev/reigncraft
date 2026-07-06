'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import { RenderingWorldPlazaTreeChopProgressRing } from '@/components/world/harvest/components/renderingWorldPlazaTreeChopProgressIndicator';
import { DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_LABEL_GAP_PX } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopProgressConstants';
import type { ListingWorldPlazaTreesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import { listingWorldPlazaTreesInInteractionRange } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { resolvingWorldPlazaTreeInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaTreeInteractionLabelScreenPoint';
import type { UsingWorldPlazaTreeChopProgressSnapshot } from '@/components/world/harvest/hooks/usingWorldPlazaTreeChopProgress';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_ROW_CLASS_NAME =
  'pointer-events-auto relative inline-flex items-center' as const;

export type RenderingWorldPlazaTreeInteractionLabelsProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly choppedTreeStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaChoppedTreeTileState>
  >;
  readonly chopProgressSnapshot: UsingWorldPlazaTreeChopProgressSnapshot;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onChopTree: (
    entry: ListingWorldPlazaTreesInInteractionRangeEntry
  ) => void;
};

function formattingWorldPlazaTreeInteractionLabelTileKey(
  entry: ListingWorldPlazaTreesInInteractionRangeEntry
): string {
  return formattingWorldPlazaInteractableTreeSelectionKey(
    entry.tileX,
    entry.tileY
  );
}

function checkingWorldPlazaTreeChopProgressMatchesEntry(
  snapshot: UsingWorldPlazaTreeChopProgressSnapshot,
  entry: ListingWorldPlazaTreesInInteractionRangeEntry
): boolean {
  if (snapshot.activeTileX === null || snapshot.activeTileY === null) {
    return false;
  }

  return (
    snapshot.activeTileX === entry.tileX && snapshot.activeTileY === entry.tileY
  );
}

function checkingWorldPlazaTreeChopProgressRingVisible(
  snapshot: UsingWorldPlazaTreeChopProgressSnapshot,
  entry: ListingWorldPlazaTreesInInteractionRangeEntry
): boolean {
  if (!checkingWorldPlazaTreeChopProgressMatchesEntry(snapshot, entry)) {
    return false;
  }

  return (
    snapshot.isActive || snapshot.isCancelling || snapshot.progressRatio > 0
  );
}

/**
 * Simple outlined "Chop" text above a tree after the player clicks it.
 */
export function RenderingWorldPlazaTreeInteractionLabels({
  placedBlocks,
  selectedInteractableBlockKeysRef,
  choppedTreeStateByTileKeyRef,
  chopProgressSnapshot,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onChopTree,
}: RenderingWorldPlazaTreeInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedTrees, setSelectedTrees] = useState<
    readonly ListingWorldPlazaTreesInInteractionRangeEntry[]
  >([]);

  const placedBlocksRef = useRef(placedBlocks);
  const onChopTreeRef = useRef(onChopTree);

  placedBlocksRef.current = placedBlocks;
  onChopTreeRef.current = onChopTree;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      const nextSelectedTrees = listingWorldPlazaTreesInInteractionRange(
        placedBlocksRef.current,
        selectedInteractableBlockKeysRef.current,
        choppedTreeStateByTileKeyRef.current
      );

      setSelectedTrees((currentEntries) => {
        if (
          currentEntries.length === nextSelectedTrees.length &&
          currentEntries.every((entry, index) => {
            const nextEntry = nextSelectedTrees[index];

            return (
              nextEntry !== undefined &&
              entry.tileX === nextEntry.tileX &&
              entry.tileY === nextEntry.tileY
            );
          })
        ) {
          return currentEntries;
        }

        return nextSelectedTrees;
      });

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedTrees) {
        const tileKey = formattingWorldPlazaTreeInteractionLabelTileKey(entry);
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaTreeInteractionLabelScreenPoint(
          entry.tree,
          cameraOffset,
          cameraWorldZoom
        );

        labelElement.style.transform =
          computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
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
    placedBlocks,
    selectedInteractableBlockKeysRef,
    choppedTreeStateByTileKeyRef,
  ]);

  if (selectedTrees.length === 0) {
    return <></>;
  }

  const currentChopProgressSnapshot = chopProgressSnapshot;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedTrees.map((entry) => {
        const tileKey = formattingWorldPlazaTreeInteractionLabelTileKey(entry);
        const isChopProgressRingVisible =
          checkingWorldPlazaTreeChopProgressRingVisible(
            currentChopProgressSnapshot,
            entry
          );

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
              RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_HIDDEN_TRANSFORM,
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
                RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_ROW_CLASS_NAME
              }
            >
              {isChopProgressRingVisible ? (
                <div
                  className="absolute top-1/2 right-full -translate-y-1/2"
                  style={{
                    marginRight: `${DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_LABEL_GAP_PX}px`,
                  }}
                >
                  <RenderingWorldPlazaTreeChopProgressRing
                    snapshot={currentChopProgressSnapshot}
                  />
                </div>
              ) : null}
              <button
                type="button"
                {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                className={
                  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME
                }
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onChopTreeRef.current(entry);
                }}
              >
                Chop
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
