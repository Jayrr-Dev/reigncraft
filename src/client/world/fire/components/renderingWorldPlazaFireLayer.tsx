'use client';

import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import { resolvingWorldPlazaPlayerNightLightGlowBakedTexture } from '@/components/world/domains/creatingWorldPlazaPlayerNightLightGlowBakedTexture';
import { DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA } from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex } from '@/components/world/domains/resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex';
import {
  DEFINING_WORLD_PLAZA_FIRE_FLAME_FLICKER_SPEED,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_WIDTH_PX,
  DEFINING_WORLD_PLAZA_FIRE_GLOW_FLOOR_DEPTH_BIAS,
  DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT,
  DEFINING_WORLD_PLAZA_FIRE_GLOW_WARM_CORE_ALPHA,
} from '@/components/world/fire/domains/definingWorldPlazaFireConstants';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { useApplication, useTick } from '@pixi/react';
import type { Container, Graphics, Sprite } from 'pixi.js';
import { Graphics as PixiGraphics, Sprite as PixiSprite } from 'pixi.js';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

export interface RenderingWorldPlazaFireLayerProps {
  readonly floorLayerRef: RefObject<Container | null>;
  readonly entityLayerRef: RefObject<Container | null>;
  readonly fireCells: readonly WorldFireDevvitCell[];
}

type RenderingWorldPlazaFireGlowSpriteEntry = {
  readonly sprite: Sprite;
  readonly tileKey: string;
};

type RenderingWorldPlazaFireFlameGraphicsEntry = {
  readonly graphics: Graphics;
  readonly tileKey: string;
};

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

function drawingWorldPlazaFireFlameOnGraphics(
  graphics: Graphics,
  flickerPhase: number,
  intensity: number
): void {
  graphics.clear();

  const flickerScale = 0.85 + Math.sin(flickerPhase) * 0.12;
  const width = DEFINING_WORLD_PLAZA_FIRE_FLAME_WIDTH_PX * flickerScale;
  const height =
    DEFINING_WORLD_PLAZA_FIRE_FLAME_HEIGHT_PX * flickerScale * intensity;

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
  graphics.fill({ color: 0xff8c42, alpha: 0.85 * intensity });
  graphics.stroke({ color: 0xff4500, width: 1, alpha: 0.7 * intensity });
}

/**
 * Renders fire flames on the entity layer and warm ground glow at night.
 */
export function RenderingWorldPlazaFireLayer({
  floorLayerRef,
  entityLayerRef,
  fireCells,
}: RenderingWorldPlazaFireLayerProps): null {
  const sunState = usingWorldPlazaDayNightSunState();
  const nightLightState =
    computingWorldPlazaPlayerNightLightStateFromSunState(sunState);
  const nightLightStateRef = useRef(nightLightState);
  const glowSpritesRef = useRef<
    Map<string, RenderingWorldPlazaFireGlowSpriteEntry>
  >(new Map());
  const flameGraphicsRef = useRef<
    Map<string, RenderingWorldPlazaFireFlameGraphicsEntry>
  >(new Map());
  const flickerPhaseRef = useRef(0);
  const applicationContext = useApplication();
  const visibleFireCells = useMemo(
    () => fireCells.slice(0, DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT),
    [fireCells]
  );

  useEffect(() => {
    nightLightStateRef.current = nightLightState;
  }, [nightLightState]);

  useEffect(() => {
    return () => {
      for (const entry of glowSpritesRef.current.values()) {
        entry.sprite.destroy();
      }

      for (const entry of flameGraphicsRef.current.values()) {
        entry.graphics.destroy();
      }

      glowSpritesRef.current.clear();
      flameGraphicsRef.current.clear();
    };
  }, []);

  useTick(() => {
    flickerPhaseRef.current += DEFINING_WORLD_PLAZA_FIRE_FLAME_FLICKER_SPEED;

    const floorLayer = floorLayerRef.current;
    const entityLayer = entityLayerRef.current;
    const { glowBrightness } = nightLightStateRef.current;
    const glowEntries = glowSpritesRef.current;
    const flameEntries = flameGraphicsRef.current;
    const nextTileKeys = new Set(
      visibleFireCells.map((cell) => buildingWorldPlazaFireTileKey(cell))
    );

    for (const [tileKey, entry] of glowEntries) {
      if (!nextTileKeys.has(tileKey)) {
        floorLayer?.removeChild(entry.sprite);
        entry.sprite.destroy();
        glowEntries.delete(tileKey);
      }
    }

    for (const [tileKey, entry] of flameEntries) {
      if (!nextTileKeys.has(tileKey)) {
        entityLayer?.removeChild(entry.graphics);
        entry.graphics.destroy();
        flameEntries.delete(tileKey);
      }
    }

    if (!floorLayer || !entityLayer) {
      return;
    }

    for (const cell of visibleFireCells) {
      const tileKey = buildingWorldPlazaFireTileKey(cell);
      const gridPoint = resolvingWorldPlazaFireGridPointFromCell(cell);
      const footAnchor =
        computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(gridPoint);
      const glowZIndex =
        resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
          gridPoint,
          DEFINING_WORLD_PLAZA_FIRE_GLOW_FLOOR_DEPTH_BIAS
        );

      let glowEntry = glowEntries.get(tileKey);

      if (!glowEntry) {
        const sprite = new PixiSprite();
        sprite.eventMode = 'none';
        sprite.blendMode = 'screen';
        sprite.anchor.set(0.5);
        floorLayer.addChild(sprite);
        glowEntry = { sprite, tileKey };
        glowEntries.set(tileKey, glowEntry);
      }

      glowEntry.sprite.position.set(footAnchor.centerXPx, footAnchor.centerYPx);
      glowEntry.sprite.zIndex = glowZIndex;

      const effectiveGlowAlpha =
        glowBrightness *
        cell.intensity *
        DEFINING_WORLD_PLAZA_FIRE_GLOW_WARM_CORE_ALPHA;

      if (
        effectiveGlowAlpha <= 0.01 ||
        !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
      ) {
        glowEntry.sprite.visible = false;
        glowEntry.sprite.alpha = 0;
      } else {
        if (!glowEntry.sprite.texture) {
          glowEntry.sprite.texture =
            resolvingWorldPlazaPlayerNightLightGlowBakedTexture(
              applicationContext.app.renderer
            );
        }

        glowEntry.sprite.visible = true;
        glowEntry.sprite.alpha =
          effectiveGlowAlpha *
          (DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA / 0.48);
      }

      let flameEntry = flameEntries.get(tileKey);

      if (!flameEntry) {
        const graphics = new PixiGraphics();
        graphics.eventMode = 'none';
        entityLayer.addChild(graphics);
        flameEntry = { graphics, tileKey };
        flameEntries.set(tileKey, flameEntry);
      }

      flameEntry.graphics.position.set(
        footAnchor.centerXPx,
        footAnchor.centerYPx - 8
      );
      flameEntry.graphics.zIndex = glowZIndex + 2;
      drawingWorldPlazaFireFlameOnGraphics(
        flameEntry.graphics,
        flickerPhaseRef.current + cell.tileX * 0.7 + cell.tileY * 0.3,
        cell.intensity
      );
      flameEntry.graphics.visible = cell.intensity > 0.05;
    }

    if (floorLayer.sortableChildren) {
      floorLayer.sortChildren();
    }

    if (entityLayer.sortableChildren) {
      entityLayer.sortChildren();
    }
  });

  return null;
}
