/**
 * Live wildlife body-circle strokes for the terrain collision debug overlay.
 *
 * @module components/world/domains/drawingWorldPlazaVisibleWildlifeCollisionDebugOnGraphics
 */

import { DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_WILDLIFE_COLLIDER_STROKE_COLOR } from '@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics } from '@/components/world/domains/drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeInstanceCollisionRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import type { Graphics } from 'pixi.js';

/**
 * Draws dashed collision circles for every live wildlife instance in view.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param bounds - Visible tile window (same padding as other debug passes).
 * @param wildlifeStore - Live wildlife instance store.
 */
export function drawingWorldPlazaVisibleWildlifeCollisionDebugOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  wildlifeStore: ManagingWildlifeInstanceStore
): void {
  for (const instance of listingWildlifeInstances(wildlifeStore)) {
    if (instance.isDead) {
      continue;
    }

    const tileX = Math.round(instance.position.x);
    const tileY = Math.round(instance.position.y);

    if (
      tileX < bounds.minTileX ||
      tileX > bounds.maxTileX ||
      tileY < bounds.minTileY ||
      tileY > bounds.maxTileY
    ) {
      continue;
    }

    const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

    if (!species) {
      continue;
    }

    drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
      graphics,
      instance.position.x,
      instance.position.y,
      resolvingWildlifeInstanceCollisionRadiusGrid(species, instance),
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_WILDLIFE_COLLIDER_STROKE_COLOR,
      instance.position.layer
    );
  }
}
