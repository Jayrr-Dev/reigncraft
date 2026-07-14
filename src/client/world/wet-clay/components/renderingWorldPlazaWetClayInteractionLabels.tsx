'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { resolvingWorldPlazaGroundTileInteractionLabelScreenPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaGroundTileInteractionLabelScreenPoint';
import { DEFINING_WORLD_PLAZA_WET_CLAY_ACTION_LABEL } from '@/components/world/wet-clay/domains/definingWorldPlazaWetClayConstants';
import { formattingWorldPlazaWetClayTileSelectionKey } from '@/components/world/wet-clay/domains/formattingWorldPlazaWetClayTileSelectionKey';
import type { ListingWorldPlazaWetClayTilesInInteractionRangeEntry } from '@/components/world/wet-clay/domains/listingWorldPlazaWetClayTilesInInteractionRange';
import { listingWorldPlazaWetClayTilesInInteractionRange } from '@/components/world/wet-clay/domains/listingWorldPlazaWetClayTilesInInteractionRange';
import { resolvingWorldPlazaClosestWetClayTileInInteractionRange } from '@/components/world/wet-clay/domains/resolvingWorldPlazaClosestWetClayTileInInteractionRange';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_WET_CLAY_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_WET_CLAY_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaWetClayInteractionLabelsProps = {
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly hasClayInInventory: boolean;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onWetClay: (
    entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry
  ) => void;
};

/**
 * Outlined "Wet Clay" label on the closest eligible water tile when carrying clay.
 */
export function RenderingWorldPlazaWetClayInteractionLabels({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  hasClayInInventory,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onWetClay,
}: RenderingWorldPlazaWetClayInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedTiles, setSelectedTiles] = useState<
    readonly ListingWorldPlazaWetClayTilesInInteractionRangeEntry[]
  >([]);
  const selectedTilesRef = useRef(selectedTiles);
  const onWetClayRef = useRef(onWetClay);
  const hasClayInInventoryRef = useRef(hasClayInInventory);
  const activeTargetKeyRef = useRef(
    timedInteractionProgressSnapshot.activeTargetKey
  );
  selectedTilesRef.current = selectedTiles;
  onWetClayRef.current = onWetClay;
  hasClayInInventoryRef.current = hasClayInInventory;
  activeTargetKeyRef.current = timedInteractionProgressSnapshot.activeTargetKey;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (!hasClayInInventoryRef.current) {
        if (selectedTilesRef.current.length > 0) {
          selectedTilesRef.current = [];
          setSelectedTiles([]);
        }
        return;
      }

      const playerPosition = playerPositionRef.current;
      const selectedKeys = selectedInteractableBlockKeysRef.current;

      if (selectedKeys.size === 0) {
        if (selectedTilesRef.current.length > 0) {
          selectedTilesRef.current = [];
          setSelectedTiles([]);
        }
        return;
      }

      const candidateTiles = playerPosition
        ? listingWorldPlazaWetClayTilesInInteractionRange(
            playerPosition
          ).filter((entry) =>
            selectedKeys.has(
              formattingWorldPlazaWetClayTileSelectionKey(
                entry.tileX,
                entry.tileY
              )
            )
          )
        : [];
      const closestTile = playerPosition
        ? resolvingWorldPlazaClosestWetClayTileInInteractionRange(
            playerPosition,
            candidateTiles,
            activeTargetKeyRef.current
          )
        : null;
      const nextSelectedTiles = closestTile ? [closestTile] : [];

      const currentEntries = selectedTilesRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedTiles.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedTiles[index];

          return (
            nextEntry !== undefined &&
            entry.tileX === nextEntry.tileX &&
            entry.tileY === nextEntry.tileY
          );
        });

      if (didSelectionChange) {
        selectedTilesRef.current = nextSelectedTiles;
        setSelectedTiles(nextSelectedTiles);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedTiles) {
        const tileKey = formattingWorldPlazaWetClayTileSelectionKey(
          entry.tileX,
          entry.tileY
        );
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaGroundTileInteractionLabelScreenPoint(
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

    const unsubscribeDomOverlayFrame =
      subscribingWorldPlazaDomOverlayFrame(updatingLabels);

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    playerPositionRef,
    selectedInteractableBlockKeysRef,
  ]);

  if (selectedTiles.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedTiles.map((entry) => {
        const tileKey = formattingWorldPlazaWetClayTileSelectionKey(
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
              RENDERING_WORLD_PLAZA_WET_CLAY_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_WET_CLAY_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label={DEFINING_WORLD_PLAZA_WET_CLAY_ACTION_LABEL}
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
                onWetClayRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
