import { DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS } from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import { resolvingWorldPlazaStoneDecorationJitterOffsetPx } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationJitterOffsetPx';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaStoneDecorationJitterOffsetPx', () => {
  it('keeps tiny pebbles inside a wide jitter band', () => {
    const tiny = DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS[0];
    const offset = resolvingWorldPlazaStoneDecorationJitterOffsetPx(
      1,
      1,
      tiny.bodyHalfWidthPx,
      tiny.bodyHalfHeightPx
    );

    expect(Math.abs(offset.offsetX)).toBeLessThanOrEqual(20);
    expect(Math.abs(offset.offsetY)).toBeLessThanOrEqual(10);
    expect(Math.abs(offset.offsetX)).toBeGreaterThan(10);
  });

  it('shrinks large boulder jitter by body half-extent only', () => {
    const large = DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS[3];
    const offset = resolvingWorldPlazaStoneDecorationJitterOffsetPx(
      1,
      1,
      large.bodyHalfWidthPx,
      large.bodyHalfHeightPx
    );

    expect(
      Math.abs(offset.offsetX) + large.bodyHalfWidthPx
    ).toBeLessThanOrEqual(20 + 1e-6);
    expect(
      Math.abs(offset.offsetY) + large.bodyHalfHeightPx
    ).toBeLessThanOrEqual(10 + 1e-6);
    expect(Math.abs(offset.offsetX)).toBeGreaterThan(5);
  });
});
