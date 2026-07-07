/**
 * Health damage options when a wildlife melee swing hits the local player.
 *
 * Wildlife attacks can land in the same simulation tick from multiple animals.
 * Granting post-hit invincibility frames on the first swing would block the rest.
 *
 * @module components/world/wildlife/domains/definingWildlifePlayerMeleeHealthDamageOptions
 */

import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Incoming damage options for wildlife melee hits against the player. */
export const DEFINING_WILDLIFE_PLAYER_MELEE_HEALTH_DAMAGE_OPTIONS = {
  grantInvincibilityFrames: false,
} as const satisfies Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  'grantInvincibilityFrames'
>;
