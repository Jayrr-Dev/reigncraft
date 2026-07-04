import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

/** Declarative config for one damage/healing source category. */
export type DefiningWorldPlazaEntityDamageKindDescriptor = {
  kind: DefiningWorldPlazaEntityDamageKind;
  /** Legacy text prefix for deprecated label formatter, e.g. `Frost `. */
  labelPrefix: string;
  /** Float glyph when `kind === 'damage'`; null falls back to tier/default icon. */
  floatIcon: MappingWorldPlazaEntityHealthFloatTextIconName | null;
  /** Overrides tier color styling for all damage floats from this source. */
  floatClassNameOverride: string | null;
  /** Instant hits go through the statistical roll engine. */
  usesDamageRoll: boolean;
  /** Which temperature resistance applies when exposure is inferred from kind. */
  temperatureExposure: 'heat' | 'cold' | null;
};

/** Single source of truth for damage source categories. */
export const DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY: Record<
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityDamageKindDescriptor
> = {
  physical: {
    kind: 'physical',
    labelPrefix: '',
    floatIcon: null,
    floatClassNameOverride: null,
    usesDamageRoll: true,
    temperatureExposure: null,
  },
  environmental_lava: {
    kind: 'environmental_lava',
    labelPrefix: 'Burn ',
    floatIcon: 'solar:fire-bold',
    floatClassNameOverride: null,
    usesDamageRoll: true,
    temperatureExposure: 'heat',
  },
  environmental_heat: {
    kind: 'environmental_heat',
    labelPrefix: 'Scorch ',
    floatIcon: 'solar:fire-bold',
    floatClassNameOverride: null,
    usesDamageRoll: false,
    temperatureExposure: 'heat',
  },
  environmental_cold: {
    kind: 'environmental_cold',
    labelPrefix: 'Frost ',
    floatIcon: 'mdi:snowflake',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-frost',
    usesDamageRoll: false,
    temperatureExposure: 'cold',
  },
  fall: {
    kind: 'fall',
    labelPrefix: 'Fall ',
    floatIcon: 'mdi:arrow-down-bold',
    floatClassNameOverride: null,
    usesDamageRoll: true,
    temperatureExposure: null,
  },
  poison: {
    kind: 'poison',
    labelPrefix: 'Toxin ',
    floatIcon: 'mdi:biohazard',
    floatClassNameOverride: null,
    usesDamageRoll: false,
    temperatureExposure: null,
  },
  healing: {
    kind: 'healing',
    labelPrefix: '',
    floatIcon: null,
    floatClassNameOverride: null,
    usesDamageRoll: false,
    temperatureExposure: null,
  },
};

/**
 * Returns the descriptor for a damage kind.
 */
export function resolvingWorldPlazaEntityDamageKindDescriptor(
  kind: DefiningWorldPlazaEntityDamageKind
): DefiningWorldPlazaEntityDamageKindDescriptor {
  return DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[kind];
}

/**
 * Whether instant hits of this kind use the statistical roll engine.
 */
export function shouldWorldPlazaEntityDamageKindUseDamageRoll(
  kind: DefiningWorldPlazaEntityDamageKind
): boolean {
  return DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[kind].usesDamageRoll;
}

/**
 * Float icon for plain `damage` floats from this source, if any.
 */
export function resolvingWorldPlazaEntityDamageKindFloatIcon(
  kind: DefiningWorldPlazaEntityDamageKind
): MappingWorldPlazaEntityHealthFloatTextIconName | null {
  return DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[kind].floatIcon;
}

/**
 * Optional CSS class override for damage floats from this source.
 */
export function resolvingWorldPlazaEntityDamageKindFloatClassNameOverride(
  kind: DefiningWorldPlazaEntityDamageKind
): string | null {
  return DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[kind]
    .floatClassNameOverride;
}

/**
 * Temperature exposure inferred from damage kind when not explicitly provided.
 */
export function resolvingWorldPlazaEntityDamageKindTemperatureExposure(
  kind: DefiningWorldPlazaEntityDamageKind
): 'heat' | 'cold' | null {
  return DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[kind]
    .temperatureExposure;
}
