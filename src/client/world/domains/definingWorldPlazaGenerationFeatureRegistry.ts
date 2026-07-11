/**
 * Declarative debug controls for isolating procedural world-generation layers.
 *
 * @module components/world/domains/definingWorldPlazaGenerationFeatureRegistry
 */

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE = {
  WILDLIFE: 'wildlife',
  TREES: 'trees',
  COLUMN_ROCKS: 'column-rocks',
  STONE_DECORATIONS: 'stone-decorations',
  LAKES: 'lakes',
  RIVERS: 'rivers',
  STREAMS: 'streams',
  PONDS: 'ponds',
  SWAMP_PONDS: 'swamp-ponds',
} as const;

export type DefiningWorldPlazaGenerationFeatureId =
  (typeof DEFINING_WORLD_PLAZA_GENERATION_FEATURE)[keyof typeof DEFINING_WORLD_PLAZA_GENERATION_FEATURE];

export type DefiningWorldPlazaGenerationFeatureGroupId =
  | 'entities'
  | 'terrain'
  | 'water';

export type DefiningWorldPlazaGenerationFeatureDefinition = {
  readonly featureId: DefiningWorldPlazaGenerationFeatureId;
  readonly groupId: DefiningWorldPlazaGenerationFeatureGroupId;
  readonly label: string;
  readonly description: string;
};

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_LABELS: Readonly<
  Record<DefiningWorldPlazaGenerationFeatureGroupId, string>
> = {
  entities: 'Entities',
  terrain: 'Terrain generation',
  water: 'Water generation',
};

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_ORDER: readonly DefiningWorldPlazaGenerationFeatureGroupId[] =
  ['entities', 'terrain', 'water'];

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY: readonly DefiningWorldPlazaGenerationFeatureDefinition[] =
  [
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE,
      groupId: 'entities',
      label: 'Wildlife',
      description: 'Spawn, simulate, sync, and render animals.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
      groupId: 'terrain',
      label: 'Trees',
      description: 'Procedural tree trunks, canopies, shadows, and collision.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.COLUMN_ROCKS,
      groupId: 'terrain',
      label: 'Rock columns',
      description: 'Large rocky-biome and open-world rock formations.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS,
      groupId: 'terrain',
      label: 'Stone decorations',
      description: 'Small stones, pebbles, and their harvest collision.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAKES,
      groupId: 'water',
      label: 'Lakes',
      description: 'Inland lake basins. Ocean and island boundaries remain.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
      groupId: 'water',
      label: 'Rivers',
      description: 'Wide flowing river channels and tributaries.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STREAMS,
      groupId: 'water',
      label: 'Streams',
      description: 'Thin connected streams, branches, and connectors.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PONDS,
      groupId: 'water',
      label: 'Ponds',
      description: 'Small still-water basins outside swamps.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SWAMP_PONDS,
      groupId: 'water',
      label: 'Swamp ponds',
      description: 'Large murky pools deep inside swamp biomes.',
    },
  ];

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS: Readonly<
  Record<DefiningWorldPlazaGenerationFeatureId, boolean>
> = {
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.COLUMN_ROCKS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAKES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STREAMS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PONDS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SWAMP_PONDS]: true,
};

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_STORAGE_KEY =
  'world-plaza-generation-feature-flags' as const;
