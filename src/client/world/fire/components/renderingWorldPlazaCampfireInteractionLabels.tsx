'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import type { ListingWorldPlazaCampfireBlocksInInteractionRangeEntry } from '@/components/world/fire/domains/listingWorldPlazaCampfireBlocksInInteractionRange';
import { listingWorldPlazaCampfireBlocksInInteractionRange } from '@/components/world/fire/domains/listingWorldPlazaCampfireBlocksInInteractionRange';
import { resolvingWorldPlazaCampfireInteractionLabelScreenPoint } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireInteractionLabelScreenPoint';
import { useLayoutEffect, useRef, useState } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

const RENDERING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaCampfireInteractionLabelsProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly fireCells: readonly WorldFireDevvitCell[];
  readonly selectedInteractableBlockKeysRef: React.RefObject<ReadonlySet<string>>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onInteractWithCampfire: (
    block: DefiningWorldBuildingPlacedBlock
  ) => void;
};

function formattingWorldPlazaCampfireInteractionLabelTileKey(
  entry: ListingWorldPlazaCampfireBlocksInInteractionRangeEntry
): string {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(entry.block);

  return `${entry.block.tilePosition.tileX}:${entry.block.tilePosition.tileY}:${worldLayer}`;
}

function resolvingWorldPlazaCampfireInteractionLabelText(
  interactionLabel: ListingWorldPlazaCampfireBlocksInInteractionRangeEntry['interactionLabel']
): string {
  return interactionLabel === 'add-wood' ? 'Add Wood' : 'Light';
}

/**
 * Simple outlined text above a campfire after the player clicks it.
 */
export function RenderingWorldPlazaCampfireInteractionLabels({
  placedBlocks,
  fireCells,
  selectedInteractableBlockKeysRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onInteractWithCampfire,
}: RenderingWorldPlazaCampfireInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const buttonElementByTileKeyRef = useRef<Map<string, HTMLButtonElement>>(
    new Map()
  );
  const [selectedCampfires, setSelectedCampfires] = useState<
    readonly ListingWorldPlazaCampfireBlocksInInteractionRangeEntry[]
  >([]);

  const placedBlocksRef = useRef(placedBlocks);
  const fireCellsRef = useRef(fireCells);
  const onInteractWithCampfireRef = useRef(onInteractWithCampfire);

  placedBlocksRef.current = placedBlocks;
  fireCellsRef.current = fireCells;
  onInteractWithCampfireRef.current = onInteractWithCampfire;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      const nextSelectedCampfires =
        listingWorldPlazaCampfireBlocksInInteractionRange(
          placedBlocksRef.current,
          fireCellsRef.current,
          selectedInteractableBlockKeysRef.current
        );

      setSelectedCampfires((currentEntries) => {
        if (
          currentEntries.length === nextSelectedCampfires.length &&
          currentEntries.every((entry, index) => {
            const nextEntry = nextSelectedCampfires[index];

            return (
              nextEntry !== undefined &&
              entry.block.blockId === nextEntry.block.blockId &&
              entry.interactionLabel === nextEntry.interactionLabel
            );
          })
        ) {
          return currentEntries;
        }

        return nextSelectedCampfires;
      });

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedCampfires) {
        const tileKey =
          formattingWorldPlazaCampfireInteractionLabelTileKey(entry);
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const buttonElement = buttonElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaCampfireInteractionLabelScreenPoint(
            entry.block,
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
    fireCells,
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
                onInteractWithCampfireRef.current(entry.block);
              }}
            >
              {resolvingWorldPlazaCampfireInteractionLabelText(
                entry.interactionLabel
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
