import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC,
  DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_DOOR_WOODEN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_SIGN_WOODEN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_POINTER_CLICK_MAX_CHEBYSHEV_GRID_DISTANCE } from '@/components/world/fire/domains/definingWorldPlazaCampfirePointerInteractionConstants';
import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';
import type { DefiningWorldPlazaInteractableBlockClickActionDefinition } from '@/components/world/interaction/domains/definingWorldPlazaInteractableBlockClickAction';
import { WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES } from '../../../../shared/worldFireDevvit';

/** Default player reach for functional block clicks (tiles). */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_DEFAULT_PLAYER_RANGE_TILES = 2;

/**
 * Click-action definitions keyed by placed-block definition id.
 *
 * Only blocks listed here participate in the shared pointer resolver.
 */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_CLICK_ACTION_REGISTRY: Readonly<
  Record<string, DefiningWorldPlazaInteractableBlockClickActionDefinition>
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE]: {
    dispatch: 'popover',
    hitTest: 'forgiving',
    pointerHitRadiusTiles:
      DEFINING_WORLD_PLAZA_CAMPFIRE_POINTER_CLICK_MAX_CHEBYSHEV_GRID_DISTANCE,
    playerRangeTiles: WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES,
    requiresPlotOwner: false,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK]: {
    dispatch: 'popover',
    hitTest: 'forgiving',
    pointerHitRadiusTiles:
      DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES,
    playerRangeTiles: DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES,
    requiresPlotOwner: false,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_DOOR_WOODEN]: {
    dispatch: 'immediate',
    hitTest: 'tile',
    playerRangeTiles:
      DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_DEFAULT_PLAYER_RANGE_TILES,
    requiresPlotOwner: true,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC]: {
    dispatch: 'immediate',
    hitTest: 'tile',
    playerRangeTiles:
      DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_DEFAULT_PLAYER_RANGE_TILES,
    requiresPlotOwner: true,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_SIGN_WOODEN]: {
    dispatch: 'immediate',
    hitTest: 'tile',
    playerRangeTiles:
      DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_DEFAULT_PLAYER_RANGE_TILES,
    requiresPlotOwner: true,
  },
};

/**
 * Resolves click-action metadata for a block definition id.
 */
export function resolvingWorldPlazaInteractableBlockClickAction(
  definitionId: string
): DefiningWorldPlazaInteractableBlockClickActionDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_CLICK_ACTION_REGISTRY[
      definitionId
    ] ?? null
  );
}
