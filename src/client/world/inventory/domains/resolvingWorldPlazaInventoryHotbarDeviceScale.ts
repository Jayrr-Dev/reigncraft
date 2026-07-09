import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';

/**
 * Picks the hotbar device multiplier for the current viewport class.
 *
 * Desktop and fullscreen render the hotbar larger; mobile keeps the
 * compact authored size.
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
