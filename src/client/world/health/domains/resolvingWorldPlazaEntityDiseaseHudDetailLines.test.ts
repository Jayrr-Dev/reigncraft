import { resolvingWorldPlazaEntityDiseaseDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityDiseaseHudDetailLines } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseHudDetailLines';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityDiseaseHudDetailLines', () => {
  it('marks onset grants active and later grants as upcoming', () => {
    const descriptor =
      resolvingWorldPlazaEntityDiseaseDescriptor('liver-fluke');
    const symptomsStartAtMs = 1_000_000;
    const detail = resolvingWorldPlazaEntityDiseaseHudDetailLines({
      descriptor,
      diseaseEffect: {
        id: 'disease-instance-1',
        diseaseId: 'liver-fluke',
        contractedAtMs: symptomsStartAtMs - 10_000,
        symptomsStartAtMs,
        expiresAtMs: symptomsStartAtMs + 100_000,
        symptomStrengthMultiplier: 1,
        durationMultiplier: 1,
        pendingGrants: [],
      },
      worldEpochMs: symptomsStartAtMs + 1_000,
    });

    expect(detail.severityLabel).toBe('Moderate');
    expect(detail.effectLines[0]).toMatch(/^Active: /);
    expect(detail.effectLines[1]).toMatch(/in-game hour/);
    expect(detail.effectLines[1]).not.toMatch(/^Active: /);
  });
});
