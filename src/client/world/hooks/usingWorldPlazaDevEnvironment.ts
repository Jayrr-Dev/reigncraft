'use client';

import { DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

/**
 * Tracks whether dev-only plaza tooling should be available.
 */
export function usingWorldPlazaDevEnvironment(): boolean {
  return DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED;
}
