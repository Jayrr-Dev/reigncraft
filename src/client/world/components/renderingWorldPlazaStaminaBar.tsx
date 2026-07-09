'use client';

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX,
  DEFINING_WORLD_PLAZA_ENTITY_STAMINA_BAR_HEIGHT_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';

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

export type RenderingWorldPlazaStaminaBarTrackProps = {
  /** Current stamina as a 0..1 ratio. */
  staminaRatio: number;
  /** True while actively running. */
  isRunning: boolean;
  /** True while running is locked out after depletion. */
  isDepleted: boolean;
};

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
