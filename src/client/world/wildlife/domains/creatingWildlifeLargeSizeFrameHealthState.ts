/**
 * Spawn-time health modifiers for obese wildlife damage rolls.
 *
 * @module components/world/wildlife/domains/creatingWildlifeLargeSizeFrameHealthState
 */

import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWildlifeLargeSizeFrame } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import { DEFINING_WILDLIFE_OBESE_INCOMING_BLOCK_BIAS } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';

const DEFINING_WILDLIFE_OBESE_DAMAGE_ROLL_MODIFIER_ID =
  'wildlife-obese-incoming-block-bias';

/** Builds initial health state with obese frame roll modifiers applied. */
export function creatingWildlifeLargeSizeFrameHealthState(
  baseMaxHealth: number,
  largeSizeFrame: DefiningWildlifeLargeSizeFrame | null
): DefiningWorldPlazaEntityHealthState {
  const healthState = creatingWorldPlazaEntityHealthInitialState();

  if (largeSizeFrame !== 'obese') {
    return {
      ...healthState,
      baseMaxHealth,
      currentHealth: baseMaxHealth,
    };
  }

  return {
    ...healthState,
    baseMaxHealth,
    currentHealth: baseMaxHealth,
    damageRollModifiers: [
      {
        id: DEFINING_WILDLIFE_OBESE_DAMAGE_ROLL_MODIFIER_ID,
        kind: 'block_bias',
        value: DEFINING_WILDLIFE_OBESE_INCOMING_BLOCK_BIAS,
        expiresAtMs: null,
      },
    ],
  };
}
