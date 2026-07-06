import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** One biome entry in the codex biomes guide. */
export type DefiningPlazaBiomesGuideEntry = {
  kind: DefiningWorldPlazaBiomeKind;
  icon: string;
  summary: string;
};

/** Subtitle shown under the Biomes panel title. */
export const DEFINING_PLAZA_BIOMES_PANEL_SUBTITLE =
  'Walk the world to reveal each region.' as const;

/** Label shown for biomes the player has not entered yet. */
export const LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME = '???' as const;

/** Hint shown under undiscovered biome cards. */
export const LABELING_PLAZA_BIOMES_UNDISCOVERED_HINT =
  'Keep exploring to uncover this region.' as const;

/** Ordered biome guide entries from common regions to rare ones. */
export const DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES: readonly DefiningPlazaBiomesGuideEntry[] =
  [
    {
      kind: 'plains',
      icon: 'mdi:grass',
      summary: 'Open grasslands with scattered wildflowers.',
    },
    {
      kind: 'forest',
      icon: 'mdi:pine-tree',
      summary: 'Dense trees, shade, and quiet ground cover.',
    },
    {
      kind: 'flower_forest',
      icon: 'mdi:flower',
      summary: 'Bright meadows packed with colorful blooms.',
    },
    {
      kind: 'beach',
      icon: 'mdi:beach',
      summary: 'Soft sand where land meets open water.',
    },
    {
      kind: 'savanna',
      icon: 'mdi:tree-outline',
      summary: 'Dry grass and scattered acacia groves.',
    },
    {
      kind: 'desert',
      icon: 'mdi:weather-sunny',
      summary: 'Hot dunes with little shade or water.',
    },
    {
      kind: 'snowy_plains',
      icon: 'mdi:snowflake',
      summary: 'Frozen ground and biting cold air.',
    },
    {
      kind: 'swamp',
      icon: 'mdi:water',
      summary: 'Murky wetlands with lily pads and reeds.',
    },
    {
      kind: 'rocky',
      icon: 'mdi:image-filter-hdr',
      summary: 'Bare stone flats with sparse vegetation.',
    },
    {
      kind: 'badlands',
      icon: 'mdi:terrain',
      summary: 'Layered clay hills and steep red drops.',
    },
    {
      kind: 'ocean',
      icon: 'mdi:waves',
      summary: 'Deep water far from any shore.',
    },
    {
      kind: 'firelands',
      icon: 'solar:fire-bold',
      summary: 'Scorched earth, ember vents, and ash.',
    },
  ] as const;

/** Static codex menu description for the Biomes section. */
export const LABELING_PLAZA_BIOMES_CODEX_MENU_DESCRIPTION =
  'Discovered regions and hidden ones' as const;
