import {
  DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_FULL_FADE_NORMALIZED_DISTANCE,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ZERO_FADE_NORMALIZED_DISTANCE,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ELLIPSE_RADIUS_X_MULTIPLIER,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ELLIPSE_RADIUS_Y_MULTIPLIER,
} from "@/components/world/domains/definingWorldPlazaTreeCanopyPlayerOcclusionConstants";
import {
  resolvingWorldPlazaTreeCanopyFootprintRadiusPx,
  resolvingWorldPlazaTreeTrunkHeightPx,
  resolvingWorldPlazaTreeVisualScale,
} from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Screen-space canopy fade strength from avatar/crown visual overlap.
 *
 * @module components/world/domains/computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength
 */

/** Input for {@link computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength}. */
export interface ComputingWorldPlazaTreeCanopyPlayerScreenOcclusionStrengthInput {
  /** Avatar visual body center X in world screen space. */
  readonly avatarScreenX: number;
  /** Avatar visual body center Y in world screen space. */
  readonly avatarScreenY: number;
  /** Trunk base X in world screen space (including elevation offset). */
  readonly canopyBaseScreenX: number;
  /** Trunk base Y in world screen space (including elevation offset). */
  readonly canopyBaseScreenY: number;
  /** Tree variant and placement scale. */
  readonly tree: DefiningWorldPlazaTreeInstance;
}

/**
 * Computes 0..1 fade strength from how much the drawn crown covers the avatar.
 *
 * Models the painted crown as a screen-space ellipse centered above the trunk
 * and measures the avatar's normalized distance to it: 1 when the avatar sits
 * inside the crown, easing to 0 as it clears the foliage silhouette.
 *
 * @param input - Avatar and trunk-base screen positions plus tree instance.
 */
export function computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength(
  input: ComputingWorldPlazaTreeCanopyPlayerScreenOcclusionStrengthInput,
): number {
  const scale = resolvingWorldPlazaTreeVisualScale(input.tree);
  const trunkHeightPx = resolvingWorldPlazaTreeTrunkHeightPx(input.tree, scale);
  const crownRadiusPx = resolvingWorldPlazaTreeCanopyFootprintRadiusPx(
    input.tree,
  );

  const crownCenterX = input.canopyBaseScreenX;
  const crownCenterY =
    input.canopyBaseScreenY - trunkHeightPx - crownRadiusPx * 0.5;
  const ellipseRadiusX =
    crownRadiusPx * DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ELLIPSE_RADIUS_X_MULTIPLIER;
  const ellipseRadiusY =
    crownRadiusPx * DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ELLIPSE_RADIUS_Y_MULTIPLIER;

  const normalizedDistance = Math.hypot(
    (input.avatarScreenX - crownCenterX) / ellipseRadiusX,
    (input.avatarScreenY - crownCenterY) / ellipseRadiusY,
  );

  if (
    normalizedDistance <=
    DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_FULL_FADE_NORMALIZED_DISTANCE
  ) {
    return 1;
  }

  if (
    normalizedDistance >=
    DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ZERO_FADE_NORMALIZED_DISTANCE
  ) {
    return 0;
  }

  const falloffSpan =
    DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ZERO_FADE_NORMALIZED_DISTANCE -
    DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_FULL_FADE_NORMALIZED_DISTANCE;
  const strength =
    1 -
    (normalizedDistance -
      DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_FULL_FADE_NORMALIZED_DISTANCE) /
      falloffSpan;

  // Smoothstep keeps the fade edge soft instead of a hard linear cutoff.
  return strength * strength * (3 - 2 * strength);
}
