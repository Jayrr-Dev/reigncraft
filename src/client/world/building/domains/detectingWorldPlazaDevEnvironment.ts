/**
 * Detects when the plaza is running in a development environment.
 *
 * @module components/world/building/domains/detectingWorldPlazaDevEnvironment
 */

import { DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

/**
 * Returns true when dev-only plaza tooling should be available.
 */
export function detectingWorldPlazaDevEnvironment(): boolean {
  return DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED;
}
