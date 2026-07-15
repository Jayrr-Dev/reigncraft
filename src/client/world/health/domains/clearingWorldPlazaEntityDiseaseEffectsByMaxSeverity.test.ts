import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity } from '@/components/world/health/domains/clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity', () => {
  it('clears only diseases at or below requested severity', () => {
    const nowMs = 1_000;
    const mildAndSevere = applyingWorldPlazaEntityDisease(
      applyingWorldPlazaEntityDisease(
        creatingWorldPlazaEntityHealthInitialState(),
        'salmonellosis',
        nowMs,
        () => 0.5
      ),
      'trichinellosis',
      nowMs,
      () => 0.5
    );

    const cleared = clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity(
      mildAndSevere,
      'mild'
    );

    expect(cleared.diseaseEffects.map((effect) => effect.diseaseId)).toEqual([
      'trichinellosis',
    ]);
  });
});
