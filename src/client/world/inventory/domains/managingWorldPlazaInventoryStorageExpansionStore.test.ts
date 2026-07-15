import {
  checkingWorldPlazaInventoryStorageExpansionAtCap,
  checkingWorldPlazaInventoryStorageExpansionCodexClaimed,
  claimingWorldPlazaInventoryStorageExpansionCodexReward,
  gettingWorldPlazaInventoryBonusStorageRows,
  initializingWorldPlazaInventoryStorageExpansionStore,
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

  it('claims Codex chests once and still marks claim at cap', () => {
    expect(
      claimingWorldPlazaInventoryStorageExpansionCodexReward({
        sectionId: 'herbarium',
        meterKind: 'discovered',
        percent: 20,
      })
    ).toBe('unlocked');
    expect(
      claimingWorldPlazaInventoryStorageExpansionCodexReward({
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

    unlockingWorldPlazaInventoryStorageRow();
    unlockingWorldPlazaInventoryStorageRow();

    expect(
      claimingWorldPlazaInventoryStorageExpansionCodexReward({
        sectionId: 'bestiary',
        meterKind: 'discovered',
        percent: 20,
      })
    ).toBe('at-cap');
    expect(gettingWorldPlazaInventoryBonusStorageRows()).toBe(3);
  });
});
