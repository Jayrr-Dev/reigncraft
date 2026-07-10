import {
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_OUTCOME_TIERS,
  type DefiningWorldPlazaAvatarMeleeCritFatalOutcomeTier,
} from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';

/**
 * Returns true when a damage outcome tier should play the punch impact clip.
 */
export function checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx(
  outcomeTier: string | null | undefined
): outcomeTier is DefiningWorldPlazaAvatarMeleeCritFatalOutcomeTier {
  if (!outcomeTier) {
    return false;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_OUTCOME_TIERS.includes(
    outcomeTier as DefiningWorldPlazaAvatarMeleeCritFatalOutcomeTier
  );
}
