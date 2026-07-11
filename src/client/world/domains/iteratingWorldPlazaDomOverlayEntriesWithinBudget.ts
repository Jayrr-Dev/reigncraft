/**
 * Round-robin DOM overlay work sliced to a small main-thread budget.
 *
 * @module components/world/domains/iteratingWorldPlazaDomOverlayEntriesWithinBudget
 */

export type IteratingWorldPlazaDomOverlayEntriesWithinBudgetState = {
  nextIndex: number;
};

export function creatingWorldPlazaDomOverlayIterationState(): IteratingWorldPlazaDomOverlayEntriesWithinBudgetState {
  return { nextIndex: 0 };
}

export type IteratingWorldPlazaDomOverlayEntriesWithinBudgetParams<T> = {
  readonly entries: readonly T[];
  readonly state: IteratingWorldPlazaDomOverlayEntriesWithinBudgetState;
  readonly timeBudgetMs: number;
  readonly visit: (entry: T) => void;
  readonly readNowMs?: () => number;
};

function readingWorldPlazaDomOverlayPerformanceNowMs(): number {
  return performance.now();
}

/**
 * Visits at least one entry, then yields when the callback budget is spent.
 */
export function iteratingWorldPlazaDomOverlayEntriesWithinBudget<T>({
  entries,
  state,
  timeBudgetMs,
  visit,
  readNowMs = readingWorldPlazaDomOverlayPerformanceNowMs,
}: IteratingWorldPlazaDomOverlayEntriesWithinBudgetParams<T>): number {
  if (entries.length === 0) {
    state.nextIndex = 0;
    return 0;
  }

  const startedAtMs = readNowMs();
  const startIndex = state.nextIndex % entries.length;
  let visitedCount = 0;

  while (visitedCount < entries.length) {
    const entryIndex = (startIndex + visitedCount) % entries.length;
    const entry = entries[entryIndex];

    if (entry === undefined) {
      break;
    }

    visit(entry);
    visitedCount += 1;

    if (
      visitedCount < entries.length &&
      readNowMs() - startedAtMs >= timeBudgetMs
    ) {
      break;
    }
  }

  state.nextIndex = (startIndex + visitedCount) % entries.length;
  return visitedCount;
}
