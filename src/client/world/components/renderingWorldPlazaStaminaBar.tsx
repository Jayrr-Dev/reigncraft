'use client';

import {
  LABELING_WORLD_PLAZA_KEYBOARD_CONTROLS_HINT,
  LABELING_WORLD_PLAZA_MOBILE_CONTROLS_HINT,
} from '@/components/world/domains/definingWorldPlazaKeyboardInputConstants';
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX,
  DEFINING_WORLD_PLAZA_ENTITY_STAMINA_BAR_HEIGHT_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';
import { useEffect, useState } from 'react';

const RENDERING_WORLD_PLAZA_STAMINA_BAR_TRACK_CLASS =
  'overflow-hidden rounded-[2px] border border-poster-gold/25 bg-poster-teal-deep/70';

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_BASE_CLASS =
  'h-full rounded-full transition-[width,background-color] duration-150 ease-out';

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_READY_CLASS =
  'bg-gradient-to-r from-poster-gold to-[#f4d35e]';

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_LOW_CLASS =
  'bg-gradient-to-r from-poster-amber to-poster-orange';

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_DEPLETED_CLASS =
  'bg-gradient-to-r from-poster-orange to-poster-orange-deep';

const RENDERING_WORLD_PLAZA_CONTROLS_HINT_TOAST_CLASS =
  'pointer-events-none absolute inset-x-0 top-1/4 z-30 flex justify-center transition-opacity duration-700 ease-out';

const RENDERING_WORLD_PLAZA_CONTROLS_HINT_PILL_CLASS =
  'select-none rounded-full bg-poster-teal-deep/70 px-3 py-1 text-[10px] font-medium leading-none text-parchment/85 shadow-md shadow-black/25 backdrop-blur-sm';

/** How long the control hint toast stays visible before fading out (ms). */
const DEFINING_WORLD_PLAZA_CONTROLS_HINT_VISIBLE_DURATION_MS = 6000;

export type RenderingWorldPlazaStaminaBarTrackProps = {
  /** Current stamina as a 0..1 ratio. */
  staminaRatio: number;
  /** True while actively running. */
  isRunning: boolean;
  /** True while running is locked out after depletion. */
  isDepleted: boolean;
};

export interface RenderingWorldPlazaStaminaBarProps {
  /** When true, shows mobile-oriented control hints. */
  isMobile?: boolean;
}

function resolvingStaminaBarFillClass({
  staminaRatio,
  isDepleted,
}: Pick<
  RenderingWorldPlazaStaminaBarTrackProps,
  'staminaRatio' | 'isDepleted'
>): string {
  if (isDepleted) {
    return RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_DEPLETED_CLASS;
  }

  if (staminaRatio <= DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO) {
    return RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_LOW_CLASS;
  }

  return RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_READY_CLASS;
}

/**
 * Run-stamina track rendered below the local player health bar.
 *
 * Fully hidden while stamina is full and idle, fading in only when the player
 * runs or recovers.
 */
export function RenderingWorldPlazaStaminaBarTrack({
  staminaRatio,
  isRunning,
  isDepleted,
}: RenderingWorldPlazaStaminaBarTrackProps): React.JSX.Element {
  const isFullAndIdle = staminaRatio >= 1 && !isRunning && !isDepleted;
  const fillClass = resolvingStaminaBarFillClass({ staminaRatio, isDepleted });
  const fillWidthPercent = Math.round(
    Math.min(1, Math.max(0, staminaRatio)) * 100
  );

  return (
    <div
      className="transition-opacity duration-500 ease-out"
      style={{
        opacity: isFullAndIdle ? 0 : 1,
        width: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX}px`,
        height: `${DEFINING_WORLD_PLAZA_ENTITY_STAMINA_BAR_HEIGHT_PX}px`,
      }}
      aria-hidden="true"
    >
      <div
        className={RENDERING_WORLD_PLAZA_STAMINA_BAR_TRACK_CLASS}
        style={{
          height: `${DEFINING_WORLD_PLAZA_ENTITY_STAMINA_BAR_HEIGHT_PX}px`,
        }}
      >
        <div
          className={`${RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_BASE_CLASS} ${fillClass}`}
          style={{ width: `${fillWidthPercent}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Transient controls hint toast shown once near the upper quarter of the viewport.
 */
export function RenderingWorldPlazaStaminaBar({
  isMobile = false,
}: RenderingWorldPlazaStaminaBarProps): React.JSX.Element {
  const [isHintVisible, setIsHintVisible] = useState(true);

  useEffect(() => {
    const hintFadeTimer = window.setTimeout(() => {
      setIsHintVisible(false);
    }, DEFINING_WORLD_PLAZA_CONTROLS_HINT_VISIBLE_DURATION_MS);

    return () => {
      window.clearTimeout(hintFadeTimer);
    };
  }, []);

  return (
    <div
      className={RENDERING_WORLD_PLAZA_CONTROLS_HINT_TOAST_CLASS}
      style={{ opacity: isHintVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      <span className={RENDERING_WORLD_PLAZA_CONTROLS_HINT_PILL_CLASS}>
        {isMobile
          ? LABELING_WORLD_PLAZA_MOBILE_CONTROLS_HINT
          : LABELING_WORLD_PLAZA_KEYBOARD_CONTROLS_HINT}
      </span>
    </div>
  );
}
