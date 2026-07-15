import {
  checkingPlazaCodexDualMetersHaveRewardReady,
  resolvingPlazaCodexMenuRewardReadySections,
} from '@/components/home/domains/resolvingPlazaCodexMenuRewardReadySections';
import {
  checkingPlazaCodexDiscoveryProgressHasRewardReady,
  checkingPlazaCodexOverallProgressHasRewardReady,
  resolvingPlazaCodexDiscoveryMilestoneRewardMarkers,
  resolvingPlazaCodexOverallProgressMilestoneRewardMarkers,
  resolvingPlazaCodexStudyMilestoneRewardPopoverAlign,
  resolvingPlazaCodexStudyMilestoneRewardPopoverLabel,
} from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaCodexOverallProgressMilestoneRewardMarkers', () => {
  it('places chests along overall discovered or studied meters', () => {
    const markers = resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
      13,
      44
    );

    expect(markers.map((marker) => marker.percent)).toEqual([
      5, 20, 50, 75, 100,
    ]);
    expect(markers[0]?.threshold).toBe(2);
    expect(markers[0]?.isReached).toBe(true);
    expect(markers[0]?.remainingNeeded).toBe(0);
    expect(markers[4]?.threshold).toBe(44);
    expect(markers[4]?.isReached).toBe(false);
    expect(markers[4]?.remainingNeeded).toBe(31);
  });

  it('scales studied-point milestones to the panel max', () => {
    const markers = resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
      879,
      4400
    );

    expect(markers.find((marker) => marker.percent === 5)?.threshold).toBe(220);
    expect(markers.find((marker) => marker.percent === 5)?.isReached).toBe(
      true
    );
    expect(markers.find((marker) => marker.percent === 20)?.threshold).toBe(
      880
    );
    expect(markers.find((marker) => marker.percent === 20)?.isReached).toBe(
      false
    );
    expect(
      markers.find((marker) => marker.percent === 20)?.remainingNeeded
    ).toBe(1);
  });

  it('marks herbarium Sighted 5% as unclaimed wood axe until attached', () => {
    const markers = resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
      2,
      44,
      undefined,
      {
        sectionId: 'herbarium',
        meterKind: 'discovered',
        attachedRecipeIds: new Set(),
      }
    );

    const first = markers.find((marker) => marker.percent === 5);
    expect(first?.hasUnclaimedReward).toBe(true);
    expect(first?.rewardDefinition?.reward.recipeId).toBe(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD
    );

    const claimed = resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
      2,
      44,
      undefined,
      {
        sectionId: 'herbarium',
        meterKind: 'discovered',
        attachedRecipeIds: new Set([
          DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD,
        ]),
      }
    );

    expect(
      claimed.find((marker) => marker.percent === 5)?.hasUnclaimedReward
    ).toBe(false);
    expect(claimed.find((marker) => marker.percent === 5)?.isClaimed).toBe(
      true
    );
  });
});

describe('resolvingPlazaCodexStudyMilestoneRewardPopoverLabel', () => {
  it('shows remaining count until reward', () => {
    expect(resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(31, false)).toBe(
      '31 more'
    );
    expect(resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(1, false)).toBe(
      '1 more'
    );
  });

  it('shows ready when milestone is reached without a defined grant', () => {
    expect(resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(0, true)).toBe(
      'Reward ready'
    );
  });

  it('shows claim and claimed labels for defined grants', () => {
    expect(
      resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(0, true, {
        rewardLabel: 'Wood Axe recipe',
        hasUnclaimedReward: true,
      })
    ).toBe('Claim Wood Axe recipe');
    expect(
      resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(0, true, {
        isClaimed: true,
      })
    ).toBe('Claimed');
  });

  it('names locked grants so players see what the chest holds', () => {
    expect(
      resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(31, false, {
        rewardLabel: 'Wood Axe recipe',
      })
    ).toBe('31 more · Wood Axe recipe');
    expect(
      resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(1, false, {
        rewardLabel: 'Wood Pickaxe recipe',
      })
    ).toBe('1 more · Wood Pickaxe recipe');
  });
});

