/**
 * DOM interaction labels for selected bear traps (Arm / Disarm / Pick up).
 *
 * @module components/world/trap/components/renderingWorldPlazaBearTrapInteractionLabels
 */

'use client';

import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME,
  LABELING_WORLD_PLAZA_BEAR_TRAP_ARM_ACTION,
  LABELING_WORLD_PLAZA_BEAR_TRAP_DISARM_ACTION,
  LABELING_WORLD_PLAZA_BEAR_TRAP_PICK_UP_ACTION,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import {
  listingWorldPlazaBearTrapsInInteractionRange,
  type ListingWorldPlazaBearTrapsInInteractionRangeAction,
  type ListingWorldPlazaBearTrapsInInteractionRangeEntry,
} from '@/components/world/trap/domains/listingWorldPlazaBearTrapsInInteractionRange';
import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { resolvingWorldPlazaFlowerInteractionLabelScreenPoint } from '@/components/world/harvest/domains/resolvingWorldPlazaFlowerInteractionLabelScreenPoint';
import { RenderingWorldPlazaTimedInteractionLabelRow } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionLabelRow';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT,
  type DefiningWorldPlazaTimedInteractionProgressSnapshot,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingWorldPlazaBearTrapInteractionLabelsProps = {
  readonly selectedInteractableBlockKeysRef: React.RefObject<
    ReadonlySet<string>
  >;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onTrapAction: (
    entry: ListingWorldPlazaBearTrapsInInteractionRangeEntry,
    action: ListingWorldPlazaBearTrapsInInteractionRangeAction
  ) => void;
};

function resolvingBearTrapActionLabel(
  action: ListingWorldPlazaBearTrapsInInteractionRangeAction
): string {
  if (action === 'arm') {
    return LABELING_WORLD_PLAZA_BEAR_TRAP_ARM_ACTION;
  }

  if (action === 'disarm') {
    return LABELING_WORLD_PLAZA_BEAR_TRAP_DISARM_ACTION;
  }

  return LABELING_WORLD_PLAZA_BEAR_TRAP_PICK_UP_ACTION;
}

/**
 * Campfire-style labels above selected traps (Arm or Disarm by state).
 */
export function RenderingWorldPlazaBearTrapInteractionLabels({
  selectedInteractableBlockKeysRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onTrapAction,
}: RenderingWorldPlazaBearTrapInteractionLabelsProps): React.JSX.Element {
  const enabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS
  );
  const labelElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowElementByKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedTraps, setSelectedTraps] = useState<
    readonly ListingWorldPlazaBearTrapsInInteractionRangeEntry[]
  >([]);
  const selectedTrapsRef = useRef(selectedTraps);
  const onTrapActionRef = useRef(onTrapAction);
  const idleProgressSnapshotRef =
    useRef<DefiningWorldPlazaTimedInteractionProgressSnapshot>(
      DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
    );
  const idleProgressRatioRef = useRef(0);

  selectedTrapsRef.current = selectedTraps;
  onTrapActionRef.current = onTrapAction;

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    let isActive = true;

    const updatingLabels = (): void => {
      if (!isActive) {
        return;
      }

      if (selectedInteractableBlockKeysRef.current.size === 0) {
        if (selectedTrapsRef.current.length > 0) {
          selectedTrapsRef.current = [];
          setSelectedTraps([]);
        }
        return;
      }

      const nextSelectedTraps = listingWorldPlazaBearTrapsInInteractionRange(
        selectedInteractableBlockKeysRef.current
      );

      const currentEntries = selectedTrapsRef.current;
      const didSelectionChange =
        currentEntries.length !== nextSelectedTraps.length ||
        !currentEntries.every((entry, index) => {
          const nextEntry = nextSelectedTraps[index];

          return (
            nextEntry !== undefined &&
            entry.trapId === nextEntry.trapId &&
            entry.actions.join(',') === nextEntry.actions.join(',')
          );
        });

      if (didSelectionChange) {
        selectedTrapsRef.current = nextSelectedTraps;
        setSelectedTraps(nextSelectedTraps);
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        return;
      }

      for (const entry of nextSelectedTraps) {
        const labelElement = labelElementByKeyRef.current.get(
          entry.selectionKey
        );
        const rowElement = rowElementByKeyRef.current.get(entry.selectionKey);

        if (!labelElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaFlowerInteractionLabelScreenPoint(
            Math.floor(entry.worldX),
            Math.floor(entry.worldY),
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
    enabled,
    selectedInteractableBlockKeysRef,
  ]);

  if (!enabled || selectedTraps.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {selectedTraps.map((entry) => (
        <div
          key={entry.selectionKey}
          ref={(element) => {
            if (element) {
              labelElementByKeyRef.current.set(entry.selectionKey, element);
              return;
            }

            labelElementByKeyRef.current.delete(entry.selectionKey);
          }}
          className={
            RENDERING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_WRAPPER_CLASS_NAME
          }
          style={{
            transform:
              RENDERING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_HIDDEN_TRANSFORM,
          }}
        >
          <div
            ref={(element) => {
              if (element) {
                rowElementByKeyRef.current.set(entry.selectionKey, element);
                return;
              }

              rowElementByKeyRef.current.delete(entry.selectionKey);
            }}
            className={
              DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME
            }
          >
            {entry.actions.map((action) => (
              <RenderingWorldPlazaTimedInteractionLabelRow
                key={`${entry.selectionKey}:${action}`}
                label={resolvingBearTrapActionLabel(action)}
                targetKey={`${entry.selectionKey}:${action}`}
                progressSnapshot={idleProgressSnapshotRef.current}
                progressRatioRef={idleProgressRatioRef}
                buttonClassName={
                  DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_BUTTON_CLASS_NAME
                }
                onActivate={() => {
                  onTrapActionRef.current(entry, action);
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
