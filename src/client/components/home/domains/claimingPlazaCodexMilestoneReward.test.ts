import {
  checkingPlazaCodexMilestoneRewardClaimed,
  claimingPlazaCodexMilestoneReward,
} from '@/components/home/domains/claimingPlazaCodexMilestoneReward';
import { resolvingPlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import {
  attachingWorldPlazaRecipePage,
  gettingWorldPlazaRecipeAttachedSnapshot,
  resettingWorldPlazaRecipeDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('claimingPlazaCodexMilestoneReward', () => {
  beforeEach(() => {
    resettingWorldPlazaRecipeDiscoveryStoreForTests();
  });

  it('attaches the wood axe recipe when herbarium Sighted chest is reached', () => {
    const definition = resolvingPlazaCodexMilestoneRewardDefinition({
      sectionId: 'herbarium',
      meterKind: 'discovered',
      percent: 5,
    });

    expect(definition).not.toBeNull();
    if (!definition) {
      return;
    }

    expect(claimingPlazaCodexMilestoneReward(definition, false)).toBe(
      'not-ready'
    );
    expect(claimingPlazaCodexMilestoneReward(definition, true)).toBe(
      'attached'
    );
    expect(gettingWorldPlazaRecipeAttachedSnapshot()).toContain(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD
    );
    expect(claimingPlazaCodexMilestoneReward(definition, true)).toBe(
      'already-attached'
    );
  });

  it('treats cookbook attach as claimed', () => {
    const definition = resolvingPlazaCodexMilestoneRewardDefinition({
      sectionId: 'bestiary',
      meterKind: 'discovered',
      percent: 5,
    });

    expect(definition).not.toBeNull();
    if (!definition) {
      return;
    }

    expect(
      checkingPlazaCodexMilestoneRewardClaimed(definition, new Set())
    ).toBe(false);

    attachingWorldPlazaRecipePage(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_WOOD
    );

    expect(
      checkingPlazaCodexMilestoneRewardClaimed(
        definition,
        new Set([DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_WOOD])
      )
    ).toBe(true);
  });
});
