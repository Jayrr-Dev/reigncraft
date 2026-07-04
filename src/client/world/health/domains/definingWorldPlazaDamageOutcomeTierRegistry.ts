import type { DefiningWorldPlazaEntityHealthFloatTextKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

/** How a tier threshold is compared against a deviation score. */
export type DefiningWorldPlazaDamageOutcomeTierThresholdComparison =
  | 'high'
  | 'low'
  | 'none';

/** Declarative config for one randomized damage outcome tier. */
export type DefiningWorldPlazaDamageOutcomeTierDescriptor = {
  tier: DefiningWorldPlazaDamageOutcomeTier;
  /** Short label for dev panel buttons, e.g. `Fatal`. */
  label: string;
  /** Legacy float label prefix, e.g. `Fatal `. */
  floatTextKindLabel: string;
  /**
   * Classification bound in SD units (`>=` for high tiers, `<=` for low).
   * `null` when tier is not assigned via deviation score alone.
   */
  thresholdSd: number | null;
  thresholdComparison: DefiningWorldPlazaDamageOutcomeTierThresholdComparison;
  /** Representative deviation score for dev forced-tier roll buttons. */
  forcedDeviationScore: number;
  /** Combat float kind shown for this tier. */
  floatTextKind: DefiningWorldPlazaEntityHealthFloatTextKind;
  /** Icon on damage floats at this tier. */
  damageIcon: MappingWorldPlazaEntityHealthFloatTextIconName;
  /** Icon on active heal floats at this tier. */
  healIcon: MappingWorldPlazaEntityHealthFloatTextIconName;
  /** Icon on shield gain floats at this tier. */
  shieldIcon: MappingWorldPlazaEntityHealthFloatTextIconName;
  /** Tailwind/CSS classes for damage floats at this tier. */
  damageClassName: string;
  /** |σ| used for float size/lifetime when roll score is absent. */
  visualMagnitudeSd: number;
  /** When true, sizing uses `visualMagnitudeSd` before roll deviation score. */
  usesLowTierVisualMagnitude: boolean;
  /** Dev panel forced-tier button order; null hides from dev tier grid. */
  devRollOrder: number | null;
};

/** Single source of truth for outcome tiers. */
export const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY: Record<
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaDamageOutcomeTierDescriptor
> = {
  fatal: {
    tier: 'fatal',
    label: 'Fatal',
    floatTextKindLabel: 'Fatal ',
    thresholdSd: 3,
    thresholdComparison: 'high',
    forcedDeviationScore: 3.5,
    floatTextKind: 'damage_fatal',
    damageIcon: 'game-icons:scythe',
    healIcon: 'mdi:heart-plus',
    shieldIcon: 'mdi:shield-plus',
    damageClassName: 'plaza-combat-float-fatal plaza-combat-float-fatal-black',
    visualMagnitudeSd: 3,
    usesLowTierVisualMagnitude: false,
    devRollOrder: 7,
  },
  lethal: {
    tier: 'lethal',
    label: 'Lethal',
    floatTextKindLabel: 'Lethal ',
    thresholdSd: 2,
    thresholdComparison: 'high',
    forcedDeviationScore: 2.25,
    floatTextKind: 'damage_lethal',
    damageIcon: 'game-icons:death-skull',
    healIcon: 'mdi:heart-plus',
    shieldIcon: 'mdi:shield-plus',
    damageClassName:
      'plaza-combat-float-lethal plaza-combat-float-damage-3d-slight text-orange-400',
    visualMagnitudeSd: 2,
    usesLowTierVisualMagnitude: false,
    devRollOrder: 6,
  },
  critical: {
    tier: 'critical',
    label: 'Critical',
    floatTextKindLabel: 'Critical ',
    thresholdSd: 1,
    thresholdComparison: 'high',
    forcedDeviationScore: 1.25,
    floatTextKind: 'damage_critical',
    damageIcon: 'boxicons:target',
    healIcon: 'mdi:heart-flash',
    shieldIcon: 'mdi:shield-check',
    damageClassName: 'plaza-combat-float-critical text-amber-300',
    visualMagnitudeSd: 1.25,
    usesLowTierVisualMagnitude: false,
    devRollOrder: 5,
  },
  normal: {
    tier: 'normal',
    label: 'Normal',
    floatTextKindLabel: '',
    thresholdSd: null,
    thresholdComparison: 'none',
    forcedDeviationScore: 0,
    floatTextKind: 'damage',
    damageIcon: 'boxicons:sword-filled',
    healIcon: 'solar:heart-pulse-bold',
    shieldIcon: 'mdi:shield-plus',
    damageClassName: 'plaza-combat-float-damage text-red-500',
    visualMagnitudeSd: 0,
    usesLowTierVisualMagnitude: false,
    devRollOrder: 4,
  },
  true_strike: {
    tier: 'true_strike',
    label: 'True Strike',
    floatTextKindLabel: 'True Strike ',
    thresholdSd: null,
    thresholdComparison: 'none',
    forcedDeviationScore: 0,
    floatTextKind: 'damage_true_strike',
    damageIcon: 'mdi:crosshairs-gps',
    healIcon: 'mdi:crosshairs-gps',
    shieldIcon: 'mdi:shield-check',
    damageClassName: 'plaza-combat-float-true-strike text-yellow-100',
    visualMagnitudeSd: 0,
    usesLowTierVisualMagnitude: false,
    devRollOrder: 8,
  },
  softened: {
    tier: 'softened',
    label: 'Softened',
    floatTextKindLabel: 'Softened ',
    thresholdSd: -1,
    thresholdComparison: 'low',
    forcedDeviationScore: -1.25,
    floatTextKind: 'damage_softened',
    damageIcon: 'mdi:shield-half-full',
    healIcon: 'mdi:heart-outline',
    shieldIcon: 'mdi:shield-half-full',
    damageClassName: 'plaza-combat-float-softened text-slate-200',
    visualMagnitudeSd: 0.75,
    usesLowTierVisualMagnitude: true,
    devRollOrder: 1,
  },
  blocked: {
    tier: 'blocked',
    label: 'Blocked',
    floatTextKindLabel: 'Blocked ',
    thresholdSd: -2,
    thresholdComparison: 'low',
    forcedDeviationScore: -2.25,
    floatTextKind: 'damage_roll_blocked',
    damageIcon: 'mdi:shield',
    healIcon: 'mdi:heart-outline',
    shieldIcon: 'mdi:shield',
    damageClassName: 'plaza-combat-float-roll-blocked text-slate-400',
    visualMagnitudeSd: 1.35,
    usesLowTierVisualMagnitude: true,
    devRollOrder: 2,
  },
  dodged: {
    tier: 'dodged',
    label: 'Dodged',
    floatTextKindLabel: 'Dodged ',
    thresholdSd: -3,
    thresholdComparison: 'low',
    forcedDeviationScore: -3.5,
    floatTextKind: 'damage_dodged',
    damageIcon: 'ph:person-simple-run',
    healIcon: 'ph:heart-half',
    shieldIcon: 'mdi:shield-half-full',
    damageClassName:
      'plaza-combat-float-dodged plaza-combat-float-dodged-outline',
    visualMagnitudeSd: 2,
    usesLowTierVisualMagnitude: true,
    devRollOrder: 3,
  },
};

const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST = Object.values(
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY
);

const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_HIGH_THRESHOLDS =
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST.filter(
    (descriptor) => descriptor.thresholdComparison === 'high'
  ).sort((left, right) => (right.thresholdSd ?? 0) - (left.thresholdSd ?? 0));

const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LOW_THRESHOLDS =
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST.filter(
    (descriptor) => descriptor.thresholdComparison === 'low'
  ).sort((left, right) => (left.thresholdSd ?? 0) - (right.thresholdSd ?? 0));

/**
 * Returns the descriptor for an outcome tier.
 */
export function resolvingWorldPlazaDamageOutcomeTierDescriptor(
  tier: DefiningWorldPlazaDamageOutcomeTier
): DefiningWorldPlazaDamageOutcomeTierDescriptor {
  return DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[tier];
}

/**
 * Dev panel button order for forced-tier rolls.
 */
export function listingWorldPlazaDamageOutcomeTierDevRollOrder(): DefiningWorldPlazaDamageOutcomeTier[] {
  return DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST.filter(
    (descriptor) => descriptor.devRollOrder !== null
  )
    .sort((left, right) => (left.devRollOrder ?? 0) - (right.devRollOrder ?? 0))
    .map((descriptor) => descriptor.tier);
}

/**
 * Classifies a deviation score into an outcome tier using registry thresholds.
 */
export function classifyingWorldPlazaDamageOutcomeTierFromRegistry(
  deviationScore: number
): DefiningWorldPlazaDamageOutcomeTier {
  for (const descriptor of DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_HIGH_THRESHOLDS) {
    if (
      descriptor.thresholdSd !== null &&
      deviationScore >= descriptor.thresholdSd
    ) {
      return descriptor.tier;
    }
  }

  for (const descriptor of DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LOW_THRESHOLDS) {
    if (
      descriptor.thresholdSd !== null &&
      deviationScore <= descriptor.thresholdSd
    ) {
      return descriptor.tier;
    }
  }

  return 'normal';
}

/**
 * Maps an outcome tier to its combat float text kind.
 */
export function mappingWorldPlazaDamageOutcomeTierToFloatTextKindFromRegistry(
  tier: DefiningWorldPlazaDamageOutcomeTier
): DefiningWorldPlazaEntityHealthFloatTextKind {
  return DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[tier].floatTextKind;
}

/**
 * Damage float CSS classes for a tier float text kind.
 */
export function resolvingWorldPlazaEntityHealthFloatTextKindDamageClassName(
  floatTextKind: DefiningWorldPlazaEntityHealthFloatTextKind
): string | null {
  for (const descriptor of DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST) {
    if (descriptor.floatTextKind === floatTextKind) {
      return descriptor.damageClassName;
    }
  }

  return null;
}

/**
 * Legacy float label prefix for a tier float text kind.
 */
export function resolvingWorldPlazaEntityHealthFloatTextKindTierLabel(
  floatTextKind: DefiningWorldPlazaEntityHealthFloatTextKind
): string {
  for (const descriptor of DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST) {
    if (descriptor.floatTextKind === floatTextKind) {
      return descriptor.floatTextKindLabel;
    }
  }

  return '';
}

/**
 * Low-tier visual magnitudes keyed by float text kind.
 */
export function listingWorldPlazaEntityHealthFloatTextKindLowTierVisualMagnitudes(): Partial<
  Record<DefiningWorldPlazaEntityHealthFloatTextKind, number>
> {
  const magnitudes: Partial<
    Record<DefiningWorldPlazaEntityHealthFloatTextKind, number>
  > = {};

  for (const descriptor of DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST) {
    if (descriptor.usesLowTierVisualMagnitude) {
      magnitudes[descriptor.floatTextKind] = descriptor.visualMagnitudeSd;
    }
  }

  return magnitudes;
}

/**
 * Fallback |σ| magnitudes keyed by float text kind when roll score is absent.
 */
export function listingWorldPlazaEntityHealthFloatTextKindVisualMagnitudes(): Partial<
  Record<DefiningWorldPlazaEntityHealthFloatTextKind, number>
> {
  const magnitudes: Partial<
    Record<DefiningWorldPlazaEntityHealthFloatTextKind, number>
  > = {};

  for (const descriptor of DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_LIST) {
    magnitudes[descriptor.floatTextKind] = descriptor.visualMagnitudeSd;
  }

  return magnitudes;
}
