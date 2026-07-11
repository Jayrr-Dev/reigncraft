/**
 * Declarative debug controls for isolating procedural world-generation layers.
 *
 * @module components/world/domains/definingWorldPlazaGenerationFeatureRegistry
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE = {
  BIOMES: 'biomes',
  ELEVATION: 'elevation',
  FLOOR_TILES: 'floor-tiles',
  DOM_OVERLAYS: 'dom-overlays',
  WILDLIFE: 'wildlife',
  TREES: 'trees',
  COLUMN_ROCKS: 'column-rocks',
  STONE_DECORATIONS: 'stone-decorations',
  LAVA: 'lava',
  OCEAN: 'ocean',
  LAKES: 'lakes',
  RIVERS: 'rivers',
  STREAMS: 'streams',
  PONDS: 'ponds',
  SWAMP_PONDS: 'swamp-ponds',
} as const;

export type DefiningWorldPlazaGenerationFeatureId =
  (typeof DEFINING_WORLD_PLAZA_GENERATION_FEATURE)[keyof typeof DEFINING_WORLD_PLAZA_GENERATION_FEATURE];

export type DefiningWorldPlazaGenerationFeatureGroupId =
  | 'world'
  | 'entities'
  | 'terrain'
  | 'hud'
  | 'hazards'
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
  world: 'World shape',
  entities: 'Entities',
  terrain: 'Terrain generation',
  hud: 'HUD / overlays',
  hazards: 'Hazards',
  water: 'Water generation',
};

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_ORDER: readonly DefiningWorldPlazaGenerationFeatureGroupId[] =
  ['world', 'entities', 'terrain', 'hud', 'hazards', 'water'];

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY: readonly DefiningWorldPlazaGenerationFeatureDefinition[] =
  [
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES,
      groupId: 'world',
      label: 'Biomes',
      description:
        'Procedural biome variety. Off forces flat plains everywhere.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ELEVATION,
      groupId: 'world',
      label: 'Elevation',
      description: 'Hills and mountains. Off keeps every tile flat ground.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.FLOOR_TILES,
      groupId: 'terrain',
      label: 'Floor tiles',
      description:
        'Grass floor chunk bake and draw. Off leaves an empty stage (perf bisect).',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.DOM_OVERLAYS,
      groupId: 'hud',
      label: 'DOM overlays',
      description:
        'Shared rAF for name tags, minimap pan, health bars, labels, HUD sync.',
    },
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
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA,
      groupId: 'hazards',
      label: 'Lava',
      description: 'Procedural lava pools, Firelands lava, and ruin lava.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.OCEAN,
      groupId: 'water',
      label: 'Ocean',
      description: 'Ocean biome water and island-mode outer ocean.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAKES,
      groupId: 'water',
      label: 'Lakes',
      description: 'Inland lake basins.',
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
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ELEVATION]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.FLOOR_TILES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.DOM_OVERLAYS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.COLUMN_ROCKS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.OCEAN]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAKES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STREAMS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PONDS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SWAMP_PONDS]: true,
};

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_STORAGE_KEY =
  'world-plaza-generation-feature-flags' as const;

/** Biome forced when the Biomes generation feature is off. */
export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_FLAT_BIOME_KIND: DefiningWorldPlazaBiomeKind =
  'plains';

/** Water-layer ids: any one on is enough to keep water surface/shimmer syncing. */
export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_WATER_IDS = [
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.OCEAN,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAKES,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STREAMS,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PONDS,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SWAMP_PONDS,
] as const satisfies readonly DefiningWorldPlazaGenerationFeatureId[];
