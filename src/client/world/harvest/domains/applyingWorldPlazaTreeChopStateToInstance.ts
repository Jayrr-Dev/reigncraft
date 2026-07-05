import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';

/**
 * Counts choppable world layers on a tree (visual height minus trunk foot).
 */
export function computingWorldPlazaTreeChoppableLayerCount(
  tree: DefiningWorldPlazaTreeInstance
): number {
  if (tree.isStump) {
    return 0;
  }

  const standingSurfaceLayer = tree.standingSurfaceLayer ?? 1;
  const visualSurfaceLayer = tree.visualSurfaceLayer ?? standingSurfaceLayer;

  return Math.max(0, visualSurfaceLayer - standingSurfaceLayer);
}

/**
 * Resolves the remaining visual layer after prior chops.
 */
export function resolvingWorldPlazaTreeRemainingVisualLayer(
  tree: DefiningWorldPlazaTreeInstance,
  choppedState: DefiningWorldPlazaChoppedTreeTileState | undefined
): number {
  const standingSurfaceLayer = tree.standingSurfaceLayer ?? 1;
  const fullVisualLayer = tree.visualSurfaceLayer ?? standingSurfaceLayer;

  if (!choppedState || choppedState.isStump) {
    if (choppedState?.isStump) {
      return standingSurfaceLayer;
    }

    return fullVisualLayer;
  }

  return Math.max(standingSurfaceLayer, choppedState.remainingVisualLayer);
}

/**
 * Applies chop persistence to a tree instance; returns a stump when fully felled.
 */
export function applyingWorldPlazaTreeChopStateToInstance(
  tree: DefiningWorldPlazaTreeInstance,
  choppedState: DefiningWorldPlazaChoppedTreeTileState | undefined
): DefiningWorldPlazaTreeInstance | null {
  if (!choppedState) {
    return tree;
  }

  if (choppedState.isStump) {
    const standingSurfaceLayer = tree.standingSurfaceLayer ?? 1;

    return {
      ...tree,
      visualSurfaceLayer: standingSurfaceLayer,
      isStump: true,
    };
  }

  const standingSurfaceLayer = tree.standingSurfaceLayer ?? 1;
  const remainingVisualLayer = resolvingWorldPlazaTreeRemainingVisualLayer(
    tree,
    choppedState
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
