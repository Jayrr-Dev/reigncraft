/**
 * Declarative navigation cost profiles for plaza agents.
 *
 * @module components/world/navigation/domains/definingWorldPlazaNavigationCostProfiles
 */

import {
  DEFINING_NAVIGATION_ASTAR_DEFAULT_HEURISTIC_ID,
  DEFINING_NAVIGATION_ASTAR_DEFAULT_MOVEMENT_MODE_ID,
} from '@/lib/navigation/definingNavigationAStarConstants';
import type {
  DefiningNavigationHeuristicId,
  DefiningNavigationMovementModeId,
} from '@/lib/navigation/definingNavigationGridTypes';

export type DefiningWorldPlazaNavigationCostProfileId = 'player.default';

export type DefiningWorldPlazaNavigationCostProfile = {
  readonly id: DefiningWorldPlazaNavigationCostProfileId;
  readonly movementModeId: DefiningNavigationMovementModeId;
  readonly heuristicId: DefiningNavigationHeuristicId;
  readonly preventCornerCutting: boolean;
};

/** Ordered registry of plaza navigation cost profiles. */
export const DEFINING_WORLD_PLAZA_NAVIGATION_COST_PROFILE_REGISTRY: Record<
  DefiningWorldPlazaNavigationCostProfileId,
  DefiningWorldPlazaNavigationCostProfile
> = {
  'player.default': {
    id: 'player.default',
    movementModeId: DEFINING_NAVIGATION_ASTAR_DEFAULT_MOVEMENT_MODE_ID,
    heuristicId: DEFINING_NAVIGATION_ASTAR_DEFAULT_HEURISTIC_ID,
    preventCornerCutting: true,
  },
};
