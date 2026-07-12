'use client';

import { Badge } from '@/components/ui/badge';
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
} from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import { type DefiningWorldBuildingPlotRegistryOwnerGroup } from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner';
import { formattingWorldBuildingPlotRegistryContiguousRegionLabel } from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions';
import {
  LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_PENDING_BUTTON,
  LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_VISIT_BUTTON,
  type WorldPlotVisitRequestOutgoingListMember,
} from '@/components/world/plotVisit/domains/definingWorldPlotVisitRequest';
import {
  groupingWorldPlotVisitOutgoingRequestsByBoundsKey,
  groupingWorldPlotVisitPendingHostUserIds,
  resolvingWorldPlotVisitClaimListActionState,
} from '@/components/world/plotVisit/domains/resolvingWorldPlotVisitClaimListActionState';
import { cn } from '@/lib/utils';

/** Empty registry message. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_EMPTY_MESSAGE =
  'No plots to show yet.' as const;

/** Loading registry message. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_LOADING_MESSAGE =
  'Loading plots...' as const;

/** Teleport action label for local plot rows. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_TELEPORT_LABEL =
  'Teleport to Plot' as const;

/** Plot row layout classes. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_ROW_CLASS_NAME =
  'flex min-w-0 items-center gap-1' as const;

/** Local owner row title. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_LOCAL_OWNER_GROUP_TITLE = 'You' as const;

export interface RenderingWorldPlazaClaimModePlotListProps {
  ownerGroups: DefiningWorldBuildingPlotRegistryOwnerGroup[];
  isLoading: boolean;
  onTeleportToPlotBounds?: (bounds: DefiningWorldBuildingPlotBounds) => void;
  onRequestingFriendPlotVisit?: (
    hostUserId: string,
    hostDisplayName: string,
    bounds: DefiningWorldBuildingPlotBounds
  ) => void;
  onTeleportingToApprovedFriendPlot?: (
    bounds: DefiningWorldBuildingPlotBounds,
    requestId: string
  ) => void;
  outgoingVisitRequests?: readonly WorldPlotVisitRequestOutgoingListMember[];
  isRequestingFriendPlotVisit?: boolean;
}

/** Builds a stable React key for one contiguous region badge. */
function formattingWorldPlazaClaimModeContiguousRegionKey(
  ownerUserId: string,
  bounds: DefiningWorldBuildingPlotBounds
): string {
  return `${ownerUserId}:${bounds.minTileX},${bounds.minTileY},${bounds.maxTileX},${bounds.maxTileY}`;
}

/**
 * Formats the owner group title with plot and tile counts.
 *
 * @param ownerGroup - Registry owner row.
 */
function formattingWorldPlazaClaimModeOwnerGroupTitle(
  ownerGroup: DefiningWorldBuildingPlotRegistryOwnerGroup
): string {
  const tileLabel =
    ownerGroup.tileClaimCount === 1
      ? '1 tile'
      : `${ownerGroup.tileClaimCount} tiles`;
  const plotLabel =
    ownerGroup.ownedPlotCount === 1
      ? '1 plot'
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
  isLoading,
  onTeleportToPlotBounds,
  onRequestingFriendPlotVisit,
  onTeleportingToApprovedFriendPlot,
  outgoingVisitRequests = [],
  isRequestingFriendPlotVisit = false,
}: RenderingWorldPlazaClaimModePlotListProps): React.JSX.Element {
  const outgoingRequestsByBoundsKey =
    groupingWorldPlotVisitOutgoingRequestsByBoundsKey(outgoingVisitRequests);
  const pendingHostUserIds = groupingWorldPlotVisitPendingHostUserIds(
    outgoingVisitRequests
  );

  if (isLoading) {
    return (
      <p className="text-[9px] text-white/55">
        {RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_LOADING_MESSAGE}
      </p>
    );
  }

  if (ownerGroups.length === 0) {
    return (
      <p className="text-[9px] text-white/55">
        {RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_LIST_EMPTY_MESSAGE}
      </p>
    );
  }

  return (
    <div className={DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_LIST_CLASS_NAME}>
      {ownerGroups.map((ownerGroup) => (
        <div
          key={ownerGroup.ownerUserId}
          className={DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_CLASS_NAME}
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
                  contiguousRegion.bounds
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
                    pendingHostUserIds
                  );

              return (
                <div
                  key={formattingWorldPlazaClaimModeContiguousRegionKey(
                    ownerGroup.ownerUserId,
                    contiguousRegion.bounds
                  )}
                  className={RENDERING_WORLD_PLAZA_CLAIM_MODE_PLOT_ROW_CLASS_NAME}
                >
                  <Badge
                    variant="outline"
                    title={regionLabel}
                    className={cn(
                      DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_BADGE_CLASS_NAME,
                      'flex-1',
                      ownerGroup.isLocalPlayer
                        ? DEFINING_WORLD_BUILDING_CLAIM_MODE_LOCAL_PLOT_BADGE_CLASS_NAME
                        : DEFINING_WORLD_BUILDING_CLAIM_MODE_OTHER_PLOT_BADGE_CLASS_NAME
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
                  {visitActionState?.kind === 'visit' ? (
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
                          contiguousRegion.bounds
                        );
                      }}
                      className={
                        DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_VISIT_BUTTON_CLASS_NAME
                      }
                    >
                      {LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_VISIT_BUTTON}
                    </button>
                  ) : null}
                  {visitActionState?.kind === 'pending' ? (
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
                  {visitActionState?.kind === 'go' &&
                  visitActionState.requestId &&
                  onTeleportingToApprovedFriendPlot ? (
                    <button
                      type="button"
                      aria-label={`Teleport to ${regionLabel}`}
                      title={`Teleport to ${regionLabel}`}
                      onClick={() => {
                        onTeleportingToApprovedFriendPlot(
                          contiguousRegion.bounds,
                          visitActionState.requestId as string
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
  );
}
