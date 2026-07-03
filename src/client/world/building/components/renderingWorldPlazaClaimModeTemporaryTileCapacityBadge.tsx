"use client";

import { RenderingWorldPlazaClaimModePlotCapacityBadges } from "@/components/world/building/components/renderingWorldPlazaClaimModePlotCapacityBadges";
import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_MAX_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_VALUE_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Temporary tile capacity badge label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_TEMPORARY_CAPACITY_BADGE_LABEL =
  "Temporary Tiles" as const;

export interface RenderingWorldPlazaClaimModeTemporaryTileCapacityBadgeProps {
  temporaryTileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
}

/**
 * Capacity badge for temporary build tiles in claim mode.
 */
export function RenderingWorldPlazaClaimModeTemporaryTileCapacityBadge({
  temporaryTileClaimCount,
  plotOwnerLimits,
}: RenderingWorldPlazaClaimModeTemporaryTileCapacityBadgeProps): React.JSX.Element {
  const maxTemporaryTileCount = plotOwnerLimits.maxTemporaryTileCount;
  const isAtMax = temporaryTileClaimCount >= maxTemporaryTileCount;

  return (
    <div
      aria-label={`${RENDERING_WORLD_PLAZA_CLAIM_MODE_TEMPORARY_CAPACITY_BADGE_LABEL}: ${temporaryTileClaimCount} of ${maxTemporaryTileCount} used`}
      className={DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME}
    >
      <Badge
        variant="outline"
        title={`${RENDERING_WORLD_PLAZA_CLAIM_MODE_TEMPORARY_CAPACITY_BADGE_LABEL}: ${temporaryTileClaimCount} of ${maxTemporaryTileCount} used`}
        className={cn(
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME,
          "w-full",
          isAtMax
            ? DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_CLASS_NAME
            : DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_CLASS_NAME,
        )}
      >
        <span
          className={cn(
            DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME,
            isAtMax
              ? DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_LABEL_CLASS_NAME
              : DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL_CLASS_NAME,
          )}
        >
          {RENDERING_WORLD_PLAZA_CLAIM_MODE_TEMPORARY_CAPACITY_BADGE_LABEL}
        </span>
        <span
          className={cn(
            DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME,
            isAtMax
              ? DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_VALUE_CLASS_NAME
              : DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_VALUE_CLASS_NAME,
          )}
        >
          {temporaryTileClaimCount}
          <span
            className={
              DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_MAX_VALUE_CLASS_NAME
            }
          >
            /{maxTemporaryTileCount}
          </span>
        </span>
      </Badge>
    </div>
  );
}
