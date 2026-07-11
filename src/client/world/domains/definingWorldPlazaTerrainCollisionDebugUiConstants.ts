/**
 * UI styling for the plaza terrain collision debug toggle.
 *
 * @module components/world/domains/definingWorldPlazaTerrainCollisionDebugUiConstants
 */

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

/** Collision debug toggle button classes when inactive. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME} focus-visible:ring-cyan-300/70` as const;

/** Collision debug toggle button classes when active. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME} border-cyan-300/70 bg-cyan-400/15 text-cyan-100 focus-visible:ring-cyan-300/70` as const;

/** Visible button label. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_LABEL =
  'Collision' as const;

/** Accessible label for the collision debug toggle. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_ARIA_LABEL =
  'Toggle collision debug overlay' as const;
