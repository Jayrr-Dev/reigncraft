'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import type { ListingWorldPlazaPebblesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaPebblesInInteractionRange';
import { listingWorldPlazaPebblesInInteractionRange } from '@/components/world/harvest/domains/listingWorldPlazaPebblesInInteractionRange';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { resolvingWorldPlazaPebbleInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaPebbleInteractionLabelScreenPoint';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractablePebbleSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractablePebbleSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_PEBBLE_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_PEBBLE_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaPebbleInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly pickedPebbleStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaPickedPebbleTileState>
  >;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onPickPebble: (
    entry: ListingWorldPlazaPebblesInInteractionRangeEntry
  ) => void;
};

function formattingWorldPlazaPebbleInteractionLabelTileKey(
  entry: ListingWorldPlazaPebblesInInteractionRangeEntry
): string {
  return formattingWorldPlazaInteractablePebbleSelectionKey(
    entry.tileX,
    entry.tileY
  );
}

/**
 * Simple outlined "Pick" text above a pebble after the player clicks it.
 */
export function RenderingWorldPlazaPebbleInteractionLabels({
  selectedInteractableBlockKeysRef,
  pickedPebbleStateByTileKeyRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onPickPebble,
}: RenderingWorldPlazaPebbleInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedPebbles, setSelectedPebbles] = useState<
    readonly ListingWorldPlazaPebblesInInteractionRangeEntry[]
  >([]);

  const onPickPebbleRef = useRef(onPickPebble);

  onPickPebbleRef.current = onPickPebble;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      const nextSelectedPebbles = listingWorldPlazaPebblesInInteractionRange(
        selectedInteractableBlockKeysRef.current,
        pickedPebbleStateByTileKeyRef.current
      );

      setSelectedPebbles((currentEntries) => {
        if (
          currentEntries.length === nextSelectedPebbles.length &&
          currentEntries.every((entry, index) => {
            const nextEntry = nextSelectedPebbles[index];

            return (
              nextEntry !== undefined &&
              entry.tileX === nextEntry.tileX &&
              entry.tileY === nextEntry.tileY
            );
          })
        ) {
          return currentEntries;
        }

        return nextSelectedPebbles;
      });

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedPebbles) {
        const tileKey = formattingWorldPlazaPebbleInteractionLabelTileKey(entry);
        const labelElement = labelElementByTileKeyRef.current.get(tileKey);
        const rowElement = rowElementByTileKeyRef.current.get(tileKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaPebbleInteractionLabelScreenPoint(
          entry.tileX,
          entry.tileY,
          entry.decoration,
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
    pickedPebbleStateByTileKeyRef,
  ]);

  if (selectedPebbles.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedPebbles.map((entry) => {
        const tileKey = formattingWorldPlazaPebbleInteractionLabelTileKey(entry);

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
              RENDERING_WORLD_PLAZA_PEBBLE_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_PEBBLE_INTERACTION_LABEL_HIDDEN_TRANSFORM,
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
                onPickPebbleRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
