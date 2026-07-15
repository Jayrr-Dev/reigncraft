/**
 * Declarative grants for Codex overall-meter milestone chests.
 * Sighted/Logged and Studied percents come from milestone constants.
 *
 * @module components/home/domains/definingPlazaCodexMilestoneRewardRegistry
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
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
  /** Matches a value in `DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS`. */
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
  {
    sectionId: 'herbarium',
    meterKind: 'discovered',
    percent: 20,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'rare',
      label: 'Rare Packing Ledger',
      description:
        'Your pack gains one storage page (+6 slots). At most three ledgers can bind.',
    },
  },
  {
    sectionId: 'lapidary',
    meterKind: 'discovered',
    percent: 20,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'mythic',
      label: 'Mythic Packing Ledger',
      description:
        'Your pack gains one storage page (+6 slots). At most three ledgers can bind.',
    },
  },
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 20,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'legendary',
      label: 'Legendary Packing Ledger',
      description:
        'Your pack gains one storage page (+6 slots). At most three ledgers can bind.',
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
