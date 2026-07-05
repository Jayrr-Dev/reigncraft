import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';

/**
 * Counts choppable world layers on a tree (visual height minus trunk foot).
 */
export function computingWorldPlazaTreeChoppableLayerCount(
  tree: DefiningWorldPlazaTreeInstance
): number {
  const standingSurfaceLayer = tree.standingSurfaceLayer ?? 1;
  const visualSurfaceLayer = tree.visualSurfaceLayer ?? standingSurfaceLayer;

  return Math.max(0, visualSurfaceLayer - standingSurfaceLayer);
}

/**
 * Resolves the remaining visual layer after prior chops.
 */
export function resolvingWorldPlazaTreeRemainingVisualLayer(
  tree: DefiningWorldPlazaTreeInstance,
  choppedRemainingVisualLayer: number | undefined
): number {
  const standingSurfaceLayer = tree.standingSurfaceLayer ?? 1;
  const fullVisualLayer = tree.visualSurfaceLayer ?? standingSurfaceLayer;

  if (choppedRemainingVisualLayer === undefined) {
    return fullVisualLayer;
  }

  return Math.max(standingSurfaceLayer, choppedRemainingVisualLayer);
}

/**
 * Applies chop persistence to a tree instance; returns null when fully felled.
 */
export function applyingWorldPlazaTreeChopStateToInstance(
  tree: DefiningWorldPlazaTreeInstance,
  choppedRemainingVisualLayer: number | undefined
): DefiningWorldPlazaTreeInstance | null {
  const standingSurfaceLayer = tree.standingSurfaceLayer ?? 1;
  const remainingVisualLayer = resolvingWorldPlazaTreeRemainingVisualLayer(
    tree,
    choppedRemainingVisualLayer
  );

  if (remainingVisualLayer <= standingSurfaceLayer) {
    return null;
  }

  if (remainingVisualLayer === tree.visualSurfaceLayer) {
    return tree;
  }

  return {
    ...tree,
    visualSurfaceLayer: remainingVisualLayer,
  };
}
