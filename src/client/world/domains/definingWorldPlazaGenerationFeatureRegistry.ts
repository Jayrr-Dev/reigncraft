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
  HUD_MINIMAP: 'hud-minimap',
  HUD_ACTION_BAR: 'hud-action-bar',
  HUD_HOTBAR: 'hud-hotbar',
  HUD_CRAFTING: 'hud-crafting',
  HUD_DAY_NIGHT: 'hud-day-night',
  HUD_DANGER_SENSE: 'hud-danger-sense',
  HUD_STATUS: 'hud-status',
  HUD_HEALTH: 'hud-health',
  HUD_STAMINA: 'hud-stamina',
  HUD_WORLD_ANCHORS: 'hud-world-anchors',
  AUDIO_SFX: 'audio-sfx',
  PROJECTILES: 'projectiles',
  WILDLIFE: 'wildlife',
  WILDLIFE_AI: 'wildlife-ai',
  WILDLIFE_BOULDER_COVER: 'wildlife-boulder-cover',
  WILDLIFE_FAIRY_GLOW: 'wildlife-fairy-glow',
  WILDLIFE_SPEECH_BUBBLES: 'wildlife-speech-bubbles',
  WILDLIFE_DAMAGE_NUMBERS: 'wildlife-damage-numbers',
  WILDLIFE_NAME_TAGS: 'wildlife-name-tags',
  WILDLIFE_HUNGER_CIRCLE: 'wildlife-hunger-circle',
  NPCS: 'npcs',
  CHESTS: 'chests',
  TRAPS: 'traps',
  TREES: 'trees',
  COLUMN_ROCKS: 'column-rocks',
  ORE_VEINS: 'ore-veins',
  STONE_DECORATIONS: 'stone-decorations',
  LONG_GRASS: 'long-grass',
  SHRUBS: 'shrubs',
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
  | 'systems'
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
  systems: 'Systems',
  hazards: 'Hazards',
  water: 'Water generation',
};

export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_ORDER: readonly DefiningWorldPlazaGenerationFeatureGroupId[] =
  ['world', 'entities', 'terrain', 'hud', 'systems', 'hazards', 'water'];

