import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';

/**
 * Hotbar device multiplier for the current viewport class.
 *
 * Mobile, desktop, and fullscreen all use the fullscreen inventory size.
 *
 * @param _isMobile - Kept for call-site compatibility; size no longer branches
 */
export function resolvingWorldPlazaInventoryHotbarDeviceScale(
  _isMobile: boolean
): number {
  return DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE;
}
