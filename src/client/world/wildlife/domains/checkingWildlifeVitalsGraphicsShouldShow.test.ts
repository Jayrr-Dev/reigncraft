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

  it('hides hunger when bars are full even for domesticated pets', () => {
    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: false,
        isImmortal: false,
        healthRatio: 1,
        staminaRatio: 1,
        showHungerCircle: true,
      })
    ).toEqual({
      showGraphics: false,
      showBars: false,
      showHungerCircle: false,
    });
  });

  it('shows hunger with bars for domesticated pets when HP/stamina drop', () => {
    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: false,
        isImmortal: false,
        healthRatio: 0.5,
        staminaRatio: 1,
        showHungerCircle: true,
      })
    ).toEqual({
      showGraphics: true,
      showBars: true,
      showHungerCircle: true,
    });
  });

  it('shows bars without hunger for wild animals', () => {
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

  it('shows bars when apex stamina is below its raised cap but still above 1', () => {
    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: false,
        isImmortal: false,
        healthRatio: 1,
        staminaRatio: 1.1,
        maxStaminaRatio: 1.3,
        showHungerCircle: true,
      })
    ).toEqual({
      showGraphics: true,
      showBars: true,
      showHungerCircle: true,
    });
  });

  it('hides bars when apex stamina is full at its raised cap', () => {
    expect(
      checkingWildlifeVitalsGraphicsShouldShow({
        isDead: false,
        isImmortal: false,
        healthRatio: 1,
        staminaRatio: 1.3,
        maxStaminaRatio: 1.3,
        showHungerCircle: true,
      })
    ).toEqual({
      showGraphics: false,
      showBars: false,
      showHungerCircle: false,
    });
  });
});