describe('resolvingPlazaCodexStudyMilestoneRewardPopoverAlign', () => {
  it('pins early and late chests to the panel edges', () => {
    expect(resolvingPlazaCodexStudyMilestoneRewardPopoverAlign(5)).toBe(
      'start'
    );
    expect(resolvingPlazaCodexStudyMilestoneRewardPopoverAlign(50)).toBe(
      'center'
    );
    expect(resolvingPlazaCodexStudyMilestoneRewardPopoverAlign(100)).toBe(
      'end'
    );
  });
});

describe('checkingPlazaCodexOverallProgressHasRewardReady', () => {
  it('is false before the first milestone', () => {
    expect(checkingPlazaCodexOverallProgressHasRewardReady(0, 44)).toBe(false);
    expect(checkingPlazaCodexOverallProgressHasRewardReady(1, 44)).toBe(false);
  });

  it('is true once any milestone threshold is reached', () => {
    expect(checkingPlazaCodexOverallProgressHasRewardReady(2, 44)).toBe(true);
    expect(checkingPlazaCodexOverallProgressHasRewardReady(13, 57)).toBe(true);
  });
});

describe('resolvingPlazaCodexDiscoveryMilestoneRewardMarkers', () => {
  it('places four chests on discovery-only meters', () => {
    const markers = resolvingPlazaCodexDiscoveryMilestoneRewardMarkers(3, 14);

    expect(markers.map((marker) => marker.percent)).toEqual([25, 50, 75, 100]);
    expect(markers[0]?.threshold).toBe(4);
    expect(markers[0]?.isReached).toBe(false);
    expect(markers[0]?.remainingNeeded).toBe(1);
    expect(markers[3]?.threshold).toBe(14);
    expect(markers[3]?.isReached).toBe(false);
  });

  it('marks reward ready from the first discovery chest', () => {
    expect(checkingPlazaCodexDiscoveryProgressHasRewardReady(3, 14)).toBe(
      false
    );
    expect(checkingPlazaCodexDiscoveryProgressHasRewardReady(4, 14)).toBe(true);
    expect(checkingPlazaCodexDiscoveryProgressHasRewardReady(12, 12)).toBe(
      true
    );
  });
});

describe('resolvingPlazaCodexMenuRewardReadySections', () => {
  it('marks herbarium/bestiary/lapidary only for defined unclaimed Sighted rewards', () => {
    expect(
      checkingPlazaCodexDualMetersHaveRewardReady(
        {
          discoveredValue: 0,
          discoveredMax: 40,
          studiedValue: 0,
          studiedMax: 4000,
        },
        'herbarium'
      )
    ).toBe(false);

    const ready = resolvingPlazaCodexMenuRewardReadySections(
      {
        bestiary: {
          discoveredValue: 13,
          discoveredMax: 57,
          studiedValue: 0,
          studiedMax: 5700,
        },
        pathology: {
          discoveredValue: 0,
          discoveredMax: 20,
          studiedValue: 0,
          studiedMax: 2000,
        },
      },
      {},
      new Set()
    );

    expect([...ready]).toEqual(['bestiary']);
  });

  it('clears herbarium ready after wood axe recipe is attached', () => {
    const meters = {
      discoveredValue: 3,
      discoveredMax: 40,
      studiedValue: 0,
      studiedMax: 4000,
    };

    expect(
      checkingPlazaCodexDualMetersHaveRewardReady(
        meters,
        'herbarium',
        new Set()
      )
    ).toBe(true);

    expect(
      checkingPlazaCodexDualMetersHaveRewardReady(
        meters,
        'herbarium',
        new Set([DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD])
      )
    ).toBe(false);
  });

  it('marks discovery-only sections with four-chest thresholds', () => {
    const ready = resolvingPlazaCodexMenuRewardReadySections(
      {},
      {
        biomes: { value: 3, max: 14 },
        recipes: { value: 12, max: 12 },
      }
    );

    expect([...ready].sort()).toEqual(['recipes']);
  });
});
