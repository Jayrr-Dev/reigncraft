import { resolvingPlazaCodexOverallProgressMilestoneRewardMarkers } from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
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
    expect(markers[4]?.threshold).toBe(44);
    expect(markers[4]?.isReached).toBe(false);
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
  });
});
