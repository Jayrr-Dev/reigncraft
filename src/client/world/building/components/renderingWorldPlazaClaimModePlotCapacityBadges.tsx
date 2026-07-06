'use client';

import { DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS } from '@/components/ui/domains/definingReigncraftBadgeConstants';
import { RenderingReigncraftCapacityBadge } from '@/components/ui/renderingReigncraftCapacityBadge';
import { DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME } from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import {
  formattingWorldPlazaClaimModeLocalPlotCapacitySectionLabel,
  resolvingWorldPlazaClaimModeLocalPlotCapacity,
  type FormattingWorldPlazaClaimModeLocalPlotCapacityInput,
} from '@/components/world/building/domains/formattingWorldPlazaClaimModeLocalPlotCapacityLabel';

/** Plot capacity badge label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_PLOT_BADGE_LABEL =
  'Plots' as const;

/** Tile capacity badge label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL =
  'Tiles' as const;

export interface RenderingWorldPlazaClaimModePlotCapacityBadgesProps {
  ownedPlotCount: number;
  tileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
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

  const plotPreset = DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.plotCapacity;
  const tilePreset = DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.tileCapacity;

  return (
    <div
      aria-label={formattingWorldPlazaClaimModeLocalPlotCapacitySectionLabel(
        capacity
      )}
      className={
        DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME
      }
    >
      <RenderingReigncraftCapacityBadge
        label={RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_PLOT_BADGE_LABEL}
        currentCount={capacity.ownedPlotCount}
        maxCount={capacity.maxOwnedPlotCount}
        isAtMax={capacity.isPlotCapacityReached}
        color={plotPreset.color}
        shade={plotPreset.shade}
        className="w-full"
      />
      <RenderingReigncraftCapacityBadge
        label={RENDERING_WORLD_PLAZA_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL}
        currentCount={capacity.tileClaimCount}
        maxCount={capacity.maxTileClaimCount}
        isAtMax={capacity.isTileCapacityReached}
        color={tilePreset.color}
        shade={tilePreset.shade}
        className="w-full"
      />
    </div>
  );
}
