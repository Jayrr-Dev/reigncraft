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
import type { ListingWorldPlazaTreesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import { listingWorldPlazaTreesInInteractionRange } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { resolvingWorldPlazaTreeInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaTreeInteractionLabelScreenPoint';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_TREE_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaTreeInteractionLabelsProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly choppedTreeStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaChoppedTreeTileState>
  >;
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

/**
 * Simple outlined "Chop" text above a tree after the player clicks it.
 */
export function RenderingWorldPlazaTreeInteractionLabels({
  placedBlocks,
  selectedInteractableBlockKeysRef,
  choppedTreeStateByTileKeyRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onChopTree,
}: RenderingWorldPlazaTreeInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const buttonElementByTileKeyRef = useRef<Map<string, HTMLButtonElement>>(
    new Map()
  );
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
        const buttonElement = buttonElementByTileKeyRef.current.get(tileKey);

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
          buttonElement,
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

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedTrees.map((entry) => {
        const tileKey = formattingWorldPlazaTreeInteractionLabelTileKey(entry);

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
            <button
              type="button"
              ref={(element) => {
                if (element) {
                  buttonElementByTileKeyRef.current.set(tileKey, element);
                  return;
                }

                buttonElementByTileKeyRef.current.delete(tileKey);
              }}
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
        );
      })}
    </div>
  );
}
