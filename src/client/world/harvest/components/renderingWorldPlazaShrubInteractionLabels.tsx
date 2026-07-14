'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { LABELING_WORLD_PLAZA_SHRUB_PICK_ACTION } from '@/components/world/harvest/domains/definingWorldPlazaShrubPickConstants';
import type { ListingWorldPlazaShrubsInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaShrubsInInteractionRange';
import { listingWorldPlazaShrubsInInteractionRange } from '@/components/world/harvest/domains/listingWorldPlazaShrubsInInteractionRange';
import type { DefiningWorldPlazaPickedShrubTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { resolvingWorldPlazaShrubInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaShrubInteractionLabelScreenPoint';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableShrubSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableShrubSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_SHRUB_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_SHRUB_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaShrubInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly pickedShrubStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaPickedShrubTileState>
  >;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onPickShrub: (
    entry: ListingWorldPlazaShrubsInInteractionRangeEntry
  ) => void;
};

function formattingWorldPlazaShrubInteractionLabelTileKey(
  entry: ListingWorldPlazaShrubsInInteractionRangeEntry
): string {
  return formattingWorldPlazaInteractableShrubSelectionKey(
    entry.tileX,
    entry.tileY
  );
}

export function RenderingWorldPlazaShrubInteractionLabels({
  selectedInteractableBlockKeysRef,
  pickedShrubStateByTileKeyRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onPickShrub,
}: RenderingWorldPlazaShrubInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedShrubs, setSelectedShrubs] = useState<
    readonly ListingWorldPlazaShrubsInInteractionRangeEntry[]
  >([]);
  const selectedShrubsRef = useRef(selectedShrubs);
  const onPickShrubRef = useRef(onPickShrub);

  selectedShrubsRef.current = selectedShrubs;
  onPickShrubRef.current = onPickShrub;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedShrubsRef.current.length > 0) {
          selectedShrubsRef.current = [];
          setSelectedShrubs([]);
        }
        return;
      }

      const nextSelectedShrubs = listingWorldPlazaShrubsInInteractionRange(
        selectedInteractableBlockKeysRef.current,
        pickedShrubStateByTileKeyRef.current
      );

      const currentEntries = selectedShrubsRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedShrubs.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedShrubs[index];

          return (
            nextEntry !== undefined &&
            entry.tileX === nextEntry.tileX &&
            entry.tileY === nextEntry.tileY
          );
        });

      if (didSelectionChange) {
        selectedShrubsRef.current = nextSelectedShrubs;
        setSelectedShrubs(nextSelectedShrubs);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedShrubs) {
        const tileKey =
          formattingWorldPlazaShrubInteractionLabelTileKey(entry);
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaShrubInteractionLabelScreenPoint(
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
    pickedShrubStateByTileKeyRef,
  ]);

  if (selectedShrubs.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedShrubs.map((entry) => {
        const tileKey =
          formattingWorldPlazaShrubInteractionLabelTileKey(entry);

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
              RENDERING_WORLD_PLAZA_SHRUB_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_SHRUB_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label={LABELING_WORLD_PLAZA_SHRUB_PICK_ACTION}
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
                onPickShrubRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
