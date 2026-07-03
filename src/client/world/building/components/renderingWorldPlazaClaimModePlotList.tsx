"use client";

import { Badge } from "@/components/ui/badge";
import { RenderingWorldPlazaClaimModePlotCapacityBadges } from "@/components/world/building/components/renderingWorldPlazaClaimModePlotCapacityBadges";
import { RenderingWorldPlazaClaimModeTemporaryTilesList } from "@/components/world/building/components/renderingWorldPlazaClaimModeTemporaryTilesList";
import { countingWorldBuildingOwnerTemporaryTileClaims } from "@/components/world/building/domains/countingWorldBuildingOwnerTemporaryTileClaims";
import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LOCAL_OWNER_GROUP_TITLE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LOCAL_PLOT_BADGE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_OTHER_PLOT_BADGE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_TITLE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_BADGE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_BADGE_GRID_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_LIST_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_TELEPORT_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_VISIT_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { type DefiningWorldBuildingPlotRegistryOwnerGroup } from "@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner";
import { formattingWorldBuildingPlotRegistryContiguousRegionLabel } from "@/components/world/building/domains/groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_BADGE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_ICON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_MESSAGE,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_TEXT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SECTION_LABEL,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL,
  LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON,
} from "@/components/world/domains/definingWorldPlazaSavedCoordsListUiConstants";
import { formattingWorldPlazaSavedCoordsLabel } from "@/components/world/domains/formattingWorldPlazaSavedCoordsLabel";
import {
  LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_PENDING_BUTTON,
  LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_VISIT_BUTTON,
  type WorldPlotVisitRequestOutgoingListMember,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import {
  groupingWorldPlotVisitOutgoingRequestsByBoundsKey,
  groupingWorldPlotVisitPendingHostUserIds,
  resolvingWorldPlotVisitClaimListActionState,
} from "@/components/world/plotVisit/domains/resolvingWorldPlotVisitClaimListActionState";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/** Empty registry message. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_EMPTY_MESSAGE =
  "No plots to show yet." as const;

/** Loading registry message. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_LOADING_MESSAGE =
  "Loading plots..." as const;

/** Teleport action label for local plot rows. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_TELEPORT_LABEL =
  "Teleport to Plot" as const;

/** Plot row layout classes. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_ROW_CLASS_NAME =
  "flex min-w-0 items-center gap-1" as const;

export interface RenderingWorldPlazaClaimModePlotListProps {
  ownerGroups: DefiningWorldBuildingPlotRegistryOwnerGroup[];
  activeViewportPlots: readonly DefiningWorldBuildingPlot[];
  localUserId: string;
  localOwnedPlotCount: number;
  localTileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  isLoading: boolean;
  onTeleportToPlotBounds?: (bounds: DefiningWorldBuildingPlotBounds) => void;
  onRequestingFriendPlotVisit?: (
    hostUserId: string,
    hostDisplayName: string,
    bounds: DefiningWorldBuildingPlotBounds,
  ) => void;
  onTeleportingToApprovedFriendPlot?: (
    bounds: DefiningWorldBuildingPlotBounds,
    requestId: string,
  ) => void;
  outgoingVisitRequests?: readonly WorldPlotVisitRequestOutgoingListMember[];
  isRequestingFriendPlotVisit?: boolean;
  onRemoveTemporaryPlotAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition,
  ) => void;
  isRemovingTemporaryPlot?: boolean;
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[];
  trackedSavedCoordsId: string | null;
  onToggleSavedCoordsTracking: (savedCoordsId: string) => void;
  onDeleteSavedCoords: (savedCoordsId: string) => void;
  isDeletingSavedCoords?: boolean;
}

/** Builds a stable React key for one contiguous region badge. */
function formattingWorldPlazaClaimModeContiguousRegionKey(
  ownerUserId: string,
  bounds: DefiningWorldBuildingPlotBounds,
): string {
  return `${ownerUserId}:${bounds.minTileX},${bounds.minTileY},${bounds.maxTileX},${bounds.maxTileY}`;
}

/** Local owner row title. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_LOCAL_OWNER_GROUP_TITLE = "You" as const;

/**
 * Formats the owner group title with plot and tile counts.
 *
 * @param ownerGroup - Registry owner row.
 */
function formattingWorldPlazaClaimModeOwnerGroupTitle(
  ownerGroup: DefiningWorldBuildingPlotRegistryOwnerGroup,
): string {
  const tileLabel =
    ownerGroup.tileClaimCount === 1
      ? "1 tile"
      : `${ownerGroup.tileClaimCount} tiles`;
  const plotLabel =
    ownerGroup.ownedPlotCount === 1
      ? "1 plot"
      : `${ownerGroup.ownedPlotCount} plots`;

  if (ownerGroup.isLocalPlayer) {
    return RENDERING_WORLD_PLAZA_CLAIM_MODE_LOCAL_OWNER_GROUP_TITLE;
  }

  if (ownerGroup.ownedPlotCount > 1) {
    return `${ownerGroup.ownerDisplayLabel} · ${plotLabel} · ${tileLabel}`;
  }

  return `${ownerGroup.ownerDisplayLabel} · ${tileLabel}`;
}

/**
 * Scrollable list of player plots grouped by owner for claim mode.
 */
export function RenderingWorldPlazaClaimModePlotList({
  ownerGroups,
  activeViewportPlots,
  localUserId,
  localOwnedPlotCount,
  localTileClaimCount,
  plotOwnerLimits,
  isLoading,
  onTeleportToPlotBounds,
  onRequestingFriendPlotVisit,
  onTeleportingToApprovedFriendPlot,
  outgoingVisitRequests = [],
  isRequestingFriendPlotVisit = false,
  onRemoveTemporaryPlotAtTile,
  isRemovingTemporaryPlot = false,
  savedCoordsList,
  trackedSavedCoordsId,
  onToggleSavedCoordsTracking,
  onDeleteSavedCoords,
  isDeletingSavedCoords = false,
}: RenderingWorldPlazaClaimModePlotListProps): React.JSX.Element {
  const savedCoordsCount = savedCoordsList.length;
  const localTemporaryTileClaimCount =
    countingWorldBuildingOwnerTemporaryTileClaims(
      activeViewportPlots,
      localUserId,
    );
  const outgoingRequestsByBoundsKey =
    groupingWorldPlotVisitOutgoingRequestsByBoundsKey(outgoingVisitRequests);
  const pendingHostUserIds = groupingWorldPlotVisitPendingHostUserIds(
    outgoingVisitRequests,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <RenderingWorldPlazaClaimModePlotCapacityBadges
        ownedPlotCount={localOwnedPlotCount}
        tileClaimCount={localTileClaimCount}
        plotOwnerLimits={plotOwnerLimits}
      />
      {isLoading ? (
        <p className="text-[9px] text-white/55">
          {RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_LOADING_MESSAGE}
        </p>
      ) : ownerGroups.length === 0 ? (
        <p className="text-[9px] text-white/55">
          {RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_EMPTY_MESSAGE}
        </p>
      ) : (
        <div
          className={DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_LIST_CLASS_NAME}
        >
          {ownerGroups.map((ownerGroup) => (
            <div
              key={ownerGroup.ownerUserId}
              className={
                DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_CLASS_NAME
              }
            >
              <p
                className={
                  ownerGroup.isLocalPlayer
                    ? DEFINING_WORLD_BUILDING_CLAIM_MODE_LOCAL_OWNER_GROUP_TITLE_CLASS_NAME
                    : DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_TITLE_CLASS_NAME
                }
              >
                {formattingWorldPlazaClaimModeOwnerGroupTitle(ownerGroup)}
              </p>
              <div
                className={
                  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_BADGE_GRID_CLASS_NAME
                }
              >
                {ownerGroup.contiguousRegions.map((contiguousRegion) => {
                  const regionLabel =
                    formattingWorldBuildingPlotRegistryContiguousRegionLabel(
                      contiguousRegion.bounds,
                    );
                  const canTeleportToOwnPlot =
                    ownerGroup.isLocalPlayer &&
                    onTeleportToPlotBounds !== undefined;
                  const visitActionState = ownerGroup.isLocalPlayer
                    ? null
                    : resolvingWorldPlotVisitClaimListActionState(
                        ownerGroup.ownerUserId,
                        contiguousRegion.bounds,
                        outgoingRequestsByBoundsKey,
                        pendingHostUserIds,
                      );

                  return (
                    <div
                      key={formattingWorldPlazaClaimModeContiguousRegionKey(
                        ownerGroup.ownerUserId,
                        contiguousRegion.bounds,
                      )}
                      className={
                        RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_ROW_CLASS_NAME
                      }
                    >
                      <Badge
                        variant="outline"
                        title={regionLabel}
                        className={cn(
                          DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_BADGE_CLASS_NAME,
                          "flex-1",
                          ownerGroup.isLocalPlayer
                            ? DEFINING_WORLD_BUILDING_CLAIM_MODE_LOCAL_PLOT_BADGE_CLASS_NAME
                            : DEFINING_WORLD_BUILDING_CLAIM_MODE_OTHER_PLOT_BADGE_CLASS_NAME,
                        )}
                      >
                        {regionLabel}
                      </Badge>
                      {canTeleportToOwnPlot ? (
                        <button
                          type="button"
                          aria-label={`Teleport to ${regionLabel}`}
                          title={`Teleport to ${regionLabel}`}
                          onClick={() => {
                            onTeleportToPlotBounds(contiguousRegion.bounds);
                          }}
                          className={
                            DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_TELEPORT_BUTTON_CLASS_NAME
                          }
                        >
                          {RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_TELEPORT_LABEL}
                        </button>
                      ) : null}
                      {visitActionState?.kind === "visit" ? (
                        <button
                          type="button"
                          aria-label={`Request visit to ${regionLabel}`}
                          title={`Request visit to ${regionLabel}`}
                          disabled={
                            isRequestingFriendPlotVisit ||
                            onRequestingFriendPlotVisit === undefined
                          }
                          onClick={() => {
                            onRequestingFriendPlotVisit?.(
                              ownerGroup.ownerUserId,
                              ownerGroup.ownerDisplayLabel,
                              contiguousRegion.bounds,
                            );
                          }}
                          className={
                            DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_VISIT_BUTTON_CLASS_NAME
                          }
                        >
                          {LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_VISIT_BUTTON}
                        </button>
                      ) : null}
                      {visitActionState?.kind === "pending" ? (
                        <button
                          type="button"
                          disabled
                          aria-label={`Visit request pending for ${regionLabel}`}
                          title={`Visit request pending for ${regionLabel}`}
                          className={
                            DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_VISIT_BUTTON_CLASS_NAME
                          }
                        >
                          {LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_PENDING_BUTTON}
                        </button>
                      ) : null}
                      {visitActionState?.kind === "go" &&
                      visitActionState.requestId &&
                      onTeleportingToApprovedFriendPlot ? (
                        <button
                          type="button"
                          aria-label={`Teleport to ${regionLabel}`}
                          title={`Teleport to ${regionLabel}`}
                          onClick={() => {
                            onTeleportingToApprovedFriendPlot(
                              contiguousRegion.bounds,
                              visitActionState.requestId as string,
                            );
                          }}
                          className={
                            DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_TELEPORT_BUTTON_CLASS_NAME
                          }
                        >
                          {RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_TELEPORT_LABEL}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <RenderingWorldPlazaClaimModeTemporaryTilesList
        activeViewportPlots={activeViewportPlots}
        localUserId={localUserId}
        temporaryTileClaimCount={localTemporaryTileClaimCount}
        plotOwnerLimits={plotOwnerLimits}
        onRemoveTemporaryPlotAtTile={onRemoveTemporaryPlotAtTile}
        isRemovingTemporaryPlot={isRemovingTemporaryPlot}
      />

      <div className="flex flex-col gap-1.5 border-t border-white/10 pt-2">
        <p
          className={
            DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME
          }
        >
          {DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SECTION_LABEL} (
          {savedCoordsCount})
        </p>
        {!savedCoordsCount ? (
          <p
            className={
              DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_TEXT_CLASS_NAME
            }
          >
            {DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_MESSAGE}
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {savedCoordsList.map((savedCoords) => {
              const savedCoordsLabel =
                formattingWorldPlazaSavedCoordsLabel(savedCoords);
              const isTrackingSavedCoords =
                trackedSavedCoordsId === savedCoords.savedCoordsId;

              return (
                <div
                  key={savedCoords.savedCoordsId}
                  className={
                    DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME
                  }
                >
                  <button
                    type="button"
                    {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                    aria-label={`${LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON} ${savedCoordsLabel}`}
                    title={`${LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON} ${savedCoordsLabel}`}
                    disabled={isDeletingSavedCoords}
                    onClick={() => {
                      onDeleteSavedCoords(savedCoords.savedCoordsId);
                    }}
                    className={
                      DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON_CLASS_NAME
                    }
                  >
                    <X
                      className={
                        DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_ICON_CLASS_NAME
                      }
                      aria-hidden
                    />
                  </button>
                  <Badge
                    variant="outline"
                    title={savedCoordsLabel}
                    className={cn(
                      DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_BADGE_CLASS_NAME,
                      "flex-1",
                    )}
                  >
                    {savedCoordsLabel}
                  </Badge>
                  <button
                    type="button"
                    {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                    aria-label={`Track saved coordinates ${savedCoordsLabel}`}
                    aria-pressed={isTrackingSavedCoords}
                    title={`Track saved coordinates ${savedCoordsLabel}`}
                    onClick={() => {
                      onToggleSavedCoordsTracking(savedCoords.savedCoordsId);
                    }}
                    className={
                      isTrackingSavedCoords
                        ? DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME
                        : DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_CLASS_NAME
                    }
                  >
                    {DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
