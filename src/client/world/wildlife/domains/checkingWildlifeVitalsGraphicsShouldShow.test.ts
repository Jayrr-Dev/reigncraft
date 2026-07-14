import { checkingWildlifeVitalsGraphicsShouldShow } from '@/components/world/wildlife/domains/checkingWildlifeVitalsGraphicsShouldShow';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeVitalsGraphicsShouldShow', () => {
  it('hides everything for dead or immortal animals', () => {
    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: true,
        isImmortal: false,
        healthRatio: 0.2,
        staminaRatio: 0.2,
        showHungerCircle: true,
      })
    ).toEqual({
      showGraphics: false,
      showBars: false,
      showHungerCircle: false,
    });

    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: false,
        isImmortal: true,
        healthRatio: 0.2,
        staminaRatio: 0.2,
        showHungerCircle: true,
      }).showGraphics
    ).toBe(false);
  });

  it('shows hunger circle alone when bars are full', () => {
    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: false,
        isImmortal: false,
        healthRatio: 1,
        staminaRatio: 1,
        showHungerCircle: true,
      })
    ).toEqual({
      showGraphics: true,
      showBars: false,
      showHungerCircle: true,
    });
  });

  it('shows bars without hunger when the feature is off', () => {
    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: false,
        isImmortal: false,
        healthRatio: 0.5,
        staminaRatio: 1,
        showHungerCircle: false,
      })
    ).toEqual({
      showGraphics: true,
      showBars: true,
      showHungerCircle: false,
    });
  });
});
