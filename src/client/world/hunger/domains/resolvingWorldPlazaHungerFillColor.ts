/**
 * Hunger orb fill colors: brown when full, reddish brown mid-drain,
 * charcoal when empty.
 *
 * @module components/world/hunger/domains/resolvingWorldPlazaHungerFillColor
 */

/** RGB triple for fill-stop interpolation. */
export type DefiningWorldPlazaHungerFillRgb = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

/** One stop on the hunger drain color ramp (ratio = hunger remaining). */
export type DefiningWorldPlazaHungerFillColorStop = {
  readonly ratio: number;
  readonly highlight: DefiningWorldPlazaHungerFillRgb;
  readonly mid: DefiningWorldPlazaHungerFillRgb;
  readonly shadow: DefiningWorldPlazaHungerFillRgb;
};

/** Full belly: warm brown. */
const DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_FULL = {
  ratio: 1,
  highlight: { r: 184, g: 115, b: 51 },
  mid: { r: 139, g: 90, b: 43 },
  shadow: { r: 107, g: 66, b: 32 },
} as const satisfies DefiningWorldPlazaHungerFillColorStop;

/** Mid drain: reddish brown. */
const DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_MID = {
  ratio: 0.4,
  highlight: { r: 176, g: 72, b: 52 },
  mid: { r: 138, g: 52, b: 40 },
  shadow: { r: 92, g: 32, b: 24 },
} as const satisfies DefiningWorldPlazaHungerFillColorStop;

/** Empty: charcoal black. */
const DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_EMPTY = {
  ratio: 0,
  highlight: { r: 58, g: 52, b: 48 },
  mid: { r: 28, g: 24, b: 22 },
  shadow: { r: 14, g: 12, b: 11 },
} as const satisfies DefiningWorldPlazaHungerFillColorStop;

/**
 * Drain color stops ordered high → low hunger.
 * Full brown → reddish brown → charcoal.
 */
export const DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_STOPS = [
  DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_FULL,
  DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_MID,
  DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_EMPTY,
] as const;

/** Resolved gradient colors for the hunger fill at a given ratio. */
export type ResolvingWorldPlazaHungerFillColors = {
  readonly highlightCss: string;
  readonly midCss: string;
  readonly shadowCss: string;
  /** Vertical fill gradient suitable for `background`. */
  readonly fillBackgroundCss: string;
};

function formattingHungerFillRgbCss(
  color: DefiningWorldPlazaHungerFillRgb
): string {
  return `rgb(${Math.round(color.r)} ${Math.round(color.g)} ${Math.round(color.b)})`;
}

function lerpingHungerFillRgb(
  from: DefiningWorldPlazaHungerFillRgb,
  to: DefiningWorldPlazaHungerFillRgb,
  t: number
): DefiningWorldPlazaHungerFillRgb {
  const clampedT = Math.min(1, Math.max(0, t));
  return {
    r: from.r + (to.r - from.r) * clampedT,
    g: from.g + (to.g - from.g) * clampedT,
    b: from.b + (to.b - from.b) * clampedT,
  };
}

/**
 * Interpolates hunger fill colors along the brown → red-brown → charcoal ramp.
 *
 * @param hungerRatio - Current hunger as a 0..1 ratio (1 = full)
 */
export function resolvingWorldPlazaHungerFillColors(
  hungerRatio: number
): ResolvingWorldPlazaHungerFillColors {
  const clampedRatio = Math.min(1, Math.max(0, hungerRatio));
  const stops = DEFINING_WORLD_PLAZA_HUNGER_FILL_COLOR_STOPS;

  let upperStop = stops[0];
  let lowerStop = stops[stops.length - 1];

  for (let stopIndex = 0; stopIndex < stops.length - 1; stopIndex += 1) {
    const candidateUpper = stops[stopIndex];
    const candidateLower = stops[stopIndex + 1];
    if (
      clampedRatio <= candidateUpper.ratio &&
      clampedRatio >= candidateLower.ratio
    ) {
      upperStop = candidateUpper;
      lowerStop = candidateLower;
      break;
    }
  }

  const span = upperStop.ratio - lowerStop.ratio;
  const t = span <= 0 ? 0 : (upperStop.ratio - clampedRatio) / span;

  const highlight = lerpingHungerFillRgb(
    upperStop.highlight,
    lowerStop.highlight,
    t
  );
  const mid = lerpingHungerFillRgb(upperStop.mid, lowerStop.mid, t);
  const shadow = lerpingHungerFillRgb(upperStop.shadow, lowerStop.shadow, t);
  const highlightCss = formattingHungerFillRgbCss(highlight);
  const midCss = formattingHungerFillRgbCss(mid);
  const shadowCss = formattingHungerFillRgbCss(shadow);

  return {
    highlightCss,
    midCss,
    shadowCss,
    fillBackgroundCss: `linear-gradient(180deg, ${highlightCss} 0%, ${midCss} 55%, ${shadowCss} 100%)`,
  };
}
