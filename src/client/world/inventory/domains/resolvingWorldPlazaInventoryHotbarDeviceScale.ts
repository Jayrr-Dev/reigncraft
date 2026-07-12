import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';

/**
 * Picks the hotbar device multiplier for the current viewport class.
 *
 * Mobile, desktop, and fullscreen share the same authored hotbar size.
 *
 * @param isMobile - Mobile layout input from the viewport profile
 */
export function resolvingWorldPlazaInventoryHotbarDeviceScale(
  isMobile: boolean
): number {
  return isMobile
    ? DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE.mobile
    : DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE.desktopAndFullscreen;
}
