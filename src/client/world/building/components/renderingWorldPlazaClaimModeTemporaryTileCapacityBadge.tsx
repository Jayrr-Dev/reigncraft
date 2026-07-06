'use client';

import { DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS } from '@/components/ui/domains/definingReigncraftBadgeConstants';
import { RenderingReigncraftCapacityBadge } from '@/components/ui/renderingReigncraftCapacityBadge';
import { DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME } from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';

/** Temporary tile capacity badge label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_TEMPORARY_CAPACITY_BADGE_LABEL =
  'Temporary Tiles' as const;

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
  const tilePreset =
    DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.temporaryTileCapacity;

  return (
    <div
      aria-label={`${RENDERING_WORLD_PLAZA_CLAIM_MODE_TEMPORARY_CAPACITY_BADGE_LABEL}: ${temporaryTileClaimCount} of ${maxTemporaryTileCount} used`}
      className={
        DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME
      }
    >
      <RenderingReigncraftCapacityBadge
        label={RENDERING_WORLD_PLAZA_CLAIM_MODE_TEMPORARY_CAPACITY_BADGE_LABEL}
        currentCount={temporaryTileClaimCount}
        maxCount={maxTemporaryTileCount}
        isAtMax={isAtMax}
        color={tilePreset.color}
        shade={tilePreset.shade}
        className="w-full"
      />
    </div>
  );
}
