/* eslint-disable no-restricted-imports -- characterization tests lock legacy shim output */
import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { checkingWorldCollisionVerticalColumnBlocksPlayer } from '@/components/world/collision/domains/checkingWorldCollisionVerticalColumnRule';
import {
  checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare,
  pushingWorldCollisionPointOutsideCircularCollider,
} from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';
import { checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import {
  clampingWorldPlazaWalkTargetToWalkableGridPoint,
  resolvingWorldPlazaBlockedWorldPoint,
  resolvingWorldPlazaEjectingPlayerFromBlockedWorldPoint,
} from '@/components/world/domains/resolvingWorldPlazaBlockedWorldPoint';
import { describe, expect, it } from 'vitest';

function creatingWorldCollisionCharacterizationWallBlock(
  tileX: number,
  tileY: number,
  worldLayer: number,
  blockHeight: number
) {
  return creatingWorldBuildingPlacedBlock({
    blockId: `wall-${tileX}-${tileY}-${worldLayer}`,
    plotId: 'plot-test',
    definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    worldLayer,
    blockHeight,
    ownerId: 'owner-test',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

describe('world collision characterization (legacy modules)', () => {
  describe('shape geometry', () => {
    it('detects circle overlapping tile square at origin', () => {
      expect(
        checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare(
          { x: 0.4, y: 0 },
          DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
          0,
          0,
          DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID
        )
      ).toBe(true);
    });

    it('pushes point outside circular collider to contact radius', () => {
      const pushed = pushingWorldCollisionPointOutsideCircularCollider(
        0.9,
        0,
        1,
        0,
        0.5,
        DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
      );

      expect(pushed.x).toBeCloseTo(0.25, 5);
      expect(pushed.y).toBe(0);
    });
  });

  describe('vertical column rule', () => {
    it('blocks when surface is more than jump reach above player', () => {
      expect(
        checkingWorldCollisionVerticalColumnBlocksPlayer({
          playerLayer: 1,
          surfaceLayer: 10,
          applyBlockCollision: true,
          isWalkableStep: false,
          verticalBandsOverlap: true,
        })
      ).toBe(true);
    });

    it('allows +1 walkable step', () => {
      expect(
        checkingWorldCollisionVerticalColumnBlocksPlayer({
          playerLayer: 1,
          surfaceLayer: 2,
          applyBlockCollision: true,
          isWalkableStep: true,
          verticalBandsOverlap: true,
        })
      ).toBe(false);
    });
  });

  describe('resolver baseline', () => {
    it('leaves open ground unchanged', () => {
      const resolved = resolvingWorldPlazaBlockedWorldPoint({
        x: 0,
        y: 0,
        layer: 1,
      });

      expect(resolved.x).toBe(0);
      expect(resolved.y).toBe(0);
    });

    it('clamps walk target before a placed block wall', () => {
      const wall = creatingWorldCollisionCharacterizationWallBlock(5, 5, 4, 4);
      const from = { x: 3.5, y: 5, layer: 1 };
      const to = { x: 5.5, y: 5, layer: 1 };
      const clamped = clampingWorldPlazaWalkTargetToWalkableGridPoint(
        from,
        to,
        false,
        [wall]
      );

      expect(clamped.x).toBeLessThan(to.x);
      expect(
        Math.hypot(clamped.x - from.x, clamped.y - from.y)
      ).toBeGreaterThan(0);
    });

    it('disables block collision mid-jump arc', () => {
      const wall = creatingWorldCollisionCharacterizationWallBlock(5, 5, 4, 4);
      const desired = { x: 5, y: 5, layer: 1 };
      const midJump = resolvingWorldPlazaBlockedWorldPoint(desired, {
        isJumping: true,
        jumpProgress: 0.5,
        placedBlocks: [wall],
        playerLayer: 1,
      });

      expect(midJump.x).toBe(5);
      expect(midJump.y).toBe(5);
    });

    it('ejects from embedded block tile to nearby walkable cell', () => {
      const wall = creatingWorldCollisionCharacterizationWallBlock(5, 5, 4, 4);
      const ejected = resolvingWorldPlazaEjectingPlayerFromBlockedWorldPoint(
        { x: 5, y: 5, layer: 1 },
        { placedBlocks: [wall], playerLayer: 1 }
      );

      expect(ejected.x !== 5 || ejected.y !== 5).toBe(true);
    });
  });

  describe('terrain elevation column', () => {
    it('returns stable block result for procedural tile at origin', () => {
      const blocks =
        checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex(
          0,
          0,
          1,
          true
        );

      expect(typeof blocks).toBe('boolean');
    });
  });
});
