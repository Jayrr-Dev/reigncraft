import { afterEach, describe, expect, it } from 'vitest';
import {
  checkingWorldPlazaLocalTreeStumpStudied,
  clearingWorldPlazaLocalStudiedTreeStumpsMemoryForOwner,
  markingWorldPlazaLocalTreeStumpStudied,
} from './managingWorldPlazaLocalStudiedTreeStumps';

const OWNER_ID = 'test-stump-study-owner';

describe('managingWorldPlazaLocalStudiedTreeStumps', () => {
  afterEach(() => {
    clearingWorldPlazaLocalStudiedTreeStumpsMemoryForOwner(OWNER_ID);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(
        `world-plaza-studied-tree-stumps:${OWNER_ID}`
      );
    }
  });

  it('marks a stump tile studied once', () => {
    expect(checkingWorldPlazaLocalTreeStumpStudied(OWNER_ID, 3, 5)).toBe(false);
    expect(markingWorldPlazaLocalTreeStumpStudied(OWNER_ID, 3, 5)).toBe(true);
    expect(checkingWorldPlazaLocalTreeStumpStudied(OWNER_ID, 3, 5)).toBe(true);
    expect(markingWorldPlazaLocalTreeStumpStudied(OWNER_ID, 3, 5)).toBe(false);
  });

  it('returns false without a persistence owner', () => {
    expect(markingWorldPlazaLocalTreeStumpStudied(null, 1, 1)).toBe(false);
    expect(checkingWorldPlazaLocalTreeStumpStudied(null, 1, 1)).toBe(false);
  });
});
