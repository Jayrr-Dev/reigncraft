/**
 * Declarative config for continuous 360° danger-sense edge vignette HUD.
 *
 * @module components/world/domains/definingWorldPlazaDangerSenseHudConstants
 */

/** localStorage key for the player danger-sense visibility preference. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_PREFERENCE_STORAGE_KEY =
  'world-plaza-danger-sense-enabled' as const;

/** Default: on. Players can turn the rim vignette off in Settings. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_DEFAULT_ENABLED = true;

/** Settings row label in the action-bar mixer panel. */
export const LABELING_WORLD_PLAZA_DANGER_SENSE_TOGGLE = 'Danger Sense' as const;

/** Peak edge opacity at the outer rim when intensity is 1. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_PEAK_EDGE_ALPHA = 0.88;

/** CSS red for active hunt / combat danger. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_DANGER_RGB = {
  r: 255,
  g: 48,
  b: 48,
} as const;

/** CSS yellow for stalking / territory stand-ground caution. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_RGB = {
  r: 255,
  g: 210,
  b: 48,
} as const;

/** Beyond this grid distance, a threat no longer lights the edge. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_MAX_RANGE_GRID = 20;

/**
 * Inside this range, threats stay at full strength. Beyond it, intensity eases
 * down toward max range (closer = brighter, farther = more faded).
 */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FULL_INTENSITY_RANGE_GRID = 2;

/**
 * Exponent on the distance fade curve. Higher = faster drop-off with range
 * (far threats look much weaker).
 */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_DISTANCE_FALLOFF_POWER = 1.75;

/** Soft proximity-threat intensity cap (below locked chase/attack). */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SOFT_THREAT_INTENSITY_CAP = 0.62;

/** Locked aggro (activeTargetId) intensity before distance falloff. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_LOCKED_TARGET_INTENSITY = 0.85;

/** Active chase/attack intensity before distance falloff. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_HUNTING_INTENSITY = 1;

/** Stalk / territory-warn caution intensity before distance falloff. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY = 0.78;

/** How fast edge intensity rises toward a new threat (ms to nearly catch). */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_RISE_MS = 120;

/** How fast edge intensity falls after a threat leaves (ms). */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FALL_MS = 420;

/** Skip rewriting the conic CSS when max bin delta is below this. */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_WRITE_EPSILON = 0.004;

/**
 * Angular samples around the full circle for continuous bearing.
 * 72 = every 5°. Dense enough to read as smooth 360° without huge CSS strings.
 */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_COUNT = 72;

/**
 * Half-width of each threat's soft arc (radians). Threats bleed into neighbors
 * instead of lighting a single razor wedge.
 */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_ANGULAR_SPREAD_RADIANS =
  (29 * Math.PI) / 180;

/** Exponent on the angular lobe (higher = tighter hotspot, softer skirts). */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_ANGULAR_FALLOFF_POWER = 1.35;

/**
 * Soft square rim: how far the frame reaches inward from each side (% of viewport).
 * Soft stops are fractions of that band (0..100 within the rim).
 */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_FADE = {
  /** Rim depth from each side of the rectangle. */
  thicknessPercent: 5,
  /** Full-mask stop near the outer rim (0 = whole band is feathered). */
  rimSolidPercent: 0,
  /** First soft step within the band. */
  softNearPercent: 12,
  /** Mid opacity stop for soft falloff within the band. */
  softMidPercent: 35,
  /** Far soft step before the tail. */
  softFarPercent: 58,
  /** Near-transparent stop before the band becomes fully clear. */
  softTailPercent: 82,
} as const;

/**
 * Above Pixi + day/night (z-15), below gameplay HUD chrome (z-20).
 * Pointer events pass through to the stage.
 */
export const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_OVERLAY_CLASS_NAME =
  'pointer-events-none absolute inset-0 z-[16] overflow-hidden' as const;

/** One live threat contribution in screen-space bearing. */
export type DefiningWorldPlazaDangerSenseHudTint = 'caution' | 'danger';

export type DefiningWorldPlazaDangerSenseHudThreatBearing = {
  /** Screen bearing radians: 0 = east, increasing clockwise (Y-down atan2). */
  readonly bearingRadians: number;
  /** 0..1 threat strength after distance falloff. */
  readonly intensity: number;
  /** Yellow caution (stalk / territory) or red danger (hunt). */
  readonly tint: DefiningWorldPlazaDangerSenseHudTint;
};

/** Zeroed intensity ring for the continuous sample buffer. */
export function creatingWorldPlazaDangerSenseHudSampleIntensities(): Float32Array {
  return new Float32Array(DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_COUNT);
}

export function buildingWorldPlazaDangerSenseHudRgba(
  channelAlpha: number,
  tint: DefiningWorldPlazaDangerSenseHudTint = 'danger'
): string {
  const { r, g, b } =
    tint === 'caution'
      ? DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_RGB
      : DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_DANGER_RGB;
  return `rgba(${r}, ${g}, ${b}, ${channelAlpha.toFixed(3)})`;
}
