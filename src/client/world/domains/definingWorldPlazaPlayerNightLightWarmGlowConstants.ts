/**
 * Layered warm glow drawn on the floor beneath avatars at night.
 */

/** Soft halo layers drawn largest first; tight bright core with steep falloff. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_GLOW_SOFT_LAYERS = [
  { radiusScale: 0.68, color: 0xfaba78, alphaScale: 0.07 },
  { radiusScale: 0.46, color: 0xffcc8e, alphaScale: 0.14 },
  { radiusScale: 0.28, color: 0xffdca4, alphaScale: 0.28 },
  { radiusScale: 0.15, color: 0xfff4e0, alphaScale: 0.58 },
  { radiusScale: 0.07, color: 0xfffaf0, alphaScale: 0.92 },
] as const;
