import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_QUALITY,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_STRENGTH_PX,
} from "@/components/world/domains/definingWorldPlazaPlayerNightLightConstants";
import { BlurFilter } from "pixi.js";

/**
 * Builds the blur filter that softens the player torch glow into a diffuse halo.
 */
export function creatingWorldPlazaPlayerNightLightGlowBlurFilter(): BlurFilter {
  return new BlurFilter({
    strength: DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_STRENGTH_PX,
    quality: DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_QUALITY,
  });
}
