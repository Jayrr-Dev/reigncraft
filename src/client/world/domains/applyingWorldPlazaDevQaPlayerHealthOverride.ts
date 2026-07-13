/**
 * Forces tank HP while the single-player Dev QA load session is active.
 *
 * @module components/world/domains/applyingWorldPlazaDevQaPlayerHealthOverride
 */

import { DEFINING_WORLD_PLAZA_DEV_QA_PLAYER_BASE_MAX_HEALTH } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Returns health state with Dev QA tank HP when the QA session is enabled.
 */
export function applyingWorldPlazaDevQaPlayerHealthOverride(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  if (!checkingWorldPlazaDevQaLoadEnabled()) {
    return state;
  }

  return {
    ...state,
    baseMaxHealth: DEFINING_WORLD_PLAZA_DEV_QA_PLAYER_BASE_MAX_HEALTH,
    currentHealth: DEFINING_WORLD_PLAZA_DEV_QA_PLAYER_BASE_MAX_HEALTH,
  };
}
