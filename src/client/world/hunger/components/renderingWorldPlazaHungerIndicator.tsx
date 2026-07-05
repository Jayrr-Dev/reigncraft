'use client';

/**
 * Persistent hunger row shown above the plaza hotbar.
 *
 * @module components/world/hunger/components/renderingWorldPlazaHungerIndicator
 */

import { Icon } from '@/components/ui/icon';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import {
  type DefiningWorldPlazaHungerIconFillState,
  listingWorldPlazaHungerIconFillStates,
} from '@/components/world/hunger/domains/listingWorldPlazaHungerIconFillStates';
import {
  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR,
  resolvingWorldPlazaHungerIndicatorViewportStyles,
} from '@/components/world/hunger/domains/resolvingWorldPlazaHungerIndicatorViewportStyles';
import { useMemo } from 'react';

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
}

const RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_ROW_CLASS =
  'flex w-full items-center justify-between';

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

type RenderingWorldPlazaHungerFoodIconProps = {
  fill: DefiningWorldPlazaHungerIconFillState;
  iconSizePx: number;
};

function RenderingWorldPlazaHungerFoodIcon({
  fill,
  iconSizePx,
}: RenderingWorldPlazaHungerFoodIconProps): React.JSX.Element {
  const iconStyle = {
    filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.65))',
  } as const;

  if (fill === 0) {
    return (
      <Icon
        icon="mdi:food-drumstick"
        aria-hidden
        className="shrink-0"
        style={{
          ...iconStyle,
          color: DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
        }}
        width={iconSizePx}
        height={iconSizePx}
      />
    );
  }

  return (
    <div
      className="relative shrink-0"
      style={{ width: iconSizePx, height: iconSizePx }}
    >
      <Icon
        icon="mdi:food-drumstick"
        aria-hidden
        className="absolute inset-0"
        style={{
          ...iconStyle,
          color: DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
        }}
        width={iconSizePx}
        height={iconSizePx}
      />
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${fill * 100}%` }}
      >
        <Icon
          icon="mdi:food-drumstick"
          aria-hidden
          style={{
            ...iconStyle,
            color: DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR,
          }}
          width={iconSizePx}
          height={iconSizePx}
        />
      </div>
    </div>
  );
}

/**
 * Minecraft-style drumstick row aligned to the inventory hotbar width.
 */
export function RenderingWorldPlazaHungerIndicator({
  hungerRatio,
  tier,
  isStarving,
  viewportHudScale = 1,
}: RenderingWorldPlazaHungerIndicatorProps): React.JSX.Element {
  const iconFillStates = listingWorldPlazaHungerIconFillStates(hungerRatio);
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaHungerIndicatorViewportStyles(viewportHudScale),
    [viewportHudScale]
  );
  const label = RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TIER_LABEL[tier];
  const hungerPercent = Math.round(Math.min(1, Math.max(0, hungerRatio)) * 100);
  const statusLabel = isStarving ? `${label}, starving` : label;

  return (
    <div
      className={RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_ROW_CLASS}
      style={viewportStyles.rowStyle}
      role="img"
      aria-label={`Hunger: ${statusLabel}, ${hungerPercent}%`}
      title={`Hunger: ${statusLabel}`}
    >
      {iconFillStates.map((fill, iconIndex) => (
        <RenderingWorldPlazaHungerFoodIcon
          key={iconIndex}
          fill={fill}
          iconSizePx={viewportStyles.iconSizePx}
        />
      ))}
    </div>
  );
}
