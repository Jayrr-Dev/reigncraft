import { resolvingPlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { resolvingPlazaCodexMilestoneRewardClaimDialogModel } from '@/components/home/domains/resolvingPlazaCodexMilestoneRewardClaimDialogModel';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaCodexMilestoneRewardClaimDialogModel', () => {
  it('uses registry label and claim description with recipe art', () => {
    const definition = resolvingPlazaCodexMilestoneRewardDefinition({
      sectionId: 'herbarium',
      meterKind: 'discovered',
      percent: 5,
    });

    expect(definition).not.toBeNull();
    if (!definition) {
      return;
    }

    const model =
      resolvingPlazaCodexMilestoneRewardClaimDialogModel(definition);

    expect(model.title).toBe('Wood Axe recipe');
    expect(model.description).toContain('cookbook');
    expect(model.recipeVisual).not.toBeNull();
    expect(definition.reward.recipeId).toBe(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD
    );
  });
});
