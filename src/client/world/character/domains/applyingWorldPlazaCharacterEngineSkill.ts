/**
 * Executes a character engine skill against entity health state.
 *
 * @module components/world/character/domains/applyingWorldPlazaCharacterEngineSkill
 */

import { resolvingWorldPlazaCharacterEngineSkillDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineSkillRegistry';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { healingWorldPlazaEntityHealthWithAmplifiers } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

export type ApplyingWorldPlazaCharacterEngineSkillResult = {
  readonly state: DefiningWorldPlazaEntityHealthState;
  readonly didApply: boolean;
  /** Actual HP restored (0 when the skill is not a heal or already at max). */
  readonly healedAmount: number;
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
    return { state, didApply: false, healedAmount: 0 };
  }

  const { effect } = skill;

  if (effect.kind === 'heal') {
    const previousHealth = state.currentHealth;
    const nextState = healingWorldPlazaEntityHealthWithAmplifiers({
      receiverState: state,
      baseHealAmount: effect.amount,
      nowMs,
    }).state;

    return {
      state: nextState,
      didApply: true,
      healedAmount: Math.max(0, nextState.currentHealth - previousHealth),
    };
  }

  if (effect.kind === 'apply_buff') {
    return {
      state: applyingWorldPlazaEntityBuff(state, effect.buffId, nowMs),
      didApply: true,
      healedAmount: 0,
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
    healedAmount: 0,
  };
}
