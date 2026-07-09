import { describe, expect, it } from 'vitest';
import {
  WORLD_INVENTORY_DEVVIT_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX,
  checkingWorldInventoryGroundDropSkipsPlayerRadius,
} from './worldInventoryDevvit';

describe('checkingWorldInventoryGroundDropSkipsPlayerRadius', () => {
  it('skips radius for wildlife meat sentinel slot', () => {
    expect(
      checkingWorldInventoryGroundDropSkipsPlayerRadius(
        WORLD_INVENTORY_DEVVIT_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX
      )
    ).toBe(true);
  });

  it('keeps radius for inventory and other world drops', () => {
    expect(checkingWorldInventoryGroundDropSkipsPlayerRadius(0)).toBe(false);
    expect(checkingWorldInventoryGroundDropSkipsPlayerRadius(-1)).toBe(false);
  });
});
