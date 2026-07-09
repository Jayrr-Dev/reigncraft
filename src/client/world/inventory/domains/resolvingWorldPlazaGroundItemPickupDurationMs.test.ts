import { computingWorldPlazaGroundItemPickupDurationMs } from '@/components/world/inventory/domains/computingWorldPlazaGroundItemPickupDurationMs';
import {
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MIN_MS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemWeightConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { resolvingWorldPlazaGroundItemPickupDurationMs } from '@/components/world/inventory/domains/resolvingWorldPlazaGroundItemPickupDurationMs';
import { resolvingWorldPlazaInventoryItemWeight } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemWeight';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryItemWeight', () => {
  it('uses light weight for berries', () => {
    expect(resolvingWorldPlazaInventoryItemWeight('world-plaza-berries')).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN
    );
  });

  it('maps chicken meat near the light end and elephant meat near the heavy end', () => {
    const chickenWeight = resolvingWorldPlazaInventoryItemWeight(
      'world-plaza-raw-chicken-meat'
    );
    const elephantWeight = resolvingWorldPlazaInventoryItemWeight(
      'world-plaza-raw-elephant-meat'
    );

    expect(chickenWeight).toBeCloseTo(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN,
      5
    );
    expect(elephantWeight).toBeCloseTo(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX,
      5
    );
    expect(elephantWeight).toBeGreaterThan(chickenWeight);
  });

  it('resolves a weight for every registered item type', () => {
    for (const definition of DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS) {
      const weight = resolvingWorldPlazaInventoryItemWeight(definition.typeId);

      expect(weight).toBeGreaterThan(0);
      expect(weight).toBeLessThanOrEqual(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX
      );
    }
  });
});

describe('computingWorldPlazaGroundItemPickupDurationMs', () => {
  it('maps min weight to 0.5s and max weight to 10s', () => {
    expect(
      computingWorldPlazaGroundItemPickupDurationMs(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN
      )
    ).toBe(DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MIN_MS);

    expect(
      computingWorldPlazaGroundItemPickupDurationMs(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX
      )
    ).toBe(DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MAX_MS);
  });
});

describe('resolvingWorldPlazaGroundItemPickupDurationMs', () => {
  it('keeps pickup durations in the 0.5s–10s band for all items', () => {
    for (const definition of DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS) {
      const durationMs = resolvingWorldPlazaGroundItemPickupDurationMs(
        definition.typeId
      );

      expect(durationMs).toBeGreaterThanOrEqual(
        DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MIN_MS
      );
      expect(durationMs).toBeLessThanOrEqual(
        DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MAX_MS
      );
    }
  });
});
