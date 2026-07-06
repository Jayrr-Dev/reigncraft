import { DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV } from '@/components/home/domains/definingPlazaMechanicsConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY,
  type DefiningWorldPlazaEntityBuffRollModifier,
  type DefiningWorldPlazaEntityBuffRollSide,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_TIER_BIAS_SD_SHIFT } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  formattingWorldPlazaEntityHealthDamageRollForcedTierLabel,
  resolvingWorldPlazaDamageOutcomeTierFromForcedDeviationScore,
} from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';
import type { RollingWorldPlazaDamageRollMode } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

export type PlazaMechanicsBuffBadgeRollCurvePreviewNone = {
  kind: 'none';
};

export type PlazaMechanicsBuffBadgeRollCurvePreviewModifiers = {
  kind: 'roll_modifiers';
  side: DefiningWorldPlazaEntityBuffRollSide;
  luck: number;
  deviationBiasShift: number;
  expectedMultiplier: number;
  varianceMultiplier: number;
  rollMode: RollingWorldPlazaDamageRollMode;
  exampleExpectedDamage: number;
  effectLabels: readonly string[];
  forcedTier: DefiningWorldPlazaDamageOutcomeTier | null;
};

export type PlazaMechanicsBuffBadgeRollCurvePreview =
  | PlazaMechanicsBuffBadgeRollCurvePreviewNone
  | PlazaMechanicsBuffBadgeRollCurvePreviewModifiers;

function formattingPlazaMechanicsBuffRollModifierLabel(
  modifier: DefiningWorldPlazaEntityBuffRollModifier
): string | null {
  switch (modifier.kind) {
    case 'expected':
      return `EV ×${modifier.value}`;
    case 'variance':
    case 'stability':
      return `Spread ×${modifier.value}`;
    case 'luck': {
      const sign = modifier.value >= 0 ? '+' : '';
      return `Luck ${sign}${modifier.value}`;
    }
    case 'block_bias':
      return `Block bias +${modifier.value}`;
    case 'dodge_bias':
      return `Dodge bias +${modifier.value}`;
    case 'critical_bias':
      return `Critical bias +${modifier.value}`;
    case 'lock_in':
      return 'Lock-in (always EV)';
    case 'chaotic':
      return 'Chaotic tails';
    case 'forced_tier': {
      const tier =
        resolvingWorldPlazaDamageOutcomeTierFromForcedDeviationScore(
          modifier.value
        );

      return tier === null
        ? 'Forced tier'
        : formattingWorldPlazaEntityHealthDamageRollForcedTierLabel(tier);
    }
    default:
      return null;
  }
}

function resolvingPlazaMechanicsBuffBadgeRollModifierTotals(
  modifiers: readonly DefiningWorldPlazaEntityBuffRollModifier[]
): {
  expectedMultiplier: number;
  varianceMultiplier: number;
  luck: number;
  deviationBiasShift: number;
  rollMode: RollingWorldPlazaDamageRollMode;
  effectLabels: string[];
  forcedTier: DefiningWorldPlazaDamageOutcomeTier | null;
} {
  const expectedMultiplier = modifiers
    .filter((modifier) => modifier.kind === 'expected')
    .reduce((product, modifier) => product * modifier.value, 1);

  const varianceMultiplier = modifiers
    .filter(
      (modifier) =>
        modifier.kind === 'variance' || modifier.kind === 'stability'
    )
    .reduce((product, modifier) => product * modifier.value, 1);

  const luck = Math.min(
    1,
    Math.max(
      -1,
      modifiers
        .filter((modifier) => modifier.kind === 'luck')
        .reduce((sum, modifier) => sum + modifier.value, 0)
    )
  );

  const blockBiasTotal = modifiers
    .filter((modifier) => modifier.kind === 'block_bias')
    .reduce((sum, modifier) => sum + modifier.value, 0);
  const dodgeBiasTotal = modifiers
    .filter((modifier) => modifier.kind === 'dodge_bias')
    .reduce((sum, modifier) => sum + modifier.value, 0);
  const criticalBiasTotal = modifiers
    .filter((modifier) => modifier.kind === 'critical_bias')
    .reduce((sum, modifier) => sum + modifier.value, 0);
  const lockInTotal = modifiers
    .filter((modifier) => modifier.kind === 'lock_in')
    .reduce((sum, modifier) => sum + modifier.value, 0);
  const chaoticTotal = modifiers
    .filter((modifier) => modifier.kind === 'chaotic')
    .reduce((sum, modifier) => sum + modifier.value, 0);

  const deviationBiasShift =
    (criticalBiasTotal - blockBiasTotal - dodgeBiasTotal) *
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_TIER_BIAS_SD_SHIFT;

  const rollMode: RollingWorldPlazaDamageRollMode =
    lockInTotal > 0 ? 'lock_in' : chaoticTotal > 0 ? 'chaotic' : 'normal';

  const forcedTierModifier = modifiers.find(
    (modifier) => modifier.kind === 'forced_tier'
  );
  const forcedTier =
    forcedTierModifier === undefined
      ? null
      : resolvingWorldPlazaDamageOutcomeTierFromForcedDeviationScore(
          forcedTierModifier.value
        );

  const effectLabels = modifiers
    .map(formattingPlazaMechanicsBuffRollModifierLabel)
    .filter((label): label is string => label !== null);

  return {
    expectedMultiplier,
    varianceMultiplier,
    luck,
    deviationBiasShift,
    rollMode,
    effectLabels,
    forcedTier,
  };
}

/** Resolves bell-curve overlay data for a buff badge accordion entry. */
export function resolvingPlazaMechanicsBuffBadgeRollCurvePreview(
  buffId: string
): PlazaMechanicsBuffBadgeRollCurvePreview {
  const descriptor = DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY[buffId];

  if (!descriptor || descriptor.effect.kind !== 'damage_roll_modifiers') {
    return { kind: 'none' };
  }

  const totals = resolvingPlazaMechanicsBuffBadgeRollModifierTotals(
    descriptor.effect.modifiers
  );

  return {
    kind: 'roll_modifiers',
    side: descriptor.effect.side,
    luck: totals.luck,
    deviationBiasShift: totals.deviationBiasShift,
    expectedMultiplier: totals.expectedMultiplier,
    varianceMultiplier: totals.varianceMultiplier,
    rollMode: totals.rollMode,
    exampleExpectedDamage: Math.max(
      0,
      DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV *
        totals.expectedMultiplier
    ),
    effectLabels: totals.effectLabels,
    forcedTier: totals.forcedTier,
  };
}
