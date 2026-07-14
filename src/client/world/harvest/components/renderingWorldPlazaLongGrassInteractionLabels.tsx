'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { LABELING_WORLD_PLAZA_LONG_GRASS_SEARCH_ACTION } from '@/components/world/harvest/domains/definingWorldPlazaLongGrassSearchConstants';
import type { ListingWorldPlazaLongGrassInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaLongGrassInInteractionRange';
import { listingWorldPlazaLongGrassInInteractionRange } from '@/components/world/harvest/domains/listingWorldPlazaLongGrassInInteractionRange';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import { resolvingWorldPlazaFlowerInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaFlowerInteractionLabelScreenPoint';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableLongGrassSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableLongGrassSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_LONG_GRASS_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_LONG_GRASS_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaLongGrassInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly clearedLongGrassStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaClearedLongGrassTileState>
  >;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onSearchLongGrass: (
    entry: ListingWorldPlazaLongGrassInInteractionRangeEntry
  ) => void;
};

function formattingWorldPlazaLongGrassInteractionLabelTileKey(
  entry: ListingWorldPlazaLongGrassInInteractionRangeEntry
): string {
  return formattingWorldPlazaInteractableLongGrassSelectionKey(
    entry.tileX,
    entry.tileY
  );
}

export function RenderingWorldPlazaLongGrassInteractionLabels({
  selectedInteractableBlockKeysRef,
  clearedLongGrassStateByTileKeyRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onSearchLongGrass,
}: RenderingWorldPlazaLongGrassInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedGrass, setSelectedGrass] = useState<
    readonly ListingWorldPlazaLongGrassInInteractionRangeEntry[]
  >([]);
  const selectedGrassRef = useRef(selectedGrass);
  const onSearchLongGrassRef = useRef(onSearchLongGrass);

  selectedGrassRef.current = selectedGrass;
  onSearchLongGrassRef.current = onSearchLongGrass;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedGrassRef.current.length > 0) {
          selectedGrassRef.current = [];
          setSelectedGrass([]);
        }
        return;
      }

      const nextSelectedGrass = listingWorldPlazaLongGrassInInteractionRange(
        selectedInteractableBlockKeysRef.current,
        clearedLongGrassStateByTileKeyRef.current
      );

      const currentEntries = selectedGrassRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedGrass.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedGrass[index];

          return (
            nextEntry !== undefined &&
            entry.tileX === nextEntry.tileX &&
            entry.tileY === nextEntry.tileY
          );
        });

      if (didSelectionChange) {
        selectedGrassRef.current = nextSelectedGrass;
        setSelectedGrass(nextSelectedGrass);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedGrass) {
        const tileKey =
          formattingWorldPlazaLongGrassInteractionLabelTileKey(entry);
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaFlowerInteractionLabelScreenPoint(
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
    clearedLongGrassStateByTileKeyRef,
  ]);

  if (selectedGrass.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedGrass.map((entry) => {
        const tileKey =
          formattingWorldPlazaLongGrassInteractionLabelTileKey(entry);

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
              RENDERING_WORLD_PLAZA_LONG_GRASS_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_LONG_GRASS_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label={LABELING_WORLD_PLAZA_LONG_GRASS_SEARCH_ACTION}
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
                onSearchLongGrassRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
