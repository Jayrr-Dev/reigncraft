'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import type { ListingWorldPlazaRocksInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaRocksInInteractionRange';
import { listingWorldPlazaRocksInInteractionRange } from '@/components/world/harvest/domains/listingWorldPlazaRocksInInteractionRange';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { resolvingWorldPlazaRockInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaRockInteractionLabelScreenPoint';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableRockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableRockSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_ROCK_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ROCK_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaRockInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly minedRockStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaMinedRockTileState>
  >;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onMineRock: (
    entry: ListingWorldPlazaRocksInInteractionRangeEntry
  ) => void;
};

function formattingWorldPlazaRockInteractionLabelTileKey(
  entry: ListingWorldPlazaRocksInInteractionRangeEntry
): string {
  return formattingWorldPlazaInteractableRockSelectionKey(
    entry.tileX,
    entry.tileY
  );
}

/**
 * Simple outlined "Mine" text above a rock after the player clicks it.
 */
export function RenderingWorldPlazaRockInteractionLabels({
  selectedInteractableBlockKeysRef,
  minedRockStateByTileKeyRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onMineRock,
}: RenderingWorldPlazaRockInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedRocks, setSelectedRocks] = useState<
    readonly ListingWorldPlazaRocksInInteractionRangeEntry[]
  >([]);

  const onMineRockRef = useRef(onMineRock);

  onMineRockRef.current = onMineRock;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      const nextSelectedRocks = listingWorldPlazaRocksInInteractionRange(
        selectedInteractableBlockKeysRef.current,
        minedRockStateByTileKeyRef.current
      );

      setSelectedRocks((currentEntries) => {
        if (
          currentEntries.length === nextSelectedRocks.length &&
          currentEntries.every((entry, index) => {
            const nextEntry = nextSelectedRocks[index];

            return (
              nextEntry !== undefined &&
              entry.tileX === nextEntry.tileX &&
              entry.tileY === nextEntry.tileY
            );
          })
        ) {
          return currentEntries;
        }

        return nextSelectedRocks;
      });

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedRocks) {
        const tileKey = formattingWorldPlazaRockInteractionLabelTileKey(entry);
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaRockInteractionLabelScreenPoint(
          entry.metadata,
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
    selectedInteractableBlockKeysRef,
    minedRockStateByTileKeyRef,
  ]);

  if (selectedRocks.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedRocks.map((entry) => {
        const tileKey = formattingWorldPlazaRockInteractionLabelTileKey(entry);

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
              RENDERING_WORLD_PLAZA_ROCK_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_ROCK_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label="Mine"
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
                onMineRockRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
