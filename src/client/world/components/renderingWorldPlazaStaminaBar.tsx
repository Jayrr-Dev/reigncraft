'use client';

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
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
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.barTrack;

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_BASE_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillBase;

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_READY_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillReady;

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_LOW_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillLow;

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_DEPLETED_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillDepleted;

const RENDERING_WORLD_PLAZA_CONTROLS_HINT_TOAST_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
    .controlsHintToast.anchorClassName;

const RENDERING_WORLD_PLAZA_CONTROLS_HINT_PILL_CLASS =
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS;

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
