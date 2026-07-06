import { resolvingWildlifeMeleeEngagementIntent } from '@/components/world/wildlife/domains/resolvingWildlifeMeleeEngagementIntent';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeMeleeEngagementIntent', () => {
  it('upgrades chase to attack when the target is in melee range', () => {
    const intent = resolvingWildlifeMeleeEngagementIntent({
      intent: {
        mode: 'chase',
        targetInstanceId: 'wildlife:2:2:0',
        targetPoint: { x: 2.4, y: 1.5, layer: 1 },
      },
      position: { x: 1.5, y: 1.5, layer: 1 },
      targetPosition: { x: 2.4, y: 1.5, layer: 1 },
    });

    expect(intent.mode).toBe('attack');
  });

  it('keeps chase when the target is still out of melee range', () => {
    const intent = resolvingWildlifeMeleeEngagementIntent({
      intent: {
        mode: 'chase',
        targetInstanceId: 'wildlife:2:2:0',
        targetPoint: { x: 6, y: 1.5, layer: 1 },
      },
      position: { x: 1.5, y: 1.5, layer: 1 },
      targetPosition: { x: 6, y: 1.5, layer: 1 },
    });

    expect(intent.mode).toBe('chase');
  });
});
