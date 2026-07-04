import type { ComputingWorldPlazaDayNightSunState } from "@/components/world/domains/computingWorldPlazaDayNightSunState";
import { DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_MIDNIGHT } from "@/components/world/domains/definingWorldPlazaDayNightCycleConstants";
import { DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_MIN_STRENGTH } from "@/components/world/domains/definingWorldPlazaPlayerNightLightConstants";

/**
 * Maps the shared sun state to a 0..1 torch strength multiplier.
 *
 * @param sunState - Current day/night lighting snapshot.
 */
export function computingWorldPlazaPlayerNightLightStrengthFromSunState(
  sunState: ComputingWorldPlazaDayNightSunState,
): number {
  if (sunState.isDaytime) {
    return 0;
  }

  const midnightNormalizedStrength =
    sunState.edgeVignetteAlpha /
    DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_MIDNIGHT;

  return Math.min(
    1,
    Math.max(
      DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_MIN_STRENGTH,
      midnightNormalizedStrength,
    ),
  );
}
