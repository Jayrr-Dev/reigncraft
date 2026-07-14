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
   * Instance stamina cap (apex / fleet prey may exceed 1). Full bar means
   * `staminaRatio` is at this max, not necessarily at 1.
   */
  maxStaminaRatio?: number;
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

/** Hide vitals when fill is within this of a full bar. */
const CHECKING_WILDLIFE_VITALS_FULL_RATIO_EPSILON = 0.999;

/**
 * Resolves whether vitals Graphics should mount and which pieces to draw.
 * Hunger orb rides the same show/hide window as HP + stamina bars.
 */
export function checkingWildlifeVitalsGraphicsShouldShow({
  isDead,
  isImmortal,
  healthRatio,
  staminaRatio,
  maxStaminaRatio = 1,
  showHungerCircle,
}: CheckingWildlifeVitalsGraphicsShouldShowParams): CheckingWildlifeVitalsGraphicsShouldShowResult {
  if (isDead || isImmortal) {
    return {
      showGraphics: false,
      showBars: false,
      showHungerCircle: false,
    };
  }

  const staminaFill = staminaRatio / Math.max(maxStaminaRatio, Number.EPSILON);
  const showBars =
    healthRatio < CHECKING_WILDLIFE_VITALS_FULL_RATIO_EPSILON ||
    staminaFill < CHECKING_WILDLIFE_VITALS_FULL_RATIO_EPSILON;
  const hungerVisible = showHungerCircle && showBars;

  return {
    showGraphics: showBars,
    showBars,
    showHungerCircle: hungerVisible,
  };
}
