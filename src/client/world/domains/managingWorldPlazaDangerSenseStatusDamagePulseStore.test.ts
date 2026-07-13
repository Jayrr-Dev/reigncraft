import { describe, expect, it, beforeEach } from 'vitest';
import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_DURATION_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FADE_IN_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_LOW_AT_TTK_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_MIN_STRENGTH_SCALE,
  resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition,
} from '@/components/world/domains/definingWorldPlazaDangerSenseStatusDamagePulseRegistry';
import {
  clearingWorldPlazaDangerSenseStatusDamagePulses,
  computingWorldPlazaDangerSenseStatusDamagePulseIntensity,
  computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale,
  computingWorldPlazaDangerSenseStatusDamagePulseTimeToKillMs,
  listingWorldPlazaDangerSenseStatusDamagePulses,
  pushingWorldPlazaDangerSenseStatusDamagePulse,
} from '@/components/world/domains/managingWorldPlazaDangerSenseStatusDamagePulseStore';

describe('world plaza danger sense status damage pulses', () => {
  beforeEach(() => {
    clearingWorldPlazaDangerSenseStatusDamagePulses();
  });

  it('maps heat cold hunger poison bleed kinds to pulse ids', () => {
    expect(
      resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition(
        'environmental_heat'
      )?.pulseId
    ).toBe('heat');
    expect(
      resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition(
        'environmental_cold'
      )?.pulseId
    ).toBe('cold');
    expect(
      resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition('starvation')
        ?.pulseId
    ).toBe('hunger');
    expect(
      resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition('toxic')
        ?.pulseId
    ).toBe('poison');
    expect(
      resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition('bleeding')
        ?.pulseId
    ).toBe('bleed');
    expect(
      resolvingWorldPlazaDangerSenseStatusDamagePulseDefinition('physical')
    ).toBeNull();
  });

  it('scales strength by projected time-to-kill from 30s high to 5min low', () => {
    const tickIntervalMs = 1_000;
    const currentHealth = 100;

    const fullDamage =
      (currentHealth * tickIntervalMs) /
      DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS;
    const lowDamage =
      (currentHealth * tickIntervalMs) /
      DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_LOW_AT_TTK_MS;

    expect(
      computingWorldPlazaDangerSenseStatusDamagePulseTimeToKillMs(
        fullDamage,
        currentHealth,
        tickIntervalMs
      )
    ).toBeCloseTo(
      DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS
    );

    expect(
      computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
        fullDamage,
        currentHealth,
        tickIntervalMs
      )
    ).toBe(1);

    expect(
      computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
        fullDamage * 2,
        currentHealth,
        tickIntervalMs
      )
    ).toBe(1);

    expect(
      computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
        lowDamage,
        currentHealth,
        tickIntervalMs
      )
    ).toBe(
      DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_MIN_STRENGTH_SCALE
    );

    // Midpoint between 30s and 5min
    const midTtkMs =
      (DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS +
        DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_LOW_AT_TTK_MS) /
      2;
    const midDamage = (currentHealth * tickIntervalMs) / midTtkMs;
    const midStrength =
      computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
        midDamage,
        currentHealth,
        tickIntervalMs
      );
    expect(midStrength).toBeCloseTo(
      (1 +
        DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_MIN_STRENGTH_SCALE) /
        2
    );

    // Same DPS at half HP → half TTK → stronger (at/under full band)
    expect(
      computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
        fullDamage * 0.5,
        currentHealth / 2,
        tickIntervalMs
      )
    ).toBe(1);

    expect(
      computingWorldPlazaDangerSenseStatusDamagePulseStrengthScale(
        0.01,
        currentHealth,
        tickIntervalMs
      )
    ).toBe(
      DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_MIN_STRENGTH_SCALE
    );
  });

  it('fades in then fades out over duration', () => {
    const atPeak = computingWorldPlazaDangerSenseStatusDamagePulseIntensity(
      DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FADE_IN_MS,
      1
    );
    const halfStrengthPeak =
      computingWorldPlazaDangerSenseStatusDamagePulseIntensity(
        DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FADE_IN_MS,
        0.5
      );

    expect(halfStrengthPeak).toBeCloseTo(atPeak * 0.5);
    expect(
      computingWorldPlazaDangerSenseStatusDamagePulseIntensity(
        DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_DURATION_MS,
        1
      )
    ).toBe(0);
  });

  it('stores ttk-scaled strength on push', () => {
    // poison 1s tick; HP 100; dmg ~3.33 → TTK 30s → full
    pushingWorldPlazaDangerSenseStatusDamagePulse({
      damageKind: 'toxic',
      nowMs: 1_000,
      damageAmount:
        100_000 / DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FULL_AT_TTK_MS,
      currentHealth: 100,
    });

    const atPeak = listingWorldPlazaDangerSenseStatusDamagePulses(
      1_000 + DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_FADE_IN_MS
    );
    expect(atPeak).toHaveLength(1);
    expect(atPeak[0]?.strengthScale).toBe(1);
  });
});
