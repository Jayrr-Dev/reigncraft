/**
 * Expends a caltrop and describes victim side effects.
 *
 * @module components/world/trap/domains/applyingWorldPlazaCaltropTrigger
 */

import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import {
  DEFINING_WORLD_PLAZA_CALTROP_BLEED_SEVERITY,
  DEFINING_WORLD_PLAZA_CALTROP_PLAYER_BLEED_FLAT_DAMAGE,
  DEFINING_WORLD_PLAZA_CALTROP_SLOW_BUFF_ID,
  DEFINING_WORLD_PLAZA_CALTROP_WILDLIFE_BLEED_FLAT_DAMAGE,
} from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import type { DefiningWorldPlazaCaltropId } from '@/components/world/trap/domains/definingWorldPlazaCaltropTypes';
import {
  gettingWorldPlazaCaltropInstance,
  removingWorldPlazaCaltrop,
  type ManagingWorldPlazaCaltropInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';

export type ApplyingWorldPlazaCaltropTriggerVictimEffects = {
  readonly slowBuffId: typeof DEFINING_WORLD_PLAZA_CALTROP_SLOW_BUFF_ID;
  readonly bleedSeverity: DefiningWorldPlazaEntityBleedSeverity;
  readonly playerBleedFlatDamage: number;
  readonly wildlifeBleedFlatDamage: number;
};

export type ApplyingWorldPlazaCaltropTriggerResult =
  | {
      readonly outcome: 'expended';
      readonly trapId: DefiningWorldPlazaCaltropId;
      readonly effects: ApplyingWorldPlazaCaltropTriggerVictimEffects;
    }
  | {
      readonly outcome: 'miss';
    };

/**
 * Removes a caltrop from the world. Caller applies bleed / slow to the victim.
 */
export function applyingWorldPlazaCaltropTrigger(
  trapId: DefiningWorldPlazaCaltropId,
  store?: ManagingWorldPlazaCaltropInstanceStore
): ApplyingWorldPlazaCaltropTriggerResult {
  const instance = gettingWorldPlazaCaltropInstance(trapId, store);

  if (!instance) {
    return { outcome: 'miss' };
  }

  removingWorldPlazaCaltrop(trapId, store);

  return {
    outcome: 'expended',
    trapId,
    effects: {
      slowBuffId: DEFINING_WORLD_PLAZA_CALTROP_SLOW_BUFF_ID,
      bleedSeverity: DEFINING_WORLD_PLAZA_CALTROP_BLEED_SEVERITY,
      playerBleedFlatDamage:
        DEFINING_WORLD_PLAZA_CALTROP_PLAYER_BLEED_FLAT_DAMAGE,
      wildlifeBleedFlatDamage:
        DEFINING_WORLD_PLAZA_CALTROP_WILDLIFE_BLEED_FLAT_DAMAGE,
    },
  };
}
