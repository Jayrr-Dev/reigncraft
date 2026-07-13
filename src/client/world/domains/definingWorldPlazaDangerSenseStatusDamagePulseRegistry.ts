/**
 * Declarative full-rim vignette pulses for status damage ticks.
 *
 * Same square-frame look as wildlife danger sense. Each pulse uses an outer→inner
 * color gradient (outer at the rim, inner feathering inward).
 *
 * @module components/world/domains/definingWorldPlazaDangerSenseStatusDamagePulseRegistry
 */

import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TICK_INTERVAL_MS } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

export type DefiningWorldPlazaDangerSenseStatusDamagePulseId =
  | 'heat'
  | 'cold'
  | 'hunger'
  | 'poison'
  | 'bleed';

export type DefiningWorldPlazaDangerSenseStatusDamagePulseRgb = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

export type DefiningWorldPlazaDangerSenseStatusDamagePulseDefinition = {
  readonly pulseId: DefiningWorldPlazaDangerSenseStatusDamagePulseId;
  /** Color at the outer rim. */
  readonly outerRgb: DefiningWorldPlazaDangerSenseStatusDamagePulseRgb;
  /** Color feathering inward from the rim. */
  readonly innerRgb: DefiningWorldPlazaDangerSenseStatusDamagePulseRgb;
  /** Damage kinds that trigger this pulse on a damaging tick. */
  readonly damageKinds: readonly DefiningWorldPlazaEntityDamageKind[];
  /** Cadence used to project time-to-kill from one tick's damage. */
  readonly tickIntervalMs: number;
};

/** How long a status pulse stays visible after its tick (ms). */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_DURATION_MS = 640;

/** Time from tick to peak opacity (ms). Rest of duration fades out. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FADE_IN_MS = 110;

/**
 * Peak rim opacity / inward size at full strength.
 * Full strength when projected time-to-kill at this tick rate is at or below
 * {@link DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS}.
 */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_PEAK_ALPHA = 0.95;

/** Projected TTK (ms) at or below which the pulse hits peak fade+size (high). */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS = 30_000;

/** Projected TTK (ms) at or above which the pulse sits at the low floor. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_LOW_AT_TTK_MS = 300_000;

/** Floor strength at / beyond the low TTK (fraction of peak). */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_MIN_STRENGTH_SCALE = 0.35;

export const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_REGISTRY: readonly DefiningWorldPlazaDangerSenseStatusDamagePulseDefinition[] =
  [
    {
      pulseId: 'heat',
      // Rim: orange → red (outer redder)
      outerRgb: { r: 255, g: 36, b: 18 },
      innerRgb: { r: 255, g: 150, b: 36 },
      damageKinds: ['environmental_heat', 'environmental_lava'],
      tickIntervalMs:
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
    },
    {
      pulseId: 'cold',
      // Rim: white → blue (outer bluer)
      outerRgb: { r: 48, g: 130, b: 255 },
      innerRgb: { r: 240, g: 248, b: 255 },
      damageKinds: ['environmental_cold'],
      tickIntervalMs:
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
    },
    {
      pulseId: 'hunger',
      // Rim: black → red
      outerRgb: { r: 220, g: 36, b: 36 },
      innerRgb: { r: 8, g: 4, b: 4 },
      damageKinds: ['starvation'],
      tickIntervalMs: DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TICK_INTERVAL_MS,
    },
    {
      pulseId: 'poison',
      // Rim: black → green
      outerRgb: { r: 48, g: 210, b: 64 },
      innerRgb: { r: 4, g: 12, b: 4 },
      damageKinds: ['toxic', 'venomous', 'lethal'],
      tickIntervalMs: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS,
    },
    {
      pulseId: 'bleed',
      // Rim: black → brown
      outerRgb: { r: 150, g: 78, b: 36 },
      innerRgb: { r: 10, g: 4, b: 2 },
      damageKinds: ['bleeding', 'hemorrhaging', 'exsanguinating'],
      tickIntervalMs: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS,
    },
  ];

const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_BY_KIND: ReadonlyMap<
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaDangerSenseStatusDamagePulseDefinition
> = new Map(
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_REGISTRY.flatMap(
    (definition) =>
      definition.damageKinds.map(
        (damageKind) =>
          [damageKind, definition] as const
      )
  )
);

export function resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition(
  damageKind: DefiningWorldPlazaEntityDamageKind | null | undefined
): DefiningWorldPlazaDangerSenseStatusDamagePulseDefinition | null {
  if (!damageKind) {
    return null;
  }

  return (
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_BY_KIND.get(
      damageKind
    ) ?? null
  );
}

export function resolvingWorldPlazaDangerSenseStatusDamagePulseDefinitionById(
  pulseId: DefiningWorldPlazaDangerSenseStatusDamagePulseId
): DefiningWorldPlazaDangerSenseStatusDamagePulseDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_REGISTRY.find(
      (definition) => definition.pulseId === pulseId
    ) ?? null
  );
}
