'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';
import { formattingWorldPlazaFarmlandTileSelectionKey } from '@/components/world/farming/domains/formattingWorldPlazaFarmlandTileSelectionKey';
import {
  listingWorldPlazaFarmlandTilesInInteractionRange,
  type ListingWorldPlazaFarmlandTilesInInteractionRangeEntry,
} from '@/components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { resolvingWorldPlazaGroundTileInteractionLabelScreenPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaGroundTileInteractionLabelScreenPoint';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_FARMING_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_FARMING_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

function resolvingFarmingActionLabel(
  interactionKind: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry['interactionKind']
): string {
  if (interactionKind === 'till') {
    return 'Till';
  }

  if (interactionKind === 'plant') {
    return 'Plant';
  }

  return 'Harvest';
}

export type RenderingWorldPlazaFarmingInteractionLabelsProps = {
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly farmlandByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaFarmlandTileState>
  >;
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly hasEquippedHoe: boolean;
  readonly hasEquippedScythe: boolean;
  readonly hasSeedsInInventory: boolean;
  readonly timedInteractionProgressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onFarmingAction: (
    entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry
  ) => void;
};

/**
 * Till / Plant / Harvest labels above eligible farmland tiles.
 */
export function RenderingWorldPlazaFarmingInteractionLabels({
  playerPositionRef,
  farmlandByTileKeyRef,
  selectedInteractableBlockKeysRef,
  hasEquippedHoe,
  hasEquippedScythe,
  hasSeedsInInventory,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onFarmingAction,
}: RenderingWorldPlazaFarmingInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedEntries, setSelectedEntries] = useState<
    readonly ListingWorldPlazaFarmlandTilesInInteractionRangeEntry[]
  >([]);
  const onFarmingActionRef = useRef(onFarmingAction);
  onFarmingActionRef.current = onFarmingAction;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      const playerPosition = playerPositionRef.current;
      const selectedKeys = selectedInteractableBlockKeysRef.current;
      const nextSelectedEntries = playerPosition
        ? listingWorldPlazaFarmlandTilesInInteractionRange({
            playerPosition,
            farmlandByTileKey: farmlandByTileKeyRef.current,
            hasEquippedHoe,
            hasEquippedScythe,
            hasSeedsInInventory,
          }).filter((entry) =>
            selectedKeys.has(
              formattingWorldPlazaFarmlandTileSelectionKey(
                entry.tileX,
                entry.tileY,
                entry.interactionKind
              )
            )
          )
        : [];

      setSelectedEntries((currentEntries) => {
        if (
          currentEntries.length === nextSelectedEntries.length &&
          currentEntries.every((entry, index) => {
            const nextEntry = nextSelectedEntries[index];

            return (
              nextEntry !== undefined &&
              entry.tileX === nextEntry.tileX &&
              entry.tileY === nextEntry.tileY &&
              entry.interactionKind === nextEntry.interactionKind
            );
          })
        ) {
          return currentEntries;
        }

        return nextSelectedEntries;
      });

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedEntries) {
        const tileKey = formattingWorldPlazaFarmlandTileSelectionKey(
          entry.tileX,
          entry.tileY,
          entry.interactionKind
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

    const unsubscribeDomOverlayFrame =
      subscribingWorldPlazaDomOverlayFrame(updatingLabels);

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    farmlandByTileKeyRef,
    hasEquippedHoe,
    hasEquippedScythe,
    hasSeedsInInventory,
    playerPositionRef,
    selectedInteractableBlockKeysRef,
  ]);

  if (selectedEntries.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedEntries.map((entry) => {
        const tileKey = formattingWorldPlazaFarmlandTileSelectionKey(
          entry.tileX,
          entry.tileY,
          entry.interactionKind
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
              RENDERING_WORLD_PLAZA_FARMING_INTERACTION_LABEL_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_FARMING_INTERACTION_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label={resolvingFarmingActionLabel(entry.interactionKind)}
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
                onFarmingActionRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
