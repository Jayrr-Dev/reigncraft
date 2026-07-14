'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import type { ListingWorldPlazaFlowersInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaFlowersInInteractionRange';
import { listingWorldPlazaFlowersInInteractionRange } from '@/components/world/harvest/domains/listingWorldPlazaFlowersInInteractionRange';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { resolvingWorldPlazaFlowerInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaFlowerInteractionLabelScreenPoint';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableFlowerSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableFlowerSelectionKey';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_FLOWER_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_FLOWER_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaFlowerInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly pickedFlowerStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaPickedFlowerTileState>
  >;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onPickFlower: (
    entry: ListingWorldPlazaFlowersInInteractionRangeEntry
  ) => void;
};

function formattingWorldPlazaFlowerInteractionLabelTileKey(
  entry: ListingWorldPlazaFlowersInInteractionRangeEntry
): string {
  return formattingWorldPlazaInteractableFlowerSelectionKey(
    entry.tileX,
    entry.tileY
  );
}

/**
 * Simple outlined "Pick" text above a biome flower after the player clicks it.
 */
export function RenderingWorldPlazaFlowerInteractionLabels({
  selectedInteractableBlockKeysRef,
  pickedFlowerStateByTileKeyRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onPickFlower,
}: RenderingWorldPlazaFlowerInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedFlowers, setSelectedFlowers] = useState<
    readonly ListingWorldPlazaFlowersInInteractionRangeEntry[]
  >([]);
  const selectedFlowersRef = useRef(selectedFlowers);

  const onPickFlowerRef = useRef(onPickFlower);

  selectedFlowersRef.current = selectedFlowers;
  onPickFlowerRef.current = onPickFlower;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedFlowersRef.current.length > 0) {
          selectedFlowersRef.current = [];
          setSelectedFlowers([]);
        }
        return;
      }

      const nextSelectedFlowers = listingWorldPlazaFlowersInInteractionRange(
        selectedInteractableBlockKeysRef.current,
        pickedFlowerStateByTileKeyRef.current
      );

      const currentEntries = selectedFlowersRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedFlowers.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedFlowers[index];

          return (
            nextEntry !== undefined &&
            entry.tileX === nextEntry.tileX &&
            entry.tileY === nextEntry.tileY
          );
        });

      if (didSelectionChange) {
        selectedFlowersRef.current = nextSelectedFlowers;
        setSelectedFlowers(nextSelectedFlowers);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedFlowers) {
        const tileKey =
          formattingWorldPlazaFlowerInteractionLabelTileKey(entry);
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
    pickedFlowerStateByTileKeyRef,
  ]);

  if (selectedFlowers.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedFlowers.map((entry) => {
        const tileKey =
          formattingWorldPlazaFlowerInteractionLabelTileKey(entry);

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
              RENDERING_WORLD_PLAZA_FLOWER_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_FLOWER_INTERACTION_LABEL_HIDDEN_TRANSFORM,
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
                onPickFlowerRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
