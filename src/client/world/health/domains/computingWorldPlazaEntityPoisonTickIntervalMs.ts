import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';

/** Shortest poison tick cadence near the end of the effect. */
export const DEFINING_WORLD_PLAZA_ENTITY_POISON_TICK_INTERVAL_MIN_MS = 250;

/** Longest poison tick cadence near the start of the effect. */
export const DEFINING_WORLD_PLAZA_ENTITY_POISON_TICK_INTERVAL_MAX_MS = 3_000;

export type ComputingWorldPlazaEntityPoisonTickIntervalMsParams = {
  startedAtMs: number;
  expiresAtMs: number;
  nowMs: number;
  baseTickIntervalMs?: number;
};

/**
 * Back-loaded poison tick cadence: long pauses early, rapid ticks late.
 * Inverse of bleed's front-loaded damage pacing.
 */
export function computingWorldPlazaEntityPoisonTickIntervalMs({
  startedAtMs,
  expiresAtMs,
  nowMs,
  baseTickIntervalMs = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS,
}: ComputingWorldPlazaEntityPoisonTickIntervalMsParams): number {
  const durationMs = expiresAtMs - startedAtMs;

  if (durationMs <= 0) {
    return baseTickIntervalMs;
  }

  const elapsedMs = Math.max(0, nowMs - startedAtMs);
  const progress = Math.min(1, elapsedMs / durationMs);
  const intervalMultiplier = 2 * (1.125 - progress * 0.875);
  const tickIntervalMs = baseTickIntervalMs * intervalMultiplier;

  return Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_POISON_TICK_INTERVAL_MAX_MS,
    Math.max(
      DEFINING_WORLD_PLAZA_ENTITY_POISON_TICK_INTERVAL_MIN_MS,
      tickIntervalMs
    )
  );
}
