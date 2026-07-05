'use client';

/**
 * Persistent hunger bar shown above the plaza hotbar.
 *
 * @module components/world/hunger/components/renderingWorldPlazaHungerIndicator
 */

import { RoughDiv } from '@/components/ui/rough-div';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { cn } from '@/lib/utils';

/** Props for {@link RenderingWorldPlazaHungerIndicator}. */
export interface RenderingWorldPlazaHungerIndicatorProps {
  /** Current hunger as a 0..1 ratio. */
  hungerRatio: number;
  /** Named hunger tier for color styling. */
  tier: DefiningWorldPlazaHungerTier;
  /** True while starvation is actively draining health (pulses the bar). */
  isStarving: boolean;
}

const RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_WRAPPER_CLASS =
  'pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center';

const RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TRACK_CLASS =
  'h-2 w-40 overflow-hidden rounded-full border border-poster-gold/25 bg-poster-teal-deep/70 shadow-md shadow-black/25';

const RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_FILL_BASE_CLASS =
  'h-full rounded-full transition-[width,background-color] duration-300 ease-out';

/** Tier-to-fill-color mapping for the hunger bar. */
const RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TIER_FILL_CLASS: Record<
  DefiningWorldPlazaHungerTier,
  string
> = {
  well_fed: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
  content: 'bg-gradient-to-r from-poster-gold to-[#f4d35e]',
  peckish: 'bg-gradient-to-r from-poster-amber to-poster-orange',
  hungry: 'bg-gradient-to-r from-orange-500 to-orange-600',
  starving: 'bg-gradient-to-r from-red-600 to-red-800',
};

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
 * Hand-drawn hunger bar rendered just above the inventory hotbar. Pulses
 * while actively starving to draw attention to the health drain.
 */
export function RenderingWorldPlazaHungerIndicator({
  hungerRatio,
  tier,
  isStarving,
}: RenderingWorldPlazaHungerIndicatorProps): React.JSX.Element {
  const fillWidthPercent = Math.round(
    Math.min(1, Math.max(0, hungerRatio)) * 100
  );
  const fillClass = RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TIER_FILL_CLASS[tier];
  const label = RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TIER_LABEL[tier];

  return (
    <div
      className={RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_WRAPPER_CLASS}
      aria-hidden="true"
    >
      <RoughDiv
        variant="outline-solid"
        className={cn(
          RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_TRACK_CLASS,
          isStarving && 'animate-pulse'
        )}
        title={`Hunger: ${label}`}
      >
        <div
          className={cn(
            RENDERING_WORLD_PLAZA_HUNGER_INDICATOR_FILL_BASE_CLASS,
            fillClass
          )}
          style={{ width: `${fillWidthPercent}%` }}
        />
      </RoughDiv>
    </div>
  );
}
