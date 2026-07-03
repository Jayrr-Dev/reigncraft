"use client";

import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_MAX_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_VALUE_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import {
  formattingWorldPlazaClaimModeLocalPlotCapacitySectionLabel,
  resolvingWorldPlazaClaimModeLocalPlotCapacity,
  type FormattingWorldPlazaClaimModeLocalPlotCapacityInput,
} from "@/components/world/building/domains/formattingWorldPlazaClaimModeLocalPlotCapacityLabel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Plot capacity badge label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_PLOT_BADGE_LABEL =
  "Plots" as const;

/** Tile capacity badge label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL =
  "Tiles" as const;

export interface RenderingWorldPlazaClaimModePlotCapacityBadgesProps {
  ownedPlotCount: number;
  tileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
}

/** Props for one claim capacity badge. */
interface RenderingWorldPlazaClaimModePlotCapacityBadgeProps {
  label: string;
  currentCount: number;
  maxCount: number;
  isAtMax: boolean;
  defaultClassName: string;
  defaultLabelClassName: string;
  defaultValueClassName: string;
}

/**
 * Renders one plot or tile capacity badge with high-contrast counts.
 *
 * @param props - Badge label, counts, and theme classes.
 */
function RenderingWorldPlazaClaimModePlotCapacityBadge({
  label,
  currentCount,
  maxCount,
  isAtMax,
  defaultClassName,
  defaultLabelClassName,
  defaultValueClassName,
}: RenderingWorldPlazaClaimModePlotCapacityBadgeProps): React.JSX.Element {
  return (
    <Badge
      variant="outline"
      aria-label={`${label}: ${currentCount} of ${maxCount} used`}
      title={`${label}: ${currentCount} of ${maxCount} used`}
      className={cn(
        DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME,
        "w-full",
        isAtMax
          ? DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_CLASS_NAME
          : defaultClassName,
      )}
    >
      <span
        className={cn(
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME,
          isAtMax
            ? DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_LABEL_CLASS_NAME
            : defaultLabelClassName,
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME,
          isAtMax
            ? DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_VALUE_CLASS_NAME
            : defaultValueClassName,
        )}
      >
        {currentCount}
        <span
          className={
            DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_MAX_VALUE_CLASS_NAME
          }
        >
          /{maxCount}
        </span>
      </span>
    </Badge>
  );
}

/**
 * Prominent plot and tile capacity badges for claim mode.
 *
 * @param props - Current local plot and tile claim counts.
 */
export function RenderingWorldPlazaClaimModePlotCapacityBadges({
  ownedPlotCount,
  tileClaimCount,
  plotOwnerLimits,
}: RenderingWorldPlazaClaimModePlotCapacityBadgesProps): React.JSX.Element {
  const capacity = resolvingWorldPlazaClaimModeLocalPlotCapacity({
    ownedPlotCount,
    tileClaimCount,
    plotOwnerLimits,
  } satisfies FormattingWorldPlazaClaimModeLocalPlotCapacityInput);

  return (
    <div
      aria-label={formattingWorldPlazaClaimModeLocalPlotCapacitySectionLabel(
        capacity,
      )}
      className={DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME}
    >
      <RenderingWorldPlazaClaimModePlotCapacityBadge
        label={RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_PLOT_BADGE_LABEL}
        currentCount={capacity.ownedPlotCount}
        maxCount={capacity.maxOwnedPlotCount}
        isAtMax={capacity.isPlotCapacityReached}
        defaultClassName={
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_CLASS_NAME
        }
        defaultLabelClassName={
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_LABEL_CLASS_NAME
        }
        defaultValueClassName={
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_VALUE_CLASS_NAME
        }
      />
      <RenderingWorldPlazaClaimModePlotCapacityBadge
        label={RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL}
        currentCount={capacity.tileClaimCount}
        maxCount={capacity.maxTileClaimCount}
        isAtMax={capacity.isTileCapacityReached}
        defaultClassName={
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_CLASS_NAME
        }
        defaultLabelClassName={
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL_CLASS_NAME
        }
        defaultValueClassName={
          DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_VALUE_CLASS_NAME
        }
      />
    </div>
  );
}
