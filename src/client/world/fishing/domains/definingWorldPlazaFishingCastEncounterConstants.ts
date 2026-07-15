/**
 * Declarative fishing cast wildlife encounter tuning.
 *
 * Each successful cast has a small chance to spawn a biome-weighted surprise:
 * predators, curious visitors, herds, or fairy watchers.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpeciesId,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Chance a cast rolls any wildlife encounter. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE = 0.04;

/** Minimum wall-clock gap between successful cast encounters (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_COOLDOWN_MS = 90_000;

export type DefiningWorldPlazaFishingCastEncounterBehavior =
  | 'predator'
  | 'curious'
  | 'herd'
  | 'fairy'
  | 'pinguin';

export type DefiningWorldPlazaFishingCastEncounterEventId =
  | 'bear'
  | 'wolf'
  | 'pinguin'
  | 'fairy'
  | 'monkey_troop'
  | 'lion'
  | 'tiger'
  | 'elephant_herd'
  | 'curious_herd'
  | 'crocodile'
  | 'hyena_pack';

export type DefiningWorldPlazaFishingCastEncounterSpeciesSource =
  | {
      readonly mode: 'fixed';
      readonly speciesId: DefiningWildlifeSpeciesId;
    }
  | {
      readonly mode: 'pool';
      readonly speciesIds: readonly DefiningWildlifeSpeciesId[];
    }
  | { readonly mode: 'bear_by_biome' }
  | { readonly mode: 'curious_herd_by_biome' }
  | { readonly mode: 'lion_pride' }
  | { readonly mode: 'elephant_herd' };

export type DefiningWorldPlazaFishingCastEncounterRegistryEntry = {
  readonly eventId: DefiningWorldPlazaFishingCastEncounterEventId;
  readonly weight: number;
  /** Omit = eligible in every biome (e.g. fairy). */
  readonly biomeKinds?: readonly DefiningWorldPlazaBiomeKind[];
  readonly packSizeRange: readonly [number, number];
  readonly behavior: DefiningWorldPlazaFishingCastEncounterBehavior;
  readonly toast: string;
  readonly speciesSource: DefiningWorldPlazaFishingCastEncounterSpeciesSource;
  readonly temperamentOverrideId?: DefiningWildlifeTemperamentId | null;
  readonly aggressionLevel?: DefiningWildlifeAggressionLevel;
  /** Pack index that may bond as a docile pet (monkey troop leader). */
  readonly tameablePackIndex?: number;
};

/** Predator stalks / follows before it may attack (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS = 10_000;

/**
 * If the player gets this far from the predator during the stalk window, the
 * encounter cancels and the animal soft-despawns.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID = 26;

/**
 * Spawn ring: min grid distance from the player (off-screen on typical viewports).
 * Must stay under wildlife sim radius so the instance is not instantly culled.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MIN_DISTANCE_GRID = 18;

/** Spawn ring max grid distance from the player. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MAX_DISTANCE_GRID = 24;

/**
 * Ideal shadow distance while the predator stalks before attacking (grid).
 * Larger than docile follow comfort so the animal does not glue to the player.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_DISTANCE_GRID = 10;

/** Back away when closer than this while fishing-cast stalking. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MIN_DISTANCE_GRID = 8;

/** Catch up when farther than this while fishing-cast stalking. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MAX_DISTANCE_GRID = 12;

/** Placement attempts for an off-screen encounter spawn. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_ATTEMPT_COUNT = 24;

/** Salt mixed into seeded encounter placement rolls. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_PLACEMENT_SALT = 77_421;

/** How long a cast-spawned fairy trails before departing (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_FOLLOW_MS = 45_000;

/** How long a cast-spawned pinguin stays curious / followable (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_FOLLOW_MS = 90_000;

/** How long the tameable monkey in a troop may follow / bond (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_TAME_FOLLOW_MS = 90_000;

/** How long skittish monkeys linger near a fishing spot (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_SKITTISH_LINGER_MS = 45_000;

/** How long a curious herbivore herd visits the shore (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_LINGER_MS = 45_000;

/** How long an elephant herd approaches before wandering off (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_ELEPHANT_HERD_LINGER_MS = 60_000;

/** Toast when a predator begins stalking from off-screen. */
export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PREDATOR_TOAST =
  'Something stalks you from beyond the water…' as const;

export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_LION_TOAST =
  'A lion catches the scent of your catch.' as const;

export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_TIGER_TOAST =
  'A tiger watches from the treeline…' as const;

export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CROCODILE_TOAST =
  'Something stirs in the shallows…' as const;

export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_HYENA_TOAST =
  'Hyena laughs carry across the water.' as const;

/** Toast when a pinguin waddles in from the cast. */
export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_TOAST =
  'A pinguin notices your catch.' as const;

/** Toast when a fairy drifts in from the cast. */
export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_TOAST =
  'A fairy drifts in to watch you fish.' as const;

export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_TROOP_TOAST =
  'A troop of monkeys swings in to watch you fish.' as const;

export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_ELEPHANT_HERD_TOAST =
  'An elephant herd rumbles toward the water.' as const;

export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_TOAST =
  'A herd wanders over to see what you caught.' as const;

