/**
 * Default Reigncraft badge palette: rainbow hues with three dark fill depths.
 *
 * @module components/ui/domains/definingReigncraftBadgeConstants
 */

/** Rainbow badge hues (ROYGBIV). */
export type DefiningReigncraftBadgeRainbowColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'violet';

/** Dark fill depth for rainbow badges (lightest dark → near-black). */
export type DefiningReigncraftBadgeDarkShade = 'dark' | 'darker' | 'deepest';

/** Paint tokens for one rainbow badge hue and shade. */
export type DefiningReigncraftBadgePaint = {
  shellClassName: string;
};

/** Ordered rainbow hues for registries and pickers. */
export const DEFINING_REIGNCRAFT_BADGE_RAINBOW_COLORS: readonly DefiningReigncraftBadgeRainbowColor[] =
  ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'] as const;

/** Ordered dark shades from standard dark to near-black. */
export const DEFINING_REIGNCRAFT_BADGE_DARK_SHADES: readonly DefiningReigncraftBadgeDarkShade[] =
  ['dark', 'darker', 'deepest'] as const;

/** CSS shell class authored in `index.css` (embossed dark plaque). */
export const DEFINING_REIGNCRAFT_BADGE_CSS_SHELL_CLASS_NAME =
  'plaza-rainbow-badge' as const;

/** Shared layout shell for compact HUD count badges. */
export const DEFINING_REIGNCRAFT_BADGE_CAPACITY_SHELL_CLASS_NAME =
  'flex h-5 min-w-0 flex-row items-center justify-center gap-1 rounded-sm border px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]' as const;

/** Capacity badge label typography (white on dark fill). */
export const DEFINING_REIGNCRAFT_BADGE_CAPACITY_LABEL_CLASS_NAME =
  'text-[7px] font-semibold uppercase tracking-[0.14em] text-white/85' as const;

/** Capacity badge value typography. */
export const DEFINING_REIGNCRAFT_BADGE_CAPACITY_VALUE_CLASS_NAME =
  'text-[11px] font-bold leading-none tabular-nums tracking-tight text-white' as const;

/** Capacity badge max denominator typography. */
export const DEFINING_REIGNCRAFT_BADGE_CAPACITY_MAX_VALUE_CLASS_NAME =
  'text-[10px] font-semibold text-white/45' as const;

/** Tutorial / guide demo sizing (slightly larger than in-world HUD). */
export const DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_SHELL_CLASS_NAME =
  'flex flex-1 items-center justify-between rounded-sm border px-1.5 py-1 text-[9px] font-semibold' as const;

export const DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_LABEL_CLASS_NAME =
  'text-white/90' as const;

export const DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_VALUE_CLASS_NAME =
  'tabular-nums text-white' as const;

export const DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_MAX_VALUE_CLASS_NAME =
  'text-white/55' as const;

/**
 * Dark fill + tinted border per rainbow hue and shade.
 * Text is always white (set on shell via `text-white`).
 */
export const DEFINING_REIGNCRAFT_BADGE_RAINBOW_PAINT_REGISTRY: Record<
  DefiningReigncraftBadgeRainbowColor,
  Record<DefiningReigncraftBadgeDarkShade, DefiningReigncraftBadgePaint>
> = {
  red: {
    dark: {
      shellClassName: 'border-red-500/55 bg-red-900 text-white',
    },
    darker: {
      shellClassName: 'border-red-500/50 bg-red-950 text-white',
    },
    deepest: {
      shellClassName: 'border-red-400/45 bg-[#1a0606] text-white',
    },
  },
  orange: {
    dark: {
      shellClassName: 'border-orange-500/55 bg-orange-900 text-white',
    },
    darker: {
      shellClassName: 'border-orange-500/50 bg-orange-950 text-white',
    },
    deepest: {
      shellClassName: 'border-orange-400/45 bg-[#1a0c04] text-white',
    },
  },
  yellow: {
    dark: {
      shellClassName: 'border-yellow-500/55 bg-yellow-900 text-white',
    },
    darker: {
      shellClassName: 'border-yellow-500/50 bg-yellow-950 text-white',
    },
    deepest: {
      shellClassName: 'border-yellow-400/45 bg-[#1a1404] text-white',
    },
  },
  green: {
    dark: {
      shellClassName: 'border-green-500/55 bg-green-900 text-white',
    },
    darker: {
      shellClassName: 'border-green-500/50 bg-green-950 text-white',
    },
    deepest: {
      shellClassName: 'border-green-400/45 bg-[#061a0a] text-white',
    },
  },
  blue: {
    dark: {
      shellClassName: 'border-blue-500/55 bg-blue-900 text-white',
    },
    darker: {
      shellClassName: 'border-blue-500/50 bg-blue-950 text-white',
    },
    deepest: {
      shellClassName: 'border-blue-400/45 bg-[#040a1a] text-white',
    },
  },
  indigo: {
    dark: {
      shellClassName: 'border-indigo-500/55 bg-indigo-900 text-white',
    },
    darker: {
      shellClassName: 'border-indigo-500/50 bg-indigo-950 text-white',
    },
    deepest: {
      shellClassName: 'border-indigo-400/45 bg-[#08061a] text-white',
    },
  },
  violet: {
    dark: {
      shellClassName: 'border-violet-500/55 bg-violet-900 text-white',
    },
    darker: {
      shellClassName: 'border-violet-500/50 bg-violet-950 text-white',
    },
    deepest: {
      shellClassName: 'border-violet-400/45 bg-[#12061a] text-white',
    },
  },
};

/** Semantic rainbow badge presets used across gameplay HUD. */
export const DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS = {
  plotCapacity: { color: 'orange', shade: 'dark' },
  tileCapacity: { color: 'blue', shade: 'dark' },
  temporaryTileCapacity: { color: 'green', shade: 'dark' },
  capacityAtMax: { color: 'red', shade: 'darker' },
  localPlotCoordinate: { color: 'orange', shade: 'darker' },
  otherPlotCoordinate: { color: 'indigo', shade: 'dark' },
  savedCoordinate: { color: 'yellow', shade: 'darker' },
  notification: { color: 'orange', shade: 'deepest' },
} as const satisfies Record<
  string,
  {
    color: DefiningReigncraftBadgeRainbowColor;
    shade: DefiningReigncraftBadgeDarkShade;
  }
>;
