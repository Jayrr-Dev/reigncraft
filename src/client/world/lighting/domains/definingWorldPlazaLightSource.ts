/**
 * World-space light sources rendered as warm ground glows at night.
 *
 * Any feature (fires, lamps, torch posts) can publish lights into the shared
 * store; one renderer draws them all on the Pixi floor layer with brightness
 * driven by the day/night darkness curve.
 *
 * @module components/world/lighting/domains/definingWorldPlazaLightSource
 */

/** One world light source in grid coordinates. */
export type DefiningWorldPlazaLightSource = {
  /** Stable id, e.g. `fire:3,4,0`. */
  readonly id: string;
  /** Grid X of the glow center (tile units, fractional allowed). */
  readonly gridX: number;
  /** Grid Y of the glow center (tile units, fractional allowed). */
  readonly gridY: number;
  /** World layer the light sits on. */
  readonly worldLayer: number;
  /** Glow footprint relative to the baked torch texture (1 = torch size). */
  readonly radiusScale: number;
  /** Source strength 0..1; multiplied by the night darkness curve. */
  readonly brightness: number;
  /** Optional warm tint applied to the glow sprite. */
  readonly colorTint?: number;
};

/** Default glow tint: warm campfire orange. */
export const DEFINING_WORLD_PLAZA_LIGHT_SOURCE_DEFAULT_TINT = 0xffb86b;

/** Max glow sprites rendered per frame. */
export const DEFINING_WORLD_PLAZA_LIGHT_SOURCE_MAX_RENDERED_COUNT = 32;

/** Alpha multiplier applied to every glow at full brightness and midnight. */
export const DEFINING_WORLD_PLAZA_LIGHT_SOURCE_WARM_CORE_ALPHA = 0.68;
