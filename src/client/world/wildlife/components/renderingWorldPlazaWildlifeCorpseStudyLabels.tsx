'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import { LABELING_WILDLIFE_CORPSE_STUDY_ACTION } from '@/components/world/wildlife/domains/definingWildlifeCorpseStudyConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { formattingWildlifeCorpseStudySelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';
import {
  listingWildlifeCorpsesInStudyRange,
  type ListingWildlifeCorpsesInStudyRangeEntry,
} from '@/components/world/wildlife/domains/listingWildlifeCorpsesInStudyRange';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeCorpseStudyLabelScreenPoint } from '@/components/world/wildlife/domains/resolvingWildlifeCorpseStudyLabelScreenPoint';
import type { UsingWorldPlazaWildlifeCorpseStudyProgressSnapshot } from '@/components/world/wildlife/hooks/usingWorldPlazaWildlifeCorpseStudyProgress';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WILDLIFE_CORPSE_STUDY_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WILDLIFE_CORPSE_STUDY_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaWildlifeCorpseStudyLabelsProps = {
  readonly wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly timedInteractionProgressSnapshot: UsingWorldPlazaWildlifeCorpseStudyProgressSnapshot;
  readonly timedInteractionProgressRatioRef: React.RefObject<number>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onStudyCorpse: (
    entry: ListingWildlifeCorpsesInStudyRangeEntry
  ) => void;
};

/**
 * Floating "Study" label above a selected wildlife corpse.
 */
export function RenderingWorldPlazaWildlifeCorpseStudyLabels({
  wildlifeStoreRef,
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  timedInteractionProgressSnapshot,
  timedInteractionProgressRatioRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onStudyCorpse,
}: RenderingWorldPlazaWildlifeCorpseStudyLabelsProps): React.JSX.Element {
  const labelElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedCorpses, setSelectedCorpses] = useState<
    readonly ListingWildlifeCorpsesInStudyRangeEntry[]
  >([]);
  const onStudyCorpseRef = useRef(onStudyCorpse);
  onStudyCorpseRef.current = onStudyCorpse;

  useLayoutEffect(() => {
    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      const nextSelectedCorpses = listingWildlifeCorpsesInStudyRange(
        wildlifeStoreRef.current,
        selectedInteractableBlockKeysRef.current,
        playerPositionRef.current,
        (instance) =>
          resolvingWildlifeSpeciesDefinition(instance.speciesId)?.massKg ?? 50
      );

      setSelectedCorpses((currentEntries) => {
        if (
          currentEntries.length === nextSelectedCorpses.length &&
          currentEntries.every((entry, index) => {
            const nextEntry = nextSelectedCorpses[index];

            return (
              nextEntry !== undefined &&
              entry.instanceId === nextEntry.instanceId
            );
          })
        ) {
          return currentEntries;
        }

        return nextSelectedCorpses;
      });

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedCorpses) {
        const selectionKey = formattingWildlifeCorpseStudySelectionKey(
          entry.instanceId
        );
        const labelElement = labelElementByKeyRef.current.get(selectionKey);
        const rowElement = rowElementByKeyRef.current.get(selectionKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint = resolvingWildlifeCorpseStudyLabelScreenPoint(
          entry.position,
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
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    wildlifeStoreRef,
  ]);

  if (selectedCorpses.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedCorpses.map((entry) => {
        const selectionKey = formattingWildlifeCorpseStudySelectionKey(
          entry.instanceId
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
            className={RENDERING_WILDLIFE_CORPSE_STUDY_LABEL_WRAPPER_CLASS_NAME}
            style={{
              transform: RENDERING_WILDLIFE_CORPSE_STUDY_LABEL_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaTimedInteractionLabelRow
              label={LABELING_WILDLIFE_CORPSE_STUDY_ACTION}
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
                onStudyCorpseRef.current(entry);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
