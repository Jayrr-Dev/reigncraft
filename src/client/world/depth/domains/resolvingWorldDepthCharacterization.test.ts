/* eslint-disable no-restricted-imports -- characterization tests lock legacy shim output */
import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { resolvingWorldBuildingClaimModePlotOverlayEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingClaimModePlotOverlayZIndex';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_ON_BLOCK_DEPTH_BIAS } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import {
  resolvingWorldPlazaAvatarBodyEntityZIndex,
  resolvingWorldPlazaAvatarGroundShadowEntityZIndex,
} from '@/components/world/domains/resolvingWorldPlazaAvatarGroundShadowEntityZIndex';
import { resolvingWorldPlazaIsometricEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex';
import { resolvingWorldPlazaTreeTrunkEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex';
import { describe, expect, it } from 'vitest';

function creatingWorldDepthCharacterizationWallBlock(
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

describe('world depth characterization (legacy modules)', () => {
  describe('computingWorldDepthSortKey baseline', () => {
    it('projects grid depth from screen Y', () => {
      expect(resolvingWorldPlazaIsometricEntityZIndex({ x: 10, y: 10 })).toBe(
        3200
      );
      expect(resolvingWorldPlazaIsometricEntityZIndex({ x: 0, y: 0 })).toBe(0);
    });
  });

  describe('column sort keys', () => {
    it('resolves placed block column z-index from tile foot', () => {
      expect(
        resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 4)
      ).toBe(3200);
    });

    it('resolves tree trunk z-index with terrain column bias', () => {
      expect(resolvingWorldPlazaTreeTrunkEntityZIndex(10, 10)).toBe(3202);
    });

    it('resolves rock column z-index at anchor tile', () => {
      expect(resolvingWorldPlazaTerrainRockColumnEntityZIndex(10, 10)).toBe(
        3205
      );
    });

    it('resolves claim overlay entity z-index with stable characterization value', () => {
      const tilePosition = creatingWorldBuildingTilePosition(10, 10);
      const entityZ =
        resolvingWorldBuildingClaimModePlotOverlayEntityZIndex(tilePosition);

      expect(entityZ).toBe(3316);
    });
  });

  describe('surface layer resolution', () => {
    it('returns ground on flat procedural tiles without placed blocks', () => {
      expect(resolvingWorldPlazaSurfaceLayerAtTileIndex(0, 0)).toBe(1);
    });

    it('returns placed block top layer when a stack is present', () => {
      const wall = creatingWorldDepthCharacterizationWallBlock(5, 5, 4, 4);

      expect(resolvingWorldPlazaSurfaceLayerAtTileIndex(5, 5, [wall])).toBe(4);
    });
  });

  describe('avatar body sort key', () => {
    it('characterizes flat spawn tile body sort key at origin', () => {
      const bodyZ = resolvingWorldPlazaAvatarBodyEntityZIndex(
        { x: 0, y: 0, layer: 1 },
        []
      );

      expect(bodyZ).toBe(720);
    });

    it('characterizes raised terrain standing bump at procedural hill tile', () => {
      const bodyZ = resolvingWorldPlazaAvatarBodyEntityZIndex(
        { x: 10, y: 10, layer: 1 },
        []
      );

      expect(bodyZ).toBe(3920);
    });

    it('bumps above a placed block the avatar stands on', () => {
      const platform = creatingWorldDepthCharacterizationWallBlock(
        10,
        10,
        3,
        3
      );

      const bodyZ = resolvingWorldPlazaAvatarBodyEntityZIndex(
        { x: 10, y: 10, layer: 3 },
        [platform]
      );
      const columnZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        10,
        10,
        3
      );

      expect(bodyZ).toBeGreaterThan(
        columnZ + DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_ON_BLOCK_DEPTH_BIAS - 1
      );
    });

    it('tucks behind a taller wall in front on the grid', () => {
      const wall = creatingWorldDepthCharacterizationWallBlock(11, 11, 4, 4);
      const bodyZ = resolvingWorldPlazaAvatarBodyEntityZIndex(
        { x: 10, y: 10, layer: 1 },
        [wall]
      );
      const wallZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        11,
        11,
        4
      );

      expect(bodyZ).toBeLessThan(wallZ);
    });

    it('tucks under a taller roof on the same tile', () => {
      const roof = creatingWorldDepthCharacterizationWallBlock(10, 10, 6, 1);
      const bodyZ = resolvingWorldPlazaAvatarBodyEntityZIndex(
        { x: 10, y: 10, layer: 1 },
        [roof]
      );
      const roofZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        10,
        10,
        6
      );

      expect(bodyZ).toBeLessThan(roofZ);
    });

    it('stays in front of a wall behind on the grid', () => {
      const wall = creatingWorldDepthCharacterizationWallBlock(9, 9, 4, 4);
      const bodyZ = resolvingWorldPlazaAvatarBodyEntityZIndex(
        { x: 10, y: 10, layer: 1 },
        [wall]
      );
      const wallZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        9,
        9,
        4
      );

      expect(bodyZ).toBeGreaterThan(wallZ);
    });

    it('stays in front when standing south of a northern wall', () => {
      const wall = creatingWorldDepthCharacterizationWallBlock(10, 10, 8, 8);
      const bodyZ = resolvingWorldPlazaAvatarBodyEntityZIndex(
        { x: 10.4, y: 11.2, layer: 1 },
        [wall]
      );
      const wallZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        10,
        10,
        8
      );

      expect(bodyZ).toBeGreaterThan(wallZ);
    });
  });

  describe('avatar shadow sort key', () => {
    it('sorts at foot depth on flat ground', () => {
      const shadowZ = resolvingWorldPlazaAvatarGroundShadowEntityZIndex(
        { x: 10, y: 10 },
        []
      );

      expect(shadowZ).toBe(
        resolvingWorldPlazaIsometricEntityZIndex({ x: 10, y: 10 }) + 1
      );
    });

    it('stays below a taller column in front of the avatar', () => {
      const wall = creatingWorldDepthCharacterizationWallBlock(11, 11, 4, 4);
      const shadowZ = resolvingWorldPlazaAvatarGroundShadowEntityZIndex(
        { x: 10, y: 10, layer: 1 },
        [wall]
      );
      const wallZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        11,
        11,
        4
      );

      expect(shadowZ).toBeLessThan(wallZ);
    });
  });

  describe('front occluder and south layering', () => {
    it('tucks avatar behind a taller southern wall while staying above a northern stub', () => {
      const northernStub = creatingWorldDepthCharacterizationWallBlock(
        8,
        8,
        2,
        2
      );
      const southernWall = creatingWorldDepthCharacterizationWallBlock(
        11,
        11,
        6,
        6
      );
      const northernZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        8,
        8,
        2
      );
      const southernZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        11,
        11,
        6
      );
      const bodyZ = resolvingWorldDepthAvatarBodySortKey(
        { x: 9.5, y: 9.5, layer: 1 },
        { placedBlocks: [northernStub, southernWall] }
      );

      expect(bodyZ).toBeGreaterThan(northernZ);
      expect(bodyZ).toBeLessThan(southernZ);
    });

    it('keeps tree trunk above its tile terrain column after height bias', () => {
      const columnZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        11,
        9
      );
      const trunkZ = resolvingWorldPlazaTreeTrunkEntityZIndex(11, 9);

      expect(trunkZ).toBeGreaterThan(columnZ);
    });

    it('keeps avatar in front of a northern taller column when standing south', () => {
      const northernWall = creatingWorldDepthCharacterizationWallBlock(
        12,
        12,
        10,
        10
      );
      const wallZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        12,
        12,
        10
      );
      const bodyZ = resolvingWorldDepthAvatarBodySortKey(
        { x: 12.5, y: 13.2, layer: 1 },
        { placedBlocks: [northernWall] }
      );

      expect(bodyZ).toBeGreaterThan(wallZ);
    });
  });
});
