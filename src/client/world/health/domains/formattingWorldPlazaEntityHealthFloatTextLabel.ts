import type {
  DefiningWorldPlazaEntityHealthFloatText,
  DefiningWorldPlazaEntityHealthFloatTextKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityDamageKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_DAMAGE_PREFIX_BY_KIND: Partial<
  Record<DefiningWorldPlazaEntityDamageKind, string>
> = {
  environmental_lava: 'Burn ',
  environmental_heat: 'Scorch ',
  environmental_cold: 'Frost ',
  fall: 'Fall ',
  poison: 'Toxin ',
};

const FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TIER_LABEL_BY_KIND: Partial<
  Record<DefiningWorldPlazaEntityHealthFloatTextKind, string>
> = {
  damage_critical: 'Critical ',
  damage_true_strike: 'True Strike ',
  damage_lethal: 'Lethal ',
  damage_fatal: 'Fatal ',
  damage_softened: 'Softened ',
  damage_roll_blocked: 'Blocked ',
  damage_dodged: 'Dodged ',
};

const FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_BENEFICIAL_TIER_LABEL: Partial<
  Record<DefiningWorldPlazaDamageOutcomeTier, string>
> = {
  critical: 'Critical ',
  true_strike: 'True Strike ',
  lethal: 'Lethal ',
  fatal: 'Fatal ',
  softened: 'Softened ',
  blocked: 'Blocked ',
  dodged: 'Dodged ',
};

function resolvingWorldPlazaEntityHealthBeneficialTierLabel(
  outcomeTier: DefiningWorldPlazaDamageOutcomeTier | null | undefined
): string {
  if (
    outcomeTier === null ||
    outcomeTier === undefined ||
    outcomeTier === 'normal'
  ) {
    return '';
  }

  return (
    FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_BENEFICIAL_TIER_LABEL[
      outcomeTier
    ] ?? ''
  );
}

export function isWorldPlazaEntityHealthFloatDamageKind(
  kind: DefiningWorldPlazaEntityHealthFloatTextKind
): boolean {
  return (
    kind === 'damage' ||
    kind === 'damage_critical' ||
    kind === 'damage_true_strike' ||
    kind === 'damage_lethal' ||
    kind === 'damage_fatal' ||
    kind === 'damage_softened' ||
    kind === 'damage_roll_blocked' ||
    kind === 'damage_dodged'
  );
}

/**
 * Formats the numeric portion of a combat float (icons carry the meaning).
 */
export function formattingWorldPlazaEntityHealthFloatTextAmount({
  kind,
  amount,
}: Pick<DefiningWorldPlazaEntityHealthFloatText, 'kind' | 'amount'>):
  | string
  | null {
  const roundedAmount = Math.max(0, Math.round(amount));

  if (kind === 'blocked') {
    return null;
  }

  if (kind === 'health_scale') {
    return `${Math.max(1, roundedAmount)}X`;
  }

  if (kind === 'heal' || kind === 'shield_gain') {
    return `+${roundedAmount}`;
  }

  if (isWorldPlazaEntityHealthFloatDamageKind(kind)) {
    return `${roundedAmount}`;
  }

  return `${roundedAmount}`;
}

/**
 * @deprecated Prefer icon + {@link formattingWorldPlazaEntityHealthFloatTextAmount}.
 */
export function formattingWorldPlazaEntityHealthFloatTextLabel({
  kind,
  amount,
  damageKind,
  outcomeTier,
}: Pick<
  DefiningWorldPlazaEntityHealthFloatText,
  'kind' | 'amount' | 'damageKind' | 'outcomeTier'
>): string {
  const amountLabel = formattingWorldPlazaEntityHealthFloatTextAmount({
    kind,
    amount,
  });

  if (amountLabel === null) {
    if (kind === 'blocked') {
      return 'Blocked';
    }

    return '';
  }

  if (kind === 'heal' || kind === 'shield_gain') {
    const tierLabel =
      resolvingWorldPlazaEntityHealthBeneficialTierLabel(outcomeTier);
    return `${tierLabel}${amountLabel}`;
  }

  const tierLabel =
    FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TIER_LABEL_BY_KIND[kind] ?? '';
  const prefix =
    damageKind !== null
      ? (FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_DAMAGE_PREFIX_BY_KIND[
          damageKind
        ] ?? '')
      : '';

  if (isWorldPlazaEntityHealthFloatDamageKind(kind)) {
    if (tierLabel.length > 0) {
      return `${tierLabel}${amountLabel}`;
    }

    return `-${prefix}${amountLabel.replace(/^\+/, '')}`;
  }

  return amountLabel;
}

const FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_FROST_CLASS_NAME =
  'plaza-combat-float-damage plaza-combat-float-frost' as const;

/**
 * Tailwind classes for each float kind using the plaza adventure-poster palette.
 */
export function resolvingWorldPlazaEntityHealthFloatTextClassName(
  kind: DefiningWorldPlazaEntityHealthFloatTextKind,
  outcomeTier?: DefiningWorldPlazaDamageOutcomeTier | null,
  damageKind?: DefiningWorldPlazaEntityDamageKind | null
): string {
  if (
    damageKind === 'environmental_cold' &&
    (kind === 'damage' || isWorldPlazaEntityHealthFloatDamageKind(kind))
  ) {
    return FORMATTING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_FROST_CLASS_NAME;
  }
  if (kind === 'heal') {
    if (outcomeTier === 'fatal' || outcomeTier === 'lethal') {
      return 'plaza-combat-float-heal plaza-combat-float-heal-strong';
    }

    if (outcomeTier === 'critical') {
      return 'plaza-combat-float-heal plaza-combat-float-heal-strong';
    }

    if (outcomeTier === 'true_strike') {
      return 'plaza-combat-float-heal';
    }

    if (
      outcomeTier === 'softened' ||
      outcomeTier === 'blocked' ||
      outcomeTier === 'dodged'
    ) {
      return 'plaza-combat-float-heal plaza-combat-float-heal-weak';
    }

    return 'plaza-combat-float-heal';
  }

  if (kind === 'health_scale') {
    return 'plaza-combat-float-heal plaza-combat-float-heal-strong';
  }

  if (kind === 'shield_gain') {
    if (outcomeTier === 'fatal' || outcomeTier === 'lethal') {
      return 'plaza-combat-float-lethal text-[20px] text-sky-100';
    }

    if (outcomeTier === 'critical') {
      return 'plaza-combat-float-critical text-[18px] text-sky-200';
    }

    if (outcomeTier === 'true_strike') {
      return 'plaza-combat-float-true-strike text-[17px] text-sky-100';
    }

    if (
      outcomeTier === 'softened' ||
      outcomeTier === 'blocked' ||
      outcomeTier === 'dodged'
    ) {
      return 'plaza-combat-float-softened text-[15px] text-sky-200/80';
    }

    return 'text-[18px] text-sky-200';
  }

  if (kind === 'shield_absorb') {
    return 'text-sky-100/90 text-[15px]';
  }

  if (kind === 'blocked') {
    return 'plaza-combat-float-roll-blocked text-[17px] text-slate-500';
  }

  if (kind === 'damage_fatal') {
    return 'plaza-combat-float-fatal plaza-combat-float-fatal-black';
  }

  if (kind === 'damage_lethal') {
    return 'plaza-combat-float-lethal plaza-combat-float-damage-3d-slight text-orange-400';
  }

  if (kind === 'damage_critical') {
    return 'plaza-combat-float-critical text-amber-300';
  }

  if (kind === 'damage_true_strike') {
    return 'plaza-combat-float-true-strike text-yellow-100';
  }

  if (kind === 'damage_softened') {
    return 'plaza-combat-float-softened text-slate-200';
  }

  if (kind === 'damage_roll_blocked') {
    return 'plaza-combat-float-roll-blocked text-slate-400';
  }

  if (kind === 'damage_dodged') {
    return 'plaza-combat-float-dodged plaza-combat-float-dodged-outline';
  }

  return 'plaza-combat-float-damage text-red-500';
}

/**
 * Whether a float kind should use the display font styling.
 */
export function shouldWorldPlazaEntityHealthFloatTextUseDisplayFont(
  _kind: DefiningWorldPlazaEntityHealthFloatTextKind
): boolean {
  return false;
}
