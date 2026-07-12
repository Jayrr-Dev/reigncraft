import {
  DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE,
  DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_MOBILE_DEVICE_SCALE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';

/**
 * Hotbar device multiplier for the current viewport class.
 *
 * @param isMobile - True when the plaza HUD is in the mobile layout
 */
export function resolvingWorldPlazaInventoryHotbarDeviceScale(
  isMobile: boolean
): number {
  return isMobile
    ? DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_MOBILE_DEVICE_SCALE
    : DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE;
}
