import { computingWorldPlazaTileGravityWellAcceleration } from '@/components/world/domains/computingWorldPlazaTileGravityWellAcceleration';
import {
  computingWorldPlazaTileGravityWellGridDelta,
  computingWorldPlazaTileGravityWellVelocityStep,
} from '@/components/world/domains/computingWorldPlazaTileGravityWellStep';
import { creatingWorldPlazaTileGravityWellFromTile } from '@/components/world/domains/creatingWorldPlazaTileGravityWell';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaTileGravityWellAcceleration', () => {
  const well = creatingWorldPlazaTileGravityWellFromTile({
    tileIndex: { tileX: 10, tileY: 20 },
    accelerationGridPerSec2: 2,
    radiusGrid: 4,
    falloff: 'none',
    settleRadiusGrid: 0,
    maxSpeedGridPerSec: 10,
  });

  it('pulls toward the tile attractor inside the radius', () => {
    const sample = computingWorldPlazaTileGravityWellAcceleration({
      position: { x: 8, y: 20 },
      well,
    });

    expect(sample.isInsideWell).toBe(true);
    expect(sample.accelerationX).toBeGreaterThan(0);
    expect(sample.accelerationY).toBeCloseTo(0, 5);
    expect(sample.strengthRatio).toBeCloseTo(1, 5);
  });

  it('returns zero acceleration outside the radius', () => {
    const sample = computingWorldPlazaTileGravityWellAcceleration({
      position: { x: 0, y: 0 },
      well,
    });

    expect(sample.isInsideWell).toBe(false);
    expect(sample.accelerationX).toBe(0);
    expect(sample.accelerationY).toBe(0);
    expect(sample.strengthRatio).toBe(0);
  });

  it('fades with linear falloff near the edge', () => {
    const linearWell = creatingWorldPlazaTileGravityWellFromTile({
      tileIndex: { tileX: 0, tileY: 0 },
      accelerationGridPerSec2: 4,
      radiusGrid: 4,
      falloff: 'linear',
      settleRadiusGrid: 0,
    });
    const nearEdge = computingWorldPlazaTileGravityWellAcceleration({
      position: { x: 3, y: 0 },
      well: linearWell,
    });
    const nearCenter = computingWorldPlazaTileGravityWellAcceleration({
      position: { x: 1, y: 0 },
      well: linearWell,
    });

    expect(nearEdge.strengthRatio).toBeCloseTo(0.25, 5);
    expect(nearCenter.strengthRatio).toBeCloseTo(0.75, 5);
    expect(Math.abs(nearCenter.accelerationX)).toBeGreaterThan(
      Math.abs(nearEdge.accelerationX)
    );
  });

  it('supports repulsive wells with negative acceleration', () => {
    const sample = computingWorldPlazaTileGravityWellAcceleration({
      position: { x: 8, y: 20 },
      well: {
        ...well,
        accelerationGridPerSec2: -2,
      },
    });

    expect(sample.accelerationX).toBeLessThan(0);
  });
});

describe('computingWorldPlazaTileGravityWellVelocityStep', () => {
  const well = creatingWorldPlazaTileGravityWellFromTile({
    tileIndex: { tileX: 0, tileY: 0 },
    accelerationGridPerSec2: 2,
    radiusGrid: 5,
    falloff: 'none',
    settleRadiusGrid: 0,
    maxSpeedGridPerSec: 3,
  });

  it('accumulates velocity toward the attractor', () => {
    const stepped = computingWorldPlazaTileGravityWellVelocityStep({
      position: { x: -2, y: 0 },
      velocity: { x: 0, y: 0 },
      well,
      deltaSeconds: 0.5,
    });

    expect(stepped.velocity.x).toBeCloseTo(1, 5);
    expect(stepped.velocity.y).toBeCloseTo(0, 5);
  });

  it('clamps gravity velocity to maxSpeedGridPerSec', () => {
    const stepped = computingWorldPlazaTileGravityWellVelocityStep({
      position: { x: -2, y: 0 },
      velocity: { x: 2.5, y: 0 },
      well,
      deltaSeconds: 1,
    });

    expect(Math.hypot(stepped.velocity.x, stepped.velocity.y)).toBeCloseTo(
      3,
      5
    );
  });

  it('preserves intentional velocity when outside the well', () => {
    const stepped = computingWorldPlazaTileGravityWellVelocityStep({
      position: { x: 20, y: 0 },
      velocity: { x: 1.5, y: -0.5 },
      well,
      deltaSeconds: 0.1,
    });

    expect(stepped.velocity).toEqual({ x: 1.5, y: -0.5 });
    expect(stepped.isInsideWell).toBe(false);
  });
});

describe('computingWorldPlazaTileGravityWellGridDelta', () => {
  const well = creatingWorldPlazaTileGravityWellFromTile({
    tileIndex: { tileX: 5, tileY: 5 },
    accelerationGridPerSec2: 2,
    radiusGrid: 6,
    falloff: 'none',
    settleRadiusGrid: 0,
    maxSpeedGridPerSec: 10,
  });

  it('returns a position delta that can compose with walk intent', () => {
    const pull = computingWorldPlazaTileGravityWellGridDelta({
      position: { x: 3, y: 5 },
      well,
      deltaSeconds: 0.1,
      velocity: { x: 0, y: 0 },
    });

    expect(pull.gridDelta.x).toBeGreaterThan(0);
    expect(pull.gridDelta.y).toBeCloseTo(0, 5);
    expect(pull.nextVelocity.x).toBeGreaterThan(0);

    const intentDelta = { x: -0.2, y: 0 };
    const composedX = intentDelta.x + pull.gridDelta.x;
    expect(composedX).toBeGreaterThan(intentDelta.x);
  });

  it('builds speed across ticks when velocity is carried', () => {
    const first = computingWorldPlazaTileGravityWellGridDelta({
      position: { x: 3, y: 5 },
      well,
      deltaSeconds: 0.1,
    });
    const second = computingWorldPlazaTileGravityWellGridDelta({
      position: { x: 3, y: 5 },
      well,
      deltaSeconds: 0.1,
      velocity: first.nextVelocity,
    });

    expect(Math.abs(second.gridDelta.x)).toBeGreaterThan(
      Math.abs(first.gridDelta.x)
    );
  });
});
