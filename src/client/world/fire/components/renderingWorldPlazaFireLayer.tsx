'use client';

import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex } from '@/components/world/domains/resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex';
import {
  DEFINING_WORLD_PLAZA_FIRE_FLAME_FLICKER_SPEED,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_WIDTH_PX,
  DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT,
} from '@/components/world/fire/domains/definingWorldPlazaFireConstants';
import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';
import {
  clearingWorldPlazaLightSourcesForOwner,
  syncingWorldPlazaLightSourcesForOwner,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { useTick } from '@pixi/react';
import type { Container, Graphics } from 'pixi.js';
import { Graphics as PixiGraphics } from 'pixi.js';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/** Light store namespace owned by the fire layer. */
const RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY = 'fire';

/** Glow footprint relative to the player torch texture. */
const RENDERING_WORLD_PLAZA_FIRE_LIGHT_RADIUS_SCALE = 1.4;

export interface RenderingWorldPlazaFireLayerProps {
  readonly entityLayerRef: RefObject<Container | null>;
  readonly fireCells: readonly WorldFireDevvitCell[];
}

function buildingWorldPlazaFireTileKey(cell: WorldFireDevvitCell): string {
  return `${cell.tileX},${cell.tileY},${cell.worldLayer}`;
}

function resolvingWorldPlazaFireGridPointFromCell(
  cell: WorldFireDevvitCell
): DefiningWorldPlazaWorldPoint {
  return {
    x: cell.tileX + 0.5,
    y: cell.tileY + 0.5,
    layer: cell.worldLayer,
  };
}

function mappingWorldPlazaFireCellToLightSource(
  cell: WorldFireDevvitCell
): DefiningWorldPlazaLightSource {
  return {
    id: `fire:${buildingWorldPlazaFireTileKey(cell)}`,
    gridX: cell.tileX + 0.5,
    gridY: cell.tileY + 0.5,
    worldLayer: cell.worldLayer,
    radiusScale: RENDERING_WORLD_PLAZA_FIRE_LIGHT_RADIUS_SCALE,
    brightness: Math.max(0.35, cell.intensity),
  };
}

function drawingWorldPlazaFireFlameOnGraphics(
  graphics: Graphics,
  flickerPhase: number,
  intensity: number
): void {
  graphics.clear();

  const flickerScale = 0.85 + Math.sin(flickerPhase) * 0.12;
  const width = DEFINING_WORLD_PLAZA_FIRE_FLAME_WIDTH_PX * flickerScale;
  const height =
    DEFINING_WORLD_PLAZA_FIRE_FLAME_HEIGHT_PX *
    flickerScale *
    Math.max(0.4, intensity);

  graphics.moveTo(0, 0);
  graphics.bezierCurveTo(
    width * 0.35,
    -height * 0.45,
    width * 0.55,
    -height * 0.85,
    0,
    -height
  );
  graphics.bezierCurveTo(
    -width * 0.55,
    -height * 0.85,
    -width * 0.35,
    -height * 0.45,
    0,
    0
  );
  graphics.fill({ color: 0xff8c42, alpha: 0.85 });
  graphics.stroke({ color: 0xff4500, width: 1, alpha: 0.7 });

  const innerHeight = height * 0.55;
  const innerWidth = width * 0.5;
  graphics.moveTo(0, 0);
  graphics.bezierCurveTo(
    innerWidth * 0.35,
    -innerHeight * 0.45,
    innerWidth * 0.55,
    -innerHeight * 0.85,
    0,
    -innerHeight
  );
  graphics.bezierCurveTo(
    -innerWidth * 0.55,
    -innerHeight * 0.85,
    -innerWidth * 0.35,
    -innerHeight * 0.45,
    0,
    0
  );
  graphics.fill({ color: 0xffd166, alpha: 0.9 });
}

/**
 * Renders animated fire flames and publishes each burning cell as a world
 * light source consumed by {@link RenderingWorldPlazaLightSourcesGroundGlow}.
 */
export function RenderingWorldPlazaFireLayer({
  entityLayerRef,
  fireCells,
}: RenderingWorldPlazaFireLayerProps): null {
  const flameGraphicsPoolRef = useRef<Map<string, Graphics>>(new Map());
  const flickerPhaseRef = useRef(0);
  const visibleFireCells = useMemo(
    () => fireCells.slice(0, DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT),
    [fireCells]
  );
  const visibleFireCellsRef = useRef(visibleFireCells);

  useEffect(() => {
    visibleFireCellsRef.current = visibleFireCells;
    syncingWorldPlazaLightSourcesForOwner(
      RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY,
      visibleFireCells.map(mappingWorldPlazaFireCellToLightSource)
    );
  }, [visibleFireCells]);

  useEffect(() => {
    const flameGraphicsPool = flameGraphicsPoolRef.current;

    return () => {
      clearingWorldPlazaLightSourcesForOwner(
        RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY
      );

      for (const graphics of flameGraphicsPool.values()) {
        graphics.destroy();
      }

      flameGraphicsPool.clear();
    };
  }, []);

  useTick(() => {
    flickerPhaseRef.current += DEFINING_WORLD_PLAZA_FIRE_FLAME_FLICKER_SPEED;

    const entityLayer = entityLayerRef.current;
    const flameGraphicsPool = flameGraphicsPoolRef.current;
    const cells = visibleFireCellsRef.current;

    if (!entityLayer) {
      return;
    }

    const activeTileKeys = new Set(cells.map(buildingWorldPlazaFireTileKey));

    for (const [tileKey, graphics] of flameGraphicsPool) {
      if (!activeTileKeys.has(tileKey)) {
        entityLayer.removeChild(graphics);
        graphics.destroy();
        flameGraphicsPool.delete(tileKey);
      }
    }

    let didMutateEntityLayerOrder = false;

    for (const cell of cells) {
      const tileKey = buildingWorldPlazaFireTileKey(cell);
      let graphics = flameGraphicsPool.get(tileKey);

      if (!graphics) {
        graphics = new PixiGraphics();
        graphics.eventMode = 'none';
        entityLayer.addChild(graphics);
        flameGraphicsPool.set(tileKey, graphics);
      }

      const gridPoint = resolvingWorldPlazaFireGridPointFromCell(cell);
      const footAnchor =
        computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(gridPoint);
      const flameZIndex =
        resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
          gridPoint,
          2
        );

      graphics.position.set(footAnchor.centerXPx, footAnchor.centerYPx - 6);

      if (graphics.zIndex !== flameZIndex) {
        graphics.zIndex = flameZIndex;
        didMutateEntityLayerOrder = true;
      }

      drawingWorldPlazaFireFlameOnGraphics(
        graphics,
        flickerPhaseRef.current + cell.tileX * 0.7 + cell.tileY * 0.3,
        cell.intensity
      );
    }

    if (didMutateEntityLayerOrder && entityLayer.sortableChildren) {
      entityLayer.sortChildren();
    }
  });

  return null;
}
