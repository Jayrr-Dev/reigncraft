'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { formattingWorldPlazaFishingTileSelectionKey } from '@/components/world/fishing/domains/formattingWorldPlazaFishingTileSelectionKey';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import { listingWorldPlazaFishingTilesInInteractionRange } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { resolvingWorldPlazaGroundTileInteractionLabelScreenPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaGroundTileInteractionLabelScreenPoint';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_FISHING_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_FISHING_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaFishingInteractionLabelsProps = {
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onFish: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => void;
};

/**
 * Outlined "Fish" labels above eligible nearby water tiles.
 */
export function RenderingWorldPlazaFishingInteractionLabels({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onFish,
}: RenderingWorldPlazaFishingInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedTiles, setSelectedTiles] = useState<
    readonly ListingWorldPlazaFishingTilesInInteractionRangeEntry[]
  >([]);
  const selectedTilesRef = useRef(selectedTiles);
  const onFishRef = useRef(onFish);
  selectedTilesRef.current = selectedTiles;
  onFishRef.current = onFish;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
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

      const nextSelectedTiles = playerPosition
        ? listingWorldPlazaFishingTilesInInteractionRange(
            playerPosition
          ).filter((entry) =>
            selectedKeys.has(
              formattingWorldPlazaFishingTileSelectionKey(
                entry.tileX,
                entry.tileY
              )
            )
          )
        : [];

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
        const tileKey = formattingWorldPlazaFishingTileSelectionKey(
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
        const tileKey = formattingWorldPlazaFishingTileSelectionKey(
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
              RENDERING_WORLD_PLAZA_FISHING_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_FISHING_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label="Fish"
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
                onFishRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
