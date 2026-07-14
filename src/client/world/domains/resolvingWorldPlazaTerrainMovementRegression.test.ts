import {
  resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint,
  resolvingWorldCollisionSlidingPlayerFromBlockedWorldPoint,
} from '@/components/world/collision';
import { syncingWorldPlazaPlayerStandingLayer } from '@/components/world/building/domains/syncingWorldPlazaPlayerStandingLayer';
import { resolvingWorldPlazaJumpLandingGridPointAlongPath } from '@/components/world/domains/resolvingWorldPlazaJumpLandingGridPointAlongPath';
import { describe, expect, it } from 'vitest';

describe('generated terrain movement regressions', () => {
  it('slides out of the reported cliff and river tile-corner trap', () => {
    const from = { x: 48.55, y: -714.5, layer: 1 };
    const movementDelta = { x: 0.125, y: 0.125 };
    const desired = {
      x: from.x + movementDelta.x,
      y: from.y + movementDelta.y,
      layer: from.layer,
    };
    const options = {
      fallbackPosition: from,
      playerLayer: from.layer,
      playerCenter: from,
      movementDelta,
    };

    const blocked =
      resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint(
        desired,
        options
      );
    const slid = resolvingWorldCollisionSlidingPlayerFromBlockedWorldPoint(
      desired,
      options
    );

    expect(blocked).toEqual(from);
    expect(slid.x).toBeGreaterThan(from.x);
    expect(slid.y).toBe(from.y);
  });

  it('lands on reachable procedural elevation instead of ground layer', () => {
    const landing = resolvingWorldPlazaJumpLandingGridPointAlongPath(
      { x: 49, y: -714, layer: 1 },
      { x: -1, y: 0 },
      1,
      [],
      1,
      4
    );

    expect(landing).not.toBeNull();
    expect(landing?.landingSurfaceLayer).toBe(3);
  });

  it('rejects procedural elevation above the current jump reach', () => {
    const landing = resolvingWorldPlazaJumpLandingGridPointAlongPath(
      { x: 49, y: -714, layer: 1 },
      { x: -1, y: 0 },
      1,
      [],
      1,
      1
    );

    expect(landing).toBeNull();
  });

  it('repairs a player persisted below the procedural terrain surface', () => {
    const playerPosition = { x: -36, y: -729, layer: 1 };

    syncingWorldPlazaPlayerStandingLayer(playerPosition, [], false);

    expect(playerPosition.layer).toBe(3);
  });
});
