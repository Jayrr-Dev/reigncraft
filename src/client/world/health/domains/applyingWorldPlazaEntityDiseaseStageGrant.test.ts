import { applyingWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/applyingWorldPlazaEntityDiseaseStageGrant';
import { computingWorldPlazaInGameHoursToDiseaseRealMs } from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseDurationMs';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntityDiseaseStageGrant', () => {
  it('builds poison pools from percent of max HP and grant duration', () => {
    const nowMs = 10_000;
    const state = creatingWorldPlazaEntityHealthInitialState();
    const nextState = applyingWorldPlazaEntityDiseaseStageGrant({
      state,
      diseaseInstanceId: 'disease-1',
      grantIndex: 0,
      grant: {
        kind: 'poison',
        delayMs: 0,
        potency: 'toxic',
        healthPercentDamage: 0.1,
        durationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(12),
      },
      nowMs,
    });

    expect(nextState.poisonEffects).toHaveLength(1);
    expect(nextState.poisonEffects[0]?.totalPoisonDamage).toBe(
      Math.round(state.baseMaxHealth * 0.1)
    );
    expect(nextState.poisonEffects[0]?.expiresAtMs).toBe(
      nowMs + computingWorldPlazaInGameHoursToDiseaseRealMs(12)
    );
  });

  it('builds bleed pools from percent of max HP and grant duration', () => {
    const nowMs = 10_000;
    const state = creatingWorldPlazaEntityHealthInitialState();
    const nextState = applyingWorldPlazaEntityDiseaseStageGrant({
      state,
      diseaseInstanceId: 'disease-1',
      grantIndex: 0,
      grant: {
        kind: 'bleed',
        delayMs: 0,
        severity: 'bleeding',
        healthPercentDamage: 0.08,
        durationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(12),
      },
      nowMs,
    });

    expect(nextState.bleedEffects).toHaveLength(1);
    expect(nextState.bleedEffects[0]?.remainingBleedDamage).toBe(
      Math.round(state.baseMaxHealth * 0.08)
    );
    expect(nextState.bleedEffects[0]?.expiresAtMs).toBe(
      nowMs + computingWorldPlazaInGameHoursToDiseaseRealMs(12)
    );
  });

  it('schedules fated damage from percent of max HP', () => {
    const nowMs = 10_000;
    const state = creatingWorldPlazaEntityHealthInitialState();
    const resolveDelayMs = computingWorldPlazaInGameHoursToDiseaseRealMs(8);
    const nextState = applyingWorldPlazaEntityDiseaseStageGrant({
      state,
      diseaseInstanceId: 'disease-1',
      grantIndex: 0,
      grant: {
        kind: 'potential_damage',
        delayMs: 0,
        healthPercentDamage: 0.15,
        resolveDelayMs,
      },
      nowMs,
    });

    expect(nextState.potentialDamageEffects).toHaveLength(1);
    expect(nextState.potentialDamageEffects[0]?.pendingExpectedDamage).toBe(
      Math.round(state.baseMaxHealth * 0.15)
    );
    expect(nextState.potentialDamageEffects[0]?.resolvesAtMs).toBe(
      nowMs + resolveDelayMs
    );
  });
});
