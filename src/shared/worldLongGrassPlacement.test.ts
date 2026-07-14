import { describe, expect, it } from 'vitest';
import {
  checkingWorldLongGrassBunchAnchorSpawnsAtTileIndex,
  checkingWorldLongGrassPlacementAtTileIndex,
  formattingWorldLongGrassSpriteUrl,
  listingWorldLongGrassBunchMemberOffsets,
  resolvingWorldLongGrassBunchAnchorAtTileIndex,
  resolvingWorldLongGrassFacingAtTileIndex,
  resolvingWorldLongGrassSizeVariantAtTileIndex,
  seedingWorldLongGrassUnitFromTileIndex,
  WORLD_LONG_GRASS_BUNCH_MIN_TILE_COUNT,
  WORLD_LONG_GRASS_PLACEMENT_SEED_SALT,
  WORLD_LONG_GRASS_VARIANT_SEED_SALT,
} from './worldLongGrassPlacement';

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

    for (let tileY = 0; tileY < 40; tileY += 1) {
      for (let tileX = 0; tileX < 40; tileX += 1) {
        const key = `${tileX},${tileY}`;
        placements.set(
          key,
          checkingWorldLongGrassPlacementAtTileIndex(tileX, tileY, modulus)
        );
      }
    }

    for (let tileY = 0; tileY < 40; tileY += 1) {
      for (let tileX = 0; tileX < 40; tileX += 1) {
        const key = `${tileX},${tileY}`;
        expect(
          checkingWorldLongGrassPlacementAtTileIndex(tileX, tileY, modulus)
        ).toBe(placements.get(key));
      }
    }

    const placedCount = [...placements.values()].filter(Boolean).length;
    expect(placedCount).toBeGreaterThan(0);
    expect(placedCount).toBeLessThan(1600);
  });

  it('spawns grass in multi-tile bunches, never isolated singles', () => {
    const modulus = 32;

    for (let tileY = 0; tileY < 48; tileY += 1) {
      for (let tileX = 0; tileX < 48; tileX += 1) {
        if (
          !checkingWorldLongGrassPlacementAtTileIndex(tileX, tileY, modulus)
        ) {
          continue;
        }

        const hasGrassNeighbor = (
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ] as const
        ).some(([dx, dy]) =>
          checkingWorldLongGrassPlacementAtTileIndex(
            tileX + dx,
            tileY + dy,
            modulus
          )
        );

        expect(hasGrassNeighbor).toBe(true);
      }
    }
  });

  it('uses bunch sizes of at least the configured minimum', () => {
    const modulus = 32;

    for (let tileY = 0; tileY < 48; tileY += 8) {
      for (let tileX = 0; tileX < 48; tileX += 8) {
        const { anchorX, anchorY } =
          resolvingWorldLongGrassBunchAnchorAtTileIndex(tileX, tileY, modulus);

        if (
          !checkingWorldLongGrassBunchAnchorSpawnsAtTileIndex(
            anchorX,
            anchorY,
            modulus
          )
        ) {
          continue;
        }

        expect(
          listingWorldLongGrassBunchMemberOffsets(anchorX, anchorY).length
        ).toBeGreaterThanOrEqual(WORLD_LONG_GRASS_BUNCH_MIN_TILE_COUNT);
      }
    }
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
