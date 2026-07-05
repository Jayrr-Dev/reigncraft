/**
 * Executes a character engine skill against entity health state.
 *
 * @module components/world/character/domains/applyingWorldPlazaCharacterEngineSkill
 */

import { resolvingWorldPlazaCharacterEngineSkillDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineSkillRegistry';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { healingWorldPlazaEntityHealth } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

export type ApplyingWorldPlazaCharacterEngineSkillResult = {
  readonly state: DefiningWorldPlazaEntityHealthState;
  readonly didApply: boolean;
};

/**
 * Applies a registered skill effect to entity health state.
 */
export function applyingWorldPlazaCharacterEngineSkill(
  state: DefiningWorldPlazaEntityHealthState,
  skillId: string,
  nowMs: number
): ApplyingWorldPlazaCharacterEngineSkillResult {
  const skill = resolvingWorldPlazaCharacterEngineSkillDefinition(skillId);

  if (!skill) {
    return { state, didApply: false };
  }

  const { effect } = skill;

  if (effect.kind === 'heal') {
    return {
      state: healingWorldPlazaEntityHealth(state, effect.amount, nowMs),
      didApply: true,
    };
  }

  if (effect.kind === 'apply_buff') {
    return {
      state: applyingWorldPlazaEntityBuff(state, effect.buffId, nowMs),
      didApply: true,
    };
  }

  const damageResult = computingWorldPlazaEntityHealthDamage({
    state,
    rawAmount: effect.baseExpectedDamage,
    kind: 'physical',
    nowMs,
    options: { skipDamageRoll: false },
  });

  return {
    state: damageResult.state,
    didApply: true,
  };
}
