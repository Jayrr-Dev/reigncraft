import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWildlifeInstanceEntityHudBadgeSnapshot } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceEntityHudBadgeSnapshot';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeInstanceEntityHudBadgeSnapshot', () => {
  const nowMs = 1_000_000;

  it('returns empty rows for a clean health state', () => {
    const snapshot = resolvingWildlifeInstanceEntityHudBadgeSnapshot({
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
    });

    expect(snapshot.activeBuffs).toEqual([]);
    expect(snapshot.statusEffectHudRows).toEqual([]);
  });

  it('lists symptomatic disease in activeBuffs and bleed in status rows', () => {
    const uniformValues = [Math.exp(-0.5), 0.25, Math.exp(-0.5), 0.25];
    let uniformIndex = 0;
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'salmonellosis',
      nowMs,
      () => uniformValues[uniformIndex++ % uniformValues.length]!
    );
    const symptomaticAtMs = state.diseaseEffects[0]!.symptomsStartAtMs;
    state = applyingWorldPlazaEntityHealthBleedStack(
      state,
      'bleeding',
      40,
      symptomaticAtMs
    );

    const snapshot = resolvingWildlifeInstanceEntityHudBadgeSnapshot({
      healthState: state,
      nowMs: symptomaticAtMs,
      worldEpochMs: symptomaticAtMs,
    });

    expect(snapshot.activeBuffs.some((row) => row.isDisease)).toBe(true);
    expect(
      snapshot.statusEffectHudRows.some((row) => row.id.includes('bleed'))
    ).toBe(true);
  });

  it('lists an active movement buff from health state', () => {
    const state = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'swift-stride-buff',
      nowMs
    );

    const snapshot = resolvingWildlifeInstanceEntityHudBadgeSnapshot({
      healthState: state,
      nowMs,
    });

    expect(
      snapshot.activeBuffs.some((row) => row.id === 'swift-stride-buff')
    ).toBe(true);
  });
});
