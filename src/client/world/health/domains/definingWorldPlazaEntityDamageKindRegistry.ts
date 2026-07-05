import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_FLOAT_TEXT_CLASS_NAME } from '@/components/world/health/domains/definingWorldPlazaEntityPotentialDamageConstants';
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
  /** Full-screen death title when this source kills the player. */
  deathScreenTitle: string;
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
    deathScreenTitle: 'YOU DIED',
  },
  environmental_lava: {
    kind: 'environmental_lava',
    labelPrefix: 'Burn ',
    floatIcon: 'solar:fire-bold',
    floatClassNameOverride: null,
    usesDamageRoll: false,
    temperatureExposure: 'heat',
    deathScreenTitle: 'YOU BURNED',
  },
  environmental_heat: {
    kind: 'environmental_heat',
    labelPrefix: 'Scorch ',
    floatIcon: 'solar:fire-bold',
    floatClassNameOverride: null,
    usesDamageRoll: false,
    temperatureExposure: 'heat',
    deathScreenTitle: 'YOU BURNED',
  },
  environmental_cold: {
    kind: 'environmental_cold',
    labelPrefix: 'Frost ',
    floatIcon: 'mdi:snowflake',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-frost',
    usesDamageRoll: false,
    temperatureExposure: 'cold',
    deathScreenTitle: 'YOU FROZE',
  },
  fall: {
    kind: 'fall',
    labelPrefix: 'Fall ',
    floatIcon: 'mdi:arrow-down-bold',
    floatClassNameOverride: null,
    usesDamageRoll: true,
    temperatureExposure: null,
    deathScreenTitle: 'YOU FELL',
  },
  toxic: {
    kind: 'toxic',
    labelPrefix: 'Toxin ',
    floatIcon: 'mdi:biohazard',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-toxic text-green-400',
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'YOU WERE POISONED',
  },
  venomous: {
    kind: 'venomous',
    labelPrefix: 'Venom ',
    floatIcon: 'game-icons:scythe',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-venomous text-green-500',
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'VENOM KILLED YOU',
  },
  lethal: {
    kind: 'lethal',
    labelPrefix: 'Lethal ',
    floatIcon: 'game-icons:death-skull',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-lethal-poison text-green-700',
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'LETHAL POISON',
  },
  bleeding: {
    kind: 'bleeding',
    labelPrefix: 'Bleed ',
    floatIcon: 'game-icons:drop',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-bleeding text-red-400',
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'YOU BLED OUT',
  },
  hemorrhaging: {
    kind: 'hemorrhaging',
    labelPrefix: 'Hemorrhage ',
    floatIcon: 'mdi:blood-bag',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-hemorrhaging text-red-600',
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'YOU HEMORRHAGED',
  },
  exsanguinating: {
    kind: 'exsanguinating',
    labelPrefix: 'Exsanguinate ',
    floatIcon: 'game-icons:broken-heart',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-exsanguinating text-red-900',
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'YOU EXSANGUINATED',
  },
  potential_damage: {
    kind: 'potential_damage',
    labelPrefix: 'Pending ',
    floatIcon: 'mdi:flash',
    floatClassNameOverride:
      DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_FLOAT_TEXT_CLASS_NAME,
    usesDamageRoll: true,
    temperatureExposure: null,
    deathScreenTitle: 'FATED DEATH',
  },
  healing: {
    kind: 'healing',
    labelPrefix: '',
    floatIcon: null,
    floatClassNameOverride: null,
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'YOU DIED',
  },
  starvation: {
    kind: 'starvation',
    labelPrefix: 'Starve ',
    floatIcon: 'mdi:food-drumstick-off',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-starvation text-amber-500',
    usesDamageRoll: false,
    temperatureExposure: null,
    deathScreenTitle: 'YOU STARVED',
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
 * Whether shield points absorb hits of this damage kind.
 */
export function shouldWorldPlazaEntityDamageKindAbsorbShield(
  kind: DefiningWorldPlazaEntityDamageKind
): boolean {
  return kind === 'physical';
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
