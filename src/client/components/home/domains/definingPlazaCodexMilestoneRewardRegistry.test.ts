import {
  DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY,
  resolvingPlazaCodexMilestoneRewardDefinition,
  resolvingPlazaCodexMilestoneRewardsForSection,
} from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import { describe, expect, it } from 'vitest';

describe('definingPlazaCodexMilestoneRewardRegistry', () => {
  it('grants wood starter tools on first Sighted chests', () => {
    const herbarium = resolvingPlazaCodexMilestoneRewardDefinition({
      sectionId: 'herbarium',
      meterKind: 'discovered',
      percent: 5,
    });
    expect(herbarium?.reward.kind).toBe('attach-recipe');
    if (herbarium?.reward.kind === 'attach-recipe') {
      expect(herbarium.reward.recipeId).toBe(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD
      );
    }

    const lapidary = resolvingPlazaCodexMilestoneRewardDefinition({
      sectionId: 'lapidary',
      meterKind: 'discovered',
      percent: 5,
    });
    expect(lapidary?.reward.kind).toBe('attach-recipe');
    if (lapidary?.reward.kind === 'attach-recipe') {
      expect(lapidary.reward.recipeId).toBe(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_WOOD
      );
    }

    const bestiary = resolvingPlazaCodexMilestoneRewardDefinition({
      sectionId: 'bestiary',
      meterKind: 'discovered',
      percent: 5,
    });
    expect(bestiary?.reward.kind).toBe('attach-recipe');
    if (bestiary?.reward.kind === 'attach-recipe') {
      expect(bestiary.reward.recipeId).toBe(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_WOOD
      );
    }
  });

  it('staggers packing ledgers: herb Studied mid, biomes Discovered max, bestiary Sighted max', () => {
    expect(
      resolvingPlazaCodexMilestoneRewardDefinition({
        sectionId: 'herbarium',
        meterKind: 'studied',
        percent: 50,
      })?.reward
    ).toMatchObject({
      kind: 'unlock-storage-row',
      pageTier: 'rare',
    });
    expect(
      resolvingPlazaCodexMilestoneRewardDefinition({
        sectionId: 'biomes',
        meterKind: 'discovered',
        percent: 100,
      })?.reward
    ).toMatchObject({
      kind: 'unlock-storage-row',
      pageTier: 'mythic',
    });
    expect(
      resolvingPlazaCodexMilestoneRewardDefinition({
        sectionId: 'bestiary',
        meterKind: 'discovered',
        percent: 100,
      })?.reward
    ).toMatchObject({
      kind: 'unlock-storage-row',
      pageTier: 'legendary',
    });
    expect(resolvingPlazaCodexMilestoneRewardsForSection('pathology')).toEqual(
      []
    );
    expect(DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY).toHaveLength(6);
  });
});
