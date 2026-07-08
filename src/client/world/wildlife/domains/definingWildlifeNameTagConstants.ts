/**
 * Wildlife name-tag tier labels, colors, and outline styling.
 *
 * @module components/world/wildlife/domains/definingWildlifeNameTagConstants
 */

/** Discrete size-roll tier used for generated mob names. */
export type DefiningWildlifeSizeTier = -2 | -1 | 0 | 1 | 2;

export type DefiningWildlifeNameTagTierConfig = {
  /** Fixed prefix before the species name (Baby, Young). */
  prefix: string | null;
  /** Rotating adjective pool for large tiers; null when unused. */
  adjectives: readonly string[] | null;
  /** Fill color for generated labels at this tier. */
  color: string;
};

/** Generated label styling per size σ tier. */
export const DEFINING_WILDLIFE_NAME_TAG_TIER_CONFIG: Record<
  DefiningWildlifeSizeTier,
  DefiningWildlifeNameTagTierConfig
> = {
  [-2]: {
    prefix: 'Baby',
    adjectives: null,
    color: '#8FD9FB',
  },
  [-1]: {
    prefix: 'Young',
    adjectives: null,
    color: '#D3D3D3',
  },
  [0]: {
    prefix: null,
    adjectives: null,
    color: '#FFFAFA',
  },
  [1]: {
    prefix: null,
    adjectives: ['Mature', 'Big', 'Killer', 'Fat'],
    color: '#FA5053',
  },
  [2]: {
    prefix: null,
    adjectives: ['Alpha', 'Deadly', 'Giant', 'Lead'],
    color: '#D4AF37',
  },
};

/** Salt for picking a stable adjective from spawn anchor coordinates. */
export const DEFINING_WILDLIFE_NAME_TAG_ADJECTIVE_PICK_SALT = 6619;

/** Tailwind text size for wildlife name tags (matches compact player name labels). */
export const STYLING_WILDLIFE_NAME_TAG_TEXT_CLASS_NAME = 'text-8' as const;

/** Font treatment aligned with compact player name labels above health bars. */
export const STYLING_WILDLIFE_NAME_TAG_FONT_CLASS_NAME =
  'font-medium font-sans' as const;

/** Fraction of speech-bubble lift used to sit name tags just above the sprite. */
export const DEFINING_WILDLIFE_NAME_TAG_LIFT_FRACTION_OF_SPEECH_OFFSET = 0.58;

/** Black outline-style shadow (same as compact player name labels). */
export const STYLING_WILDLIFE_NAME_TAG_TEXT_STYLE = {
  textShadow:
    '0 1px 2px #000, 0 0 1px #000, 1px 0 1px #000, -1px 0 1px #000, 0 -1px 1px #000',
} as const;
