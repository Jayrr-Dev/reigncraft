/**
 * Wildlife name-tag tier labels, colors, and outline styling.
 *
 * Generated labels follow: `[namePrefix] name [nameSuffix]`.
 *
 * @module components/world/wildlife/domains/definingWildlifeNameTagConstants
 */

/** Discrete size-roll tier used for generated mob names. */
export type DefiningWildlifeSizeTier = -2 | -1 | 0 | 1 | 2 | 3;

/** One fixed string or a seeded pool of options for prefix/suffix parts. */
export type DefiningWildlifeNameTagPartValue =
  | string
  | readonly string[]
  | null;

/** Per-tier prefix/suffix parts merged onto global defaults. */
export type DefiningWildlifeSpeciesNameTagTierParts = {
  namePrefix?: DefiningWildlifeNameTagPartValue;
  nameSuffix?: DefiningWildlifeNameTagPartValue;
};

/** Optional per-species overrides for generated name tags. */
export type DefiningWildlifeSpeciesNameTagConfig = {
  /** Base name in tags; defaults to {@link DefiningWildlifeSpeciesDefinition.displayName}. */
  name?: string;
  /** Per-tier prefix/suffix overrides merged onto global tier defaults. */
  tiers?: Partial<
    Record<DefiningWildlifeSizeTier, DefiningWildlifeSpeciesNameTagTierParts>
  >;
};

export type DefiningWildlifeNameTagTierConfig = {
  /** Prefix before the species name (fixed string or adjective pool). */
  namePrefix: DefiningWildlifeNameTagPartValue;
  /** Suffix after the species name (fixed string or pool). */
  nameSuffix: DefiningWildlifeNameTagPartValue;
  /** Fill color for generated labels at this tier. */
  color: string;
};

/** Generated label styling per size σ tier. */
export const DEFINING_WILDLIFE_NAME_TAG_TIER_CONFIG: Record<
  DefiningWildlifeSizeTier,
  DefiningWildlifeNameTagTierConfig
> = {
  [-2]: {
    namePrefix: [
      'Baby',
      'Smoll',
      'Lil',
      'Tiny',
      'Cute',
      'Adorable',
      'Wee',
      'Mini',
      'Pint-Sized',
      'Itty-Bitty',
      'Pocket',
      'Precious',
      'Darling',
    ],
    nameSuffix: null,
    color: '#f8c8dc',
  },
  [-1]: {
    namePrefix: [
      'Young',
      'Small',
      'Little',
      'Smol',
      'Petite',
      'Runty',
      'Juvenile',
      'Compact',
      'Dainty',
      'Shrimpy',
      'Pint',
      'Teeny',
    ],
    nameSuffix: null,
    color: '#F0FFFF',
  },
  [0]: {
    namePrefix: null,
    nameSuffix: null,
    color: '#f1f1f1',
  },
  [1]: {
    namePrefix: ['Mature', 'Big', 'Fat', 'Stocky'],
    nameSuffix: null,
    color: '#eed691',
  },
  [2]: {
    namePrefix: ['Alpha', 'Giant', 'Lead', 'Prime'],
    nameSuffix: null,
    color: '#debe1f',
  },
  [3]: {
    namePrefix: ['Legendary', 'Gody', 'Hellish', 'Demon', 'Mythical'],
    nameSuffix: null,
    color: '#ff6b35',
  },
};

/** Salt for picking a stable prefix from spawn anchor coordinates. */
export const DEFINING_WILDLIFE_NAME_TAG_PREFIX_PICK_SALT = 6619;

/** Salt for picking a stable suffix from spawn anchor coordinates. */
export const DEFINING_WILDLIFE_NAME_TAG_SUFFIX_PICK_SALT = 6623;

/** Max grid distance from the player at which name tags are built and rendered. */
export const DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID = 18;

/** Grid distance at which a nearby animal's name tag fades in. */
export const DEFINING_WILDLIFE_NAME_TAG_PROXIMITY_REVEAL_RADIUS_GRID = 3;

/** How long combat or player hits keep a wildlife name tag visible (ms). */
export const DEFINING_WILDLIFE_NAME_TAG_RECENT_COMBAT_REVEAL_MS = 8_000;

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

/** Fade-in/out when a name tag becomes relevant to the local player. */
export const STYLING_WILDLIFE_NAME_TAG_REVEAL_TRANSITION_MS = 280 as const;

export const STYLING_WILDLIFE_NAME_TAG_REVEAL_TRANSITION_STYLE = {
  transition: `opacity ${STYLING_WILDLIFE_NAME_TAG_REVEAL_TRANSITION_MS}ms ease-out`,
} as const;
