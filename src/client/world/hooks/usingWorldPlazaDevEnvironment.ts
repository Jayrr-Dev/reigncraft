'use client';

import { DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  checkingWorldPlazaDevQaLoadEnabled,
  subscribingWorldPlazaDevQaLoad,
} from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import { useSyncExternalStore } from 'react';

/**
 * True only in creative load when the tools master switch is on.
 * Normal single-player / multiplayer stay closed.
 */
export function usingWorldPlazaDevEnvironment(): boolean {
  const isCreativeLoadEnabled = useSyncExternalStore(
    subscribingWorldPlazaDevQaLoad,
    checkingWorldPlazaDevQaLoadEnabled,
    checkingWorldPlazaDevQaLoadEnabled
  );

  return DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED && isCreativeLoadEnabled;
}
