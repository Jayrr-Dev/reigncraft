/**
 * Declarative visual tokens for the Spritcore sphere inventory icon.
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreSphereIconConstants
 */

/** SVG view box edge length for the Spritcore sphere glyph. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_VIEW_BOX = 24 as const;

/** Sphere radius in view-box units. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_RADIUS = 9 as const;

/** Radial highlight center for the orb body (view-box percentages). */
export const DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_HIGHLIGHT_CENTER = {
  cx: '34%',
  cy: '28%',
  r: '68%',
} as const;

/** Orb body gradient stops from highlight to shadow. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_BODY_STOPS = [
  { offset: '0%', color: '#f8f4ff' },
  { offset: '22%', color: '#d8b4fe' },
  { offset: '52%', color: '#8b5cf6' },
  { offset: '82%', color: '#5b21b6' },
  { offset: '100%', color: '#2e1065' },
] as const;

/** Specular highlight ellipse on the orb surface. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_SPECULAR = {
  cx: 9,
  cy: 8.5,
  rx: 2.6,
  ry: 1.9,
  opacity: 0.42,
} as const;
