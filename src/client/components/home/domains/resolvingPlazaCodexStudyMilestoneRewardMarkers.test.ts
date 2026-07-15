import {
  checkingPlazaCodexDualMetersHaveRewardReady,
  resolvingPlazaCodexMenuRewardReadySections,
} from '@/components/home/domains/resolvingPlazaCodexMenuRewardReadySections';
import {
  checkingPlazaCodexOverallProgressHasRewardReady,
  resolvingPlazaCodexOverallProgressMilestoneRewardMarkers,
  resolvingPlazaCodexStudyMilestoneRewardPopoverLabel,
} from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
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

  it('shows ready when milestone is reached', () => {
    expect(resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(0, true)).toBe(
      'Reward ready'
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

describe('resolvingPlazaCodexMenuRewardReadySections', () => {
  it('marks sections when either dual meter has a reached chest', () => {
    expect(
      checkingPlazaCodexDualMetersHaveRewardReady({
        discoveredValue: 0,
        discoveredMax: 40,
        studiedValue: 0,
        studiedMax: 4000,
      })
    ).toBe(false);

    const ready = resolvingPlazaCodexMenuRewardReadySections({
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
    });

    expect([...ready]).toEqual(['bestiary']);
  });
});
