import type { Modifier } from "@dnd-kit/core";

/**
 * Reads pointer coordinates from mouse or touch activator events.
 *
 * @param event - dnd-kit activator event
 */
function resolvingInventoryPointerCoordinates(
  event: Event,
): { clientX: number; clientY: number } | null {
  if (!("clientX" in event) || !("clientY" in event)) {
    return null;
  }

  const { clientX, clientY } = event;

  if (typeof clientX !== "number" || typeof clientY !== "number") {
    return null;
  }

  return { clientX, clientY };
}

/**
 * Centers the inventory item drag overlay on the pointer.
 */
export const modifyingInventorySnapCenterToCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
}) => {
  if (!draggingNodeRect || !activatorEvent) {
    return transform;
  }

  const pointerCoordinates =
    resolvingInventoryPointerCoordinates(activatorEvent);

  if (!pointerCoordinates) {
    return transform;
  }

  const offsetX =
    pointerCoordinates.clientX -
    draggingNodeRect.left -
    draggingNodeRect.width / 2;
  const offsetY =
    pointerCoordinates.clientY -
    draggingNodeRect.top -
    draggingNodeRect.height / 2;

  return {
    ...transform,
    x: transform.x + offsetX,
    y: transform.y + offsetY,
  };
};
