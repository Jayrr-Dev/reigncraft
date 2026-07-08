/**
 * Stable string keys for navigation grid nodes in search maps.
 *
 * @module lib/navigation/resolvingNavigationGridNodeKey
 */

import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';

/**
 * Encodes a grid node as a map key. Layer defaults to 0 when omitted.
 */
export function resolvingNavigationGridNodeKey(
  node: DefiningNavigationGridNode
): string {
  return `${node.x},${node.y},${node.layer ?? 0}`;
}

/**
 * Builds a neighbor node from a base node and offset, preserving layer.
 */
export function resolvingNavigationGridNeighborNode(
  node: DefiningNavigationGridNode,
  offset: { readonly dx: number; readonly dy: number }
): DefiningNavigationGridNode {
  return {
    x: node.x + offset.dx,
    y: node.y + offset.dy,
    layer: node.layer,
  };
}
