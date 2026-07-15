import { describe, expect, it } from 'vitest';
import {
  checkingWorldTreeChopLayerEligibility,
  computingWorldTreeChopLayerMutation,
  parsingWorldTreeChopTileState,
  WORLD_TREE_CHOP_LAYERS_PER_SWING,
  WORLD_TREE_CHOP_WOOD_PER_LAYER,
} from './worldTreeChop';

describe('checkingWorldTreeChopLayerEligibility', () => {
  it('rejects chops when the player is out of range', () => {
    const result = checkingWorldTreeChopLayerEligibility({
      tileX: 10,
      tileY: 10,
      playerX: 0,
      playerY: 0,
      currentVisualLayer: 6,
      standingSurfaceLayer: 1,
    });

    expect(result).toEqual({ outcome: 'out-of-range' });
  });

  it('rejects chops on stumps', () => {
    const result = checkingWorldTreeChopLayerEligibility({
      tileX: 10,
      tileY: 10,
      playerX: 10.5,
      playerY: 10.5,
      currentVisualLayer: 6,
      standingSurfaceLayer: 1,
      existingTileState: {
        remainingVisualLayer: 1,
        isStump: true,
      },
    });

    expect(result).toEqual({ outcome: 'already-felled' });
  });
});

describe('computingWorldTreeChopLayerMutation', () => {
  it('defaults to wood baseline: one layer and one wood', () => {
    const result = computingWorldTreeChopLayerMutation({
      tileX: 4,
      tileY: 7,
      playerX: 4.5,
      playerY: 7.5,
      currentVisualLayer: 7,
      standingSurfaceLayer: 1,
    });

    expect(result).toEqual({
      outcome: 'chopped',
      nextTileState: {
        remainingVisualLayer: 6,
        isStump: false,
      },
      remainingVisualLayer: 6,
      layersRemoved: WORLD_TREE_CHOP_LAYERS_PER_SWING,
      woodQuantity:
        WORLD_TREE_CHOP_LAYERS_PER_SWING * WORLD_TREE_CHOP_WOOD_PER_LAYER,
      isFullyFelled: false,
    });
  });

  it('honors steel swing yield of three layers and three wood per layer', () => {
    const result = computingWorldTreeChopLayerMutation({
      tileX: 4,
      tileY: 7,
      playerX: 4.5,
      playerY: 7.5,
      currentVisualLayer: 7,
      standingSurfaceLayer: 1,
      layersPerSwing: 3,
      resourcePerLayer: 3,
    });

    expect(result).toEqual({
      outcome: 'chopped',
      nextTileState: {
        remainingVisualLayer: 4,
        isStump: false,
      },
      remainingVisualLayer: 4,
      layersRemoved: 3,
      woodQuantity: 9,
      isFullyFelled: false,
    });
  });

  it('marks a tree as a stump when the final layers are removed', () => {
    const result = computingWorldTreeChopLayerMutation({
      tileX: 4,
      tileY: 7,
      playerX: 4.5,
      playerY: 7.5,
      currentVisualLayer: 4,
      standingSurfaceLayer: 1,
      existingTileState: {
        remainingVisualLayer: 3,
        isStump: false,
      },
      layersPerSwing: 3,
      resourcePerLayer: 2,
    });

    expect(result).toEqual({
      outcome: 'chopped',
      nextTileState: {
        remainingVisualLayer: 1,
        isStump: true,
      },
      remainingVisualLayer: 1,
      layersRemoved: 2,
      woodQuantity: 4,
      isFullyFelled: true,
    });
  });
});

describe('parsingWorldTreeChopTileState', () => {
  it('supports legacy numeric layer values', () => {
    expect(parsingWorldTreeChopTileState('4')).toEqual({
      remainingVisualLayer: 4,
      isStump: false,
    });
  });

  it('parses structured stump state', () => {
    expect(
      parsingWorldTreeChopTileState(
        JSON.stringify({
          remainingVisualLayer: 1,
          isStump: true,
        })
      )
    ).toEqual({
      remainingVisualLayer: 1,
      isStump: true,
    });
  });
});
