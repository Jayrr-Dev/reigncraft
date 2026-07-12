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
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
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

  describe('terrain cliff layer intersection', () => {
    /**
     * Procedural cliff pair that shares one grid row (x+y = 120):
     * lower raised floor at (83, 37) layer 2, taller wall at (84, 36) layer 3.
     * Entity stands north of both so the taller column is a front occluder.
     */
    const lowerFloorTile = { x: 83, y: 37 } as const;
    const tallerCliffTile = { x: 84, y: 36 } as const;
    const entityFoot = { x: 83.4, y: 35.4 } as const;
    const entityStandingTile = { x: 83, y: 35 } as const;

    it('gives taller cliff a higher column sort key than coplanar lower floor', () => {
      const lowerLayer =
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          lowerFloorTile.x,
          lowerFloorTile.y
        );
      const tallerLayer =
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          tallerCliffTile.x,
          tallerCliffTile.y
        );
      const lowerZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        lowerFloorTile.x,
        lowerFloorTile.y
      );
      const tallerZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        tallerCliffTile.x,
        tallerCliffTile.y
      );

      expect(lowerFloorTile.x + lowerFloorTile.y).toBe(
        tallerCliffTile.x + tallerCliffTile.y
      );
      expect(tallerLayer).toBeGreaterThan(lowerLayer);
      expect(tallerZ).toBeGreaterThan(lowerZ);
    });

    it('sorts avatar between lower floor cap and taller cliff wall', () => {
      const standingLayer =
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          entityStandingTile.x,
          entityStandingTile.y
        );
      const lowerZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        lowerFloorTile.x,
        lowerFloorTile.y
      );
      const tallerZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        tallerCliffTile.x,
        tallerCliffTile.y
      );
      const bodyZ = resolvingWorldDepthAvatarBodySortKey({
        x: entityFoot.x,
        y: entityFoot.y,
        layer: standingLayer,
      });

      expect(bodyZ).toBeGreaterThan(lowerZ);
      expect(bodyZ).toBeLessThan(tallerZ);
    });

    it('sorts wildlife-style body key between lower floor and taller cliff', () => {
      const standingLayer =
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          entityStandingTile.x,
          entityStandingTile.y
        );
      const lowerZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        lowerFloorTile.x,
        lowerFloorTile.y
      );
      const tallerZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        tallerCliffTile.x,
        tallerCliffTile.y
      );
      const wildlifeBodyZ = resolvingWorldDepthAvatarBodySortKey({
        x: entityFoot.x,
        y: entityFoot.y,
        layer: standingLayer,
      });

      expect(wildlifeBodyZ).toBeGreaterThan(lowerZ);
      expect(wildlifeBodyZ).toBeLessThan(tallerZ);
    });

    it('keeps tree trunk above its tile terrain column after height bias', () => {
      const columnZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        tallerCliffTile.x,
        tallerCliffTile.y
      );
      const trunkZ = resolvingWorldPlazaTreeTrunkEntityZIndex(
        tallerCliffTile.x,
        tallerCliffTile.y
      );

      expect(trunkZ).toBeGreaterThan(columnZ);
    });
  });
});
