import {
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY,
  type DefiningWorldPlazaEntityBleedSeverity,
} from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

const COMPUTING_WORLD_PLAZA_ENTITY_AGGREGATED_BLEED_SEVERITY_RANK: Record<
  DefiningWorldPlazaEntityBleedSeverity,
  number
> = {
  bleeding: 0,
  hemorrhaging: 1,
  exsanguinating: 2,
};

export type DefiningWorldPlazaEntityAggregatedBleedHudSnapshot = {
  remainingBleedDamage: number;
  icon: MappingWorldPlazaEntityHealthFloatTextIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  /** Tooltip summary of active bleed tiers. */
  summaryLabel: string;
};

function resolvingWorldPlazaEntityHighestBleedSeverity(
  severities: readonly DefiningWorldPlazaEntityBleedSeverity[]
): DefiningWorldPlazaEntityBleedSeverity {
  return severities.reduce<DefiningWorldPlazaEntityBleedSeverity>(
    (highestSeverity, severity) =>
      COMPUTING_WORLD_PLAZA_ENTITY_AGGREGATED_BLEED_SEVERITY_RANK[severity] >
      COMPUTING_WORLD_PLAZA_ENTITY_AGGREGATED_BLEED_SEVERITY_RANK[
        highestSeverity
      ]
        ? severity
        : highestSeverity,
    'bleeding'
  );
}

/**
 * Sums all active bleed pools into one HUD snapshot for the damage countdown.
 */
export function computingWorldPlazaEntityAggregatedBleedHudSnapshot({
  state,
  nowMs,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
}): DefiningWorldPlazaEntityAggregatedBleedHudSnapshot | null {
  const activeBleeds = state.bleedEffects.filter(
    (effect) => effect.expiresAtMs > nowMs && effect.remainingBleedDamage > 0
  );

  if (activeBleeds.length === 0) {
    return null;
  }

  const remainingBleedDamage = activeBleeds.reduce(
    (total, effect) => total + effect.remainingBleedDamage,
    0
  );

  if (remainingBleedDamage <= 0) {
    return null;
  }

  const highestSeverity = resolvingWorldPlazaEntityHighestBleedSeverity(
    activeBleeds.map((effect) => effect.severity)
  );
  const descriptor =
    DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY[highestSeverity];
  const summaryLabel = activeBleeds
    .map((effect) => {
      const bleedDescriptor =
        DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY[effect.severity];

      return `${bleedDescriptor.label} x${effect.stackCount}`;
    })
    .join(' · ');

  return {
    remainingBleedDamage,
    icon: descriptor.floatIcon,
    hudIconColorClassName: descriptor.hudIconColorClassName,
    hudIconBorderClassName: descriptor.hudIconBorderClassName,
    summaryLabel,
  };
}
