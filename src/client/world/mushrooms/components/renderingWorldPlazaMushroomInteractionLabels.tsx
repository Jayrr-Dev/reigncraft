'use client';

import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableMushroomSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableMushroomSelectionKey';
import {
  listingWorldPlazaMushroomsInInteractionRange,
  type ListingWorldPlazaMushroomsInInteractionRangeEntry,
} from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomsInInteractionRange';
import type { DefiningWorldPlazaPickedMushroomTileState } from '@/components/world/mushrooms/domains/managingWorldPlazaLocalPickedMushrooms';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RESOLVING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_OFFSET_ABOVE_PX = 18;

export type RenderingWorldPlazaMushroomInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly pickedMushroomStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaPickedMushroomTileState>
  >;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onPickMushroom: (
    entry: ListingWorldPlazaMushroomsInInteractionRangeEntry
  ) => void;
};

function resolvingWorldPlazaMushroomLabelScreenPoint(
  tileX: number,
  tileY: number,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): { readonly x: number; readonly y: number } {
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  });
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      {
        x: tileAnchor.centerXPx,
        y: tileAnchor.centerYPx,
      },
      cameraOffset,
      cameraWorldZoom
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      RESOLVING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_OFFSET_ABOVE_PX *
        cameraWorldZoom,
  };
}

/**
 * Outlined "Pick" label above a world mushroom after the player clicks it.
 */
export function RenderingWorldPlazaMushroomInteractionLabels({
  selectedInteractableBlockKeysRef,
  pickedMushroomStateByTileKeyRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onPickMushroom,
}: RenderingWorldPlazaMushroomInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedMushrooms, setSelectedMushrooms] = useState<
    readonly ListingWorldPlazaMushroomsInInteractionRangeEntry[]
  >([]);
  const selectedMushroomsRef = useRef(selectedMushrooms);
  const onPickMushroomRef = useRef(onPickMushroom);

  selectedMushroomsRef.current = selectedMushrooms;
  onPickMushroomRef.current = onPickMushroom;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedMushroomsRef.current.length > 0) {
          selectedMushroomsRef.current = [];
          setSelectedMushrooms([]);
        }
        return;
      }

      const nextSelectedMushrooms = listingWorldPlazaMushroomsInInteractionRange(
        selectedInteractableBlockKeysRef.current,
        pickedMushroomStateByTileKeyRef.current
      );

      const currentEntries = selectedMushroomsRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedMushrooms.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedMushrooms[index];

          return (
            nextEntry !== undefined &&
            entry.tileX === nextEntry.tileX &&
            entry.tileY === nextEntry.tileY
          );
        });

      if (didSelectionChange) {
        selectedMushroomsRef.current = nextSelectedMushrooms;
        setSelectedMushrooms(nextSelectedMushrooms);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedMushrooms) {
        const tileKey = formattingWorldPlazaInteractableMushroomSelectionKey(
          entry.tileX,
          entry.tileY
        );
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaMushroomLabelScreenPoint(
          entry.tileX,
          entry.tileY,
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
    selectedInteractableBlockKeysRef,
    pickedMushroomStateByTileKeyRef,
  ]);

  if (selectedMushrooms.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedMushrooms.map((entry) => {
        const tileKey = formattingWorldPlazaInteractableMushroomSelectionKey(
          entry.tileX,
          entry.tileY
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
              RENDERING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label="Pick"
              targetKey={tileKey}
              progressSnapshot={timedInteractionProgressSnapshot}
              progressRatioRef={timedInteractionProgressRatioRef}
              rowRef={(element) => {
                if (element) {
                  rowElementByTileKeyRef.current.set(tileKey, element);
                  return;
                }

                rowElementByTileKeyRef.current.delete(tileKey);
              }}
              onActivate={() => {
                onPickMushroomRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
