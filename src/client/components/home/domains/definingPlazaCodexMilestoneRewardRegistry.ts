/**
 * Declarative grants for Codex overall-meter milestone chests.
 * Sighted/Logged and Studied percents come from milestone constants.
 *
 * @module components/home/domains/definingPlazaCodexMilestoneRewardRegistry
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';

/** Which dual-progress meter the chest sits on. */
export type PlazaCodexMilestoneRewardMeterKind = 'discovered' | 'studied';

/** Attach a craft recipe page to the player's cookbook. */
export type PlazaCodexMilestoneAttachRecipeReward = {
  readonly kind: 'attach-recipe';
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  /** Short player-facing label for popovers / claim feedback. */
  readonly label: string;
};

export type PlazaCodexMilestoneRewardGrant =
  PlazaCodexMilestoneAttachRecipeReward;

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
