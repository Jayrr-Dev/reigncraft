import {
  resolvingPlazaCodexAggregateStudyMilestoneRewardMarkers,
  resolvingPlazaCodexStudyMilestoneRewardMarkers,
} from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaCodexStudyMilestoneRewardMarkers', () => {
  it('places chests at study reward thresholds', () => {
    const markers = resolvingPlazaCodexStudyMilestoneRewardMarkers(
      'bestiary',
      20
    );

    expect(markers.map((marker) => marker.tierId)).toEqual([
      'understanding',
      'application',
      'proficiency',
      'expertise',
      'mastery',
    ]);
    expect(markers.map((marker) => marker.percent)).toEqual([
      5, 20, 50, 75, 100,
    ]);
    expect(
      markers.find((marker) => marker.tierId === 'application')?.isReached
    ).toBe(true);
    expect(
      markers.find((marker) => marker.tierId === 'proficiency')?.isReached
    ).toBe(false);
  });

  it('scales aggregate panel markers to the Studied max', () => {
    const markers = resolvingPlazaCodexAggregateStudyMilestoneRewardMarkers(
      880,
      4400
    );

    expect(
      markers.find((marker) => marker.tierId === 'understanding')?.threshold
    ).toBe(220);
    expect(
      markers.find((marker) => marker.tierId === 'understanding')?.isReached
    ).toBe(true);
    expect(
      markers.find((marker) => marker.tierId === 'application')?.isReached
    ).toBe(false);
  });
});
