import {
  computingWorldPlazaEntityPoisonRampCumulativeDamageFraction,
  DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT,
} from '@/components/world/health/domains/definingWorldPlazaEntityPoisonRampConstants';

export type ComputingWorldPlazaEntityPoisonTickDamageParams = {
  remainingPoisonDamage: number;
  totalPoisonDamage: number;
  startedAtMs: number;
  expiresAtMs: number;
  nowMs: number;
  lastTickAtMs: number;
  tickIntervalMs: number;
};

/**
 * Computes poison tick damage using the piecewise ramp:
 * 15% in the first 50% of time, 35% in the next 35%, 50% in the final 15%.
 */
export function computingWorldPlazaEntityPoisonTickDamage({
  remainingPoisonDamage,
  totalPoisonDamage,
  startedAtMs,
  expiresAtMs,
  nowMs,
  lastTickAtMs,
  tickIntervalMs,
}: ComputingWorldPlazaEntityPoisonTickDamageParams): number {
  if (remainingPoisonDamage <= 0 || totalPoisonDamage <= 0) {
    return 0;
  }

  const durationMs = expiresAtMs - startedAtMs;

  if (durationMs <= 0) {
    return remainingPoisonDamage;
  }

  const remainingMs = Math.max(0, expiresAtMs - nowMs);

  if (remainingMs <= tickIntervalMs) {
    return remainingPoisonDamage;
  }

  const progressAtNow = Math.min(1, (nowMs - startedAtMs) / durationMs);
  const progressAtLastTick = Math.min(
    1,
    (lastTickAtMs - startedAtMs) / durationMs
  );
  const expectedDealtAtNow =
    totalPoisonDamage *
    computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(progressAtNow);
  const dealtSoFar = totalPoisonDamage - remainingPoisonDamage;
  let tickDamage = Math.max(0, expectedDealtAtNow - dealtSoFar);

  if (
    tickDamage > 0 &&
    tickDamage < DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT &&
    remainingPoisonDamage >=
      DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT
  ) {
    tickDamage = DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT;
  }

  return Math.min(remainingPoisonDamage, tickDamage);
}
