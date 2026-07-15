import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaInventoryItemHasStudiedOreMetadata } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemHasStudiedOreMetadata';
import { convertingWorldPlazaInventoryOreSlotToStudied } from '@/components/world/inventory/domains/convertingWorldPlazaInventoryOreSlotToStudied';
import { resolvingWorldPlazaOreItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreStudyMetadataConstants';
import { describe, expect, it } from 'vitest';

describe('convertingWorldPlazaInventoryOreSlotToStudied', () => {
  const ironItemTypeId = resolvingWorldPlazaOreItemTypeIdFromSpeciesId('iron');

  function creatingIronInventoryState(options: {
    readonly unstudiedQuantity: number;
    readonly studiedQuantity?: number;
    readonly capacity?: number;
  }): DefiningInventoryState {
    const capacity = options.capacity ?? 4;
    const slots = Array.from(
      { length: capacity },
      (): DefiningInventoryState['slots'][number] => null
    );

    if (options.unstudiedQuantity > 0) {
      slots[0] = {
        id: 'unstudied-iron',
        itemTypeId: ironItemTypeId,
        quantity: options.unstudiedQuantity,
        slotIndex: 0,
      };
    }

    if ((options.studiedQuantity ?? 0) > 0) {
      slots[1] = {
        id: 'studied-iron',
        itemTypeId: ironItemTypeId,
        quantity: options.studiedQuantity ?? 0,
        slotIndex: 1,
        metadata: {
          [DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY]: true,
        },
      };
    }

    return { capacity, slots };
  }

  it('moves one unit into a studied pile and keeps the rest unstudied', () => {
    const result = convertingWorldPlazaInventoryOreSlotToStudied(
      creatingIronInventoryState({ unstudiedQuantity: 3 }),
      0
    );

    expect(result.outcome).toBe('converted');
    if (result.outcome !== 'converted') {
      return;
    }

    const unstudied = result.nextState.slots.find(
      (slot) =>
        slot?.itemTypeId === ironItemTypeId &&
        !checkingWorldPlazaInventoryItemHasStudiedOreMetadata(slot.metadata)
    );
    const studied = result.nextState.slots.find(
      (slot) =>
        slot?.itemTypeId === ironItemTypeId &&
        checkingWorldPlazaInventoryItemHasStudiedOreMetadata(slot.metadata)
    );

    expect(unstudied?.quantity).toBe(2);
    expect(studied?.quantity).toBe(1);
    expect(
      studied?.metadata?.[
        DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY
      ]
    ).toBe(true);
  });

  it('rejects already-studied piles', () => {
    const result = convertingWorldPlazaInventoryOreSlotToStudied(
      creatingIronInventoryState({
        unstudiedQuantity: 0,
        studiedQuantity: 2,
      }),
      1
    );

    expect(result.outcome).toBe('already-studied');
  });

  it('stacks onto an existing studied pile of the same ore', () => {
    const result = convertingWorldPlazaInventoryOreSlotToStudied(
      creatingIronInventoryState({
        unstudiedQuantity: 2,
        studiedQuantity: 4,
      }),
      0
    );

    expect(result.outcome).toBe('converted');
    if (result.outcome !== 'converted') {
      return;
    }

    expect(result.nextState.slots[0]?.quantity).toBe(1);
    expect(result.nextState.slots[1]?.quantity).toBe(5);
    expect(
      checkingWorldPlazaInventoryItemHasStudiedOreMetadata(
        result.nextState.slots[1]?.metadata
      )
    ).toBe(true);
  });
});
