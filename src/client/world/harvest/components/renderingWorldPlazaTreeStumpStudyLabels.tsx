'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { LABELING_WORLD_PLAZA_TREE_STUMP_STUDY_ACTION } from '@/components/world/harvest/domains/definingWorldPlazaTreeStumpStudyConstants';
import { formattingWorldPlazaTreeStumpStudySelectionKey } from '@/components/world/harvest/domains/formattingWorldPlazaTreeStumpStudySelectionKey';
import {
  listingWorldPlazaTreeStumpsInStudyRange,
  type ListingWorldPlazaTreeStumpsInStudyRangeEntry,
} from '@/components/world/harvest/domains/listingWorldPlazaTreeStumpsInStudyRange';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { resolvingWorldPlazaTreeInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaTreeInteractionLabelScreenPoint';
import type { UsingWorldPlazaTreeStumpStudyProgressSnapshot } from '@/components/world/harvest/hooks/usingWorldPlazaTreeStumpStudyProgress';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_TREE_STUMP_STUDY_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_TREE_STUMP_STUDY_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaTreeStumpStudyLabelsProps = {
  readonly placedBlocksRef: React.RefObject<
    readonly DefiningWorldBuildingPlacedBlock[]
  >;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly choppedTreeStateByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaChoppedTreeTileState>
  >;
  readonly persistenceOwnerId: string | null;
  readonly timedInteractionProgressSnapshot: UsingWorldPlazaTreeStumpStudyProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onStudyStump: (
    entry: ListingWorldPlazaTreeStumpsInStudyRangeEntry
  ) => void;
};

/**
 * Floating "Study" label above a selected felled-tree stump.
 */
export function RenderingWorldPlazaTreeStumpStudyLabels({
  placedBlocksRef,
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  choppedTreeStateByTileKeyRef,
  persistenceOwnerId,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onStudyStump,
}: RenderingWorldPlazaTreeStumpStudyLabelsProps): React.JSX.Element {
  const labelElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedStumps, setSelectedStumps] = useState<
    readonly ListingWorldPlazaTreeStumpsInStudyRangeEntry[]
  >([]);
  const onStudyStumpRef = useRef(onStudyStump);
  onStudyStumpRef.current = onStudyStump;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      const nextSelectedStumps = listingWorldPlazaTreeStumpsInStudyRange({
        placedBlocks: placedBlocksRef.current,
        selectedKeys: selectedInteractableBlockKeysRef.current,
        playerPosition: playerPositionRef.current,
        choppedTreeStateByTileKey: choppedTreeStateByTileKeyRef.current,
        persistenceOwnerId,
      });

      setSelectedStumps((currentEntries) => {
        if (
          currentEntries.length === nextSelectedStumps.length &&
          currentEntries.every((entry, index) => {
            const nextEntry = nextSelectedStumps[index];

            return (
              nextEntry !== undefined &&
              entry.tileX === nextEntry.tileX &&
              entry.tileY === nextEntry.tileY
            );
          })
        ) {
          return currentEntries;
        }

        return nextSelectedStumps;
      });

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedStumps) {
        const selectionKey = formattingWorldPlazaTreeStumpStudySelectionKey(
          entry.tileX,
          entry.tileY
        );
        const labelElement = labelElementByKeyRef.current.get(selectionKey);
        const rowElement = rowElementByKeyRef.current.get(selectionKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaTreeInteractionLabelScreenPoint(
          entry.tree,
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
    choppedTreeStateByTileKeyRef,
    persistenceOwnerId,
    placedBlocksRef,
    playerPositionRef,
    selectedInteractableBlockKeysRef,
  ]);

  if (selectedStumps.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedStumps.map((entry) => {
        const selectionKey = formattingWorldPlazaTreeStumpStudySelectionKey(
          entry.tileX,
          entry.tileY
        );

        return (
          <div
            key={selectionKey}
            ref={(element) => {
              if (element) {
                labelElementByKeyRef.current.set(selectionKey, element);
                return;
              }

              labelElementByKeyRef.current.delete(selectionKey);
            }}
            className={RENDERING_TREE_STUMP_STUDY_LABEL_WRAPPER_CLASS_NAME}
            style={{
              transform: RENDERING_TREE_STUMP_STUDY_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label={LABELING_WORLD_PLAZA_TREE_STUMP_STUDY_ACTION}
              targetKey={selectionKey}
              progressSnapshot={timedInteractionProgressSnapshot}
              progressRatioRef={timedInteractionProgressRatioRef}
              rowRef={(element) => {
                if (element) {
                  rowElementByKeyRef.current.set(selectionKey, element);
                  return;
                }

                rowElementByKeyRef.current.delete(selectionKey);
              }}
              onActivate={() => {
                onStudyStumpRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
