import { computingNavigationAStarPath } from '@/lib/navigation/computingNavigationAStarPath';
import type {
  DefiningNavigationGridNode,
  DefiningNavigationMoveCostResolver,
} from '@/lib/navigation/definingNavigationGridTypes';
import { describe, expect, it } from 'vitest';

function creatingUniformGridMoveCostResolver(
  blockedNodes: ReadonlySet<string>
): DefiningNavigationMoveCostResolver {
  return (from, to) => {
    const toKey = `${to.x},${to.y},${to.layer ?? 0}`;

    if (blockedNodes.has(toKey)) {
      return null;
    }

    const deltaX = Math.abs(to.x - from.x);
    const deltaY = Math.abs(to.y - from.y);

    if (deltaX + deltaY === 0) {
      return null;
    }

    if (deltaX > 1 || deltaY > 1) {
      return null;
    }

    return deltaX !== 0 && deltaY !== 0 ? Math.SQRT2 : 1;
  };
}

function listingPathNodeKeys(
  path: readonly DefiningNavigationGridNode[]
): string[] {
  return path.map((node) => `${node.x},${node.y},${node.layer ?? 0}`);
}

describe('computingNavigationAStarPath', () => {
  it('returns same_node when start equals goal', () => {
    const start = { x: 2, y: 3, layer: 1 };

    const result = computingNavigationAStarPath({
      start,
      goal: start,
      resolveMoveCost: creatingUniformGridMoveCostResolver(new Set()),
    });

    expect(result.status).toBe('same_node');
    expect(result.path).toEqual([start]);
    expect(result.totalCost).toBe(0);
    expect(result.nodesExpanded).toBe(0);
  });

  it('finds a straight four-direction path on an open grid', () => {
    const result = computingNavigationAStarPath({
      start: { x: 0, y: 0 },
      goal: { x: 3, y: 0 },
      movementModeId: 'four_direction',
      heuristicId: 'manhattan',
      resolveMoveCost: creatingUniformGridMoveCostResolver(new Set()),
    });

    expect(result.status).toBe('found');
    expect(listingPathNodeKeys(result.path)).toEqual([
      '0,0,0',
      '1,0,0',
      '2,0,0',
      '3,0,0',
    ]);
    expect(result.totalCost).toBe(3);
  });

  it('routes around a blocked tile', () => {
    const blocked = new Set(['1,0,0']);

    const result = computingNavigationAStarPath({
      start: { x: 0, y: 0 },
      goal: { x: 2, y: 0 },
      movementModeId: 'four_direction',
      heuristicId: 'manhattan',
      resolveMoveCost: creatingUniformGridMoveCostResolver(blocked),
    });

    expect(result.status).toBe('found');
    expect(listingPathNodeKeys(result.path)[0]).toBe('0,0,0');
    expect(listingPathNodeKeys(result.path).at(-1)).toBe('2,0,0');
    expect(listingPathNodeKeys(result.path)).not.toContain('1,0,0');
  });

  it('prefers diagonals on eight-direction open grids', () => {
    const result = computingNavigationAStarPath({
      start: { x: 0, y: 0 },
      goal: { x: 2, y: 2 },
      movementModeId: 'eight_direction',
      heuristicId: 'octile',
      resolveMoveCost: creatingUniformGridMoveCostResolver(new Set()),
    });

    expect(result.status).toBe('found');
    expect(listingPathNodeKeys(result.path)).toEqual([
      '0,0,0',
      '1,1,0',
      '2,2,0',
    ]);
  });

  it('blocks diagonal corner cutting through walls', () => {
    const blocked = new Set(['1,0,0', '0,1,0']);

    const result = computingNavigationAStarPath({
      start: { x: 0, y: 0 },
      goal: { x: 1, y: 1 },
      movementModeId: 'eight_direction',
      heuristicId: 'octile',
      preventCornerCutting: true,
      resolveMoveCost: creatingUniformGridMoveCostResolver(blocked),
    });

    expect(result.status).toBe('found');
    expect(result.path.length).toBeGreaterThan(2);
  });

  it('returns unreachable when the goal is enclosed', () => {
    const boundedResolver: DefiningNavigationMoveCostResolver = (from, to) => {
      if (to.x < 0 || to.x > 2 || to.y < 0 || to.y > 2) {
        return null;
      }

      const blocked = new Set(['0,1,0', '1,0,0', '2,1,0', '1,2,0', '0,0,0']);

      if (blocked.has(`${to.x},${to.y},${to.layer ?? 0}`)) {
        return null;
      }

      const deltaX = Math.abs(to.x - from.x);
      const deltaY = Math.abs(to.y - from.y);

      if (deltaX + deltaY !== 1) {
        return null;
      }

      return 1;
    };

    const result = computingNavigationAStarPath({
      start: { x: 0, y: 0 },
      goal: { x: 1, y: 1 },
      movementModeId: 'four_direction',
      heuristicId: 'manhattan',
      resolveMoveCost: boundedResolver,
    });

    expect(result.status).toBe('unreachable');
    expect(result.path).toEqual([]);
  });

  it('respects weighted move costs', () => {
    const resolveMoveCost: DefiningNavigationMoveCostResolver = (from, to) => {
      const deltaX = Math.abs(to.x - from.x);
      const deltaY = Math.abs(to.y - from.y);

      if (deltaX + deltaY !== 1) {
        return null;
      }

      if (to.x === 1 && to.y === 0) {
        return 10;
      }

      return 1;
    };

    const result = computingNavigationAStarPath({
      start: { x: 0, y: 0 },
      goal: { x: 2, y: 0 },
      movementModeId: 'four_direction',
      heuristicId: 'manhattan',
      resolveMoveCost,
    });

    expect(result.status).toBe('found');
    expect(listingPathNodeKeys(result.path)).not.toContain('1,0,0');
    expect(result.totalCost).toBeLessThan(10);
  });

  it('stops when expansion limit is exceeded', () => {
    const result = computingNavigationAStarPath({
      start: { x: 0, y: 0 },
      goal: { x: 20, y: 0 },
      movementModeId: 'four_direction',
      heuristicId: 'manhattan',
      maxNodeExpansions: 2,
      resolveMoveCost: creatingUniformGridMoveCostResolver(new Set()),
    });

    expect(result.status).toBe('expansion_limit');
    expect(result.path).toEqual([]);
  });
});
