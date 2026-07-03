import type { CSSProperties } from "react";

/**
 * Palette swatch appearance for build block definitions.
 *
 * Supports image files (PNG, JPG, WEBP, SVG) and arbitrary CSS backgrounds.
 * In-world Pixi rendering still uses {@link DefiningWorldBuildingBlockVisualConfig.fillColor}
 * until texture loading is wired into the draw pipeline.
 *
 * @module components/world/building/domains/definingWorldBuildingBlockPaletteSurface
 */

/** Image file palette surface (PNG, JPG, WEBP, SVG). */
export const DEFINING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_KIND_IMAGE =
  "image" as const;

/** CSS background palette surface (gradients, patterns). */
export const DEFINING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_KIND_CSS =
  "css" as const;

/** Discriminated union for palette swatch backgrounds. */
export type DefiningWorldBuildingBlockPaletteSurface =
  | {
      readonly kind: typeof DEFINING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_KIND_IMAGE;
      readonly src: string;
      readonly alt?: string;
    }
  | {
      readonly kind: typeof DEFINING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_KIND_CSS;
      readonly background: string;
    };

/** CSS background-size for image palette surfaces. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_IMAGE_BACKGROUND_SIZE =
  "cover" as const;

/** CSS background-position for image palette surfaces. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_IMAGE_BACKGROUND_POSITION =
  "center" as const;

/** CSS background-repeat for image palette surfaces. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_IMAGE_BACKGROUND_REPEAT =
  "no-repeat" as const;

/**
 * Creates an image palette surface from a public asset path or URL.
 *
 * @param src - Public path or URL to a PNG, JPG, WEBP, or SVG file.
 * @param alt - Optional accessible description for the swatch.
 */
export function creatingWorldBuildingBlockImagePaletteSurface(
  src: string,
  alt?: string,
): DefiningWorldBuildingBlockPaletteSurface {
  return {
    kind: DEFINING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_KIND_IMAGE,
    src,
    ...(alt !== undefined ? { alt } : {}),
  };
}

/**
 * Creates a CSS palette surface from any valid CSS background value.
 *
 * @param background - CSS background shorthand (gradient, pattern, etc.).
 */
export function creatingWorldBuildingBlockCssPaletteSurface(
  background: string,
): DefiningWorldBuildingBlockPaletteSurface {
  return {
    kind: DEFINING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_KIND_CSS,
    background,
  };
}

/**
 * Resolves inline styles for a palette swatch surface.
 *
 * @param surface - Palette surface definition.
 */
export function resolvingWorldBuildingBlockPaletteSurfaceStyle(
  surface: DefiningWorldBuildingBlockPaletteSurface,
): CSSProperties {
  if (
    surface.kind === DEFINING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_KIND_IMAGE
  ) {
    return {
      backgroundImage: `url("${surface.src}")`,
      backgroundSize:
        RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_IMAGE_BACKGROUND_SIZE,
      backgroundPosition:
        RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_IMAGE_BACKGROUND_POSITION,
      backgroundRepeat:
        RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_SURFACE_IMAGE_BACKGROUND_REPEAT,
    };
  }

  return {
    background: surface.background,
  };
}
