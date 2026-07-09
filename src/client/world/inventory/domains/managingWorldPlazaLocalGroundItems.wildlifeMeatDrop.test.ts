import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX } from '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function creatingTestLocalStorage(): Storage {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    key(index: number) {
      return [...storage.keys()][index] ?? null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
  };
}

describe('droppingWorldPlazaLocalGroundItem wildlife meat radius', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('crypto', {
      randomUUID: () => 'ground:wildlife-meat-far',
    });
  });

  it('allows wildlife meat drops beyond the inventory drop radius', () => {
    const result = droppingWorldPlazaLocalGroundItem('local-player', {
      itemTypeId: 'world-plaza-raw-deer-meat',
      quantity: 1,
      gridX: 20,
      gridY: 20,
      layer: 1,
      slotIndex: DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX,
      playerX: 3,
      playerY: 3,
    });

    expect(result.success).toBe(true);
    expect(result.groundItemId).toBe('ground:wildlife-meat-far');
  });

  it('still rejects inventory drops beyond the drop radius', () => {
    const result = droppingWorldPlazaLocalGroundItem('local-player', {
      itemTypeId: 'world-plaza-raw-deer-meat',
      quantity: 1,
      gridX: 20,
      gridY: 20,
      layer: 1,
      slotIndex: 0,
      playerX: 3,
      playerY: 3,
    });

    expect(result.success).toBe(false);
    expect(result.groundItemId).toBe('');
  });
});
