/**
 * Declarative unlock events for Wanderer's Corpus library volumes.
 *
 * Each volume stays blacked out (codex silhouette style) until its event fires.
 *
 * @module components/home/domains/definingPlazaLoreBookUnlockConstants
 */

/** Events that unlock one Corpus volume. */
export type PlazaLoreBookUnlockEventId =
  | 'session-start'
  | 'player-first-death'
  | 'first-wildlife-studied'
  | 'first-wildlife-sighted'
  | 'first-disease-obtained'
  | 'legendary-biome-entered';

export type PlazaLoreBookUnlockDefinition = {
  readonly bookId: string;
  readonly unlockEventId: PlazaLoreBookUnlockEventId;
  /** Shelf blurb while locked. */
  readonly lockedHint: string;
};

/**
 * One unlock rule per volume. Order matches {@link DEFINING_PLAZA_LORE_BOOKS}.
 */
export const DEFINING_PLAZA_LORE_BOOK_UNLOCK_REGISTRY: readonly PlazaLoreBookUnlockDefinition[] =
  [
    {
      bookId: 'book-i-lands',
      unlockEventId: 'session-start',
      lockedHint: 'Walk the land and the airs will open.',
    },
    {
      bookId: 'book-ii-founder',
      unlockEventId: 'player-first-death',
      lockedHint: 'Lose once. The Quiet Hand keeps the rest.',
    },
    {
      bookId: 'book-iii-climb',
      unlockEventId: 'first-wildlife-studied',
      lockedHint: 'Study a fallen beast. Count what returns.',
    },
    {
      bookId: 'book-iv-road',
      unlockEventId: 'first-wildlife-sighted',
      lockedHint: 'Sight a living beast on the road.',
    },
    {
      bookId: 'book-v-crown',
      unlockEventId: 'first-disease-obtained',
      lockedHint: 'Catch a sickness. Faith and flesh argue after.',
    },
    {
      bookId: 'book-vi-edges',
      unlockEventId: 'legendary-biome-entered',
      lockedHint: 'Reach Firelands or Frostsink.',
    },
  ] as const;

/** Title shown on locked library covers (matches sealed pages). */
export const DEFINING_PLAZA_LORE_BOOK_LOCKED_TITLE = '? ? ?' as const;

/** CSS filter matching codex locked portraits. */
export const DEFINING_PLAZA_LORE_BOOK_LOCKED_SILHOUETTE_FILTER =
  'brightness(0) opacity(0.8)' as const;

const DEFINING_PLAZA_LORE_BOOK_UNLOCK_BY_BOOK_ID = Object.fromEntries(
  DEFINING_PLAZA_LORE_BOOK_UNLOCK_REGISTRY.map((entry) => [entry.bookId, entry])
) as Readonly<Record<string, PlazaLoreBookUnlockDefinition>>;

const DEFINING_PLAZA_LORE_BOOK_ID_BY_UNLOCK_EVENT = Object.fromEntries(
  DEFINING_PLAZA_LORE_BOOK_UNLOCK_REGISTRY.map((entry) => [
    entry.unlockEventId,
    entry.bookId,
  ])
) as Readonly<Record<PlazaLoreBookUnlockEventId, string>>;

/**
 * Looks up the unlock rule for a volume id.
 */
export function resolvingPlazaLoreBookUnlockDefinition(
  bookId: string
): PlazaLoreBookUnlockDefinition | null {
  return DEFINING_PLAZA_LORE_BOOK_UNLOCK_BY_BOOK_ID[bookId] ?? null;
}

/**
 * Resolves which volume a discovery event unlocks.
 */
export function resolvingPlazaLoreBookIdForUnlockEvent(
  unlockEventId: PlazaLoreBookUnlockEventId
): string | null {
  return DEFINING_PLAZA_LORE_BOOK_ID_BY_UNLOCK_EVENT[unlockEventId] ?? null;
}
