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
  /**
   * When true, this living animal may show a hunger orb (domesticated / bonded
   * pets only; wild animals stay off).
   */
  showHungerCircle: boolean;
};

export type CheckingWildlifeVitalsGraphicsShouldShowResult = {
  showGraphics: boolean;
  showBars: boolean;
  showHungerCircle: boolean;
};

/**
 * Resolves whether vitals Graphics should mount and which pieces to draw.
 * Hunger orb rides the same show/hide window as HP + stamina bars.
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
  const hungerVisible = showHungerCircle && showBars;

  return {
    showGraphics: showBars,
    showBars,
    showHungerCircle: hungerVisible,
  };
}
