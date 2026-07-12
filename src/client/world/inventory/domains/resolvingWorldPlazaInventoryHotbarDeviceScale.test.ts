import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryHotbarDeviceScale', () => {
  it('uses the same scale on mobile and desktop', () => {
    expect(resolvingWorldPlazaInventoryHotbarDeviceScale(true)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE.mobile
    );
    expect(resolvingWorldPlazaInventoryHotbarDeviceScale(false)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE.desktopAndFullscreen
    );
    expect(resolvingWorldPlazaInventoryHotbarDeviceScale(true)).toBe(
      resolvingWorldPlazaInventoryHotbarDeviceScale(false)
    );
  });
});
