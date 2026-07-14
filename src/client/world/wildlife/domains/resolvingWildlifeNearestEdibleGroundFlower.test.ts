import { formattingWildlifeGroundFlowerItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';
import {
  clearingWildlifeOptimisticPickedGroundFlowers,
  markingWildlifeGroundFlowerOptimisticPicked,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFlowerBridge';
import { resolvingWildlifeNearestEdibleGroundFlower } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFlower';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/checkingWorldPlazaPickableFlowerDecorationAtTileIndex',
  () => ({
    checkingWorldPlazaPickableFlowerDecorationAtTileIndex: vi.fn(),
  })
);

vi.mock(
  '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup',
  () => ({
    checkingWorldPlazaRuntimeFlowerIsPicked: vi.fn(),
  })
);

vi.mock(
  '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants',
  () => ({
    resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId: vi.fn(
      () => 'world-plaza-flower-yarrow'
    ),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaFlowerSpeciesAtTileIndex',
  () => ({
    resolvingWorldPlazaFlowerSpeciesAtTileIndex: vi.fn(() => 'yarrow'),
  })
);

import { checkingWorldPlazaPickableFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaPickableFlowerDecorationAtTileIndex';
import { checkingWorldPlazaRuntimeFlowerIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup';

const pickableMock = vi.mocked(
  checkingWorldPlazaPickableFlowerDecorationAtTileIndex
);
const pickedMock = vi.mocked(checkingWorldPlazaRuntimeFlowerIsPicked);

afterEach(() => {
  clearingWildlifeOptimisticPickedGroundFlowers();
  pickableMock.mockReset();
  pickedMock.mockReset();
});

describe('resolvingWildlifeNearestEdibleGroundFlower', () => {
  it('prefers the closer unpicked pickable flower tile', () => {
    pickableMock.mockImplementation(
      (tileX, tileY) =>
        (tileX === 3 && tileY === 1) || (tileX === 8 && tileY === 1)
    );
    pickedMock.mockReturnValue(false);

    const nearest = resolvingWildlifeNearestEdibleGroundFlower({
      x: 1.5,
      y: 1.5,
      layer: 1,
    });

    expect(nearest).toEqual({
      tileX: 3,
      tileY: 1,
      itemTypeId: 'world-plaza-flower-yarrow',
      distanceGrid: Math.hypot(1.5 - 3.5, 1.5 - 1.5),
      groundItemId: formattingWildlifeGroundFlowerItemId(3, 1),
    });
  });

  it('skips picked and non-pickable tiles', () => {
    pickableMock.mockImplementation(
      (tileX, tileY) =>
        (tileX === 2 && tileY === 1) || (tileX === 4 && tileY === 1)
    );
    pickedMock.mockImplementation((tileX, tileY) => tileX === 2 && tileY === 1);

    const nearest = resolvingWildlifeNearestEdibleGroundFlower({
      x: 1.5,
      y: 1.5,
      layer: 1,
    });

    expect(nearest?.tileX).toBe(4);
    expect(nearest?.tileY).toBe(1);
  });

  it('skips tiles marked optimistic-picked mid-tick', () => {
    pickableMock.mockImplementation(
      (tileX, tileY) => tileX === 2 && tileY === 1
    );
    pickedMock.mockReturnValue(false);
    markingWildlifeGroundFlowerOptimisticPicked(2, 1);

    expect(
      resolvingWildlifeNearestEdibleGroundFlower({
        x: 1.5,
        y: 1.5,
        layer: 1,
      })
    ).toBeNull();
  });
});
