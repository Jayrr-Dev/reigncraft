import {
  creatingWorldPlazaDomOverlayIterationState,
  iteratingWorldPlazaDomOverlayEntriesWithinBudget,
} from '@/components/world/domains/iteratingWorldPlazaDomOverlayEntriesWithinBudget';
import { describe, expect, it } from 'vitest';

function creatingTimeReader(timesMs: readonly number[]): () => number {
  let index = 0;

  return () => {
    const value = timesMs[Math.min(index, timesMs.length - 1)] ?? 0;
    index += 1;
    return value;
  };
}

describe('iteratingWorldPlazaDomOverlayEntriesWithinBudget', () => {
  it('continues from the next entry after yielding', () => {
    const state = creatingWorldPlazaDomOverlayIterationState();
    const visited: string[] = [];

    iteratingWorldPlazaDomOverlayEntriesWithinBudget({
      entries: ['a', 'b', 'c'],
      state,
      timeBudgetMs: 0.5,
      visit: (entry) => visited.push(entry),
      readNowMs: creatingTimeReader([0, 0.8]),
    });
    iteratingWorldPlazaDomOverlayEntriesWithinBudget({
      entries: ['a', 'b', 'c'],
      state,
      timeBudgetMs: 0.5,
      visit: (entry) => visited.push(entry),
      readNowMs: creatingTimeReader([1, 1.8]),
    });

    expect(visited).toEqual(['a', 'b']);
    expect(state.nextIndex).toBe(2);
  });

  it('visits every entry when work stays within budget', () => {
    const state = creatingWorldPlazaDomOverlayIterationState();
    const visited: number[] = [];

    const visitedCount = iteratingWorldPlazaDomOverlayEntriesWithinBudget({
      entries: [1, 2, 3],
      state,
      timeBudgetMs: 1,
      visit: (entry) => visited.push(entry),
      readNowMs: creatingTimeReader([0, 0.1, 0.2]),
    });

    expect(visitedCount).toBe(3);
    expect(visited).toEqual([1, 2, 3]);
    expect(state.nextIndex).toBe(0);
  });
});
