import type { ComputingWorldPlazaDayNightSunState } from "@/components/world/domains/computingWorldPlazaDayNightSunState";
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_MIDNIGHT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_TWILIGHT,
} from "@/components/world/domains/definingWorldPlazaDayNightCycleConstants";
import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_DARKNESS_RESPONSE_EXPONENT,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BRIGHTNESS_MAX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BRIGHTNESS_MIN,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VIGNETTE_STRENGTH_MAX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VIGNETTE_STRENGTH_MIN,
} from "@/components/world/domains/definingWorldPlazaPlayerNightLightConstants";

/** Torch lighting derived from the shared day/night cycle. */
export type ComputingWorldPlazaPlayerNightLightState = {
  /** Normalized night darkness from twilight (0) to midnight (1). */
  readonly darknessNormalized: number;
  /** Warm ground glow brightness (0..1). */
  readonly glowBrightness: number;
  /** Outer vignette strength (0..1). */
  readonly vignetteStrength: number;
};

const COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OFF_STATE: ComputingWorldPlazaPlayerNightLightState =
  {
    darknessNormalized: 0,
    glowBrightness: 0,
    vignetteStrength: 0,
  };

/**
 * Maps edge vignette darkness into a 0..1 night amount.
 *
 * @param edgeVignetteAlpha - Current edge vignette opacity.
 */
function computingWorldPlazaPlayerNightLightDarknessNormalizedFromEdgeVignetteAlpha(
  edgeVignetteAlpha: number,
): number {
  const darknessSpan =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_MIDNIGHT -
    DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_TWILIGHT;

  if (darknessSpan <= 0) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(
      0,
      (edgeVignetteAlpha -
        DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_TWILIGHT) /
        darknessSpan,
    ),
  );
}

/**
 * Maps the shared sun state to torch glow and vignette strengths.
 *
 * Glow brightness ramps up faster as the world gets darker so the torch feels
 * faint at twilight and strongest at midnight.
 *
 * @param sunState - Current day/night lighting snapshot.
 */
export function computingWorldPlazaPlayerNightLightStateFromSunState(
  sunState: ComputingWorldPlazaDayNightSunState,
): ComputingWorldPlazaPlayerNightLightState {
  if (sunState.isDaytime) {
    return COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OFF_STATE;
  }

  const darknessNormalized =
    computingWorldPlazaPlayerNightLightDarknessNormalizedFromEdgeVignetteAlpha(
      sunState.edgeVignetteAlpha,
    );
  const darknessCurve = Math.pow(
    darknessNormalized,
    DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_DARKNESS_RESPONSE_EXPONENT,
  );

  return {
    darknessNormalized,
    glowBrightness:
      DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BRIGHTNESS_MIN +
      (DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BRIGHTNESS_MAX -
        DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BRIGHTNESS_MIN) *
        darknessCurve,
    vignetteStrength:
      DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VIGNETTE_STRENGTH_MIN +
      (DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VIGNETTE_STRENGTH_MAX -
        DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VIGNETTE_STRENGTH_MIN) *
        darknessNormalized,
  };
}

/**
 * Maps the shared sun state to a 0..1 torch vignette multiplier.
 *
 * @param sunState - Current day/night lighting snapshot.
 */
export function computingWorldPlazaPlayerNightLightStrengthFromSunState(
  sunState: ComputingWorldPlazaDayNightSunState,
): number {
  return computingWorldPlazaPlayerNightLightStateFromSunState(sunState)
    .vignetteStrength;
}
