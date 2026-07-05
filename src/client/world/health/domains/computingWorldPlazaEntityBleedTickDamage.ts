export type ComputingWorldPlazaEntityBleedTickDamageParams = {
  remainingBleedDamage: number;
  startedAtMs: number;
  expiresAtMs: number;
  nowMs: number;
  tickIntervalMs: number;
};

/**
 * Computes bleed tick damage with a front-loaded rate that starts high and
 * tapers as the bleed progresses. On the final tick, drains any remainder.
 */
export function computingWorldPlazaEntityBleedTickDamage({
  remainingBleedDamage,
  startedAtMs,
  expiresAtMs,
  nowMs,
  tickIntervalMs,
}: ComputingWorldPlazaEntityBleedTickDamageParams): number {
  if (remainingBleedDamage <= 0) {
    return 0;
  }

  const durationMs = expiresAtMs - startedAtMs;

  if (durationMs <= 0) {
    return remainingBleedDamage;
  }

  const elapsedMs = Math.max(0, nowMs - startedAtMs);
  const remainingMs = Math.max(0, expiresAtMs - nowMs);

  if (remainingMs <= tickIntervalMs) {
    return remainingBleedDamage;
  }

  const progress = Math.min(1, elapsedMs / durationMs);
  const rateMultiplier = 2 * (1 - progress * 0.875);
  const evenShare =
    remainingBleedDamage * (tickIntervalMs / Math.max(1, remainingMs));
  const tickDamage = evenShare * rateMultiplier;

  return Math.min(remainingBleedDamage, tickDamage);
}
