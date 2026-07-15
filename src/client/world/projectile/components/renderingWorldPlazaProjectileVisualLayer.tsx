'use client';

import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { DEFINING_WORLD_DEPTH_PROJECTILE_AOE_TELEGRAPH_Z_INDEX_OFFSET } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { computingWorldPlazaProjectileScreenRotationRadians } from '@/components/world/projectile/domains/computingWorldPlazaProjectileScreenRotationRadians';
import { computingWorldPlazaProjectileVisualLayout } from '@/components/world/projectile/domains/computingWorldPlazaProjectileVisualLayout';
import { DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CELL_SIZE_PX } from '@/components/world/projectile/domains/definingWorldPlazaCyrobornProjectileSpriteConstants';
import { resolvingWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import type { DefiningWorldPlazaProjectileRenderPlane } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import {
  peekingWorldPlazaCyrobornProjectileSpriteTexture,
  preloadingWorldPlazaCyrobornProjectileSpriteTextures,
} from '@/components/world/projectile/domains/loadingWorldPlazaCyrobornProjectileSpriteTextures';
import type { ManagingWorldPlazaProjectileStore } from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
import '@/components/world/projectile/domains/registeringWorldPlazaProjectileAnimationClips';
import type { Container, Graphics } from 'pixi.js';
import { Sprite } from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';

export type RenderingWorldPlazaProjectileVisualLayerProps = {
  readonly renderPlane: DefiningWorldPlazaProjectileRenderPlane;
  readonly projectileStoreRef: React.RefObject<ManagingWorldPlazaProjectileStore>;
  readonly isEnabled: boolean;
};

/**
 * Draws projectiles and AoE telegraphs for one render plane.
 * Cyroborn ice clips use sprite textures; other archetypes fall back to tinted circles.
 */
export function RenderingWorldPlazaProjectileVisualLayer({
  renderPlane,
  projectileStoreRef,
  isEnabled,
}: RenderingWorldPlazaProjectileVisualLayerProps): React.JSX.Element {
  const projectileGraphicsRef = useRef<Graphics | null>(null);
  const telegraphGraphicsRef = useRef<Graphics | null>(null);
  const spriteLayerRef = useRef<Container | null>(null);
  const spriteByProjectileIdRef = useRef<Map<string, Sprite>>(new Map());

  const drawingProjectileGraphics = useCallback((graphics: Graphics): void => {
    projectileGraphicsRef.current = graphics;
    graphics.clear();
    graphics.visible = false;
  }, []);

  const drawingTelegraphGraphics = useCallback((graphics: Graphics): void => {
    telegraphGraphicsRef.current = graphics;
    graphics.clear();
    graphics.visible = false;
  }, []);

  useEffect(() => {
    void preloadingWorldPlazaCyrobornProjectileSpriteTextures();

    return () => {
      const sprites = spriteByProjectileIdRef.current;
      for (const sprite of sprites.values()) {
        sprite.destroy();
      }
      sprites.clear();
    };
  }, []);

  usingWorldPlazaSafeTick(() => {
    const store = projectileStoreRef.current;
    const projectileGraphics = projectileGraphicsRef.current;
    const telegraphGraphics = telegraphGraphicsRef.current;
    const spriteLayer = spriteLayerRef.current;

    if (!store || !projectileGraphics) {
      return;
    }

    if (!isEnabled) {
      projectileGraphics.clear();
      projectileGraphics.visible = false;
      telegraphGraphics?.clear();
      if (telegraphGraphics) {
        telegraphGraphics.visible = false;
      }
      if (spriteLayer) {
        spriteLayer.visible = false;
      }
      return;
    }

    if (spriteLayer) {
      spriteLayer.visible = true;
    }

    const nowMs = performance.now();
    projectileGraphics.clear();
    let drewProjectileCircle = false;
    const liveSpriteProjectileIds = new Set<string>();

    for (const instance of store.instances) {
      const archetype = resolvingWorldPlazaProjectileArchetype(
        instance.archetypeId
      );
      if (!archetype || archetype.visual.renderPlane !== renderPlane) {
        continue;
      }

      const layout = computingWorldPlazaProjectileVisualLayout(
        instance,
        archetype
      );
      const spriteTexture = peekingWorldPlazaCyrobornProjectileSpriteTexture(
        archetype.visual.clipId
      );

      if (spriteTexture && spriteLayer) {
        liveSpriteProjectileIds.add(instance.projectileId);
        let sprite = spriteByProjectileIdRef.current.get(instance.projectileId);

        if (!sprite) {
          sprite = new Sprite(spriteTexture);
          sprite.anchor.set(0.5);
          sprite.eventMode = 'none';
          spriteLayer.addChild(sprite);
          spriteByProjectileIdRef.current.set(instance.projectileId, sprite);
        }

        sprite.texture = spriteTexture;
        sprite.visible = true;
        sprite.position.set(layout.screenX, layout.screenY);
        sprite.zIndex = layout.zIndex;
        sprite.tint = layout.tint;
        const displayDiameterPx = layout.radiusPx * 2;
        const uniformScale =
          (displayDiameterPx /
            DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CELL_SIZE_PX) *
          archetype.visual.scale;
        sprite.scale.set(uniformScale);
        sprite.rotation = archetype.visual.alignRotationToVelocity
          ? computingWorldPlazaProjectileScreenRotationRadians(instance)
          : 0;
        continue;
      }

      const red = (layout.tint >> 16) & 0xff;
      const green = (layout.tint >> 8) & 0xff;
      const blue = layout.tint & 0xff;
      projectileGraphics.circle(
        layout.screenX,
        layout.screenY,
        layout.radiusPx
      );
      projectileGraphics.fill({
        color: (red << 16) | (green << 8) | blue,
        alpha: 0.95,
      });
      projectileGraphics.zIndex = layout.zIndex;
      drewProjectileCircle = true;
    }

    for (const [projectileId, sprite] of spriteByProjectileIdRef.current) {
      if (liveSpriteProjectileIds.has(projectileId)) {
        continue;
      }

      if (sprite.parent === spriteLayer) {
        spriteLayer?.removeChild(sprite);
      }
      sprite.destroy();
      spriteByProjectileIdRef.current.delete(projectileId);
    }

    if (spriteLayer) {
      spriteLayer.sortableChildren = true;
    }

    projectileGraphics.position.set(0, 0);
    projectileGraphics.visible = drewProjectileCircle;

    if (!telegraphGraphics || renderPlane !== 'effects') {
      return;
    }

    telegraphGraphics.clear();
    let drewTelegraph = false;

    for (const instance of store.instances) {
      const archetype = resolvingWorldPlazaProjectileArchetype(
        instance.archetypeId
      );
      if (
        !archetype?.impact.telegraph ||
        instance.telegraphStartedAtMs === null
      ) {
        continue;
      }

      const telegraph = archetype.impact.telegraph;
      const elapsedMs = nowMs - instance.telegraphStartedAtMs;
      if (elapsedMs < 0 || elapsedMs > telegraph.durationMs) {
        continue;
      }

      const targetPoint = instance.targetPoint ?? instance.position;
      const screenPoint =
        convertingWorldPlazaGridPointToIsometricScreenPoint(targetPoint);
      const progress = elapsedMs / telegraph.durationMs;
      const alpha = 0.35 + progress * 0.35;
      const radiusPx = telegraph.radiusGrid * 32;

      telegraphGraphics.circle(screenPoint.x, screenPoint.y, radiusPx);
      telegraphGraphics.stroke({
        color: archetype.visual.tint ?? 0xff8844,
        width: 2,
        alpha,
      });
      telegraphGraphics.zIndex =
        computingWorldDepthSortKey(targetPoint) +
        DEFINING_WORLD_DEPTH_PROJECTILE_AOE_TELEGRAPH_Z_INDEX_OFFSET;
      drewTelegraph = true;
    }

    telegraphGraphics.visible = drewTelegraph;
  }, 'tick:projectile-visual');

  return (
    <>
      <pixiContainer
        ref={(container) => {
          spriteLayerRef.current = container;
        }}
        sortableChildren
        eventMode="none"
      />
      <pixiGraphics draw={drawingProjectileGraphics} eventMode="none" />
      {renderPlane === 'effects' ? (
        <pixiGraphics draw={drawingTelegraphGraphics} eventMode="none" />
      ) : null}
    </>
  );
}
