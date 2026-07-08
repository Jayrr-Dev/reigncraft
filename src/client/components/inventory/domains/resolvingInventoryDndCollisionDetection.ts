import { parsingInventoryItemDraggableId } from '@/components/inventory/domains/definingInventoryDndIds';
import { pointerWithin, type CollisionDetection } from '@dnd-kit/core';

/**
 * Returns true when a collision id refers to a dragged item instance.
 *
 * @param collisionId - dnd-kit collision id
 */
function checkingInventoryDndCollisionIdIsItemDraggable(
  collisionId: string
): boolean {
  return parsingInventoryItemDraggableId(collisionId) !== null;
}

/**
 * Prefers slot droppable containers over nested item draggables so drops onto
 * occupied slots resolve to the slot (stacking / swap) instead of no-op.
 */
export const resolvingInventoryDndCollisionDetection: CollisionDetection = (
  args
) => {
  const collisions = pointerWithin(args);

  const droppableCollisions = collisions.filter(
    (collision) =>
      !checkingInventoryDndCollisionIdIsItemDraggable(String(collision.id))
  );

  return droppableCollisions.length > 0 ? droppableCollisions : collisions;
};
