import {
  DEFINING_WORLD_PLAZA_CONFUSION_FADE_OUT_MS,
  DEFINING_WORLD_PLAZA_CONFUSION_RAMP_IN_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import { resolvingWorldPlazaEntityHealthConfusionMovement } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthConfusionMovement';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityHealthConfusionMovement', () => {
  it('ramps effective intensity from zero to full over the ramp window', () => {
    const appliedAtMs = 1000;
    const state = {
      confusionEffects: [
        {
          id: 'confusion-debuff',
          targetIntensity: 100,
          appliedAtMs,
          expiresAtMs: appliedAtMs + 60_000,
          phaseSeed: 0.5,
        },
      ],
    };

    const atStart = resolvingWorldPlazaEntityHealthConfusionMovement(
      state,
      appliedAtMs
    );
    const midRamp = resolvingWorldPlazaEntityHealthConfusionMovement(
      state,
      appliedAtMs + DEFINING_WORLD_PLAZA_CONFUSION_RAMP_IN_MS / 2
    );
    const fullRamp = resolvingWorldPlazaEntityHealthConfusionMovement(
      state,
      appliedAtMs + DEFINING_WORLD_PLAZA_CONFUSION_RAMP_IN_MS
    );

    expect(atStart.effectiveIntensity).toBe(0);
    expect(midRamp.effectiveIntensity).toBeGreaterThan(0);
    expect(midRamp.effectiveIntensity).toBeLessThan(100);
    expect(fullRamp.effectiveIntensity).toBe(100);
    expect(fullRamp.phaseSeed).toBe(0.5);
  });

  it('fades effective intensity out near expiry', () => {
    const appliedAtMs = 0;
    const expiresAtMs = 10_000;
    const state = {
      confusionEffects: [
        {
          id: 'confusion-debuff',
          targetIntensity: 80,
          appliedAtMs,
          expiresAtMs,
          phaseSeed: 1.2,
        },
      ],
    };

    const beforeFade = resolvingWorldPlazaEntityHealthConfusionMovement(
      state,
      expiresAtMs - DEFINING_WORLD_PLAZA_CONFUSION_FADE_OUT_MS - 1000
    );
    const duringFade = resolvingWorldPlazaEntityHealthConfusionMovement(
      state,
      expiresAtMs - DEFINING_WORLD_PLAZA_CONFUSION_FADE_OUT_MS / 2
    );

    expect(beforeFade.effectiveIntensity).toBe(80);
    expect(duringFade.effectiveIntensity).toBeGreaterThan(0);
    expect(duringFade.effectiveIntensity).toBeLessThan(80);
  });

  it('returns zero intensity when no confusion effects are active', () => {
    expect(
      resolvingWorldPlazaEntityHealthConfusionMovement(null, 0).effectiveIntensity
    ).toBe(0);
    expect(
      resolvingWorldPlazaEntityHealthConfusionMovement(
        { confusionEffects: [] },
        0
      ).effectiveIntensity
    ).toBe(0);
  });
});
