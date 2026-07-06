import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** How often a biome appears while exploring the world. */
export type PlazaBiomesRarityId = 'common' | 'uncommon' | 'rare' | 'legendary';

/** Rarity tab filter, including the full list. */
export type PlazaBiomesRarityFilterId = 'all' | PlazaBiomesRarityId;

/**
 * Only this biome may use the legendary codex tier.
 *
 * Validated by:
 * - `src/client/world/domains/checkingPlazaBiomesGuideRarityAgainstWorldFrequencies.ts`
 * - `src/client/world/domains/resolvingWorldPlazaBiomeFrequencySampling.test.ts`
 */
export const DEFINING_PLAZA_BIOMES_LEGENDARY_KIND: DefiningWorldPlazaBiomeKind =
  'firelands';

/** One biome entry in the codex biomes guide. */
export type DefiningPlazaBiomesGuideEntry = {
  kind: DefiningWorldPlazaBiomeKind;
  icon: string;
  summary: string;
  /** Spawn frequency tier; validated by checkingPlazaBiomesGuideRarityAgainstWorldFrequencies.ts */
  rarity: PlazaBiomesRarityId;
};

/** Rarity filter tabs for the biomes panel grid. */
export const DEFINING_PLAZA_BIOMES_RARITY_FILTERS: readonly {
  id: PlazaBiomesRarityFilterId;
  label: string;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'common', label: 'Common' },
  { id: 'uncommon', label: 'Uncommon' },
  { id: 'rare', label: 'Rare' },
  { id: 'legendary', label: 'Legendary' },
] as const;

/** Player-facing rarity labels and status-badge styling. */
export const DEFINING_PLAZA_BIOMES_RARITY_REGISTRY: Record<
  PlazaBiomesRarityId,
  {
    label: string;
    icon: string;
    borderClassName: string;
    iconClassName: string;
  }
> = {
  common: {
    label: 'Common',
    icon: 'mdi:grass',
    borderClassName: 'border-emerald-500/60 bg-emerald-950/88',
    iconClassName: 'text-emerald-200',
  },
  uncommon: {
    label: 'Uncommon',
    icon: 'mdi:shield-half-full',
    borderClassName: 'border-sky-400/60 bg-sky-950/88',
    iconClassName: 'text-sky-200',
  },
  rare: {
    label: 'Rare',
    icon: 'mdi:star-four-points',
    borderClassName: 'border-violet-400/60 bg-violet-950/88',
    iconClassName: 'text-violet-200',
  },
  legendary: {
    label: 'Legendary',
    icon: 'solar:fire-bold',
    borderClassName: 'border-amber-500/65 bg-amber-950/88',
    iconClassName: 'text-amber-200',
  },
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
      rarity: 'common',
    },
    {
      kind: 'forest',
      icon: 'mdi:pine-tree',
      summary: 'Dense trees, shade, and quiet ground cover.',
      rarity: 'common',
    },
    {
      kind: 'flower_forest',
      icon: 'mdi:flower',
      summary: 'Bright meadows packed with colorful blooms.',
      rarity: 'common',
    },
    {
      kind: 'snowy_plains',
      icon: 'mdi:snowflake',
      summary: 'Frozen ground and biting cold air.',
      rarity: 'common',
    },
    {
      kind: 'beach',
      icon: 'mdi:beach',
      summary: 'Soft sand where land meets open water.',
      rarity: 'uncommon',
    },
    {
      kind: 'savanna',
      icon: 'mdi:tree-outline',
      summary: 'Dry grass and scattered acacia groves.',
      rarity: 'uncommon',
    },
    {
      kind: 'rocky',
      icon: 'mdi:image-filter-hdr',
      summary: 'Bare stone flats with sparse vegetation.',
      rarity: 'uncommon',
    },
    {
      kind: 'desert',
      icon: 'mdi:weather-sunny',
      summary: 'Hot dunes with little shade or water.',
      rarity: 'rare',
    },
    {
      kind: 'swamp',
      icon: 'mdi:water',
      summary: 'Murky wetlands with lily pads and reeds.',
      rarity: 'rare',
    },
    {
      kind: 'badlands',
      icon: 'mdi:terrain',
      summary: 'Layered clay hills and steep red drops.',
      rarity: 'rare',
    },
    {
      kind: 'ocean',
      icon: 'mdi:waves',
      summary: 'Deep water far from any shore.',
      rarity: 'rare',
    },
    {
      kind: 'firelands',
      icon: 'solar:fire-bold',
      summary: 'Scorched earth, ember vents, and ash.',
      rarity: 'legendary',
    },
  ] as const;

/** Static codex menu description for the Biomes section. */
export const LABELING_PLAZA_BIOMES_CODEX_MENU_DESCRIPTION =
  'Discovered regions and hidden ones' as const;
