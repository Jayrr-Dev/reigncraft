import { creatingWorldPlazaPlayerNightLightGlowBlurFilter } from "@/components/world/domains/creatingWorldPlazaPlayerNightLightGlowBlurFilter";
import type { Filter, Graphics } from "pixi.js";

const APPLYING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_FILTER =
  creatingWorldPlazaPlayerNightLightGlowBlurFilter();

/**
 * Applies blur to the warm torch glow graphics instance.
 *
 * @param graphics - Pixi graphics instance to soften.
 */
export function applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics(
  graphics: Graphics,
): void {
  const currentFilters = graphics.filters as Filter[] | null;

  if (
    currentFilters?.length === 1 &&
    currentFilters[0] === APPLYING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_FILTER
  ) {
    return;
  }

  graphics.filters = [APPLYING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_FILTER];
}
