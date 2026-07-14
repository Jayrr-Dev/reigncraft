'use client';

/**
 * World-anchored Refine button for bloomery / kiln / stove.
 *
 * @module components/world/crafting/components/renderingWorldPlazaOreSmeltingInteractionLabels
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import { DEFINING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_REFINE } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingInteractionLabelConstants';
import {
  listingWorldPlazaOreSmeltingStationsInInteractionRange,
  type ListingWorldPlazaOreSmeltingStationsInInteractionRangeEntry,
} from '@/components/world/crafting/domains/listingWorldPlazaOreSmeltingStationsInInteractionRange';
import { resolvingWorldPlazaOreSmeltingInteractionLabelScreenPoint } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingInteractionLabelScreenPoint';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaOreSmeltingInteractionLabelsProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onRefineStation: (block: DefiningWorldBuildingPlacedBlock) => void;
};

/**
 * Outlined Refine text above a selected smelting station.
 */
export function RenderingWorldPlazaOreSmeltingInteractionLabels({
  placedBlocks,
  selectedInteractableBlockKeysRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onRefineStation,
}: RenderingWorldPlazaOreSmeltingInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const buttonElementByTileKeyRef = useRef<Map<string, HTMLButtonElement>>(
    new Map()
  );
  const [selectedStations, setSelectedStations] = useState<
    readonly ListingWorldPlazaOreSmeltingStationsInInteractionRangeEntry[]
  >([]);
  const selectedStationsRef = useRef(selectedStations);
  const placedBlocksRef = useRef(placedBlocks);
  const onRefineStationRef = useRef(onRefineStation);

  selectedStationsRef.current = selectedStations;
  placedBlocksRef.current = placedBlocks;
  onRefineStationRef.current = onRefineStation;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedStationsRef.current.length > 0) {
          selectedStationsRef.current = [];
          setSelectedStations([]);
        }
        return;
      }

      const nextSelectedStations =
        listingWorldPlazaOreSmeltingStationsInInteractionRange(
          placedBlocksRef.current,
          selectedInteractableBlockKeysRef.current
        );

      const currentEntries = selectedStationsRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedStations.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedStations[index];

          return (
            nextEntry !== undefined &&
            entry.block.blockId === nextEntry.block.blockId
          );
        });

      if (didSelectionChange) {
        selectedStationsRef.current = nextSelectedStations;
        setSelectedStations(nextSelectedStations);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedStations) {
        const tileKey = formattingWorldPlazaInteractableBlockSelectionKey(
          entry.block
        );
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const buttonElement = buttonElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaOreSmeltingInteractionLabelScreenPoint(
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
          buttonElement ?? labelElement,
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
  ]);

  if (selectedStations.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedStations.map((entry) => {
        const tileKey = formattingWorldPlazaInteractableBlockSelectionKey(
          entry.block
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
              RENDERING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <button
              ref={(element) => {
                if (element) {
                  buttonElementByTileKeyRef.current.set(tileKey, element);
                  return;
                }

                buttonElementByTileKeyRef.current.delete(tileKey);
              }}
              type="button"
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
              className={
                DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME
              }
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRefineStationRef.current(entry.block);
              }}
            >
              {DEFINING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_REFINE}
            </button>
          </div>
        );
      })}
    </div>
  );
}
