import {
  checkingWildlifeFleesFromPlayerCollision,
  checkingWildlifeIsStartledFromPlayerCollision,
  resolvingWildlifeFleeFromThreatPointIntent,
  resolvingWildlifePlayerCollisionStartleUntilMs,
} from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifePlayerCollisionStartle', () => {
  it('passive and skittish temperaments flee on player contact', () => {
    expect(checkingWildlifeFleesFromPlayerCollision('passive')).toBe(true);
    expect(checkingWildlifeFleesFromPlayerCollision('skittish')).toBe(true);
    expect(checkingWildlifeFleesFromPlayerCollision('retaliator')).toBe(true);
  });

  it('predators and ambushers do not flee on player contact', () => {
    expect(checkingWildlifeFleesFromPlayerCollision('predator')).toBe(false);
    expect(checkingWildlifeFleesFromPlayerCollision('ambusher')).toBe(false);
  });

  it('resolves a flee target away from the threat point', () => {
    const intent = resolvingWildlifeFleeFromThreatPointIntent(
      { x: 5, y: 5, layer: 1 },
      { x: 8, y: 5, layer: 1 }
    );

    expect(intent.mode).toBe('flee');
    expect(intent.targetPoint?.x).toBeLessThan(5);
    expect(intent.targetPoint?.y).toBe(5);
  });

  it('tracks startle duration from collision time', () => {
    expect(resolvingWildlifePlayerCollisionStartleUntilMs(1000)).toBe(3000);
    expect(checkingWildlifeIsStartledFromPlayerCollision(3000, 2500)).toBe(
      true
    );
    expect(checkingWildlifeIsStartledFromPlayerCollision(3000, 3000)).toBe(
      false
    );
    expect(checkingWildlifeIsStartledFromPlayerCollision(null, 1000)).toBe(
      false
    );
  });
});
