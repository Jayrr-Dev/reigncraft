import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryHotbarDeviceScale', () => {
  it('keeps the compact scale on mobile', () => {
    expect(resolvingWorldPlazaInventoryHotbarDeviceScale(true)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE.mobile
    );
  });

  it('enlarges the hotbar on desktop and fullscreen', () => {
    expect(resolvingWorldPlazaInventoryHotbarDeviceScale(false)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE.desktopAndFullscreen
    );
    expect(
      resolvingWorldPlazaInventoryHotbarDeviceScale(false)
    ).toBeGreaterThan(DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE.mobile);
  });
});