/** HUD chrome pieces that can be toggled independently in Perf Flags. */
export const DEFINING_WORLD_PLAZA_GENERATION_FEATURE_HUD_IDS = [
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_MINIMAP,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_ACTION_BAR,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HOTBAR,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_CRAFTING,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DAY_NIGHT,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DANGER_SENSE,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STATUS,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HEALTH,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STAMINA,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_WORLD_ANCHORS,
] as const satisfies readonly DefiningWorldPlazaGenerationFeatureId[];

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
      label: 'DOM overlay rAF',
      description:
        'Shared rAF pump for world-anchored DOM sync. Off freezes labels; run stamina uses its own loop.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_MINIMAP,
      groupId: 'hud',
      label: 'Minimap + clock',
      description: 'Mini-map stack, clock, and temperature strip.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_ACTION_BAR,
      groupId: 'hud',
      label: 'Action bar',
      description: 'Top utility bar (settings, chat, map, craft).',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HOTBAR,
      groupId: 'hud',
      label: 'Hotbar + hunger',
      description: 'Bottom inventory hotbar and hunger icons.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_CRAFTING,
      groupId: 'hud',
      label: 'Crafting recipes',
      description:
        'Cookbook recipe spreads and craft-to-placement handoff. Requires hotbar.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DAY_NIGHT,
      groupId: 'hud',
      label: 'Day/night tint',
      description: 'Full-viewport day/night color overlay.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DANGER_SENSE,
      groupId: 'hud',
      label: 'Danger sense',
      description:
        '360° edge vignette: yellow for stalk/territory warn, red for hunt.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STATUS,
      groupId: 'hud',
      label: 'Status + notices',
      description:
        'Status-effect stack, world notifications, mobile roll button.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HEALTH,
      groupId: 'hud',
      label: 'Health bars',
      description:
        'World-anchored health bars and damage float texts above avatars.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STAMINA,
      groupId: 'hud',
      label: 'Stamina bar',
      description: 'Run stamina track under the local player health bar.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_WORLD_ANCHORS,
      groupId: 'hud',
      label: 'World HUD anchors',
      description:
        'Name tags, chat bubbles, eat overlay, stun/sleep markers, interaction labels.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX,
      groupId: 'systems',
      label: 'Audio SFX',
      description:
        'Footsteps, ambience, motion, wildlife, and other star-audio SFX plays.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PROJECTILES,
      groupId: 'systems',
      label: 'Projectiles',
      description: 'Projectile simulation tick and visual layers.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE,
      groupId: 'entities',
      label: 'Wildlife',
      description: 'Spawn, simulate, sync, and render animals.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_AI,
      groupId: 'entities',
      label: 'Wildlife AI',
      description:
        'Think / intent updates (aggro, flee, stalk). Off freezes decisions.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_BOULDER_COVER,
      groupId: 'entities',
      label: 'Wildlife boulder cover',
      description:
        'Hiding behind mega-boulders reduces detection and can break chase when far.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_FAIRY_GLOW,
      groupId: 'entities',
      label: 'Fairy glow',
      description:
        'Glow-orb fairy bodies and their night light sources. Off hides orbs and fairy lights.',
    },
    {
      featureId:
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_SPEECH_BUBBLES,
      groupId: 'entities',
      label: 'Wildlife speech',
      description: 'Animal text bubbles above sprites.',
    },
    {
      featureId:
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_DAMAGE_NUMBERS,
      groupId: 'entities',
      label: 'Wildlife damage nums',
      description: 'Floating combat numbers on wildlife hits.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_NAME_TAGS,
      groupId: 'entities',
      label: 'Wildlife name tags',
      description: 'Species / name labels above animals.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_HUNGER_CIRCLE,
      groupId: 'entities',
      label: 'Wildlife hunger circle',
      description:
        'Mini hunger orb above animals (same fill drain as the player HUD). Off hides the circle.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.NPCS,
      groupId: 'entities',
      label: 'NPCs',
      description: 'Placed villagers, interaction badges, and Talk/Shop/Quest panels.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.CHESTS,
      groupId: 'entities',
      label: 'Chests',
      description:
        'Hand-placed world chests, Open/Locked labels, loot grants, and collision.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS,
      groupId: 'entities',
      label: 'Traps',
      description:
        'Player-placed bear traps and caltrops. Bear traps snare/bleed with Arm/Disarm/Pick up; caltrops are one-shot slow + bleed.',
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
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ORE_VEINS,
      groupId: 'terrain',
      label: 'Ore veins',
      description:
        'Tinted ore-bearing column rocks and ore drops when mined. Off keeps plain stone only.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS,
      groupId: 'terrain',
      label: 'Stone decorations',
      description: 'Small stones, pebbles, and their harvest collision.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LONG_GRASS,
      groupId: 'terrain',
      label: 'Long grass',
      description:
        'Sprite long-grass clumps, search loot, and wildlife grazing.',
    },
    {
      featureId: DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SHRUBS,
      groupId: 'terrain',
      label: 'Berry shrubs',
      description:
        'Berry shrubs, pick loot, and wildlife browsing unpicked bushes.',
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
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_MINIMAP]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_ACTION_BAR]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HOTBAR]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_CRAFTING]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DAY_NIGHT]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DANGER_SENSE]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STATUS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HEALTH]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STAMINA]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_WORLD_ANCHORS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PROJECTILES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_AI]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_BOULDER_COVER]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_FAIRY_GLOW]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_SPEECH_BUBBLES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_DAMAGE_NUMBERS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_NAME_TAGS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_HUNGER_CIRCLE]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.NPCS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.CHESTS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.COLUMN_ROCKS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ORE_VEINS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LONG_GRASS]: true,
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SHRUBS]: true,
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
