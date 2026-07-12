"use client";

import { RenderingWorldPlazaClaimModeTemporaryTileCapacityBadge } from "@/components/world/building/components/renderingWorldPlazaClaimModeTemporaryTileCapacityBadge";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import {
  DEFINING_WORLD_TEMPORARY_PLOT_LIST_BADGE_CLASS_NAME,
  DEFINING_WORLD_TEMPORARY_PLOT_LIST_DELETE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_TEMPORARY_PLOT_LIST_DELETE_ICON_CLASS_NAME,
  DEFINING_WORLD_TEMPORARY_PLOT_LIST_EMPTY_MESSAGE,
  DEFINING_WORLD_TEMPORARY_PLOT_LIST_EMPTY_TEXT_CLASS_NAME,
  DEFINING_WORLD_TEMPORARY_PLOT_LIST_ROW_CLASS_NAME,
  LABELING_WORLD_TEMPORARY_PLOT_LIST_DELETE_BUTTON,
} from "@/components/world/building/domains/definingWorldTemporaryPlotUiConstants";
import { formattingWorldBuildingPlotRegistryContiguousRegionLabel } from "@/components/world/building/domains/groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions";
import { listingWorldBuildingTemporaryPlotsForOwner } from "@/components/world/building/domains/listingWorldBuildingTemporaryPlotsForOwner";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface RenderingWorldPlazaClaimModeTemporaryTilesListProps {
  activeViewportPlots: readonly DefiningWorldBuildingPlot[];
  localUserId: string;
  temporaryTileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  onRemoveTemporaryPlotAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition,
  ) => void;
  isRemovingTemporaryPlot?: boolean;
}

/**
 * Temporary tiles section for claim mode, above saved coordinates.
 */
export function RenderingWorldPlazaClaimModeTemporaryTilesList({
  activeViewportPlots,
  localUserId,
  temporaryTileClaimCount,
  plotOwnerLimits,
  onRemoveTemporaryPlotAtTile,
  isRemovingTemporaryPlot = false,
}: RenderingWorldPlazaClaimModeTemporaryTilesListProps): React.JSX.Element {
  const temporaryPlots = listingWorldBuildingTemporaryPlotsForOwner(
    activeViewportPlots,
    localUserId,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <RenderingWorldPlazaClaimModeTemporaryTileCapacityBadge
        temporaryTileClaimCount={temporaryTileClaimCount}
        plotOwnerLimits={plotOwnerLimits}
      />
      {!temporaryPlots.length ? (
        <p className={DEFINING_WORLD_TEMPORARY_PLOT_LIST_EMPTY_TEXT_CLASS_NAME}>
          {DEFINING_WORLD_TEMPORARY_PLOT_LIST_EMPTY_MESSAGE}
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {temporaryPlots.map((temporaryPlot) => {
            const tilePosition: DefiningWorldBuildingTilePosition = {
              tileX: temporaryPlot.bounds.minTileX,
              tileY: temporaryPlot.bounds.minTileY,
            };
            const regionLabel = formattingWorldBuildingPlotRegistryContiguousRegionLabel(
              temporaryPlot.bounds,
            );

            return (
              <div
                key={temporaryPlot.plotId}
                className={DEFINING_WORLD_TEMPORARY_PLOT_LIST_ROW_CLASS_NAME}
              >
                <button
                  type="button"
                  {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                  aria-label={`${LABELING_WORLD_TEMPORARY_PLOT_LIST_DELETE_BUTTON} ${regionLabel}`}
                  title={`${LABELING_WORLD_TEMPORARY_PLOT_LIST_DELETE_BUTTON} ${regionLabel}`}
                  disabled={isRemovingTemporaryPlot}
                  onClick={() => {
                    onRemoveTemporaryPlotAtTile(tilePosition);
                  }}
                  className={DEFINING_WORLD_TEMPORARY_PLOT_LIST_DELETE_BUTTON_CLASS_NAME}
                >
                  <X
                    className={DEFINING_WORLD_TEMPORARY_PLOT_LIST_DELETE_ICON_CLASS_NAME}
                    aria-hidden
                  />
                </button>
                <Badge
                  variant="outline"
                  title={regionLabel}
                  className={cn(
                    DEFINING_WORLD_TEMPORARY_PLOT_LIST_BADGE_CLASS_NAME,
                    "flex-1",
                  )}
                >
                  {regionLabel}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
