/**
 * Whether the open minimap uses the far-right corner instead of the compass dropdown.
 *
 * Desktop (and desktop fullscreen) have horizontal room; mobile keeps the dropdown
 * under the action-bar compass orb.
 *
 * @module components/world/domains/checkingWorldPlazaMiniMapUsesCornerPlacement
 */

/**
 * @param isMobile - True when the HUD viewport profile is mobile-narrow.
 */
export function checkingWorldPlazaMiniMapUsesCornerPlacement(
  isMobile: boolean
): boolean {
  return !isMobile;
}
