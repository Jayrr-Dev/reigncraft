/**
 * Declarative grants for Codex overall-meter milestone chests.
 * Sighted/Logged and Studied percents come from milestone constants.
 *
 * @module components/home/domains/definingPlazaCodexMilestoneRewardRegistry
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import type { DefiningWorldPlazaInventoryStorageExpansionPageTier } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';

/** Which dual-progress meter the chest sits on. */
export type PlazaCodexMilestoneRewardMeterKind = 'discovered' | 'studied';

/** Attach a craft recipe page to the player's cookbook. */
export type PlazaCodexMilestoneAttachRecipeReward = {
  readonly kind: 'attach-recipe';
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  /** Short player-facing label for popovers / claim dialog title. */
  readonly label: string;
  /** One-line claim dialog blurb (what the player just got). */
  readonly description: string;
};

/** Unlock one bonus inventory storage page (+6 slots; global cap 3). */
export type PlazaCodexMilestoneUnlockStorageRowReward = {
  readonly kind: 'unlock-storage-row';
  /** Dialog / popover art tier (rare / mythic / legendary ledger page). */
  readonly pageTier: DefiningWorldPlazaInventoryStorageExpansionPageTier;
  readonly label: string;
  readonly description: string;
};

export type PlazaCodexMilestoneRewardGrant =
  | PlazaCodexMilestoneAttachRecipeReward
  | PlazaCodexMilestoneUnlockStorageRowReward;

export type PlazaCodexMilestoneRewardDefinition = {
  readonly sectionId: WorldPlazaCodexSectionId;
  readonly meterKind: PlazaCodexMilestoneRewardMeterKind;
  /**
   * Matches a chest percent for this meter:
   * discovered → overall / discovery / recipes arrays;
   * studied → `DEFINING_PLAZA_CODEX_STUDIED_MILESTONE_REWARD_PERCENTS`.
   */
  readonly percent: number;
  readonly reward: PlazaCodexMilestoneRewardGrant;
};

/**
 * First Sighted chests: wood starter tools for herbarium / lapidary / bestiary.
 * Further percent rows stay undefined until design locks them.
 */
export const DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY = [
  {
    sectionId: 'herbarium',
    meterKind: 'discovered',
    percent: 5,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD,
      label: 'Wood Axe recipe',
      description:
        'Pinned in your cookbook. Carve a spare axe from wood when the starter one fails.',
    },
  },
  {
    sectionId: 'lapidary',
    meterKind: 'discovered',
    percent: 5,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_WOOD,
      label: 'Wood Pickaxe recipe',
      description:
        'Pinned in your cookbook. Remake a pick from wood and stone when soft rock stops yielding.',
    },
  },
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 5,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_WOOD,
      label: 'Wood Fishing Rod recipe',
      description:
        'Pinned in your cookbook. Rebuild a wood rod when the tip snaps.',
    },
  },
  // Packing ledgers: herb Studied mid (51%) → biomes Discovered max → bestiary Sighted max.
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 51,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'rare',
      label: 'Rare Packing Ledger',
      description:
        'Added to your bag. Use it to unlock one storage page (+6 slots). At most three ledgers can expand your pack.',
    },
  },
  {
    sectionId: 'biomes',
    meterKind: 'discovered',
    percent: 100,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'mythic',
      label: 'Mythic Packing Ledger',
      description:
        'Added to your bag. Use it to unlock one storage page (+6 slots). At most three ledgers can expand your pack.',
    },
  },
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 100,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'legendary',
      label: 'Legendary Packing Ledger',
      description:
        'Added to your bag. Use it to unlock one storage page (+6 slots). At most three ledgers can expand your pack.',
    },
  },
  // Recipes Attached (8 slices): wood → ceramics → stove → healer → iron blade →
  // tube → soft clay cleaver → fated ledger blade.
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 13,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_WOOD,
      label: 'Wood Sword recipe',
      description:
        'Pinned in your cookbook. Carve a spare blade from wood when your starter sword fails.',
    },
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 25,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_BOWL,
      label: 'Wet Clay Bowl recipe',
      description:
        'Pinned in your cookbook. Shape a wet clay bowl for kilns and kitchen work.',
    },
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 38,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_STOVE,
      label: 'Clay Stove recipe',
      description:
        'Pinned in your cookbook. Build a clay stove for cooking and tea once you have the materials.',
    },
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 50,
    reward: {
      kind: 'attach-recipe',
      recipeId:
        DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_YARROW_PRESSURE_DRESSING,
      label: 'Yarrow Pressure Dressing recipe',
      description:
        'Pinned in your cookbook. Bind a yarrow dressing for field wounds.',
    },
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 63,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_IRON,
      label: 'Iron Sword recipe',
      description:
        'Pinned in your cookbook. Forge an iron blade when wood stops cutting.',
    },
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 75,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_TUBE,
      label: 'Iron Tube recipe',
      description:
        'Pinned in your cookbook. Forge iron tubes for bessemer forges and other advanced builds.',
    },
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 88,
    reward: {
      kind: 'attach-recipe',
      recipeId:
        DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_SOFT_CLAY_CLEAVER,
      label: 'Soft Clay Cleaver recipe',
      description:
        'Pinned in your cookbook. Craft the Soft Clay Cleaver, a specialty blade from ceramics work.',
    },
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 100,
    reward: {
      kind: 'attach-recipe',
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_FATED_LEDGER,
      label: 'Fated Ledger Blade recipe',
      description:
        'Pinned in your cookbook. Craft the Fated Ledger Blade, a specialty weapon bound to written fate.',
    },
  },
] as const satisfies readonly PlazaCodexMilestoneRewardDefinition[];

export type PlazaCodexMilestoneRewardLookupKey = {
  readonly sectionId: WorldPlazaCodexSectionId;
  readonly meterKind: PlazaCodexMilestoneRewardMeterKind;
  readonly percent: number;
};

/**
 * Resolves the declarative reward for one chest, or null when unset.
 */
export function resolvingPlazaCodexMilestoneRewardDefinition(
  key: PlazaCodexMilestoneRewardLookupKey
): PlazaCodexMilestoneRewardDefinition | null {
  return (
    DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY.find(
      (entry) =>
        entry.sectionId === key.sectionId &&
        entry.meterKind === key.meterKind &&
        entry.percent === key.percent
    ) ?? null
  );
}

/**
 * All defined rewards for one section (either dual meter).
 */
export function resolvingPlazaCodexMilestoneRewardsForSection(
  sectionId: WorldPlazaCodexSectionId
): readonly PlazaCodexMilestoneRewardDefinition[] {
  return DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY.filter(
    (entry) => entry.sectionId === sectionId
  );
}
