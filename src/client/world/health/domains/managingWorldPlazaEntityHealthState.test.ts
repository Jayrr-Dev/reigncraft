import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import {
  creatingWorldPlazaEntityHealthInitialState,
  doublingWorldPlazaEntityHealthMax,
  revivingWorldPlazaEntityHealthToFull,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('doublingWorldPlazaEntityHealthMax', () => {
  it('scales current health proportionally when max health doubles', () => {
    const nowMs = 1_000;
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX * 0.5,
    };

    const doubled = doublingWorldPlazaEntityHealthMax(state, nowMs);

    expect(doubled.maxHealthScale).toBe(2);
    expect(doubled.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX
    );
  });
});

describe('revivingWorldPlazaEntityHealthToFull', () => {
  it('clears buffs, debuffs, disease, and DoT after death', () => {
    const nowMs = 5_000;
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 0,
      isDead: true,
      maxHealthScale: 2,
      temporaryMaxHealthBonuses: [
        { id: 'temp-max-health-buff', amount: 20, expiresAtMs: nowMs + 10_000 },
      ],
      movementModifiers: [
        {
          id: 'slow-debuff',
          kind: 'speed' as const,
          multiplier: 0.8,
          expiresAtMs: nowMs + 10_000,
        },
      ],
      incomingDamageModifiers: [
        {
          id: 'vulnerable-debuff',
          multiplier: 1.3,
          expiresAtMs: nowMs + 10_000,
        },
      ],
      damageRollModifiers: [
        {
          id: 'exposed-debuff:0',
          kind: 'expected' as const,
          value: 1.2,
          expiresAtMs: null,
        },
      ],
      confusionEffects: [
        {
          id: 'confusion-debuff',
          targetIntensity: 50,
          appliedAtMs: nowMs,
          expiresAtMs: nowMs + 10_000,
          phaseSeed: 1,
        },
      ],
      sleepEffects: [
        {
          id: 'sleep-debuff',
          appliedAtMs: nowMs,
          expiresAtMs: nowMs + 8_000,
          wakeBonusDamage: 30,
        },
      ],
      stunEffects: [
        {
          id: 'stun-debuff',
          appliedAtMs: nowMs,
          expiresAtMs: nowMs + 4_000,
          phaseSeed: 2,
        },
      ],
      diseaseEffects: [
        {
          id: 'disease-1',
          diseaseId: 'salmonellosis' as const,
          contractedAtMs: nowMs - 1_000,
          symptomsStartAtMs: nowMs,
          expiresAtMs: nowMs + 60_000,
          symptomStrengthMultiplier: 1,
          durationMultiplier: 1,
          pathologyStudyHoursCredited: 0,
          pendingGrants: [],
        },
      ],
      poisonEffects: [
        {
          id: 'poison-1',
          potency: 'toxic' as const,
          remainingPoisonDamage: 10,
          totalPoisonDamage: 10,
          stackCount: 1,
          startedAtMs: nowMs,
          expiresAtMs: nowMs + 10_000,
          tickIntervalMs: 500,
          lastTickAtMs: nowMs,
        },
      ],
      bleedEffects: [
        {
          id: 'bleed-1',
          severity: 'bleeding' as const,
          remainingBleedDamage: 10,
          totalBleedDamage: 10,
          stackCount: 1,
          startedAtMs: nowMs,
          expiresAtMs: nowMs + 10_000,
          tickIntervalMs: 500,
          lastTickAtMs: nowMs,
        },
      ],
      immuneSystemFactor: 0.4,
      diseaseImmunityIds: [],
    };

    const revived = revivingWorldPlazaEntityHealthToFull(state, nowMs);

    expect(revived.isDead).toBe(false);
    expect(revived.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX
    );
    expect(revived.maxHealthScale).toBe(1);
    expect(revived.temporaryMaxHealthBonuses).toEqual([]);
    expect(revived.movementModifiers).toEqual([]);
    expect(revived.incomingDamageModifiers).toEqual([]);
    expect(revived.damageRollModifiers).toEqual([]);
    expect(revived.confusionEffects).toEqual([]);
    expect(revived.sleepEffects).toEqual([]);
    expect(revived.stunEffects).toEqual([]);
    expect(revived.diseaseEffects).toEqual([]);
    expect(revived.poisonEffects).toEqual([]);
    expect(revived.bleedEffects).toEqual([]);
    expect(revived.immuneSystemFactor).toBe(0.4);
  });
});
