import { describe, expect, it } from 'vitest';

import {
  DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT,
  listingWorldPlazaHungerIconFillStates,
} from '@/components/world/hunger/domains/listingWorldPlazaHungerIconFillStates';

describe('listingWorldPlazaHungerIconFillStates', () => {
  it('returns ten icons', () => {
    expect(listingWorldPlazaHungerIconFillStates(0.5)).toHaveLength(
      DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT
    );
  });

  it('fills every icon at full hunger', () => {
    expect(listingWorldPlazaHungerIconFillStates(1)).toEqual(
      Array.from({ length: DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT }, () => 1)
    );
  });

  it('empties every icon at zero hunger', () => {
    expect(listingWorldPlazaHungerIconFillStates(0)).toEqual(
      Array.from({ length: DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT }, () => 0)
    );
  });

  it('uses half icons for odd hunger points', () => {
    expect(listingWorldPlazaHungerIconFillStates(0.05)).toEqual([
      0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('fills five icons at half hunger', () => {
    expect(listingWorldPlazaHungerIconFillStates(0.5)).toEqual([
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    ]);
  });
});
