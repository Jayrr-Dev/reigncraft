import { DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY,
  resolvingWorldPlazaEntityDamageKindFloatIcon,
} from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import type {
  DefiningWorldPlazaEntityHealthFloatText,
  DefiningWorldPlazaEntityHealthFloatTextKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Bundled Iconify id for one combat float glyph. */
export type MappingWorldPlazaEntityHealthFloatTextIconName =
  | 'boxicons:sword-filled'
  | 'boxicons:target'
  | 'mdi:crosshairs-gps'
  | 'game-icons:death-skull'
  | 'game-icons:scythe'
  | 'mdi:shield-half-full'
  | 'mdi:shield'
  | 'ph:person-simple-run'
  | 'ph:heart-half'
  | 'solar:heart-pulse-bold'
  | 'mdi:heart-plus'
  | 'mdi:heart-flash'
  | 'mdi:heart-outline'
  | 'mdi:shield-plus'
  | 'mdi:shield-check'
  | 'mdi:shield-off'
  | 'mdi:arrow-up-bold'
  | 'mdi:refresh'
  | 'solar:fire-bold'
  | 'mdi:snowflake'
  | 'mdi:biohazard'
  | 'mdi:arrow-down-bold';

const MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_KIND_ICON: Partial<
  Record<
    DefiningWorldPlazaEntityHealthFloatTextKind,
    MappingWorldPlazaEntityHealthFloatTextIconName
  >
> = {
  heal: 'solar:heart-pulse-bold',
  heal_regen: 'mdi:refresh',
  health_scale: 'mdi:arrow-up-bold',
  shield_gain: 'mdi:shield-plus',
  shield_absorb: 'mdi:shield-check',
  blocked: 'mdi:shield-off',
};

function listingWorldPlazaEntityHealthFloatTextKindIconsFromTierRegistry(): Partial<
  Record<
    DefiningWorldPlazaEntityHealthFloatTextKind,
    MappingWorldPlazaEntityHealthFloatTextIconName
  >
> {
  const icons: Partial<
    Record<
      DefiningWorldPlazaEntityHealthFloatTextKind,
      MappingWorldPlazaEntityHealthFloatTextIconName
    >
  > = {};

  for (const descriptor of Object.values(
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY
  )) {
    icons[descriptor.floatTextKind] = descriptor.damageIcon;
  }

  return icons;
}

const MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_TIER_KIND_ICON =
  listingWorldPlazaEntityHealthFloatTextKindIconsFromTierRegistry();

function listingWorldPlazaEntityHealthFloatTextHealTierIcons(): Partial<
  Record<
    DefiningWorldPlazaDamageOutcomeTier,
    MappingWorldPlazaEntityHealthFloatTextIconName
  >
> {
  const icons: Partial<
    Record<
      DefiningWorldPlazaDamageOutcomeTier,
      MappingWorldPlazaEntityHealthFloatTextIconName
    >
  > = {};

  for (const descriptor of Object.values(
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY
  )) {
    icons[descriptor.tier] = descriptor.healIcon;
  }

  return icons;
}

function listingWorldPlazaEntityHealthFloatTextShieldTierIcons(): Partial<
  Record<
    DefiningWorldPlazaDamageOutcomeTier,
    MappingWorldPlazaEntityHealthFloatTextIconName
  >
> {
  const icons: Partial<
    Record<
      DefiningWorldPlazaDamageOutcomeTier,
      MappingWorldPlazaEntityHealthFloatTextIconName
    >
  > = {};

  for (const descriptor of Object.values(
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY
  )) {
    icons[descriptor.tier] = descriptor.shieldIcon;
  }

  return icons;
}

const MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_HEAL_TIER_ICON =
  listingWorldPlazaEntityHealthFloatTextHealTierIcons();

const MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_SHIELD_TIER_ICON =
  listingWorldPlazaEntityHealthFloatTextShieldTierIcons();

function listingWorldPlazaEntityHealthFloatTextDamageKindIcons(): Partial<
  Record<
    DefiningWorldPlazaEntityDamageKind,
    MappingWorldPlazaEntityHealthFloatTextIconName
  >
> {
  const icons: Partial<
    Record<
      DefiningWorldPlazaEntityDamageKind,
      MappingWorldPlazaEntityHealthFloatTextIconName
    >
  > = {};

  for (const descriptor of Object.values(
    DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY
  )) {
    if (descriptor.floatIcon !== null) {
      icons[descriptor.kind] = descriptor.floatIcon;
    }
  }

  return icons;
}

const MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_DAMAGE_KIND_ICON =
  listingWorldPlazaEntityHealthFloatTextDamageKindIcons();

function resolvingWorldPlazaEntityHealthBeneficialFloatTextIcon(
  kind: 'heal' | 'shield_gain',
  outcomeTier: DefiningWorldPlazaDamageOutcomeTier | null | undefined
): MappingWorldPlazaEntityHealthFloatTextIconName {
  if (outcomeTier !== null && outcomeTier !== undefined) {
    if (kind === 'heal') {
      return (
        MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_HEAL_TIER_ICON[
          outcomeTier
        ] ?? MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_KIND_ICON.heal!
      );
    }

    return (
      MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_SHIELD_TIER_ICON[
        outcomeTier
      ] ?? MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_KIND_ICON.shield_gain!
    );
  }

  return MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_KIND_ICON[kind]!;
}

/**
 * Resolves the Iconify glyph for a combat float (kind, damage source, roll tier).
 */
export function mappingWorldPlazaEntityHealthFloatTextIcon({
  kind,
  damageKind,
  outcomeTier,
}: Pick<
  DefiningWorldPlazaEntityHealthFloatText,
  'kind' | 'damageKind' | 'outcomeTier'
>): MappingWorldPlazaEntityHealthFloatTextIconName {
  if (kind === 'heal' || kind === 'shield_gain') {
    return resolvingWorldPlazaEntityHealthBeneficialFloatTextIcon(
      kind,
      outcomeTier
    );
  }

  if (kind === 'damage' && damageKind !== null) {
    return (
      resolvingWorldPlazaEntityDamageKindFloatIcon(damageKind) ??
      MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_DAMAGE_KIND_ICON[
        damageKind
      ] ??
      'boxicons:sword-filled'
    );
  }

  return (
    MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_KIND_ICON[kind] ??
    MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_TIER_KIND_ICON[kind] ??
    'boxicons:sword-filled'
  );
}
