import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_BORDER_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_ICON_COLOR_CLASS_NAME,
} from '@/components/world/health/domains/definingWorldPlazaEntityPotentialDamageConstants';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { resolvingWorldPlazaEntityEffectCountdownNowMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityEffectCountdownNowMs';

/**
 * Lists one HUD row per pending potential-damage effect (damage + resolve countdown).
 */
export function listingWorldPlazaEntityPotentialDamageHudRows({
  state,
  nowMs,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
}): DefiningWorldPlazaEntityStatusEffectHudRow[] {
  return state.potentialDamageEffects
    .filter((effect) => {
      const countdownNowMs = resolvingWorldPlazaEntityEffectCountdownNowMs(
        effect.resolvesAtMs,
        nowMs
      );

      return (
        effect.resolvesAtMs > countdownNowMs && effect.pendingExpectedDamage > 0
      );
    })
    .sort((firstEffect, secondEffect) => {
      if (firstEffect.resolvesAtMs !== secondEffect.resolvesAtMs) {
        return firstEffect.resolvesAtMs - secondEffect.resolvesAtMs;
      }

      return (
        secondEffect.pendingExpectedDamage - firstEffect.pendingExpectedDamage
      );
    })
    .map((effect) => ({
      id: `potential-${effect.id}`,
      displayMode: 'timed_damage',
      numericValue: effect.pendingExpectedDamage,
      icon: 'mdi:flash',
      hudIconColorClassName:
        DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_ICON_COLOR_CLASS_NAME,
      hudIconBorderClassName:
        DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_HUD_BORDER_CLASS_NAME,
      summaryLabel: `Pending damage · ${Math.round(effect.pendingExpectedDamage)} EV`,
      sortOrder: 96,
      expiresAtMs: effect.resolvesAtMs,
    }));
}
