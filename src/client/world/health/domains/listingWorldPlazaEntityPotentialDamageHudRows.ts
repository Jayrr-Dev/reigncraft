import {
  DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_BORDER_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_ICON_COLOR_CLASS_NAME,
} from '@/components/world/health/domains/definingWorldPlazaEntityPotentialDamageConstants';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';

/**
 * Lists one HUD row per armed potential damage effect (damage + fuse countdown).
 */
export function listingWorldPlazaEntityPotentialDamageHudRows({
  state,
  nowMs,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
}): DefiningWorldPlazaEntityStatusEffectHudRow[] {
  return state.potentialDamageEffects
    .filter((effect) => effect.detonatesAtMs > nowMs && effect.pendingDamage > 0)
    .sort((firstEffect, secondEffect) => {
      if (firstEffect.detonatesAtMs !== secondEffect.detonatesAtMs) {
        return firstEffect.detonatesAtMs - secondEffect.detonatesAtMs;
      }

      return secondEffect.pendingDamage - firstEffect.pendingDamage;
    })
    .map((effect) => ({
      id: `potential-${effect.id}`,
      displayMode: 'timed_damage',
      numericValue: effect.pendingDamage,
      icon: 'mdi:flash',
      hudIconColorClassName:
        DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_ICON_COLOR_CLASS_NAME,
      hudIconBorderClassName:
        DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_BORDER_CLASS_NAME,
      summaryLabel: `Potential damage · ${Math.round(effect.pendingDamage)} EV`,
      sortOrder: 96,
      expiresAtMs: effect.detonatesAtMs,
    }));
}
