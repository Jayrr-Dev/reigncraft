import { resolvingWorldBuildingPlacedBlockExtrusionBottomLayer } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  checkingWorldBuildingCutFootprintIsFull,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_ORE_WALL,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_PINE_WOOD,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_WATER_STREAM,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlockTopFaceTextureKind';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { resolvingWorldPlazaIngotMetalIdFromWallBlockDefinitionId } from '@/components/world/building/domains/definingWorldPlazaIngotWallBlockRegistry';
import { resolvingWorldPlazaIngotWallSurfaceEntry } from '@/components/world/building/domains/definingWorldPlazaIngotWallSurfaceRegistry';
import { resolvingWorldPlazaOreSpeciesIdFromWallBlockDefinitionId } from '@/components/world/building/domains/definingWorldPlazaOreWallBlockRegistry';
import { resolvingWorldPlazaOreWallSurfaceEntry } from '@/components/world/building/domains/definingWorldPlazaOreWallSurfaceRegistry';
import {
  drawingWorldBuildingCutFootprintExtrusionTexturesOnGraphics,
  drawingWorldBuildingCutFootprintFlatTileTexturesOnGraphics,
} from '@/components/world/building/domains/drawingWorldBuildingCutFootprintColumnsOnGraphics';
import { checkingWorldBuildingPlacedBlockUsesFlatTileRendering } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import { drawingWorldBuildingOreWallTopFaceTextureOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingOreWallTopFaceTextureOnGraphics';
import { drawingWorldBuildingPineWoodSideFaceTextureOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPineWoodSideFaceTextureOnGraphics';
import { drawingWorldBuildingPineWoodTopFaceTextureOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPineWoodTopFaceTextureOnGraphics';
import { drawingWorldBuildingWaterStreamTopFaceTextureOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingWaterStreamTopFaceTextureOnGraphics';
import { resolvingWorldBuildingPlacedBlockTopFaceTextureKind } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockTopFaceTextureKind';
import { checkingWorldBuildingPlacedBlockIsBurnt } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockVisualColors';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { Graphics } from 'pixi.js';

/**
 * Dispatches procedural face texture overlays for placed building blocks.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics
 */

/**
 * Resolves the screen Y center for one column top cap.
 *
 * @param groundCenterY - Ground tile center Y in screen space.
 * @param worldLayer - One-based world layer.
 */
function resolvingWorldBuildingPlacedBlockColumnTopCenterY(
  groundCenterY: number,
  worldLayer: number
): number {
  return (
    groundCenterY + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer)
  );
}

/**
 * Resolves the screen Y center for one column bottom cap.
 *
 * @param groundCenterY - Ground tile center Y in screen space.
 * @param bottomLayer - Bottom occupied world layer.
 */
function resolvingWorldBuildingPlacedBlockColumnBottomCenterY(
  groundCenterY: number,
  bottomLayer: number
): number {
  if (bottomLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return groundCenterY;
  }

  return resolvingWorldBuildingPlacedBlockColumnTopCenterY(
    groundCenterY,
    bottomLayer - 1
  );
}

/** Optional top-cut footprint applied to a textured placed block. */
export interface DrawingWorldBuildingPlacedBlockTopFaceTextureCut {
  readonly cutFootprintMask: number;
  readonly cutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
}

/**
 * Draws procedural top and side face textures for one placed block, if any.
 *
 * @param graphics - Pixi graphics instance.
 * @param block - Placed block entity.
 * @param definition - Block type definition.
 * @param cut - Optional top-cut footprint to clip the textures to.
 */
export function drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
  graphics: Graphics,
  block: DefiningWorldBuildingPlacedBlock,
  definition: DefiningWorldBuildingBlockDefinition,
  cut?: DrawingWorldBuildingPlacedBlockTopFaceTextureCut
): void {
  if (checkingWorldBuildingPlacedBlockIsBurnt(block)) {
    return;
  }

  const textureKind = resolvingWorldBuildingPlacedBlockTopFaceTextureKind(
    definition.id
  );

  if (!textureKind) {
    return;
  }

  const tileX = block.tilePosition.tileX;
  const tileY = block.tilePosition.tileY;
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const topCenterY = resolvingWorldBuildingPlacedBlockColumnTopCenterY(
    center.y,
    worldLayer
  );
  const bottomLayer = resolvingWorldBuildingPlacedBlockExtrusionBottomLayer(
    worldLayer,
    blockHeight
  );
  const bottomCenterY = resolvingWorldBuildingPlacedBlockColumnBottomCenterY(
    center.y,
    bottomLayer
  );
  const baseFillColor = definition.visualConfig.fillColor;

  if (
    textureKind ===
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_PINE_WOOD
  ) {
    const isFlatRendering =
      checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
        definition,
        worldLayer,
        blockHeight
      );
    const isTopCut =
      cut !== undefined &&
      !checkingWorldBuildingCutFootprintIsFull(
        cut.cutFootprintMask,
        cut.cutGridAxisCellCount
      );

    if (isTopCut) {
      if (isFlatRendering) {
        drawingWorldBuildingCutFootprintFlatTileTexturesOnGraphics({
          graphics,
          tileX,
          tileY,
          worldLayer,
          cutFootprintMask: cut.cutFootprintMask,
          cutGridAxisCellCount: cut.cutGridAxisCellCount,
          baseFillColor,
        });
        return;
      }

      drawingWorldBuildingCutFootprintExtrusionTexturesOnGraphics({
        graphics,
        tileX,
        tileY,
        worldLayer,
        blockHeightLayers: blockHeight,
        cutFootprintMask: cut.cutFootprintMask,
        cutGridAxisCellCount: cut.cutGridAxisCellCount,
        baseFillColor,
      });
      return;
    }

    drawingWorldBuildingPineWoodTopFaceTextureOnGraphics(
      graphics,
      tileX,
      tileY,
      center.x,
      topCenterY,
      baseFillColor
    );

    if (
      !checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
        definition,
        worldLayer,
        blockHeight
      )
    ) {
      drawingWorldBuildingPineWoodSideFaceTextureOnGraphics(
        graphics,
        tileX,
        tileY,
        center.x,
        topCenterY,
        bottomCenterY,
        baseFillColor
      );
    }

    return;
  }

  if (
    textureKind ===
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_WATER_STREAM
  ) {
    drawingWorldBuildingWaterStreamTopFaceTextureOnGraphics(
      graphics,
      tileX,
      tileY,
      center.x,
      topCenterY,
      baseFillColor
    );
    return;
  }

  if (
    textureKind ===
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_ORE_WALL
  ) {
    const oreSpeciesId =
      resolvingWorldPlazaOreSpeciesIdFromWallBlockDefinitionId(definition.id);

    if (oreSpeciesId) {
      drawingWorldBuildingOreWallTopFaceTextureOnGraphics(
        graphics,
        tileX,
        tileY,
        center.x,
        topCenterY,
        resolvingWorldPlazaOreWallSurfaceEntry(oreSpeciesId)
      );
      return;
    }

    const ingotMetalId =
      resolvingWorldPlazaIngotMetalIdFromWallBlockDefinitionId(definition.id);

    if (!ingotMetalId) {
      return;
    }

    const ingotSurface = resolvingWorldPlazaIngotWallSurfaceEntry(ingotMetalId);

    drawingWorldBuildingOreWallTopFaceTextureOnGraphics(
      graphics,
      tileX,
      tileY,
      center.x,
      topCenterY,
      {
        speciesId: 'iron',
        pattern: ingotSurface.pattern,
        fillColor: ingotSurface.fillColor,
        accentColor: ingotSurface.accentColor,
        secondaryAccentColor: ingotSurface.secondaryAccentColor,
        paletteSurface: ingotSurface.paletteSurface,
      }
    );
  }
}
