'use client';

import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_CLAIMABLE_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OTHER_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OWNED_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_TEMPORARY_SWATCH_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';

/** One legend row layout. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME =
  'flex items-center gap-1.5' as const;

/**
 * Claim-mode color legend for plot overlay swatches.
 */
export function RenderingWorldPlazaClaimModeLegendPanel(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}>
        <span
          aria-hidden
          className={
            DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OWNED_SWATCH_CLASS_NAME
          }
        />
        <span
          className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME}
        >
          Your plot
        </span>
      </div>
      <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}>
        <span
          aria-hidden
          className={
            DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_CLAIMABLE_SWATCH_CLASS_NAME
          }
        />
        <span
          className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME}
        >
          Can claim
        </span>
      </div>
      <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}>
        <span
          aria-hidden
          className={
            DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_TEMPORARY_SWATCH_CLASS_NAME
          }
        />
        <span
          className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME}
        >
          Temporary tiles
        </span>
      </div>
      <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_LEGEND_ROW_CLASS_NAME}>
        <span
          aria-hidden
          className={
            DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OTHER_SWATCH_CLASS_NAME
          }
        />
        <span
          className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME}
        >
          Friends&apos; plots
        </span>
      </div>
    </div>
  );
}
