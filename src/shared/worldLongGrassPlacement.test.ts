import {
  checkingWorldLongGrassPlacementAtTileIndex,
  formattingWorldLongGrassSpriteUrl,
  resolvingWorldLongGrassFacingAtTileIndex,
  resolvingWorldLongGrassSizeVariantAtTileIndex,
  seedingWorldLongGrassUnitFromTileIndex,
  WORLD_LONG_GRASS_PLACEMENT_SEED_SALT,
  WORLD_LONG_GRASS_VARIANT_SEED_SALT,
} from './worldLongGrassPlacement';
import { describe, expect, it } from 'vitest';

describe('worldLongGrassPlacement', () => {
  it('returns stable unit floats for the same tile', () => {
    const first = seedingWorldLongGrassUnitFromTileIndex(12, 34);
    const second = seedingWorldLongGrassUnitFromTileIndex(12, 34);

    expect(first).toBe(second);
    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThan(1);
  });

  it('uses different salts for placement vs variant rolls', () => {
    const placement = seedingWorldLongGrassUnitFromTileIndex(
      4,
      9,
      WORLD_LONG_GRASS_PLACEMENT_SEED_SALT
    );
    const variant = seedingWorldLongGrassUnitFromTileIndex(
      4,
      9,
      WORLD_LONG_GRASS_VARIANT_SEED_SALT
    );

    expect(placement).not.toBe(variant);
  });

  it('gates placement deterministically by modulus', () => {
    const modulus = 32;
    const placements = new Map<string, boolean>();

    for (let tileY = 0; tileY < 20; tileY += 1) {
      for (let tileX = 0; tileX < 20; tileX += 1) {
        const key = `${tileX},${tileY}`;
        placements.set(
          key,
          checkingWorldLongGrassPlacementAtTileIndex(tileX, tileY, modulus)
        );
      }
    }

    for (let tileY = 0; tileY < 20; tileY += 1) {
      for (let tileX = 0; tileX < 20; tileX += 1) {
        const key = `${tileX},${tileY}`;
        expect(
          checkingWorldLongGrassPlacementAtTileIndex(tileX, tileY, modulus)
        ).toBe(placements.get(key));
      }
    }

    const placedCount = [...placements.values()].filter(Boolean).length;
    expect(placedCount).toBeGreaterThan(0);
    expect(placedCount).toBeLessThan(400);
  });

  it('resolves size and facing variants from tile seed', () => {
    const size = resolvingWorldLongGrassSizeVariantAtTileIndex(8, 11);
    const facing = resolvingWorldLongGrassFacingAtTileIndex(8, 11);

    expect(['b1', 'b5']).toContain(size);
    expect(['n', 's', 'e', 'w']).toContain(facing);
    expect(formattingWorldLongGrassSpriteUrl(size, facing)).toBe(
      `/environment/sprites/flora/long-grass/long-grass-${size}-${facing}.webp`
    );
  });
});
