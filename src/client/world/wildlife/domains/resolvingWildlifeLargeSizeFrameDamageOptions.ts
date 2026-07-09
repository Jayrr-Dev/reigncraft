/**
 * EV roll options for obese wildlife damage taken and jump attacks dealt.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameDamageOptions
 */

import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  DEFINING_WILDLIFE_JUMP_ATTACK_WINDOW_MS,
  DEFINING_WILDLIFE_OBESE_JUMP_ATTACK_CRITICAL_BIAS,
} from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifeLargeSizeFrameIsObese } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameMeatDropQuantity';

const DEFINING_WILDLIFE_OBESE_JUMP_ATTACK_MODIFIER_ID =
  'wildlife-obese-jump-critical-bias';

/** True while a recent jump landing still counts as a jump attack. */
export function checkingWildlifeInstanceInJumpAttackWindow(
  instance: Pick<DefiningWildlifeInstance, 'aiState'>,
  nowMs: number
): boolean {
  const lastJumpEndedAtMs = instance.aiState.lastJumpEndedAtMs;

  if (lastJumpEndedAtMs === null) {
    return false;
  }

  return nowMs - lastJumpEndedAtMs <= DEFINING_WILDLIFE_JUMP_ATTACK_WINDOW_MS;
}

/** Enables incoming EV rolls so obese block bias can soften hits. */
export function resolvingWildlifeObeseIncomingPhysicalDamageOptions(
  instance: Pick<DefiningWildlifeInstance, 'largeSizeFrame'>
): Pick<DefiningWorldPlazaEntityHealthDamageOptions, 'skipDamageRoll'> | null {
  if (!checkingWildlifeLargeSizeFrameIsObese(instance.largeSizeFrame)) {
    return null;
  }

  return {
    skipDamageRoll: false,
  };
}

/** Skews obese jump-landing melee toward harder hits. */
export function resolvingWildlifeObeseJumpAttackDamageOptions(
  attacker: Pick<DefiningWildlifeInstance, 'largeSizeFrame' | 'aiState'>,
  nowMs: number
): Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  'skipDamageRoll' | 'attackerDamageRollModifiers'
> | null {
  if (
    !checkingWildlifeLargeSizeFrameIsObese(attacker.largeSizeFrame) ||
    !checkingWildlifeInstanceInJumpAttackWindow(attacker, nowMs)
  ) {
    return null;
  }

  return {
    skipDamageRoll: false,
    attackerDamageRollModifiers: [
      {
        id: DEFINING_WILDLIFE_OBESE_JUMP_ATTACK_MODIFIER_ID,
        kind: 'critical_bias',
        value: DEFINING_WILDLIFE_OBESE_JUMP_ATTACK_CRITICAL_BIAS,
        expiresAtMs: null,
      },
    ],
  };
}
