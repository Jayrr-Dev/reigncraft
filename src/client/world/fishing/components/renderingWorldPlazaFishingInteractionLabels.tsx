'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FISHING_REEL_READY_FLASH_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FISHING_REEL_READY_YELLOW_ONCE_CLASS_NAME,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';
import { formattingWorldPlazaFishingTileSelectionKey } from '@/components/world/fishing/domains/formattingWorldPlazaFishingTileSelectionKey';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import { listingWorldPlazaFishingTilesInInteractionRange } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import {
  gettingWorldPlazaFishingReelHold,
  gettingWorldPlazaFishingReelReadyFlashVisible,
} from '@/components/world/fishing/domains/managingWorldPlazaFishingReelCastState';
import { checkingWorldPlazaTimedInteractionProgressRingVisible } from '@/components/world/interaction/domains/checkingWorldPlazaTimedInteractionProgressMatchesTarget';
import { DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_ROW_CLASS_NAME } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionLabelUiConstants';
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
  readonly reelOpportunityActiveRef: React.RefObject<boolean>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onFish: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => void;
  readonly onReel: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => void;
  readonly onReelHoldStart: () => void;
  readonly onReelHoldEnd: () => void;
};

/**
 * Outlined "Fish" / "Reel" labels above eligible nearby water tiles.
 */
export function RenderingWorldPlazaFishingInteractionLabels({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  timedInteractionProgressSnapshot,
  reelOpportunityActiveRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onFish,
  onReel,
  onReelHoldStart,
  onReelHoldEnd,
}: RenderingWorldPlazaFishingInteractionLabelsProps): React.JSX.Element {
  const labelElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const rowElementByTileKeyRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const reelButtonElementByTileKeyRef = useRef<Map<string, HTMLButtonElement>>(
    new Map()
  );
  const [selectedTiles, setSelectedTiles] = useState<
    readonly ListingWorldPlazaFishingTilesInInteractionRangeEntry[]
  >([]);
  const selectedTilesRef = useRef(selectedTiles);
  const timedInteractionProgressSnapshotRef = useRef(
    timedInteractionProgressSnapshot
  );
  const onFishRef = useRef(onFish);
  const onReelRef = useRef(onReel);
  const onReelHoldStartRef = useRef(onReelHoldStart);
  const onReelHoldEndRef = useRef(onReelHoldEnd);
  selectedTilesRef.current = selectedTiles;
  timedInteractionProgressSnapshotRef.current =
    timedInteractionProgressSnapshot;
  onFishRef.current = onFish;
  onReelRef.current = onReel;
  onReelHoldStartRef.current = onReelHoldStart;
  onReelHoldEndRef.current = onReelHoldEnd;

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

        const reelButtonElement =
          reelButtonElementByTileKeyRef.current.get(tileKey);

        if (reelButtonElement) {
          const isCasting =
            checkingWorldPlazaTimedInteractionProgressRingVisible(
              timedInteractionProgressSnapshotRef.current,
              tileKey
            );
          const isReelReady =
            isCasting && reelOpportunityActiveRef.current === true;
          const isReelHeld = isReelReady && gettingWorldPlazaFishingReelHold();
          const shouldShowLabel = !isCasting || isReelReady;

          reelButtonElement.hidden = !shouldShowLabel;
          reelButtonElement.textContent = isCasting ? 'Reel' : 'Fish';
          reelButtonElement.classList.toggle(
            DEFINING_WORLD_PLAZA_FISHING_REEL_READY_FLASH_CLASS_NAME,
            isReelReady && !isReelHeld
          );
          reelButtonElement.classList.toggle(
            DEFINING_WORLD_PLAZA_FISHING_REEL_READY_YELLOW_ONCE_CLASS_NAME,
            isReelReady &&
              !isReelHeld &&
              gettingWorldPlazaFishingReelReadyFlashVisible()
          );
          reelButtonElement.classList.toggle(
            DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_CLASS_NAME,
            isReelHeld
          );
        }
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
    reelOpportunityActiveRef,
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
        const isCasting = checkingWorldPlazaTimedInteractionProgressRingVisible(
          timedInteractionProgressSnapshot,
          tileKey
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
            <div
              ref={(element) => {
                if (element) {
                  rowElementByTileKeyRef.current.set(tileKey, element);
                  return;
                }

                rowElementByTileKeyRef.current.delete(tileKey);
              }}
              className={
                DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_ROW_CLASS_NAME
              }
            >
              <button
                type="button"
                ref={(element) => {
                  if (element) {
                    const wasMissing =
                      !reelButtonElementByTileKeyRef.current.has(tileKey);
                    reelButtonElementByTileKeyRef.current.set(tileKey, element);
                    // Overlay frame owns label text/visibility after mount.
                    // Seed once only — inline refs re-run every render and would
                    // hide/clear "Reel" mid-cast (flicker + lost pointer hold).
                    if (wasMissing) {
                      if (isCasting) {
                        element.hidden = true;
                        element.textContent = '';
                      } else {
                        element.hidden = false;
                        element.textContent = 'Fish';
                      }
                    }
                    return;
                  }

                  reelButtonElementByTileKeyRef.current.delete(tileKey);
                }}
                {...{
                  [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
                }}
                className={
                  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME
                }
                onPointerDown={(event) => {
                  if (!isCasting || reelOpportunityActiveRef.current !== true) {
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  onReelHoldStartRef.current();
                }}
                onPointerUp={(event) => {
                  if (!isCasting) {
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  onReelHoldEndRef.current();
                }}
                onPointerCancel={(event) => {
                  if (!isCasting) {
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  onReelHoldEndRef.current();
                }}
                onLostPointerCapture={() => {
                  if (!isCasting) {
                    return;
                  }

                  onReelHoldEndRef.current();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  if (isCasting) {
                    if (reelOpportunityActiveRef.current !== true) {
                      return;
                    }

                    onReelRef.current(entry);
                    return;
                  }

                  onFishRef.current(entry);
                }}
              ></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
