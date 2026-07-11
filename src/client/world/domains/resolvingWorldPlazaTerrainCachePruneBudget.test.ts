import { resolvingWorldPlazaTerrainCachePruneBudget } from '@/components/world/domains/resolvingWorldPlazaTerrainCachePruneBudget';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaTerrainCachePruneBudget', () => {
  it('keeps the base prune budget when backlog is small', () => {
    const result = resolvingWorldPlazaTerrainCachePruneBudget({
      basePruneBudget: 6,
      staleCount: 3,
      neededCount: 40,
    });

    expect(result.pruneBudget).toBe(6);
    expect(result.shouldDeferBuilds).toBe(false);
  });

  it('bursts prune when absolute stale count is high', () => {
    const result = resolvingWorldPlazaTerrainCachePruneBudget({
      basePruneBudget: 6,
      staleCount: 20,
      neededCount: 40,
    });

    expect(result.pruneBudget).toBeGreaterThan(6);
    expect(result.shouldDeferBuilds).toBe(true);
  });

  it('bursts prune when stale ratio is high even if absolute count is modest', () => {
    const result = resolvingWorldPlazaTerrainCachePruneBudget({
      basePruneBudget: 4,
      staleCount: 6,
      neededCount: 12,
    });

    expect(result.pruneBudget).toBeGreaterThan(4);
    expect(result.shouldDeferBuilds).toBe(false);
  });

  it('caps burst prune so one frame cannot destroy unbounded Graphics', () => {
    const result = resolvingWorldPlazaTerrainCachePruneBudget({
      basePruneBudget: 6,
      staleCount: 200,
      neededCount: 40,
    });

    expect(result.pruneBudget).toBe(48);
    expect(result.shouldDeferBuilds).toBe(true);
  });
});
