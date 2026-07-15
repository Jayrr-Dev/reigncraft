import {
  DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY,
  resolvingPlazaCodexMilestoneRewardDefinition,
  resolvingPlazaCodexMilestoneRewardsForSection,
} from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import { describe, expect, it } from 'vitest';

describe('definingPlazaCodexMilestoneRewardRegistry', () => {
  it('grants wood starter tools on first Sighted chests', () => {
    expect(
      resolvingPlazaCodexMilestoneRewardDefinition({
        sectionId: 'herbarium',
        meterKind: 'discovered',
        percent: 5,
      })?.reward.recipeId
    ).toBe(DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD);

    expect(
      resolvingPlazaCodexMilestoneRewardDefinition({
        sectionId: 'lapidary',
        meterKind: 'discovered',
        percent: 5,
      })?.reward.recipeId
    ).toBe(DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_WOOD);

    expect(
      resolvingPlazaCodexMilestoneRewardDefinition({
        sectionId: 'bestiary',
        meterKind: 'discovered',
        percent: 5,
      })?.reward.recipeId
    ).toBe(DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_WOOD);
  });

  it('leaves later chests and other sections undefined for now', () => {
    expect(
      resolvingPlazaCodexMilestoneRewardDefinition({
        sectionId: 'herbarium',
        meterKind: 'discovered',
        percent: 20,
      })
    ).toBeNull();
    expect(resolvingPlazaCodexMilestoneRewardsForSection('pathology')).toEqual(
      []
    );
    expect(DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY).toHaveLength(3);
  });
});
