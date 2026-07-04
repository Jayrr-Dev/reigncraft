import type {
  DefiningWorldPlazaEntityHealthFloatText,
  DefiningWorldPlazaEntityHealthFloatTextKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityDamageKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

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
  | 'solar:heart-pulse-bold'
  | 'mdi:heart-plus'
  | 'mdi:shield-plus'
  | 'mdi:shield-check'
  | 'mdi:shield-off'
  | 'mdi:arrow-up-bold'
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
  damage: 'boxicons:sword-filled',
  damage_critical: 'boxicons:target',
  damage_true_strike: 'mdi:crosshairs-gps',
  damage_lethal: 'game-icons:death-skull',
  damage_fatal: 'game-icons:scythe',
  damage_softened: 'mdi:shield-half-full',
  damage_roll_blocked: 'mdi:shield',
  damage_dodged: 'ph:person-simple-run',
  heal: 'solar:heart-pulse-bold',
  health_scale: 'mdi:arrow-up-bold',
  shield_gain: 'mdi:shield-plus',
  shield_absorb: 'mdi:shield-check',
  blocked: 'mdi:shield-off',
};

const MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_DAMAGE_KIND_ICON: Partial<
  Record<
    DefiningWorldPlazaEntityDamageKind,
    MappingWorldPlazaEntityHealthFloatTextIconName
  >
> = {
  environmental_lava: 'solar:fire-bold',
  environmental_heat: 'solar:fire-bold',
  environmental_cold: 'mdi:snowflake',
  fall: 'mdi:arrow-down-bold',
  poison: 'mdi:biohazard',
};

const MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_BENEFICIAL_TIER_ICON: Partial<
  Record<
    DefiningWorldPlazaDamageOutcomeTier,
    MappingWorldPlazaEntityHealthFloatTextIconName
  >
> = {
  critical: 'boxicons:target',
  true_strike: 'mdi:crosshairs-gps',
  lethal: 'game-icons:death-skull',
  fatal: 'mdi:heart-plus',
  softened: 'mdi:shield-half-full',
  blocked: 'mdi:shield',
  dodged: 'ph:person-simple-run',
};

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
  if (
    (kind === 'heal' || kind === 'shield_gain') &&
    outcomeTier !== null &&
    outcomeTier !== undefined &&
    outcomeTier !== 'normal'
  ) {
    return (
      MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_BENEFICIAL_TIER_ICON[
        outcomeTier
      ] ?? MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_KIND_ICON[kind]!
    );
  }

  if (kind === 'damage' && damageKind !== null) {
    return (
      MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_DAMAGE_KIND_ICON[
        damageKind
      ] ?? 'boxicons:sword-filled'
    );
  }

  return (
    MAPPING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_KIND_ICON[kind] ??
    'boxicons:sword-filled'
  );
}
