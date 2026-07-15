import { checkingWorldPlazaOnboardingTemperatureOutsideComfort } from '@/components/world/onboarding/domains/checkingWorldPlazaOnboardingTemperatureOutsideComfort';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaOnboardingTemperatureOutsideComfort', () => {
  it('returns false inside the comfort band', () => {
    expect(
      checkingWorldPlazaOnboardingTemperatureOutsideComfort(20, {
        comfortLowCelsius: 10,
        comfortHighCelsius: 28,
      })
    ).toBe(false);
  });

  it('returns true when colder than comfort', () => {
    expect(
      checkingWorldPlazaOnboardingTemperatureOutsideComfort(5, {
        comfortLowCelsius: 10,
        comfortHighCelsius: 28,
      })
    ).toBe(true);
  });
});
