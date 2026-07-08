import { resolvingWildlifeStalkPlayerApproachRetreatIntent } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachRetreatIntent';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkPlayerApproachRetreatIntent', () => {
  it('walks away slowly when the player only walked in', () => {
    const intent = resolvingWildlifeStalkPlayerApproachRetreatIntent({
      position: { x: 10, y: 10, layer: 1 },
      preyTargetId: 'player-1',
      preyPosition: { x: 12, y: 10, layer: 1 },
      approachState: {
        noticedAtMs: 0,
        noticeDelayMs: 800,
        playerPace: 'walk',
        retreatDistanceGrid: 2.5,
        retreatStartedAtMs: 800,
        retreatFromX: 10,
        retreatFromY: 10,
      },
    });

    expect(intent.mode).toBe('stalk');
    if (intent.mode !== 'stalk') {
      return;
    }

    expect(intent.pace).toBe('walk');
    expect(intent.targetPoint.x).toBeLessThan(10);
  });

  it('runs away when the player charged in', () => {
    const intent = resolvingWildlifeStalkPlayerApproachRetreatIntent({
      position: { x: 10, y: 10, layer: 1 },
      preyTargetId: 'player-1',
      preyPosition: { x: 12, y: 10, layer: 1 },
      approachState: {
        noticedAtMs: 0,
        noticeDelayMs: 300,
        playerPace: 'run',
        retreatDistanceGrid: 6,
        retreatStartedAtMs: 300,
        retreatFromX: 10,
        retreatFromY: 10,
      },
    });

    expect(intent.mode).toBe('stalk');
    if (intent.mode !== 'stalk') {
      return;
    }

    expect(intent.pace).toBe('run');
    expect(intent.targetPoint.x).toBeLessThan(8);
  });
});
