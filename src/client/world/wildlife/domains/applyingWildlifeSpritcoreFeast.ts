/**
 * Applies Spritcore feast power + regen-until-full after wildlife gulps a stack.
 *
 * @module components/world/wildlife/domains/applyingWildlifeSpritcoreFeast
 */

import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWildlifeSpritcoreFeastAttackPowerMultiplier } from '@/components/world/wildlife/domains/computingWildlifeSpritcoreFeastAttackPowerMultiplier';
import { DEFINING_WILDLIFE_SPRITCORE_FEAST_FULL_HP_POWER_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeSpritcoreFeastConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpritcoreFeastState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Builds feast state after gulping `spritcoreQuantity` units. */
export function creatingWildlifeSpritcoreFeastState(params: {
  readonly spritcoreQuantity: number;
  readonly currentHealth: number;
  readonly effectiveMaxHealth: number;
  readonly nowMs: number;
}): DefiningWildlifeSpritcoreFeastState {
  const attackPowerMultiplier =
    computingWildlifeSpritcoreFeastAttackPowerMultiplier(
      params.spritcoreQuantity
    );
  const isAlreadyFullHp =
    params.currentHealth >= params.effectiveMaxHealth;

  return {
    attackPowerMultiplier,
    spritcoreQuantityGulped: params.spritcoreQuantity,
    boostedRegenUntilFullHp: !isAlreadyFullHp,
    powerExpiresAtMs: isAlreadyFullHp
      ? params.nowMs + DEFINING_WILDLIFE_SPRITCORE_FEAST_FULL_HP_POWER_DURATION_MS
      : null,
  };
}

/** Stamps a new Spritcore feast onto one wildlife instance. */
export function applyingWildlifeSpritcoreFeast(
  instance: DefiningWildlifeInstance,
  spritcoreQuantity: number,
  nowMs: number
): DefiningWildlifeInstance {
  if (spritcoreQuantity <= 0) {
    return instance;
  }

  const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
    instance.healthState,
    nowMs
  );

  return {
    ...instance,
    spritcoreFeast: creatingWildlifeSpritcoreFeastState({
      spritcoreQuantity,
      currentHealth: instance.healthState.currentHealth,
      effectiveMaxHealth,
      nowMs,
    }),
  };
}

/**
 * Clears expired / finished feast bonuses (full HP regen done, or timer ended).
 */
export function advancingWildlifeSpritcoreFeastExpiry(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  const feast = instance.spritcoreFeast;

  if (!feast) {
    return instance;
  }

  const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
    instance.healthState,
    nowMs
  );
  const isFullHp = instance.healthState.currentHealth >= effectiveMaxHealth;

  let nextFeast: DefiningWildlifeSpritcoreFeastState | null = feast;

  if (feast.boostedRegenUntilFullHp && isFullHp) {
    nextFeast = {
      ...feast,
      boostedRegenUntilFullHp: false,
      powerExpiresAtMs:
        feast.powerExpiresAtMs ??
        nowMs + DEFINING_WILDLIFE_SPRITCORE_FEAST_FULL_HP_POWER_DURATION_MS,
    };
  }

  if (
    nextFeast &&
    !nextFeast.boostedRegenUntilFullHp &&
    nextFeast.powerExpiresAtMs !== null &&
    nowMs >= nextFeast.powerExpiresAtMs
  ) {
    nextFeast = null;
  }

  if (nextFeast === feast) {
    return instance;
  }

  return {
    ...instance,
    spritcoreFeast: nextFeast,
  };
}

/** Active melee multiplier from an unexpired Spritcore feast (≥ 1). */
export function resolvingWildlifeSpritcoreFeastAttackPowerMultiplier(
  instance: DefiningWildlifeInstance,
  nowMs: number
): number {
  const feast = instance.spritcoreFeast;

  if (!feast) {
    return 1;
  }

  if (
    feast.powerExpiresAtMs !== null &&
    nowMs >= feast.powerExpiresAtMs &&
    !feast.boostedRegenUntilFullHp
  ) {
    return 1;
  }

  return feast.attackPowerMultiplier;
}

/** True while feast still drives boosted passive regen. */
export function checkingWildlifeSpritcoreFeastBoostsRegen(
  instance: DefiningWildlifeInstance
): boolean {
  return instance.spritcoreFeast?.boostedRegenUntilFullHp === true;
}
