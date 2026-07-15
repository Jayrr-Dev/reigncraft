import {
  checkingWorldPlazaInventoryStorageExpansionAtCap,
  checkingWorldPlazaInventoryStorageExpansionCodexClaimed,
  gettingWorldPlazaInventoryBonusStorageRows,
  initializingWorldPlazaInventoryStorageExpansionStore,
  markingWorldPlazaInventoryStorageExpansionCodexClaimed,
  resettingWorldPlazaInventoryStorageExpansionStoreForTests,
  unlockingWorldPlazaInventoryStorageRow,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('managingWorldPlazaInventoryStorageExpansionStore', () => {
  beforeEach(() => {
    resettingWorldPlazaInventoryStorageExpansionStoreForTests();
    initializingWorldPlazaInventoryStorageExpansionStore('test-storage-expand');
  });

  it('unlocks up to three bonus rows', () => {
    expect(unlockingWorldPlazaInventoryStorageRow()).toBe('unlocked');
    expect(unlockingWorldPlazaInventoryStorageRow()).toBe('unlocked');
    expect(unlockingWorldPlazaInventoryStorageRow()).toBe('unlocked');
    expect(unlockingWorldPlazaInventoryStorageRow()).toBe('at-cap');
    expect(gettingWorldPlazaInventoryBonusStorageRows()).toBe(3);
    expect(checkingWorldPlazaInventoryStorageExpansionAtCap()).toBe(true);
  });

  it('marks Codex chests claimed without unlocking rows', () => {
    expect(
      markingWorldPlazaInventoryStorageExpansionCodexClaimed({
        sectionId: 'herbarium',
        meterKind: 'discovered',
        percent: 20,
      })
    ).toBe('marked');
    expect(
      markingWorldPlazaInventoryStorageExpansionCodexClaimed({
        sectionId: 'herbarium',
        meterKind: 'discovered',
        percent: 20,
      })
    ).toBe('already-claimed');
    expect(
      checkingWorldPlazaInventoryStorageExpansionCodexClaimed({
        sectionId: 'herbarium',
        meterKind: 'discovered',
        percent: 20,
      })
    ).toBe(true);
    expect(gettingWorldPlazaInventoryBonusStorageRows()).toBe(0);
  });
});
