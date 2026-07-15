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
import {
  gettingWorldPlazaInventoryBonusStorageRows,
  initializingWorldPlazaInventoryStorageExpansionStore,
  resettingWorldPlazaInventoryStorageExpansionStoreForTests,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('claimingPlazaCodexMilestoneReward', () => {
  beforeEach(() => {
    resettingWorldPlazaRecipeDiscoveryStoreForTests();
    resettingWorldPlazaInventoryStorageExpansionStoreForTests();
    initializingWorldPlazaInventoryStorageExpansionStore('test-codex-expand');
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

  it('unlocks a bonus storage row from the herbarium Sighted 20% chest', () => {
    const definition = resolvingPlazaCodexMilestoneRewardDefinition({
      sectionId: 'herbarium',
      meterKind: 'discovered',
      percent: 20,
    });

    expect(definition).not.toBeNull();
    if (!definition) {
      return;
    }

    expect(claimingPlazaCodexMilestoneReward(definition, true)).toBe(
      'unlocked'
    );
    expect(gettingWorldPlazaInventoryBonusStorageRows()).toBe(1);
    expect(
      checkingPlazaCodexMilestoneRewardClaimed(definition, new Set())
    ).toBe(true);
    expect(claimingPlazaCodexMilestoneReward(definition, true)).toBe(
      'already-claimed'
    );
  });
});
