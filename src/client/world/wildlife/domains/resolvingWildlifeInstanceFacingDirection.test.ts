import { resolvingWildlifeInstanceFacingDirection } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceFacingDirection';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeInstanceFacingDirection', () => {
  it('faces along retreat movement instead of facingPoint while moving', () => {
    const facingFromMovement = resolvingWildlifeInstanceFacingDirection(
      { x: 10, y: 10, layer: 1 },
      {
        mode: 'stalk',
        targetInstanceId: 'player-1',
        targetPoint: { x: 12, y: 10, layer: 1 },
        facingPoint: { x: 8, y: 10, layer: 1 },
        pace: 'run',
      },
      0.2,
      0,
      'Down'
    );
    const facingTowardPrey = resolvingWildlifeInstanceFacingDirection(
      { x: 10, y: 10, layer: 1 },
      {
        mode: 'stalk',
        targetInstanceId: 'player-1',
        targetPoint: { x: 12, y: 10, layer: 1 },
        facingPoint: { x: 8, y: 10, layer: 1 },
        pace: 'run',
      },
      0,
      0,
      'Down'
    );

    expect(facingFromMovement).toBe('DownRight');
    expect(facingTowardPrey).toBe('UpLeft');
    expect(facingFromMovement).not.toBe(facingTowardPrey);
  });

  it('faces prey from facingPoint when standing still during stalk', () => {
    const facing = resolvingWildlifeInstanceFacingDirection(
      { x: 10, y: 10, layer: 1 },
      {
        mode: 'stalk',
        targetInstanceId: 'player-1',
        targetPoint: { x: 12, y: 10, layer: 1 },
        facingPoint: { x: 8, y: 10, layer: 1 },
        pace: 'walk',
      },
      0,
      0,
      'Down'
    );

    expect(facing).toBe('UpLeft');
  });

  it('faces chase target when standing still', () => {
    const facing = resolvingWildlifeInstanceFacingDirection(
      { x: 0, y: 0, layer: 1 },
      {
        mode: 'chase',
        targetInstanceId: 'deer-1',
        targetPoint: { x: 0, y: 2, layer: 1 },
      },
      0,
      0,
      'Left'
    );

    expect(facing).toBe('DownLeft');
  });
});
