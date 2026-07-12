import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import {
  parsingWorldPlazaPlayerConditions,
  serializingWorldPlazaPlayerConditionsFromHealthState,
} from '@/components/world/health/domains/serializingWorldPlazaPlayerConditions';
import { describe, expect, it } from 'vitest';

describe('serializingWorldPlazaPlayerConditionsFromHealthState', () => {
  it('persists current health and hunger ratio', () => {
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 42,
    };

    const serialized = serializingWorldPlazaPlayerConditionsFromHealthState({
      state,
      worldEpochMs: 1_000,
      hungerRatio: 0.55,
    });

    expect(serialized).toEqual(
      expect.objectContaining({
        currentHealth: 42,
        hungerRatio: 0.55,
      })
    );
  });

  it('clamps hunger ratio into 0..1', () => {
    const serialized = serializingWorldPlazaPlayerConditionsFromHealthState({
      state: creatingWorldPlazaEntityHealthInitialState(),
      worldEpochMs: 1_000,
      hungerRatio: 1.5,
    });

    expect(serialized?.hungerRatio).toBe(1);
  });
});

describe('parsingWorldPlazaPlayerConditions', () => {
  it('restores vitals from a vitals-only payload', () => {
    const parsed = parsingWorldPlazaPlayerConditions(
      {
        diseaseEffects: [],
        currentHealth: 17,
        hungerRatio: 0.25,
      },
      1_000
    );

    expect(parsed.currentHealth).toBe(17);
    expect(parsed.hungerRatio).toBe(0.25);
    expect(parsed.diseaseEffects).toEqual([]);
  });

  it('returns null vitals when absent', () => {
    const parsed = parsingWorldPlazaPlayerConditions(
      {
        diseaseEffects: [],
      },
      1_000
    );

    expect(parsed.currentHealth).toBeNull();
    expect(parsed.hungerRatio).toBeNull();
  });
});
