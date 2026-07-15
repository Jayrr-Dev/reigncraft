import {
  resolvingWorldPlazaInventoryCapacity,
  resolvingWorldPlazaInventoryPageCount,
  resolvingWorldPlazaInventoryStorageRowCount,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryCapacity';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryCapacity', () => {
  it('keeps base layout at zero bonus rows', () => {
    expect(resolvingWorldPlazaInventoryStorageRowCount(0)).toBe(3);
    expect(resolvingWorldPlazaInventoryPageCount(0)).toBe(4);
    expect(resolvingWorldPlazaInventoryCapacity(0)).toBe(24);
  });

  it('adds six slots per bonus row up to three', () => {
    expect(resolvingWorldPlazaInventoryCapacity(1)).toBe(30);
    expect(resolvingWorldPlazaInventoryPageCount(1)).toBe(5);
    expect(resolvingWorldPlazaInventoryCapacity(3)).toBe(42);
    expect(resolvingWorldPlazaInventoryPageCount(3)).toBe(7);
    expect(resolvingWorldPlazaInventoryCapacity(99)).toBe(42);
  });
});
