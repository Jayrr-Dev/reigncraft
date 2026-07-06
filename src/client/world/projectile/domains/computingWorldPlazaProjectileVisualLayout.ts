import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { DEFINING_WORLD_DEPTH_PROJECTILE_GROUND_SORTED_Z_INDEX_OFFSET } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex';
import type {
  DefiningWorldPlazaProjectileArchetype,
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileRenderPlane,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Resolves projectile screen placement and depth sort keys.
 *
 * @module components/world/projectile/domains/computingWorldPlazaProjectileVisualLayout
 */

export type ComputingWorldPlazaProjectileVisualLayout = {
  readonly screenX: number;
  readonly screenY: number;
  readonly zIndex: number;
  readonly renderPlane: DefiningWorldPlazaProjectileRenderPlane;
  readonly tint: number;
  readonly radiusPx: number;
};

/**
 * Computes world-local screen position and z-index for one projectile.
 */
export function computingWorldPlazaProjectileVisualLayout(
  instance: DefiningWorldPlazaProjectileInstance,
  archetype: DefiningWorldPlazaProjectileArchetype
): ComputingWorldPlazaProjectileVisualLayout {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const layer =
    instance.position.layer ??
    resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const layerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(layer);
  const screenY = screenPoint.y + layerOffsetPx - instance.altitudePx;
  const baseZIndex = resolvingWorldPlazaIsometricEntityZIndex(
    instance.position
  );
  const zIndex =
    archetype.visual.renderPlane === 'ground-sorted'
      ? baseZIndex +
        DEFINING_WORLD_DEPTH_PROJECTILE_GROUND_SORTED_Z_INDEX_OFFSET
      : baseZIndex + archetype.visual.spriteRadiusPx;

  return {
    screenX: screenPoint.x,
    screenY,
    zIndex,
    renderPlane: archetype.visual.renderPlane,
    tint: archetype.visual.tint ?? 0xffffff,
    radiusPx: archetype.visual.spriteRadiusPx,
  };
}
