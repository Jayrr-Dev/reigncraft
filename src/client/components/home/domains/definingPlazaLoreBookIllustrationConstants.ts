/**
 * Declarative illustration registry for lore book pages.
 *
 * Each id maps to a parchment-ink SVG scene rendered beside the entry text.
 *
 * @module components/home/domains/definingPlazaLoreBookIllustrationConstants
 */

/** Illustration scene ids used by the lore book. */
export type PlazaLoreBookIllustrationId =
  | 'corpus-bands'
  | 'biome-rings'
  | 'quiet-hand'
  | 'ladder-rungs'
  | 'spritcore-orb'
  | 'apostle-circle'
  | 'two-creeds'
  | 'beast-tiers'
  | 'cucco'
  | 'firelands'
  | 'dark-doors'
  | 'far-shore'
  | 'sealed-marks';

/** Caption shown under an illustration. */
export type PlazaLoreBookIllustrationDefinition = {
  id: PlazaLoreBookIllustrationId;
  /** Short scribe label under the drawing. */
  caption: string;
};

/**
 * Entry id → illustration. Entries omitted here render text only.
 */
export const DEFINING_PLAZA_LORE_BOOK_ILLUSTRATIONS_BY_ENTRY_ID: Readonly<
  Record<string, PlazaLoreBookIllustrationDefinition>
> = {
  corpus: {
    id: 'corpus-bands',
    caption: 'One body, and many parts labouring',
  },
  'the-bands': {
    id: 'biome-rings',
    caption: 'Ever outward run the lands',
  },
  manus: {
    id: 'quiet-hand',
    caption: 'The Quiet Hand',
  },
  'the-quiet-hand': {
    id: 'quiet-hand',
    caption: 'That shaped all things, and touches none',
  },
  'the-arrangement': {
    id: 'ladder-rungs',
    caption: 'Lose, return, grow, try again',
  },
  'the-core': {
    id: 'spritcore-orb',
    caption: 'Proof of survival, made small',
  },
  'the-spill': {
    id: 'spritcore-orb',
    caption: 'Death takes its toll of the purse',
  },
  'the-stewards': {
    id: 'apostle-circle',
    caption: 'Twelve stewards, and one god',
  },
  'the-worthy': {
    id: 'two-creeds',
    caption: 'The Worthy, and the Many',
  },
  'the-many': {
    id: 'two-creeds',
    caption: 'A shared fire, an open chest',
  },
  'old-climbers': {
    id: 'beast-tiers',
    caption: 'Read the name before the teeth',
  },
  'reading-temper': {
    id: 'beast-tiers',
    caption: 'Temper is a covenant, and kept',
  },
  'the-cucco': {
    id: 'cucco',
    caption: 'Presume, and give it a wide road',
  },
  'the-study': {
    id: 'beast-tiers',
    caption: 'Sight costs nothing; Study costs time',
  },
  'the-forgewrights': {
    id: 'firelands',
    caption: 'Stone and iron, and scorched earth',
  },
  'the-scorching': {
    id: 'firelands',
    caption: 'The ladder holds; ask the ash',
  },
  'the-dark-doors': {
    id: 'dark-doors',
    caption: 'Gates of purpose, every one dark',
  },
  'the-frostsink': {
    id: 'biome-rings',
    caption: 'A bowl of ice about a Cryocore',
  },
  'the-far-shore': {
    id: 'far-shore',
    caption: 'The rim of the known world',
  },
  'the-sealed-page': {
    id: 'sealed-marks',
    caption: 'Seven marks, and nothing between',
  },
};
