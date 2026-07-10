import { creatingWorldPlazaPlayerNightLightGlowBlurFilter } from '@/components/world/domains/creatingWorldPlazaPlayerNightLightGlowBlurFilter';
import type { BlurFilter, Graphics } from 'pixi.js';

/**
 * Applies a dedicated blur filter to the warm torch glow graphics instance.
 *
 * Callers that destroy the graphics must clear {@link graphics.filters} and
 * destroy the returned filter themselves.
 *
 * @param graphics - Pixi graphics instance to soften.
 */
export function applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics(
  graphics: Graphics
): BlurFilter {
  const blurFilter = creatingWorldPlazaPlayerNightLightGlowBlurFilter();
  graphics.filters = [blurFilter];
  return blurFilter;
}
