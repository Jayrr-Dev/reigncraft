import { describe, expect, it, vi } from 'vitest';

import { computingWorldPlazaDirectionalTerrainPrefetchBounds } from '@/components/world/domains/computingWorldPlazaDirectionalTerrainPrefetchBounds';
import {
  computingWorldPlazaSmoothedMovementDirection,
  creatingWorldPlazaSmoothedMovementDirectionState,
} from '@/components/world/domains/computingWorldPlazaSmoothedMovementDirection';
import {
  creatingWorldPlazaAdaptivePerformanceFrameSampler,
  markingWorldPlazaAdaptivePerformanceFrame,
} from '@/components/world/domains/managingWorldPlazaAdaptivePerformanceFrameSampler';
import {
  beginningWorldPlazaTerrainFrameWorkBudget,
  checkingWorldPlazaTerrainFrameWorkBudgetExpired,
} from '@/components/world/domains/managingWorldPlazaTerrainFrameWorkBudget';
import {
  creatingWorldPlazaTerrainParentSortRegistry,
  flushingWorldPlazaTerrainParentSortRegistry,
  markingWorldPlazaTerrainParentSortDirty,
} from '@/components/world/domains/managingWorldPlazaTerrainParentSortRegistry';
import { Container } from 'pixi.js';

describe('plaza smoothness helpers', () => {
  it('biases terrain bounds ahead of smoothed movement', () => {
    const movementState = creatingWorldPlazaSmoothedMovementDirectionState();
    computingWorldPlazaSmoothedMovementDirection(movementState, 0, 0);
    computingWorldPlazaSmoothedMovementDirection(movementState, 4, 0);

    const biasedBounds = computingWorldPlazaDirectionalTerrainPrefetchBounds(
      {
        minTileX: 0,
        maxTileX: 10,
        minTileY: 0,
        maxTileY: 10,
      },
      computingWorldPlazaSmoothedMovementDirection(movementState, 8, 0),
      3,
      1
    );

    expect(biasedBounds.maxTileX).toBeGreaterThan(10);
    expect(biasedBounds.minTileX).toBeGreaterThanOrEqual(0);
  });

  it('expires terrain frame budgets after the deadline', () => {
    const nowSpy = vi.spyOn(performance, 'now');
    nowSpy.mockReturnValueOnce(100).mockReturnValueOnce(102);

    const budget = beginningWorldPlazaTerrainFrameWorkBudget(1);
    expect(checkingWorldPlazaTerrainFrameWorkBudgetExpired(budget)).toBe(true);

    nowSpy.mockRestore();
  });

  it('sorts each dirty terrain parent once per flush', () => {
    const registry = creatingWorldPlazaTerrainParentSortRegistry();
    const parent = new Container();
    parent.sortableChildren = true;
    const sortChildren = vi.fn();
    parent.sortChildren = sortChildren;

    markingWorldPlazaTerrainParentSortDirty(registry, parent);
    markingWorldPlazaTerrainParentSortDirty(registry, parent);
    flushingWorldPlazaTerrainParentSortRegistry(registry);

    expect(sortChildren).toHaveBeenCalledTimes(1);
  });

  it('ignores resume-gap frames and hidden tabs in adaptive sampler', () => {
    const sampler = creatingWorldPlazaAdaptivePerformanceFrameSampler(
      'medium',
      0
    );

    expect(
      markingWorldPlazaAdaptivePerformanceFrame(sampler, 600, 600, false)
    ).toBeNull();

    sampler.frameDeltaMsHistory.push(16, 16, 16);
    expect(
      markingWorldPlazaAdaptivePerformanceFrame(sampler, 600, 600, true)
    ).toBeNull();
    expect(sampler.frameDeltaMsHistory).toHaveLength(0);
  });
});
