import {
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY,
  resolvingWorldPlazaEntityHealthFloatTextKindDamageClassName,
  resolvingWorldPlazaEntityHealthFloatTextKindTierLabel,
} from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY,
  resolvingWorldPlazaEntityDamageKindFloatClassNameOverride,
} from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import type {
  DefiningWorldPlazaEntityHealthFloatText,
  DefiningWorldPlazaEntityHealthFloatTextKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityDamageKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

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

  const descriptor =
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[outcomeTier];

  return descriptor ? `${descriptor.label} ` : '';
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

  if (kind === 'miss') {
    return 'Miss';
  }

  if (kind === 'health_scale') {
    return `${Math.max(1, roundedAmount)}X`;
  }

  if (
    kind === 'heal' ||
    kind === 'heal_regen' ||
    kind === 'shield_gain' ||
    kind === 'study' ||
    kind === 'item_gain'
  ) {
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

  if (kind === 'miss') {
    return amountLabel;
  }

  if (
    kind === 'heal' ||
    kind === 'heal_regen' ||
    kind === 'shield_gain' ||
    kind === 'study' ||
    kind === 'item_gain'
  ) {
    const tierLabel =
      resolvingWorldPlazaEntityHealthBeneficialTierLabel(outcomeTier);
    return `${tierLabel}${amountLabel}`;
  }

  const tierLabel = resolvingWorldPlazaEntityHealthFloatTextKindTierLabel(kind);
  const prefix =
    damageKind !== null
      ? (DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[damageKind]
          ?.labelPrefix ?? '')
      : '';

  if (isWorldPlazaEntityHealthFloatDamageKind(kind)) {
    if (tierLabel.length > 0) {
      return `${tierLabel}${amountLabel}`;
    }

    return `-${prefix}${amountLabel.replace(/^\+/, '')}`;
  }

  return amountLabel;
}

/**
 * Tailwind classes for each float kind using the plaza adventure-poster palette.
 */
export function resolvingWorldPlazaEntityHealthFloatTextClassName(
  kind: DefiningWorldPlazaEntityHealthFloatTextKind,
  outcomeTier?: DefiningWorldPlazaDamageOutcomeTier | null,
  damageKind?: DefiningWorldPlazaEntityDamageKind | null
): string {
  if (damageKind !== null && damageKind !== undefined) {
    const classNameOverride =
      resolvingWorldPlazaEntityDamageKindFloatClassNameOverride(damageKind);

    if (
      classNameOverride !== null &&
      (kind === 'damage' || isWorldPlazaEntityHealthFloatDamageKind(kind))
    ) {
      return classNameOverride;
    }
  }

  if (kind === 'heal' || kind === 'heal_regen') {
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

    if (kind === 'heal_regen') {
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

  if (kind === 'miss') {
    return 'plaza-combat-float-miss text-[17px] text-slate-400';
  }

  if (kind === 'study') {
    return 'plaza-combat-float-study text-poster-gold';
  }

  if (kind === 'item_gain') {
    return 'plaza-combat-float-item-gain text-poster-gold';
  }

  const tierDamageClassName =
    resolvingWorldPlazaEntityHealthFloatTextKindDamageClassName(kind);

  if (tierDamageClassName !== null) {
    return tierDamageClassName;
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
