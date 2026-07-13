import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import {
  creatingWorldPlazaEntityDepthSortCache,
  resolvingWorldPlazaCachedAvatarBodySortKey,
} from '@/components/world/domains/managingWorldPlazaEntityDepthSortCache';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey',
  () => ({
    resolvingWorldDepthAvatarBodySortKey: vi.fn(() => 42),
  })
);

describe('resolvingWorldPlazaCachedAvatarBodySortKey', () => {
  it('reuses the cached sort key while the foot-sum bucket is unchanged', () => {
    const cache = creatingWorldPlazaEntityDepthSortCache();
    const gridPoint = { x: 10.4, y: 20.6, layer: 0 };

    const first = resolvingWorldPlazaCachedAvatarBodySortKey(
      gridPoint,
      cache,
      {},
      3
    );
    const second = resolvingWorldPlazaCachedAvatarBodySortKey(
      { x: 10.41, y: 20.59, layer: 0 },
      cache,
      {},
      3
    );

    expect(first).toBe(42);
    expect(second).toBe(42);
    expect(resolvingWorldDepthAvatarBodySortKey).toHaveBeenCalledTimes(1);
  });

  it('recomputes when the avatar walks south enough to change foot-sum bucket', () => {
    vi.mocked(resolvingWorldDepthAvatarBodySortKey).mockClear();
    const cache = creatingWorldPlazaEntityDepthSortCache();

    resolvingWorldPlazaCachedAvatarBodySortKey(
      { x: 10.1, y: 20.1, layer: 0 },
      cache,
      {},
      3
    );
    resolvingWorldPlazaCachedAvatarBodySortKey(
      { x: 10.8, y: 20.8, layer: 0 },
      cache,
      {},
      3
    );

    expect(resolvingWorldDepthAvatarBodySortKey).toHaveBeenCalledTimes(2);
  });

  it('recomputes when the foot tile changes', () => {
    vi.mocked(resolvingWorldDepthAvatarBodySortKey).mockClear();
    const cache = creatingWorldPlazaEntityDepthSortCache();

    resolvingWorldPlazaCachedAvatarBodySortKey(
      { x: 10.1, y: 20.1, layer: 0 },
      cache,
      {},
      3
    );
    resolvingWorldPlazaCachedAvatarBodySortKey(
      { x: 11.1, y: 20.1, layer: 0 },
      cache,
      {},
      3
    );

    expect(resolvingWorldDepthAvatarBodySortKey).toHaveBeenCalledTimes(2);
  });

  it('recomputes when the painted-foot offset changes', () => {
    vi.mocked(resolvingWorldDepthAvatarBodySortKey).mockClear();
    const cache = creatingWorldPlazaEntityDepthSortCache();
    const gridPoint = { x: 10.1, y: 20.1, layer: 1 };

    resolvingWorldPlazaCachedAvatarBodySortKey(
      gridPoint,
      cache,
      { avatarFootOffsetBelowGridAnchorPx: 0 },
      3
    );
    resolvingWorldPlazaCachedAvatarBodySortKey(
      gridPoint,
      cache,
      { avatarFootOffsetBelowGridAnchorPx: 14 },
      3
    );

    expect(resolvingWorldDepthAvatarBodySortKey).toHaveBeenCalledTimes(2);
  });
});
