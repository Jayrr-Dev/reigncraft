/**
 * Computes contact damage for a playable-animal roll / leap hit.
 *
 * @module components/world/domains/computingWorldPlazaAnimalAvatarRollAttackDamage
 */

import type { DefiningWorldPlazaAnimalAvatarRollAttackProfile } from '@/components/world/domains/definingWorldPlazaAnimalAvatarRollAttackConstants';

/**
 * Flat expected damage for one roll contact hit (rounded for float feedback).
 */
export function computingWorldPlazaAnimalAvatarRollAttackDamage(
  attackPower: number,
  profile: DefiningWorldPlazaAnimalAvatarRollAttackProfile
): number {
  if (!profile.dealsContactDamage || attackPower <= 0) {
    return 0;
  }

  return Math.max(1, Math.round(attackPower * profile.damageMultiplier));
}
