'use client';

import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { DEFINING_WORLD_DEPTH_PROJECTILE_AOE_TELEGRAPH_Z_INDEX_OFFSET } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { computingWorldPlazaProjectileVisualLayout } from '@/components/world/projectile/domains/computingWorldPlazaProjectileVisualLayout';
import { resolvingWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import type { DefiningWorldPlazaProjectileRenderPlane } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import type { ManagingWorldPlazaProjectileStore } from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
import '@/components/world/projectile/domains/registeringWorldPlazaProjectileAnimationClips';
import { useTick } from '@pixi/react';
import type { Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

export type RenderingWorldPlazaProjectileVisualLayerProps = {
  readonly renderPlane: DefiningWorldPlazaProjectileRenderPlane;
  readonly projectileStoreRef: React.RefObject<ManagingWorldPlazaProjectileStore>;
  readonly isEnabled: boolean;
};

/**
 * Draws projectiles and AoE telegraphs for one render plane.
 */
export function RenderingWorldPlazaProjectileVisualLayer({
  renderPlane,
  projectileStoreRef,
  isEnabled,
}: RenderingWorldPlazaProjectileVisualLayerProps): React.JSX.Element {
  const projectileGraphicsRef = useRef<Graphics | null>(null);
  const telegraphGraphicsRef = useRef<Graphics | null>(null);

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

  useTick(() => {
    const store = projectileStoreRef.current;
    const projectileGraphics = projectileGraphicsRef.current;
    const telegraphGraphics = telegraphGraphicsRef.current;

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
      return;
    }

    const nowMs = performance.now();
    projectileGraphics.clear();
    let drewProjectile = false;

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
      drewProjectile = true;
    }

    projectileGraphics.position.set(0, 0);
    projectileGraphics.visible = drewProjectile;

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
  });

  return (
    <>
      <pixiGraphics draw={drawingProjectileGraphics} eventMode="none" />
      {renderPlane === 'effects' ? (
        <pixiGraphics draw={drawingTelegraphGraphics} eventMode="none" />
      ) : null}
    </>
  );
}
