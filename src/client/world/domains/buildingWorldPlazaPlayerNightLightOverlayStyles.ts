import { DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_ALPHA } from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';

/** Viewport anchor and size for the player torch overlay. */
export type BuildingWorldPlazaPlayerNightLightOverlayAnchor = {
  readonly centerXPx: number;
  readonly centerYPx: number;
  /** Horizontal light radius in viewport pixels. */
  readonly radiusXPx: number;
  /** Vertical light radius (squashed for the isometric ground plane). */
  readonly radiusYPx: number;
};

/**
 * Builds the masked outer-darkness layer that keeps only a local area visible.
 *
 * The ellipse matches the isometric ground projection and the alpha ramp
 * approximates an inverse-square falloff so the edge fades naturally instead
 * of showing a hard ring. As `holeCloseStrength` rises the transparent center
 * fills back in with darkness so the light hole no longer shines through
 * columns the player is tucked behind.
 *
 * @param anchor - Torch center and radii in viewport pixels.
 * @param strength - Night torch strength (0..1).
 * @param holeCloseStrength - How far the light hole closes (0 open .. 1 closed).
 */
export function buildingWorldPlazaPlayerNightLightOuterDarknessMaskImage(
  anchor: BuildingWorldPlazaPlayerNightLightOverlayAnchor,
  strength: number,
  holeCloseStrength = 0
): string {
  const { centerXPx, centerYPx, radiusXPx, radiusYPx } = anchor;
  const darknessAlpha = (fraction: number): string => {
    const closedFraction = fraction + (1 - fraction) * holeCloseStrength;

    return (strength * closedFraction).toFixed(3);
  };

  return `radial-gradient(ellipse ${radiusXPx}px ${radiusYPx}px at ${centerXPx}px ${centerYPx}px, rgba(0, 0, 0, ${darknessAlpha(0)}) 0%, rgba(0, 0, 0, ${darknessAlpha(0)}) 16%, rgba(0, 0, 0, ${darknessAlpha(0.14)}) 30%, rgba(0, 0, 0, ${darknessAlpha(0.38)}) 44%, rgba(0, 0, 0, ${darknessAlpha(0.66)}) 58%, rgba(0, 0, 0, ${darknessAlpha(0.88)}) 72%, black 84%)`;
}

/**
 * Resolves inline styles for the masked outer-darkness torch layer.
 *
 * @param anchor - Torch center and radius in viewport pixels.
 * @param strength - Night torch strength (0..1).
 * @param holeCloseStrength - How far the light hole closes (0 open .. 1 closed).
 */
export function buildingWorldPlazaPlayerNightLightOuterDarknessStyle(
  anchor: BuildingWorldPlazaPlayerNightLightOverlayAnchor,
  strength: number,
  holeCloseStrength = 0
): {
  backgroundColor: string;
  maskImage: string;
  WebkitMaskImage: string;
  opacity: number;
} {
  const maskImage = buildingWorldPlazaPlayerNightLightOuterDarknessMaskImage(
    anchor,
    strength,
    holeCloseStrength
  );

  return {
    backgroundColor: `rgba(0, 0, 0, ${(strength * DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_ALPHA).toFixed(3)})`,
    maskImage,
    WebkitMaskImage: maskImage,
    opacity: strength,
  };
}
