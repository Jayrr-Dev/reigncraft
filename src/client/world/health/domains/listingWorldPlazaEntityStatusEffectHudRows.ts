import { computingWorldPlazaEntityAggregatedBleedHudSnapshot } from '@/components/world/health/domains/computingWorldPlazaEntityAggregatedBleedHudSnapshot';
import { computingWorldPlazaEntityAggregatedPoisonHudSnapshot } from '@/components/world/health/domains/computingWorldPlazaEntityAggregatedPoisonHudSnapshot';
import { computingWorldPlazaEntityDamageOverTimeRemainingDamage } from '@/components/world/health/domains/computingWorldPlazaEntityDamageOverTimeRemainingDamage';
import type { ComputingWorldPlazaEnvironmentalTemperatureHudExposure } from '@/components/world/health/domains/computingWorldPlazaEnvironmentalTemperatureHudExposure';
import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonRampConstants';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { listingWorldPlazaEntityPotentialDamageHudRows } from '@/components/world/health/domains/listingWorldPlazaEntityPotentialDamageHudRows';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';
import { listingWorldPlazaEntityFrostbiteInheritedHudEffectLines } from '@/components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage';
import { resolvingWorldPlazaEntityFrostbiteStage } from '@/components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage';

const LISTING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_HUD_DOT_KINDS = [
  'environmental_lava',
  'environmental_heat',
  'environmental_cold',
] as const satisfies readonly DefiningWorldPlazaEntityDamageKind[];

type ListingWorldPlazaEntityStatusEffectHudDotKind =
  (typeof LISTING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_HUD_DOT_KINDS)[number];

const LISTING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_HUD_DOT_STYLES: Record<
  ListingWorldPlazaEntityStatusEffectHudDotKind,
  {
    icon: MappingWorldPlazaEntityHealthFloatTextIconName;
    hudIconColorClassName: string;
    hudIconBorderClassName: string;
    sortOrder: number;
    summaryLabel: string;
  }
> = {
  environmental_lava: {
    icon: 'solar:fire-bold',
    hudIconColorClassName: 'text-orange-300',
    hudIconBorderClassName: 'border-orange-500/65 bg-orange-950/85',
    sortOrder: 85,
    summaryLabel: 'Lava burn damage remaining',
  },
  environmental_heat: {
    icon: 'solar:fire-bold',
    hudIconColorClassName: 'text-amber-300',
    hudIconBorderClassName: 'border-amber-500/60 bg-amber-950/85',
    sortOrder: 80,
    summaryLabel: 'Heat damage remaining',
  },
  environmental_cold: {
    icon: 'mdi:snowflake',
    hudIconColorClassName: 'text-sky-200',
    hudIconBorderClassName: 'border-sky-400/60 bg-sky-950/85',
    sortOrder: 75,
    summaryLabel: 'Frost damage remaining',
  },
};

