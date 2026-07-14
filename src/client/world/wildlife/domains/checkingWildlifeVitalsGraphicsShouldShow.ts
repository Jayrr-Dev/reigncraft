/**
 * Visibility gate for wildlife overhead vitals Graphics.
 *
 * @module components/world/wildlife/domains/checkingWildlifeVitalsGraphicsShouldShow
 */

export type CheckingWildlifeVitalsGraphicsShouldShowParams = {
  isDead: boolean;
  isImmortal: boolean;
  healthRatio: number;
  staminaRatio: number;
  /** When true, always show the hunger orb for living mortal animals. */
  showHungerCircle: boolean;
};

export type CheckingWildlifeVitalsGraphicsShouldShowResult = {
  showGraphics: boolean;
  showBars: boolean;
  showHungerCircle: boolean;
};

/**
 * Resolves whether vitals Graphics should mount and which pieces to draw.
 */
export function checkingWildlifeVitalsGraphicsShouldShow({
  isDead,
  isImmortal,
  healthRatio,
  staminaRatio,
  showHungerCircle,
}: CheckingWildlifeVitalsGraphicsShouldShowParams): CheckingWildlifeVitalsGraphicsShouldShowResult {
  if (isDead || isImmortal) {
    return {
      showGraphics: false,
      showBars: false,
      showHungerCircle: false,
    };
  }

  const showBars = healthRatio < 0.999 || staminaRatio < 0.999;
  const hungerVisible = showHungerCircle;

  return {
    showGraphics: showBars || hungerVisible,
    showBars,
    showHungerCircle: hungerVisible,
  };
}
