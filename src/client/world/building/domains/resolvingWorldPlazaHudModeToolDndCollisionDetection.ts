/**
 * Collision detection for HUD mode tool board dnd (prefer slot droppables).
 *
 * @module components/world/building/domains/resolvingWorldPlazaHudModeToolDndCollisionDetection
 */

import { parsingWorldPlazaHudModeToolDraggableId } from '@/components/world/building/domains/definingWorldPlazaHudModeToolDndIds';
import { pointerWithin, type CollisionDetection } from '@dnd-kit/core';

/**
 * Prefers slot droppables over nested tool draggables so occupied slots swap.
 */
export const resolvingWorldPlazaHudModeToolDndCollisionDetection: CollisionDetection =
  (args) => {
    const collisions = pointerWithin(args);

    const droppableCollisions = collisions.filter(
      (collision) =>
        parsingWorldPlazaHudModeToolDraggableId(String(collision.id)) === null
    );

    return droppableCollisions.length > 0 ? droppableCollisions : collisions;
  };
