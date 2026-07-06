import { DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV } from '@/components/home/domains/definingPlazaMechanicsConstants';
import { resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierForcedDeviationScores';
import { resolvingWorldPlazaDamageOutcomeTierDescriptor } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaEntityHealthFloatTextKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  computingWorldPlazaEntityHealthDamageFloatAnimationDurationSec,
  computingWorldPlazaEntityHealthDamageFloatFontSizePx,
} from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageFloatVisualScale';
import {
  formattingWorldPlazaEntityHealthFloatTextAmount,
  resolvingWorldPlazaEntityHealthFloatTextClassName,
} from '@/components/world/health/domains/formattingWorldPlazaEntityHealthFloatTextLabel';
import { mappingWorldPlazaDamageOutcomeTierToFloatTextKind } from '@/components/world/health/domains/mappingWorldPlazaDamageOutcomeTierToFloatTextKind';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_BASE_SD_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_MIN_STANDARD_DEVIATION,
  rollingWorldPlazaDamageEngine,
} from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

export type ComputingPlazaMechanicsCombatEvDamageRollPreviewResult = {
  tier: DefiningWorldPlazaDamageOutcomeTier;
  tierLabel: string;
  rolledDamage: number;
  deviationScore: number;
  expectedDamage: number;
  standardDeviation: number;
  floatTextKind: DefiningWorldPlazaEntityHealthFloatTextKind;
  amountLabel: string | null;
  damageClassName: string;
  fontSizePx: number;
  animationDurationSec: number;
  damageIcon: string;
};

function resolvingPlazaMechanicsCombatEvStandardDeviation(
  expectedDamage: number
): number {
  return Math.max(
    expectedDamage * DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_BASE_SD_RATIO,
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_MIN_STANDARD_DEVIATION
  );
}

/** Rolls EV damage for the mechanics guide float preview. */
export function computingPlazaMechanicsCombatEvDamageRollPreview({
  expectedDamage = DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV,
  forcedTier,
  random,
}: {
  expectedDamage?: number;
  forcedTier?: DefiningWorldPlazaDamageOutcomeTier;
  random?: () => number;
}): ComputingPlazaMechanicsCombatEvDamageRollPreviewResult {
  const standardDeviation =
    resolvingPlazaMechanicsCombatEvStandardDeviation(expectedDamage);
  const forcedDeviationScore =
    forcedTier !== undefined
      ? resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore(forcedTier)
      : undefined;

  const rollResult = rollingWorldPlazaDamageEngine({
    expectedDamage,
    standardDeviation,
    forcedDeviationScore,
    random,
  });

  const descriptor = resolvingWorldPlazaDamageOutcomeTierDescriptor(
    rollResult.tier
  );
  const floatTextKind = mappingWorldPlazaDamageOutcomeTierToFloatTextKind(
    rollResult.tier
  );
  const amountLabel = formattingWorldPlazaEntityHealthFloatTextAmount({
    kind: floatTextKind,
    amount: rollResult.rolledDamage,
  });

  return {
    tier: rollResult.tier,
    tierLabel: descriptor.label,
    rolledDamage: rollResult.rolledDamage,
    deviationScore: rollResult.deviationScore,
    expectedDamage: rollResult.expectedDamage,
    standardDeviation: rollResult.standardDeviation,
    floatTextKind,
    amountLabel,
    damageClassName: resolvingWorldPlazaEntityHealthFloatTextClassName(
      floatTextKind,
      rollResult.tier
    ),
    fontSizePx: computingWorldPlazaEntityHealthDamageFloatFontSizePx({
      kind: floatTextKind,
      deviationScore: rollResult.deviationScore,
    }),
    animationDurationSec:
      computingWorldPlazaEntityHealthDamageFloatAnimationDurationSec({
        kind: floatTextKind,
        deviationScore: rollResult.deviationScore,
      }),
    damageIcon: descriptor.damageIcon,
  };
}

/** One-line roll summary for the mechanics preview footer. */
export function formattingPlazaMechanicsCombatEvRollSummary(
  roll: ComputingPlazaMechanicsCombatEvDamageRollPreviewResult
): string {
  const sigmaLabel =
    roll.deviationScore >= 0
      ? `σ +${roll.deviationScore.toFixed(1)}`
      : `σ ${roll.deviationScore.toFixed(1)}`;
  const rolledLabel =
    roll.amountLabel !== null ? roll.amountLabel : roll.tierLabel;

  return `${roll.tierLabel} · ${sigmaLabel} · EV ${roll.expectedDamage} → ${rolledLabel}`;
}
