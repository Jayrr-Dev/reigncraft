/**
 * Module store for full-rim status-damage vignette pulses.
 *
 * @module components/world/domains/managingWorldPlazaDangerSenseStatusDamagePulseStore
 */

import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_DURATION_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FADE_IN_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_LOW_AT_TTK_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_MIN_STRENGTH_SCALE,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_PEAK_ALPHA,
  resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition,
  type DefiningWorldPlazaDangerSenseStatusDamagePulseId,
} from '@/components/world/domains/definingWorldPlazaDangerSenseStatusDamagePulseRegistry';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ManagingWorldPlazaDangerSenseStatusDamagePulse = {
  readonly pulseId: DefiningWorldPlazaDangerSenseStatusDamagePulseId;
  readonly startedAtMs: number;
  /** 0..1 TTK-scaled strength (1 = current max look). */
  readonly strengthScale: number;
  /** Envelope × peak alpha × strengthScale. */
  readonly intensity: number;
};

type ManagingWorldPlazaDangerSenseStatusDamagePulseEntry = {
  startedAtMs: number;
  strengthScale: number;
};

const managingWorldPlazaDangerSenseStatusDamagePulseById = new Map<
  DefiningWorldPlazaDangerSenseStatusDamagePulseId,
  ManagingWorldPlazaDangerSenseStatusDamagePulseEntry
>();

/**
 * Projected time-to-kill if this tick's damage rate continues:
 * `currentHealth * tickIntervalMs / damageAmount`.
 */
export function computingWorldPlazaDangerSenseStatusDamagePulseTimeToKillMs(
  damageAmount: number,
  currentHealth: number,
  tickIntervalMs: number
): number {
  if (!(damageAmount > 0) || !(tickIntervalMs > 0)) {
    return Number.POSITIVE_INFINITY;
  }

  const healthForTtk = Math.max(0, currentHealth);
  if (healthForTtk <= 0) {
    return 0;
  }

  return (healthForTtk * tickIntervalMs) / damageAmount;
}

/**
 * Maps projected TTK onto strength.
 * ≤30s → 1 (high). ≥5min → min floor (low). Linear between.
 */
export function computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
  damageAmount: number,
  currentHealth: number,
  tickIntervalMs: number
): number {
  const ttkMs = computingWorldPlazaDangerSenseStatusDamagePulseTimeToKillMs(
    damageAmount,
    currentHealth,
    tickIntervalMs
  );
  const minStrength =
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_MIN_STRENGTH_SCALE;

  if (!Number.isFinite(ttkMs)) {
    return minStrength;
  }

  if (ttkMs <= 0) {
    return 1;
  }

  const fullAtTtkMs =
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS;
  const lowAtTtkMs =
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_LOW_AT_TTK_MS;

  if (ttkMs <= fullAtTtkMs) {
    return 1;
  }

  if (ttkMs >= lowAtTtkMs) {
    return minStrength;
  }

  const spanMs = lowAtTtkMs - fullAtTtkMs;
  const t = (ttkMs - fullAtTtkMs) / spanMs;
  return 1 + (minStrength - 1) * t;
}

/**
 * Smoothstep envelope: fade in to peak, then fade out to clear.
 * `strengthScale` 1 = current max opacity; lower scales the crest down.
 */
export function computingWorldPlazaDangerSenseStatusDamagePulseIntensity(
  ageMs: number,
  strengthScale = 1
): number {
  const durationMs =
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_DURATION_MS;
  const fadeInMs = Math.min(
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FADE_IN_MS,
    durationMs * 0.45
  );

  if (ageMs < 0 || ageMs >= durationMs || strengthScale <= 0) {
    return 0;
  }

  let envelope: number;

  if (ageMs < fadeInMs) {
    const t = fadeInMs <= 0 ? 1 : ageMs / fadeInMs;
    envelope = t * t * (3 - 2 * t);
  } else {
    const fadeOutMs = durationMs - fadeInMs;
    const t = fadeOutMs <= 0 ? 1 : (ageMs - fadeInMs) / fadeOutMs;
    const remaining = 1 - t;
    envelope = remaining * remaining * (3 - 2 * remaining);
  }

  return (
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_PEAK_ALPHA *
    strengthScale *
    envelope
  );
}

export type PushingWorldPlazaDangerSenseStatusDamagePulseInput = {
  readonly damageKind: DefiningWorldPlazaEntityDamageKind | null | undefined;
  readonly nowMs: number;
  readonly damageAmount: number;
  /** Health before this tick lands (TTK uses remaining life). */
  readonly currentHealth: number;
};

/**
 * Starts or refreshes a rim pulse for a damaging tick of the given kind.
 * Strength scales with projected time-to-kill at this tick rate.
 */
export function pushingWorldPlazaDangerSenseStatusDamagePulse(
  input: PushingWorldPlazaDangerSenseStatusDamagePulseInput
): void {
  const definition =
    resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition(
      input.damageKind
    );
  if (!definition) {
    return;
  }

  const strengthScale =
    computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
      input.damageAmount,
      input.currentHealth,
      definition.tickIntervalMs
    );

  managingWorldPlazaDangerSenseStatusDamagePulseById.set(definition.pulseId, {
    startedAtMs: input.nowMs,
    strengthScale,
  });
}

/**
 * Lists live pulses with fade-in then fade-out intensity.
 */
export function listingWorldPlazaDangerSenseStatusDamagePulses(
  nowMs: number
): readonly ManagingWorldPlazaDangerSenseStatusDamagePulse[] {
  const pulses: ManagingWorldPlazaDangerSenseStatusDamagePulse[] = [];
  const durationMs =
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_DURATION_MS;

  for (const [pulseId, entry] of [
    ...managingWorldPlazaDangerSenseStatusDamagePulseById.entries(),
  ]) {
    const ageMs = nowMs - entry.startedAtMs;
    if (ageMs >= durationMs) {
      managingWorldPlazaDangerSenseStatusDamagePulseById.delete(pulseId);
      continue;
    }

    pulses.push({
      pulseId,
      startedAtMs: entry.startedAtMs,
      strengthScale: entry.strengthScale,
      intensity: computingWorldPlazaDangerSenseStatusDamagePulseIntensity(
        ageMs,
        entry.strengthScale
      ),
    });
  }

  return pulses;
}

/** Test helper: clears all active status pulses. */
export function clearingWorldPlazaDangerSenseStatusDamagePulses(): void {
  managingWorldPlazaDangerSenseStatusDamagePulseById.clear();
}