function listingWorldPlazaEntityStatusEffectHudBleedRow(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityStatusEffectHudRow | null {
  const bleedHud = computingWorldPlazaEntityAggregatedBleedHudSnapshot({
    state,
    nowMs,
  });

  if (bleedHud === null || bleedHud.remainingBleedDamage <= 0) {
    return null;
  }

  return {
    id: 'bleed',
    displayMode: 'damage',
    numericValue: bleedHud.remainingBleedDamage,
    icon: bleedHud.icon,
    hudIconColorClassName: bleedHud.hudIconColorClassName,
    hudIconBorderClassName: bleedHud.hudIconBorderClassName,
    summaryLabel: bleedHud.summaryLabel,
    sortOrder: 100,
    expiresAtMs: null,
  };
}

function listingWorldPlazaEntityStatusEffectHudPoisonRow(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityStatusEffectHudRow | null {
  const poisonHud = computingWorldPlazaEntityAggregatedPoisonHudSnapshot({
    state,
    nowMs,
  });

  if (poisonHud === null || poisonHud.remainingPoisonDamage <= 0) {
    return null;
  }

  return {
    id: 'poison',
    displayMode: 'damage',
    numericValue: Math.max(
      DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT,
      poisonHud.remainingPoisonDamage
    ),
    icon: poisonHud.icon,
    hudIconColorClassName: poisonHud.hudIconColorClassName,
    hudIconBorderClassName: poisonHud.hudIconBorderClassName,
    summaryLabel: poisonHud.summaryLabel,
    sortOrder: 90,
    expiresAtMs: null,
  };
}

function listingWorldPlazaEntityStatusEffectHudTemperatureExposureRow(
  exposure: ComputingWorldPlazaEnvironmentalTemperatureHudExposure | null
): DefiningWorldPlazaEntityStatusEffectHudRow | null {
  if (exposure === null || exposure.damagePerSecond <= 0) {
    return null;
  }

  if (
    !LISTING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_HUD_DOT_KINDS.includes(
      exposure.damageKind as ListingWorldPlazaEntityStatusEffectHudDotKind,
    )
  ) {
    return null;
  }

  const style =
    LISTING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_HUD_DOT_STYLES[
      exposure.damageKind as ListingWorldPlazaEntityStatusEffectHudDotKind
    ];
  const descriptor =
    DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[exposure.damageKind];

  return {
    id: `temperature-${exposure.damageKind}`,
    displayMode: 'damage_per_second',
    numericValue: exposure.damagePerSecond,
    icon: descriptor.floatIcon ?? style.icon,
    hudIconColorClassName: style.hudIconColorClassName,
    hudIconBorderClassName: style.hudIconBorderClassName,
    summaryLabel: style.summaryLabel,
    sortOrder: style.sortOrder,
    expiresAtMs: null,
  };
}

function listingWorldPlazaEntityStatusEffectHudDotRows(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityStatusEffectHudRow[] {
  const rows: DefiningWorldPlazaEntityStatusEffectHudRow[] = [];

  for (const dotKind of LISTING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_HUD_DOT_KINDS) {
    const remainingDamage = state.damageOverTimeEffects
      .filter((effect) => effect.kind === dotKind && effect.expiresAtMs > nowMs)
      .reduce(
        (total, effect) =>
          total +
          computingWorldPlazaEntityDamageOverTimeRemainingDamage(effect, nowMs),
        0
      );

    if (remainingDamage <= 0) {
      continue;
    }

    const style =
      LISTING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_HUD_DOT_STYLES[dotKind];
    const descriptor =
      DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[dotKind];

    rows.push({
      id: `dot-${dotKind}`,
      displayMode: 'damage',
      numericValue: remainingDamage,
      icon: descriptor.floatIcon ?? style.icon,
      hudIconColorClassName: style.hudIconColorClassName,
      hudIconBorderClassName: style.hudIconBorderClassName,
      summaryLabel: style.summaryLabel,
      sortOrder: style.sortOrder,
      expiresAtMs: null,
    });
  }

  return rows;
}

function listingWorldPlazaEntityStatusEffectHudShieldRow(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityStatusEffectHudRow | null {
  if (state.shieldPoints <= 0) {
    return null;
  }

  return {
    id: 'shield',
    displayMode: 'amount',
    numericValue: state.shieldPoints,
    icon: 'mdi:shield-plus',
    hudIconColorClassName: 'text-sky-200',
    hudIconBorderClassName: 'border-sky-400/60 bg-sky-950/85',
    summaryLabel: 'Shield points',
    sortOrder: 50,
    expiresAtMs: null,
  };
}

function listingWorldPlazaEntityStatusEffectHudInvincibilityRow(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityStatusEffectHudRow | null {
  if (state.invincibleUntilMs === null || nowMs >= state.invincibleUntilMs) {
    return null;
  }

  if (!Number.isFinite(state.invincibleUntilMs)) {
    return {
      id: 'invincibility',
      displayMode: 'infinite',
      numericValue: 0,
      icon: 'solar:heart-pulse-bold',
      hudIconColorClassName: 'text-poster-gold',
      hudIconBorderClassName: 'border-poster-gold/55 bg-black/80',
      summaryLabel: 'Invincible',
      sortOrder: 40,
      expiresAtMs: null,
    };
  }

  const remainingSeconds = Math.max(
    0,
    Math.ceil((state.invincibleUntilMs - nowMs) / 1000)
  );

  if (remainingSeconds <= 0) {
    return null;
  }

  return {
    id: 'invincibility',
    displayMode: 'time',
    numericValue: remainingSeconds,
    icon: 'solar:heart-pulse-bold',
    hudIconColorClassName: 'text-poster-gold',
    hudIconBorderClassName: 'border-poster-gold/55 bg-black/80',
    summaryLabel: 'Invincibility time remaining',
    sortOrder: 40,
    expiresAtMs: state.invincibleUntilMs,
  };
}

function listingWorldPlazaEntityStatusEffectHudTemporaryMaxHealthRow(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityStatusEffectHudRow | null {
  const activeBonuses = state.temporaryMaxHealthBonuses.filter(
    (bonus) => bonus.expiresAtMs > nowMs
  );

  if (activeBonuses.length === 0) {
    return null;
  }

  const bonusAmount = activeBonuses.reduce(
    (total, bonus) => total + bonus.amount,
    0
  );
  const soonestExpiryMs = Math.min(
    ...activeBonuses.map((bonus) => bonus.expiresAtMs)
  );
  const remainingSeconds = Math.max(
    0,
    Math.ceil((soonestExpiryMs - nowMs) / 1000)
  );

  return {
    id: 'temp-max-health',
    displayMode: 'amount',
    numericValue: bonusAmount,
    icon: 'mdi:heart-plus',
    hudIconColorClassName: 'text-emerald-300',
    hudIconBorderClassName: 'border-emerald-500/55 bg-emerald-950/80',
    summaryLabel: `Bonus max health · ${remainingSeconds}s remaining`,
    sortOrder: 30,
    expiresAtMs: soonestExpiryMs,
  };
}

function listingWorldPlazaEntityStatusEffectHudFrostbiteRow(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityStatusEffectHudRow | null {
  const frostbite = state.frostbite;

  if (frostbite === null || frostbite.stackCount <= 0) {
    return null;
  }

  const stage = resolvingWorldPlazaEntityFrostbiteStage(frostbite.stackCount);

  if (stage === null) {
    return null;
  }

  return {
    id: 'frostbite',
    displayMode: 'icon_only',
    /** Kept for debug panel; not shown on the badge. */
    numericValue: Math.round(frostbite.stackCount),
    icon: 'mdi:snowflake',
    hudIconColorClassName: stage.hudIconColorClassName,
    hudIconBorderClassName: stage.hudIconBorderClassName,
    summaryLabel: stage.label,
    sortOrder: 95,
    expiresAtMs: null,
    detailLines: listingWorldPlazaEntityFrostbiteInheritedHudEffectLines(
      frostbite.stackCount
    ),
    popoverFooter: null,
  };
}

/**
 * Lists all compact top-right status rows (bleed, poison, shield, etc.).
 */
export function listingWorldPlazaEntityStatusEffectHudRows({
  state,
  nowMs,
  environmentalTemperatureExposure = null,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  environmentalTemperatureExposure?: ComputingWorldPlazaEnvironmentalTemperatureHudExposure | null;
}): DefiningWorldPlazaEntityStatusEffectHudRow[] {
  const rows = [
    listingWorldPlazaEntityStatusEffectHudBleedRow(state, nowMs),
    listingWorldPlazaEntityStatusEffectHudPoisonRow(state, nowMs),
    listingWorldPlazaEntityStatusEffectHudFrostbiteRow(state),
    ...listingWorldPlazaEntityPotentialDamageHudRows({ state, nowMs }),
    listingWorldPlazaEntityStatusEffectHudTemperatureExposureRow(
      environmentalTemperatureExposure
    ),
    ...(environmentalTemperatureExposure === null
      ? listingWorldPlazaEntityStatusEffectHudDotRows(state, nowMs)
      : []),
    listingWorldPlazaEntityStatusEffectHudShieldRow(state),
    listingWorldPlazaEntityStatusEffectHudInvincibilityRow(state, nowMs),
    listingWorldPlazaEntityStatusEffectHudTemporaryMaxHealthRow(state, nowMs),
  ].filter(
    (row): row is DefiningWorldPlazaEntityStatusEffectHudRow => row !== null
  );

  return rows.sort(
    (firstRow, secondRow) => secondRow.sortOrder - firstRow.sortOrder
  );
}

/**
 * Returns whether two status HUD row snapshots are equivalent for React updates.
 */
export function areWorldPlazaEntityStatusEffectHudRowsUnchanged(
  previousRows: readonly DefiningWorldPlazaEntityStatusEffectHudRow[],
  nextRows: readonly DefiningWorldPlazaEntityStatusEffectHudRow[]
): boolean {
  if (previousRows.length !== nextRows.length) {
    return false;
  }

  return previousRows.every((row, index) => {
    const nextRow = nextRows[index];

    return (
      row.id === nextRow?.id &&
      row.displayMode === nextRow.displayMode &&
      row.summaryLabel === nextRow.summaryLabel &&
      Math.abs(row.numericValue - (nextRow?.numericValue ?? 0)) < 0.5
    );
  });
}
