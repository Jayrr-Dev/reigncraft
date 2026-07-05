import {
  DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY,
  type DefiningWorldPlazaEntityPoisonPotency,
} from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

const COMPUTING_WORLD_PLAZA_ENTITY_AGGREGATED_POISON_POTENCY_RANK: Record<
  DefiningWorldPlazaEntityPoisonPotency,
  number
> = {
  toxic: 0,
  venomous: 1,
  lethal: 2,
};

export type DefiningWorldPlazaEntityAggregatedPoisonHudSnapshot = {
  remainingPoisonDamage: number;
  icon: MappingWorldPlazaEntityHealthFloatTextIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  summaryLabel: string;
};

function resolvingWorldPlazaEntityHighestPoisonPotency(
  potencies: readonly DefiningWorldPlazaEntityPoisonPotency[]
): DefiningWorldPlazaEntityPoisonPotency {
  return potencies.reduce<DefiningWorldPlazaEntityPoisonPotency>(
    (highestPotency, potency) =>
      COMPUTING_WORLD_PLAZA_ENTITY_AGGREGATED_POISON_POTENCY_RANK[potency] >
      COMPUTING_WORLD_PLAZA_ENTITY_AGGREGATED_POISON_POTENCY_RANK[
        highestPotency
      ]
        ? potency
        : highestPotency,
    'toxic'
  );
}

/**
 * Sums all active poison pools into one HUD snapshot for the damage countdown.
 */
export function computingWorldPlazaEntityAggregatedPoisonHudSnapshot({
  state,
  nowMs,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
}): DefiningWorldPlazaEntityAggregatedPoisonHudSnapshot | null {
  const activePoison = state.poisonEffects.filter(
    (effect) => effect.expiresAtMs > nowMs && effect.remainingPoisonDamage > 0
  );

  if (activePoison.length === 0) {
    return null;
  }

  const remainingPoisonDamage = activePoison.reduce(
    (total, effect) => total + effect.remainingPoisonDamage,
    0
  );

  if (remainingPoisonDamage <= 0) {
    return null;
  }

  const highestPotency = resolvingWorldPlazaEntityHighestPoisonPotency(
    activePoison.map((effect) => effect.potency)
  );
  const descriptor =
    DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY[highestPotency];
  const summaryLabel = activePoison
    .map((effect) => {
      const poisonDescriptor =
        DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY[effect.potency];

      return `${poisonDescriptor.label} x${effect.stackCount}`;
    })
    .join(' · ');

  return {
    remainingPoisonDamage,
    icon: descriptor.floatIcon,
    hudIconColorClassName: descriptor.hudIconColorClassName,
    hudIconBorderClassName: descriptor.hudIconBorderClassName,
    summaryLabel,
  };
}
