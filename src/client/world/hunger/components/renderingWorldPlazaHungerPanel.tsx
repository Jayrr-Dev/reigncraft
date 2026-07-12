'use client';

/**
 * Hunger status dropdown opened from the action-bar hunger orb.
 *
 * @module components/world/hunger/components/renderingWorldPlazaHungerPanel
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import {
  LABELING_WORLD_PLAZA_HUNGER_PANEL,
  LABELING_WORLD_PLAZA_HUNGER_PANEL_STARVING_WARNING,
  LABELING_WORLD_PLAZA_HUNGER_PANEL_TIER,
  LABELING_WORLD_PLAZA_HUNGER_PANEL_TIER_BLURB,
  LABELING_WORLD_PLAZA_HUNGER_PANEL_TIP,
  LABELING_WORLD_PLAZA_HUNGER_PANEL_TITLE,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_BAR_TRACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_BLURB_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_EFFECT_LINE_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_EFFECT_LIST_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_PERCENT_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_TIER_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_TIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUNGER_PANEL_WARNING_CLASS_NAME,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerPanelConstants';
import { listingWorldPlazaHungerPanelStatusLines } from '@/components/world/hunger/domains/listingWorldPlazaHungerPanelStatusLines';
import { resolvingWorldPlazaHungerFillColors } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerFillColor';
import { resolvingWorldPlazaHungerMovementEffects } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';
import { memo, useMemo } from 'react';

export type RenderingWorldPlazaHungerPanelProps = {
  readonly hungerRatio: number;
  readonly tier: DefiningWorldPlazaHungerTier;
  readonly isStarving: boolean;
};

/**
 * Compact parchment panel with fill bar, tier, and active hunger effects.
 */
export const RenderingWorldPlazaHungerPanel = memo(
  function RenderingWorldPlazaHungerPanel({
    hungerRatio,
    tier,
    isStarving,
  }: RenderingWorldPlazaHungerPanelProps): React.JSX.Element {
    const clampedRatio = Math.min(1, Math.max(0, hungerRatio));
    const hungerPercent = Math.round(clampedRatio * 100);
    const fillColors = useMemo(
      () => resolvingWorldPlazaHungerFillColors(clampedRatio),
      [clampedRatio]
    );
    const effects = useMemo(
      () => resolvingWorldPlazaHungerMovementEffects(clampedRatio),
      [clampedRatio]
    );
    const statusLines = useMemo(
      () => listingWorldPlazaHungerPanelStatusLines(effects),
      [effects]
    );

    return (
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={STYLING_WORLD_PLAZA_HUNGER_PANEL_CLASS_NAME}
        role="dialog"
        aria-label={LABELING_WORLD_PLAZA_HUNGER_PANEL}
      >
        <div className={STYLING_WORLD_PLAZA_HUNGER_PANEL_TITLE_CLASS_NAME}>
          {LABELING_WORLD_PLAZA_HUNGER_PANEL_TITLE}
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className={STYLING_WORLD_PLAZA_HUNGER_PANEL_PERCENT_CLASS_NAME}>
            {hungerPercent}%
          </div>
          <div className={STYLING_WORLD_PLAZA_HUNGER_PANEL_TIER_CLASS_NAME}>
            {LABELING_WORLD_PLAZA_HUNGER_PANEL_TIER[tier]}
          </div>
        </div>

        <div
          className={STYLING_WORLD_PLAZA_HUNGER_PANEL_BAR_TRACK_CLASS_NAME}
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full transition-[width,background] duration-200 ease-out"
            style={{
              width: `${clampedRatio * 100}%`,
              background: fillColors.fillBackgroundCss,
              boxShadow: 'inset 0 1px 0 rgba(255, 220, 170, 0.35)',
            }}
          />
        </div>

        <p className={STYLING_WORLD_PLAZA_HUNGER_PANEL_BLURB_CLASS_NAME}>
          {LABELING_WORLD_PLAZA_HUNGER_PANEL_TIER_BLURB[tier]}
        </p>

        {isStarving ? (
          <div className={STYLING_WORLD_PLAZA_HUNGER_PANEL_WARNING_CLASS_NAME}>
            {LABELING_WORLD_PLAZA_HUNGER_PANEL_STARVING_WARNING}
          </div>
        ) : null}

        {statusLines.length > 0 ? (
          <ul
            className={STYLING_WORLD_PLAZA_HUNGER_PANEL_EFFECT_LIST_CLASS_NAME}
          >
            {statusLines.map((line) => (
              <li
                key={line}
                className={
                  STYLING_WORLD_PLAZA_HUNGER_PANEL_EFFECT_LINE_CLASS_NAME
                }
              >
                · {line}
              </li>
            ))}
          </ul>
        ) : null}

        <p className={STYLING_WORLD_PLAZA_HUNGER_PANEL_TIP_CLASS_NAME}>
          {LABELING_WORLD_PLAZA_HUNGER_PANEL_TIP}
        </p>
      </div>
    );
  }
);
