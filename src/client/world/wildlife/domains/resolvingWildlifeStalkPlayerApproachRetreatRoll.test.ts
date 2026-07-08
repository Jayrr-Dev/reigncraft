import { resolvingWildlifeStalkPlayerApproachRetreatRoll } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachRetreatRoll';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkPlayerApproachRetreatRoll', () => {
  it('rolls a shorter delay and longer retreat for a running player', () => {
    const walkRoll = resolvingWildlifeStalkPlayerApproachRetreatRoll({
      packAnchorId: 'wildlife:0:0:alpha',
      playerPace: 'walk',
    });
    const runRoll = resolvingWildlifeStalkPlayerApproachRetreatRoll({
      packAnchorId: 'wildlife:0:0:alpha',
      playerPace: 'run',
    });

    expect(walkRoll.noticeDelayMs).toBeGreaterThan(runRoll.noticeDelayMs);
    expect(walkRoll.retreatDistanceGrid).toBeLessThan(
      runRoll.retreatDistanceGrid
    );
  });

  it('is stable for the same pack anchor and pace', () => {
    const first = resolvingWildlifeStalkPlayerApproachRetreatRoll({
      packAnchorId: 'wildlife:0:0:alpha',
      playerPace: 'walk',
    });
    const second = resolvingWildlifeStalkPlayerApproachRetreatRoll({
      packAnchorId: 'wildlife:0:0:alpha',
      playerPace: 'walk',
    });

    expect(second).toEqual(first);
  });
});
