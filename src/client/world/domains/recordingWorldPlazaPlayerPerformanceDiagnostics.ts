/**
 * Publishes player state and movement workload gauges to plaza diagnostics.
 *
 * @module components/world/domains/recordingWorldPlazaPlayerPerformanceDiagnostics
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  type DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaRunStaminaState } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import {
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type RecordingWorldPlazaPlayerPerformanceDiagnosticsParams = {
  readonly nowMs: number;
  readonly frameDeltaMs: number;
  readonly attemptedMoveDistance: number;
  readonly actualMoveDistance: number;
  readonly healthState: DefiningWorldPlazaEntityHealthState | null;
  readonly staminaState: DefiningWorldPlazaRunStaminaState | null;
  readonly navigationWaypointCount: number;
  readonly worldLayer: number;
  readonly isKeyboardMoving: boolean;
  readonly isClickMoving: boolean;
  readonly isRunning: boolean;
  readonly isJumping: boolean;
  readonly isFalling: boolean;
  readonly isRolling: boolean;
  readonly isPushing: boolean;
  readonly isIceSliding: boolean;
  readonly isStunned: boolean;
  readonly isAsleep: boolean;
  readonly isDead: boolean;
};

type RecordingWorldPlazaPlayerPerformanceGaugeEntry = readonly [
  DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
  number,
];

function computingWorldPlazaPlayerPerformanceHealthRatio(
  healthState: DefiningWorldPlazaEntityHealthState | null,
  nowMs: number
): number {
  if (!healthState) {
    return 0;
  }

  let temporaryMaxHealthBonus = 0;

  for (const bonus of healthState.temporaryMaxHealthBonuses) {
    if (bonus.expiresAtMs > nowMs) {
      temporaryMaxHealthBonus += bonus.amount;
    }
  }

  const effectiveMaxHealth = Math.max(
    1,
    healthState.baseMaxHealth * healthState.maxHealthScale +
      temporaryMaxHealthBonus
  );

  return Math.max(
    0,
    Math.min(1, healthState.currentHealth / effectiveMaxHealth)
  );
}

/**
 * Records one point-in-time player workload snapshot.
 */
export function recordingWorldPlazaPlayerPerformanceDiagnostics({
  nowMs,
  frameDeltaMs,
  attemptedMoveDistance,
  actualMoveDistance,
  healthState,
  staminaState,
  navigationWaypointCount,
  worldLayer,
  isKeyboardMoving,
  isClickMoving,
  isRunning,
  isJumping,
  isFalling,
  isRolling,
  isPushing,
  isIceSliding,
  isStunned,
  isAsleep,
  isDead,
}: RecordingWorldPlazaPlayerPerformanceDiagnosticsParams): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  const frameSeconds = Math.max(0.001, frameDeltaMs / 1000);
  const gaugeEntries: readonly RecordingWorldPlazaPlayerPerformanceGaugeEntry[] =
    [
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_SPEED_GRID_PER_SECOND,
        actualMoveDistance / frameSeconds,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_ATTEMPTED_SPEED_GRID_PER_SECOND,
        attemptedMoveDistance / frameSeconds,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_HEALTH_RATIO,
        computingWorldPlazaPlayerPerformanceHealthRatio(healthState, nowMs),
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_STAMINA_RATIO,
        staminaState?.staminaRatio ?? 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_STAMINA_RUNNING_SECONDS,
        staminaState?.runningForSeconds ?? 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_NAVIGATION_WAYPOINT_COUNT,
        navigationWaypointCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_WORLD_LAYER,
        worldLayer,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_KEYBOARD_MOVING,
        isKeyboardMoving ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_CLICK_MOVING,
        isClickMoving ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_RUNNING,
        isRunning ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_JUMPING,
        isJumping ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_FALLING,
        isFalling ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_ROLLING,
        isRolling ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_PUSHING,
        isPushing ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_ICE_SLIDING,
        isIceSliding ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_STUNNED,
        isStunned ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_ASLEEP,
        isAsleep ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_IS_DEAD,
        isDead ? 1 : 0,
      ],
    ];

  for (const [gaugeId, value] of gaugeEntries) {
    settingWorldPlazaPerformanceDiagnosticsGauge(gaugeId, value);
  }
}
