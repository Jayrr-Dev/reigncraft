'use client';

/**
 * Clickable hunger sphere for the plaza action bar: brown fill drains
 * downward with a tiered drumstick sprite and a 3D bronze ring.
 *
 * @module components/world/hunger/components/renderingWorldPlazaHungerIndicator
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { LABELING_WORLD_PLAZA_ACTION_BAR_HUNGER } from '@/components/world/hunger/domains/definingWorldPlazaHungerPanelConstants';
import { resolvingWorldPlazaHungerFillColors } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerFillColor';
import {
  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
  STYLING_WORLD_PLAZA_HUNGER_INDICATOR_FILL_DISC_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_INDICATOR_ORB_CLASS_NAME,
  resolvingWorldPlazaHungerIndicatorViewportStyles,
} from '@/components/world/hunger/domains/resolvingWorldPlazaHungerIndicatorViewportStyles';
import { resolvingWorldPlazaHungerTierSpriteIconStyle } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerTierSpriteIconStyle';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';

/** Props for {@link RenderingWorldPlazaHungerIndicator}. */
export interface RenderingWorldPlazaHungerIndicatorProps {
  /** Current hunger as a 0..1 ratio. */
  hungerRatio: number;
  /** Named hunger tier for accessible labeling. */
  tier: DefiningWorldPlazaHungerTier;
  /** True while starvation is actively draining health. */
  isStarving: boolean;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, applies the action bar mobile shrink. */
  isMobile?: boolean;
  /** Whether the hunger status panel is open. */
  isOpen?: boolean;
  /** Toggles the hunger status panel. */
  onToggle?: () => void;
}

/** Human-readable label per tier for the accessible name. */
const RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TIER_LABEL: Record<
  DefiningWorldPlazaHungerTier,
  string
> = {
  well_fed: 'Well fed',
  content: 'Fed',
  peckish: 'Peckish',
  hungry: 'Hungry',
  starving: 'Starving',
};

/**
 * Circular hunger orb with brown fill that drops as hunger drains.
 * Drumstick sprite swaps by named hunger tier.
 */
export const RenderingWorldPlazaHungerIndicator = memo(
  function RenderingWorldPlazaHungerIndicator({
    hungerRatio,
    tier,
    isStarving,
    viewportHudScale = 1,
    isMobile = false,
    isOpen = false,
    onToggle,
  }: RenderingWorldPlazaHungerIndicatorProps): React.JSX.Element {
    const viewportStyles = useMemo(
      () =>
        resolvingWorldPlazaHungerIndicatorViewportStyles(
          viewportHudScale,
          isMobile
        ),
      [viewportHudScale, isMobile]
    );
    const clampedRatio = Math.min(1, Math.max(0, hungerRatio));
    const fillColors = useMemo(
      () => resolvingWorldPlazaHungerFillColors(clampedRatio),
      [clampedRatio]
    );
    const tierSpriteStyle = useMemo(
      () =>
        resolvingWorldPlazaHungerTierSpriteIconStyle(
          tier,
          viewportStyles.iconSizePx
        ),
      [tier, viewportStyles.iconSizePx]
    );
    const label = RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TIER_LABEL[tier];
    const hungerPercent = Math.round(clampedRatio * 100);
    const statusLabel = isStarving ? `${label}, starving` : label;
    const ariaLabel = `${LABELING_WORLD_PLAZA_ACTION_BAR_HUNGER}: ${statusLabel}, ${hungerPercent}%`;

    return (
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={cn(
          STYLING_WORLD_PLAZA_HUNGER_INDICATOR_ORB_CLASS_NAME,
          isOpen && 'plaza-hunger-orb--open'
        )}
        style={viewportStyles.sphereStyle}
        aria-label={ariaLabel}
        aria-pressed={isOpen}
        aria-expanded={isOpen}
        title={ariaLabel}
        onClick={onToggle}
      >
        <span
          className={STYLING_WORLD_PLAZA_HUNGER_INDICATOR_FILL_DISC_CLASS_NAME}
          style={{
            backgroundColor:
              DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
          }}
          aria-hidden="true"
        >
          <span
            className="absolute inset-x-0 bottom-0 transition-[height,background] duration-200 ease-out"
            style={{
              height: `${clampedRatio * 100}%`,
              background: fillColors.fillBackgroundCss,
            }}
          />
        </span>
        <span
          className="relative z-10 shrink-0"
          style={tierSpriteStyle}
          aria-hidden
        />
      </button>
    );
  }
);
