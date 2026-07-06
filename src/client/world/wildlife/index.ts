/**
 * Wildlife engine public exports.
 *
 * @module components/world/wildlife
 */

export { RenderingWildlifeLayer } from '@/components/world/wildlife/components/renderingWildlifeLayer';
export { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
export type {
  DefiningWildlifeDamageEvent,
  DefiningWildlifeInstance,
  DefiningWildlifeNetworkSnapshot,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
export {
  DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID,
  findingWildlifeInstanceAtGridPoint,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
export { usingWildlifeSimulation } from '@/components/world/wildlife/hooks/usingWildlifeSimulation';
