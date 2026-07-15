/**
 * Styling for the in-game Spritcore upgrade overlay.
 *
 * @module components/world/domains/definingWorldPlazaSpritcoreUpgradeOverlayConstants
 */

/** Spritcore upgrade modal overlay classes (covers the plaza viewport). */
export const DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6' as const;

/** Accessible label for the Spritcore upgrade modal dialog. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_OVERLAY_DIALOG =
  'Spritcore upgrades' as const;

/** Panel title shown in the Spritcore upgrade overlay. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_TITLE =
  'Spritcore Upgrades' as const;

/** Panel subtitle explaining the upgrade loop. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_SUBTITLE =
  'Spend Spritcore from kills to raise your health, damage, and attack speed.' as const;
