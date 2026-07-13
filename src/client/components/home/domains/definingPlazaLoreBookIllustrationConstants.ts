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
    caption: 'One body, many parts',
  },
  'the-bands': {
    id: 'biome-rings',
    caption: 'Bands outward from spawn',
  },
  manus: {
    id: 'quiet-hand',
    caption: 'The Quiet Hand',
  },
  'the-quiet-hand': {
    id: 'quiet-hand',
    caption: 'Shapes everything, touches nothing',
  },
  'the-arrangement': {
    id: 'ladder-rungs',
    caption: 'Lose, return, grow, try again',
  },
  'the-core': {
    id: 'spritcore-orb',
    caption: 'Money, mana, experience, rank',
  },
  'the-stewards': {
    id: 'apostle-circle',
    caption: 'Twelve stewards, one god',
  },
  'the-worthy': {
    id: 'two-creeds',
    caption: 'The Worthy and the Many',
  },
  'the-many': {
    id: 'two-creeds',
    caption: 'Shared fire, open chest',
  },
  'old-climbers': {
    id: 'beast-tiers',
    caption: 'Read the name before the teeth',
  },
  'the-cucco': {
    id: 'cucco',
    caption: 'Assume, and walk wide',
  },
  'the-forgewrights': {
    id: 'firelands',
    caption: 'Stone, iron, and scorched ground',
  },
  'the-scorching': {
    id: 'firelands',
    caption: 'The ladder holds; ask the ash',
  },
  'the-dark-doors': {
    id: 'dark-doors',
    caption: 'Gate structures, all of them dark',
  },
  'the-far-shore': {
    id: 'far-shore',
    caption: 'The rim of the known world',
  },
  'the-sealed-page': {
    id: 'sealed-marks',
    caption: 'Seven marks. Nothing between.',
  },
};