/** Biome → bear species pool (biome-appropriate). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_BEARS_BY_BIOME: Partial<
  Record<DefiningWorldPlazaBiomeKind, readonly DefiningWildlifeSpeciesId[]>
> = {
  forest: ['brown-bear', 'grizzly'],
  snowy_plains: ['polar-bear', 'grizzly', 'brown-bear'],
  frostsink: ['polar-bear', 'grizzly', 'brown-bear'],
  rocky: ['grizzly'],
};

/** Fallback bear when the cast biome has no mapped pool. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID: DefiningWildlifeSpeciesId =
  'brown-bear';

/** Wolf species for fishing cast encounters. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID: DefiningWildlifeSpeciesId =
  'grey-wolf';

/** Pinguin species id (catalog spelling). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID: DefiningWildlifeSpeciesId =
  'pinguin';

/** Fairy species id. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID: DefiningWildlifeSpeciesId =
  'fairy';

/** Curious shore herds by biome. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_BY_BIOME: Partial<
  Record<DefiningWorldPlazaBiomeKind, readonly DefiningWildlifeSpeciesId[]>
> = {
  forest: ['deer', 'boar', 'stag'],
  flower_forest: ['deer', 'boar'],
  jungle: ['deer', 'boar', 'pig'],
  plains: ['deer', 'zebra', 'antilope'],
  savanna: ['zebra', 'antilope', 'oryx', 'ostrich', 'giraffe'],
  swamp: ['deer', 'boar', 'water-buffalo'],
  rocky: ['deer', 'ram', 'llama'],
  desert: ['zebra', 'oryx', 'ostrich', 'camel'],
  snowy_plains: ['deer', 'stag'],
  frostsink: ['deer', 'stag'],
};

export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_CURIOUS_HERD_SPECIES_ID: DefiningWildlifeSpeciesId =
  'deer';

/** Biome-weighted fishing cast encounter registry. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_REGISTRY: readonly DefiningWorldPlazaFishingCastEncounterRegistryEntry[] =
  [
    {
      eventId: 'bear',
      weight: 3,
      biomeKinds: ['forest', 'rocky', 'snowy_plains', 'frostsink'],
      packSizeRange: [1, 1],
      behavior: 'predator',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PREDATOR_TOAST,
      speciesSource: { mode: 'bear_by_biome' },
      temperamentOverrideId: 'predator',
      aggressionLevel: 'aggressive',
    },
    {
      eventId: 'wolf',
      weight: 3,
      biomeKinds: [
        'forest',
        'plains',
        'snowy_plains',
        'flower_forest',
        'rocky',
      ],
      packSizeRange: [1, 1],
      behavior: 'predator',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PREDATOR_TOAST,
      speciesSource: {
        mode: 'fixed',
        speciesId: DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID,
      },
      temperamentOverrideId: null,
      aggressionLevel: 'aggressive',
    },
    {
      eventId: 'pinguin',
      weight: 4,
      biomeKinds: ['snowy_plains', 'frostsink', 'beach', 'ocean'],
      packSizeRange: [1, 1],
      behavior: 'pinguin',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_TOAST,
      speciesSource: {
        mode: 'fixed',
        speciesId:
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID,
      },
      temperamentOverrideId: 'docile',
      aggressionLevel: 'tame',
    },
    {
      eventId: 'fairy',
      weight: 2,
      packSizeRange: [1, 1],
      behavior: 'fairy',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_TOAST,
      speciesSource: {
        mode: 'fixed',
        speciesId: DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID,
      },
      aggressionLevel: 'tame',
    },
    {
      eventId: 'monkey_troop',
      weight: 5,
      biomeKinds: ['jungle', 'forest'],
      packSizeRange: [3, 5],
      behavior: 'curious',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_TROOP_TOAST,
      speciesSource: { mode: 'fixed', speciesId: 'monkey' },
      tameablePackIndex: 0,
    },
    {
      eventId: 'lion',
      weight: 4,
      biomeKinds: ['savanna'],
      packSizeRange: [1, 2],
      behavior: 'predator',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_LION_TOAST,
      speciesSource: { mode: 'lion_pride' },
      temperamentOverrideId: 'predator',
      aggressionLevel: 'aggressive',
    },
    {
      eventId: 'tiger',
      weight: 4,
      biomeKinds: ['jungle', 'forest'],
      packSizeRange: [1, 1],
      behavior: 'predator',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_TIGER_TOAST,
      speciesSource: { mode: 'fixed', speciesId: 'tiger' },
      temperamentOverrideId: 'predator',
      aggressionLevel: 'aggressive',
    },
    {
      eventId: 'elephant_herd',
      weight: 3,
      biomeKinds: ['savanna'],
      packSizeRange: [3, 3],
      behavior: 'herd',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_ELEPHANT_HERD_TOAST,
      speciesSource: { mode: 'elephant_herd' },
    },
    {
      eventId: 'curious_herd',
      weight: 4,
      packSizeRange: [2, 4],
      behavior: 'herd',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_TOAST,
      speciesSource: { mode: 'curious_herd_by_biome' },
    },
    {
      eventId: 'crocodile',
      weight: 3,
      biomeKinds: ['swamp', 'jungle'],
      packSizeRange: [1, 1],
      behavior: 'predator',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CROCODILE_TOAST,
      speciesSource: { mode: 'fixed', speciesId: 'crocodile' },
      temperamentOverrideId: 'predator',
      aggressionLevel: 'aggressive',
    },
    {
      eventId: 'hyena_pack',
      weight: 3,
      biomeKinds: ['savanna'],
      packSizeRange: [2, 3],
      behavior: 'predator',
      toast: LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_HYENA_TOAST,
      speciesSource: { mode: 'fixed', speciesId: 'hyena' },
      temperamentOverrideId: null,
      aggressionLevel: 'aggressive',
    },
  ];

/** @deprecated Use registry event ids. Kept for tests referencing legacy kind names. */
export type DefiningWorldPlazaFishingCastEncounterKind =
  DefiningWorldPlazaFishingCastEncounterEventId;
