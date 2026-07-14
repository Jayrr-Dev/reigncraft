/**
 * Springs a bear trap and describes victim side effects.
 *
 * @module components/world/trap/domains/applyingWorldPlazaBearTrapTrigger
 */

import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_BLEED_SEVERITY,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_IMMOBILIZE_BUFF_ID,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_PLAYER_BLEED_FLAT_DAMAGE,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_WILDLIFE_BLEED_FLAT_DAMAGE,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type { DefiningWorldPlazaBearTrapId } from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';
import {
  springingWorldPlazaBearTrap,
  type ManagingWorldPlazaBearTrapInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';

export type ApplyingWorldPlazaBearTrapTriggerVictimEffects = {
  readonly immobilizeBuffId: typeof DEFINING_WORLD_PLAZA_BEAR_TRAP_IMMOBILIZE_BUFF_ID;
  readonly bleedSeverity: DefiningWorldPlazaEntityBleedSeverity;
  readonly playerBleedFlatDamage: number;
  readonly wildlifeBleedFlatDamage: number;
};

export type ApplyingWorldPlazaBearTrapTriggerResult =
  | {
      readonly outcome: 'sprung';
      readonly trapId: DefiningWorldPlazaBearTrapId;
      readonly effects: ApplyingWorldPlazaBearTrapTriggerVictimEffects;
    }
  | {
      readonly outcome: 'miss';
    };

/**
 * Springs an armed trap. Caller applies bleed / immobilize to the victim.
 */
export function applyingWorldPlazaBearTrapTrigger(
  trapId: DefiningWorldPlazaBearTrapId,
  nowMs: number,
  store?: ManagingWorldPlazaBearTrapInstanceStore
): ApplyingWorldPlazaBearTrapTriggerResult {
  const sprung = springingWorldPlazaBearTrap(trapId, nowMs, store);

  if (!sprung) {
    return { outcome: 'miss' };
  }

  return {
    outcome: 'sprung',
    trapId,
    effects: {
      immobilizeBuffId: DEFINING_WORLD_PLAZA_BEAR_TRAP_IMMOBILIZE_BUFF_ID,
      bleedSeverity: DEFINING_WORLD_PLAZA_BEAR_TRAP_BLEED_SEVERITY,
      playerBleedFlatDamage:
        DEFINING_WORLD_PLAZA_BEAR_TRAP_PLAYER_BLEED_FLAT_DAMAGE,
      wildlifeBleedFlatDamage:
        DEFINING_WORLD_PLAZA_BEAR_TRAP_WILDLIFE_BLEED_FLAT_DAMAGE,
    },
  };
}
