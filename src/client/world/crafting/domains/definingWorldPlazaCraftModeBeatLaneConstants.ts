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

/** Hit-zone center along the lane (matches sketch: left-of-center window). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT = 24;

/** Half-width of the hittable window around the hit-zone center. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT = 9;

/** Idle gap between pattern waves (inclusive min). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MIN = 900;

/** Idle gap between pattern waves (inclusive max). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MAX = 1_700;

/** Delay before the first pattern after craft start. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FIRST_PATTERN_DELAY_MS = 700;

/** Craft freeze when a cracked hammer is hit in-zone. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HALT_MS = 2_500;

/** Good hammer icon (must be bundled). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER_ICON =
  'mdi:hammer' as const;

/** Cracked hammer uses the same glyph; HUD paints it broken/red. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED_ICON =
  'mdi:hammer' as const;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER =
  'Hit hammer to speed crafting' as const;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED =
  'Cracked hammer — avoid, or crafting halts' as const;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HINT =
  'Hit hammers in the zone. Skip cracked ones.' as const;

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
