'use client';

import { RenderingWorldPlazaClaimModePlotList } from '@/components/world/building/components/renderingWorldPlazaClaimModePlotList';
import { RenderingWorldPlazaClaimModeSavedCoordsList } from '@/components/world/building/components/renderingWorldPlazaClaimModeSavedCoordsList';
import { RenderingWorldPlazaClaimModeTemporaryTilesList } from '@/components/world/building/components/renderingWorldPlazaClaimModeTemporaryTilesList';
import { countingWorldBuildingOwnerTemporaryTileClaims } from '@/components/world/building/domains/countingWorldBuildingOwnerTemporaryTileClaims';
import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_ERROR_TEXT_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_CLAIMABLE_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OTHER_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OWNED_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_TEMPORARY_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_WIDTH_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import { DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_KEY } from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED } from '@/components/world/building/domains/definingWorldTemporaryPlotFeatureFlag';
import type { DefiningWorldBuildingPlotRegistryOwnerGroup } from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner';
import { RenderingWorldPlazaSidebarPanelHeader } from '@/components/world/components/renderingWorldPlazaSidebarPanelHeader';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaSavedCoords } from '@/components/world/domains/definingWorldPlazaSavedCoords';
import type { WorldPlotVisitRequestOutgoingListMember } from '@/components/world/plotVisit/domains/definingWorldPlotVisitRequest';

/** Claim mode sidebar header copy. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_SIDEBAR_TITLE = 'Claim' as const;

/** Claim mode sidebar header classes. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_SIDEBAR_HEADER_CLASS_NAME =
  'text-[10px] font-semibold uppercase tracking-wide text-sky-100' as const;

/** Claim mode legend row classes. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME =
  'flex items-center gap-1.5' as const;

export interface RenderingWorldPlazaClaimModePanelProps {
  isClaimModeActive: boolean;
  hasUnsavedClaimChanges: boolean;
  isSavingClaimDraft: boolean;
  claimErrorMessage: string | null;
  ownerGroups: DefiningWorldBuildingPlotRegistryOwnerGroup[];
  activeViewportPlots: readonly DefiningWorldBuildingPlot[];
  localUserId: string;
  localOwnedPlotCount: number;
  localTileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  isPlotRegistryLoading: boolean;
  plotRegistryErrorMessage: string | null;
  onToggleClaimMode: () => void;
  onSaveClaimDraft: () => void;
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
  onRemoveTemporaryPlotAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition
  ) => void;
  isRemovingTemporaryPlot?: boolean;
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[];
  trackedSavedCoordsId: string | null;
  onToggleSavedCoordsTracking: (savedCoordsId: string) => void;
  onDeleteSavedCoords: (savedCoordsId: string) => void;
  isDeletingSavedCoords?: boolean;
}

/**
 * Right-side claim mode panel with plot registry list and save controls.
 */
export function RenderingWorldPlazaClaimModePanel({
  isClaimModeActive,
  claimErrorMessage,
  ownerGroups,
  activeViewportPlots,
  localUserId,
  plotOwnerLimits,
  isPlotRegistryLoading,
  plotRegistryErrorMessage,
  onToggleClaimMode,
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
}: RenderingWorldPlazaClaimModePanelProps): React.JSX.Element | null {
  if (!isClaimModeActive) {
    return null;
  }

  const localTemporaryTileClaimCount =
    countingWorldBuildingOwnerTemporaryTileClaims(
      activeViewportPlots,
      localUserId
    );

  return (
    <div
      className={`${DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_ANCHOR_CLASS_NAME} ${DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_WIDTH_CLASS_NAME}`}
    >
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={`${DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_CLASS_NAME} ${DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_WIDTH_CLASS_NAME}`}
      >
        <RenderingWorldPlazaSidebarPanelHeader
          panelTitle={RENDERING_WORLD_PLAZA_CLAIM_MODE_SIDEBAR_TITLE}
          shortcutKey={DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_KEY}
          titleClassName={
            RENDERING_WORLD_PLAZA_CLAIM_MODE_SIDEBAR_HEADER_CLASS_NAME
          }
          onExit={onToggleClaimMode}
          exitAriaLabel="Exit claim mode"
        />

        <div className="flex flex-col gap-1">
          <div
            className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}
          >
            <span
              aria-hidden
              className={
                DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OWNED_SWATCH_CLASS_NAME
              }
            />
            <span
              className={
                DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME
              }
            >
              Your plot
            </span>
          </div>
          <div
            className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}
          >
            <span
              aria-hidden
              className={
                DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_CLAIMABLE_SWATCH_CLASS_NAME
              }
            />
            <span
              className={
                DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME
              }
            >
              Can claim
            </span>
          </div>
          {DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED ? (
            <div
              className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}
            >
              <span
                aria-hidden
                className={
                  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_TEMPORARY_SWATCH_CLASS_NAME
                }
              />
              <span
                className={
                  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME
                }
              >
                Temporary tiles
              </span>
            </div>
          ) : null}
          <div
            className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}
          >
            <span
              aria-hidden
              className={
                DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OTHER_SWATCH_CLASS_NAME
              }
            />
            <span
              className={
                DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME
              }
            >
              Friends&apos; plots
            </span>
          </div>
        </div>

        <RenderingWorldPlazaClaimModePlotList
          ownerGroups={ownerGroups}
          isLoading={isPlotRegistryLoading}
          plotCardColumnCount={2}
          onTeleportToPlotBounds={onTeleportToPlotBounds}
          onRequestingFriendPlotVisit={onRequestingFriendPlotVisit}
          onTeleportingToApprovedFriendPlot={onTeleportingToApprovedFriendPlot}
          outgoingVisitRequests={outgoingVisitRequests}
          isRequestingFriendPlotVisit={isRequestingFriendPlotVisit}
        />

        <RenderingWorldPlazaClaimModeTemporaryTilesList
          activeViewportPlots={activeViewportPlots}
          localUserId={localUserId}
          temporaryTileClaimCount={localTemporaryTileClaimCount}
          plotOwnerLimits={plotOwnerLimits}
          onRemoveTemporaryPlotAtTile={onRemoveTemporaryPlotAtTile}
          isRemovingTemporaryPlot={isRemovingTemporaryPlot}
        />

        <RenderingWorldPlazaClaimModeSavedCoordsList
          savedCoordsList={savedCoordsList}
          trackedSavedCoordsId={trackedSavedCoordsId}
          onToggleSavedCoordsTracking={onToggleSavedCoordsTracking}
          onDeleteSavedCoords={onDeleteSavedCoords}
          isDeletingSavedCoords={isDeletingSavedCoords}
        />

        {claimErrorMessage ? (
          <p
            className={DEFINING_WORLD_BUILDING_CLAIM_MODE_ERROR_TEXT_CLASS_NAME}
          >
            {claimErrorMessage}
          </p>
        ) : null}
        {plotRegistryErrorMessage ? (
          <p
            className={DEFINING_WORLD_BUILDING_CLAIM_MODE_ERROR_TEXT_CLASS_NAME}
          >
            {plotRegistryErrorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
