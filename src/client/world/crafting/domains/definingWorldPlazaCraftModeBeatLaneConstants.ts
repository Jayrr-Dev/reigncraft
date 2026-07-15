/**
 * Beat-lane mini-game for cookbook crafts: notes rush right → left.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeBeatLaneConstants
 */

/** Note kinds that scroll through the hit zone. */
export type DefiningWorldPlazaCraftModeBeatNoteKind = 'hammer' | 'cracked';

export type DefiningWorldPlazaCraftModeBeatNoteDefinition = {
  readonly kind: DefiningWorldPlazaCraftModeBeatNoteKind;
  /** Delay from pattern start until this note should be centered in the hit zone. */
  readonly hitOffsetMs: number;
};

export type DefiningWorldPlazaCraftModeBeatPatternDefinition = {
  readonly id: string;
  readonly notes: readonly DefiningWorldPlazaCraftModeBeatNoteDefinition[];
};

/** How long a note takes to travel from spawn (right) to despawn (left). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS = 2_400;

/** Lane X% where notes spawn (off the right edge). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT = 108;

/** Lane X% where notes despawn (off the left edge). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT = -12;

/** Default / first gold-zone center (left side). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT = 18;

/**
 * Snap points for the gold zone, left → right.
 * Waves pick the next slot (usually advancing right, then wrap).
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_SNAP_CENTERS_PERCENT =
  [18, 34, 50, 66, 82] as const;

/** Half-width of the hittable gold window around its center. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT = 9;

/** Chance a wave snaps to a random slot instead of the next rightward one. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_RANDOM_SNAP_CHANCE = 0.35;

/** Idle gap between pattern waves (inclusive min). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MIN = 900;

/** Idle gap between pattern waves (inclusive max). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MAX = 1_700;

/** Chance a wave ends in a longer lull before the next rush. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_CHANCE = 0.22;

/** Long lull duration after an occasional pause (inclusive min). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_GAP_MS_MIN = 2_200;

/** Long lull duration after an occasional pause (inclusive max). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_GAP_MS_MAX = 3_400;

/** How much faster waves run after each pause (multiplies tempo). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_POST_PAUSE_TEMPO_STEP = 1.18;

/** Cap on post-pause speed-up (1 = normal, higher = faster notes + shorter gaps). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_TEMPO_MAX = 1.75;

/** Delay before the first pattern after craft start. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FIRST_PATTERN_DELAY_MS = 700;

/** Craft freeze when a cracked hammer is hit in-zone. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HALT_MS = 2_500;

/** Float popup lifetime for Strike / BREAK callouts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FLOAT_MS = 900;

/** Good hammer icon (must be bundled). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER_ICON =
  'mdi:hammer' as const;

/** Cracked hammer uses the same glyph; HUD paints it broken/red. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED_ICON =
  'mdi:hammer' as const;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER =
  'Hit hammer to speed crafting' as const;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED =
  'Cracked hammer: avoid, or crafting halts' as const;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HINT =
  'Hit hammers in the gold zone. Skip cracked ones.' as const;

/**
 * Combo color tiers for Strike disks / float text.
 * Higher consecutive hits step through warmer → cooler action-game hues.
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_STRIKE_COLOR_TIERS = [
  {
    minCombo: 1,
    diskClassName: 'border-amber-200 bg-amber-500 text-stone-950',
    floatClassName: 'text-amber-300',
    label: 'amber',
  },
  {
    minCombo: 3,
    diskClassName: 'border-orange-200 bg-orange-500 text-stone-950',
    floatClassName: 'text-orange-300',
    label: 'orange',
  },
  {
    minCombo: 5,
    diskClassName: 'border-yellow-100 bg-yellow-400 text-stone-950',
    floatClassName: 'text-yellow-200',
    label: 'yellow',
  },
  {
    minCombo: 8,
    diskClassName: 'border-lime-200 bg-lime-400 text-stone-950',
    floatClassName: 'text-lime-300',
    label: 'lime',
  },
  {
    minCombo: 12,
    diskClassName: 'border-cyan-200 bg-cyan-400 text-stone-950',
    floatClassName: 'text-cyan-300',
    label: 'cyan',
  },
  {
    minCombo: 18,
    diskClassName: 'border-violet-200 bg-violet-500 text-violet-50',
    floatClassName: 'text-violet-300',
    label: 'violet',
  },
] as const;

/**
 * BREAK float colors: start pure red, shift toward the active strike tier hue
 * as combo speed climbs.
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_BREAK_COLOR_TIERS = [
  { minCombo: 0, floatClassName: 'text-rose-400' },
  { minCombo: 3, floatClassName: 'text-orange-400' },
  { minCombo: 5, floatClassName: 'text-amber-400' },
  { minCombo: 8, floatClassName: 'text-lime-400' },
  { minCombo: 12, floatClassName: 'text-cyan-400' },
  { minCombo: 18, floatClassName: 'text-violet-400' },
] as const;

/**
 * Beat patterns: singles, doubles, triples, and trap mixes.
 * Keep the player guessing which wave comes next.
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY: readonly DefiningWorldPlazaCraftModeBeatPatternDefinition[] =
  [
    {
      id: 'single',
      notes: [{ kind: 'hammer', hitOffsetMs: 0 }],
    },
    {
      id: 'double',
      notes: [
        { kind: 'hammer', hitOffsetMs: 0 },
        { kind: 'hammer', hitOffsetMs: 380 },
      ],
    },
    {
      id: 'triple',
      notes: [
        { kind: 'hammer', hitOffsetMs: 0 },
        { kind: 'hammer', hitOffsetMs: 320 },
        { kind: 'hammer', hitOffsetMs: 640 },
      ],
    },
    {
      id: 'crack-single',
      notes: [{ kind: 'cracked', hitOffsetMs: 0 }],
    },
    {
      id: 'hammer-then-crack',
      notes: [
        { kind: 'hammer', hitOffsetMs: 0 },
        { kind: 'cracked', hitOffsetMs: 420 },
      ],
    },
    {
      id: 'crack-then-hammer',
      notes: [
        { kind: 'cracked', hitOffsetMs: 0 },
        { kind: 'hammer', hitOffsetMs: 400 },
      ],
    },
    {
      id: 'sandwich',
      notes: [
        { kind: 'hammer', hitOffsetMs: 0 },
        { kind: 'cracked', hitOffsetMs: 340 },
        { kind: 'hammer', hitOffsetMs: 680 },
      ],
    },
    {
      id: 'double-crack-trap',
      notes: [
        { kind: 'hammer', hitOffsetMs: 0 },
        { kind: 'hammer', hitOffsetMs: 300 },
        { kind: 'cracked', hitOffsetMs: 600 },
      ],
    },
    {
      id: 'burst-four',
      notes: [
        { kind: 'hammer', hitOffsetMs: 0 },
        { kind: 'hammer', hitOffsetMs: 260 },
        { kind: 'cracked', hitOffsetMs: 520 },
        { kind: 'hammer', hitOffsetMs: 780 },
      ],
    },
  ];
