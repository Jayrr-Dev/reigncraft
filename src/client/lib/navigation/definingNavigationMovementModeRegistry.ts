/**
 * Declarative neighbor offsets for grid pathfinding.
 *
 * @module lib/navigation/definingNavigationMovementModeRegistry
 */

import {
  DEFINING_NAVIGATION_CARDINAL_MOVE_COST,
  DEFINING_NAVIGATION_DIAGONAL_MOVE_COST,
} from '@/lib/navigation/definingNavigationAStarConstants';
import type { DefiningNavigationMovementModeId } from '@/lib/navigation/definingNavigationGridTypes';

export type DefiningNavigationMovementNeighborOffset = {
  readonly dx: number;
  readonly dy: number;
  readonly baseCost: number;
};

export type DefiningNavigationMovementModeDefinition = {
  readonly id: DefiningNavigationMovementModeId;
  readonly neighborOffsets: readonly DefiningNavigationMovementNeighborOffset[];
};

const DEFINING_NAVIGATION_FOUR_DIRECTION_OFFSETS: readonly DefiningNavigationMovementNeighborOffset[] =
  [
    { dx: 0, dy: -1, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
    { dx: 1, dy: 0, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
    { dx: 0, dy: 1, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
    { dx: -1, dy: 0, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
  ];

const DEFINING_NAVIGATION_EIGHT_DIRECTION_OFFSETS: readonly DefiningNavigationMovementNeighborOffset[] =
  [
    { dx: 0, dy: -1, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
    { dx: 1, dy: 0, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
    { dx: 0, dy: 1, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
    { dx: -1, dy: 0, baseCost: DEFINING_NAVIGATION_CARDINAL_MOVE_COST },
    {
      dx: 1,
      dy: -1,
      baseCost: DEFINING_NAVIGATION_DIAGONAL_MOVE_COST,
    },
    {
      dx: 1,
      dy: 1,
      baseCost: DEFINING_NAVIGATION_DIAGONAL_MOVE_COST,
    },
    {
      dx: -1,
      dy: 1,
      baseCost: DEFINING_NAVIGATION_DIAGONAL_MOVE_COST,
    },
    {
      dx: -1,
      dy: -1,
      baseCost: DEFINING_NAVIGATION_DIAGONAL_MOVE_COST,
    },
  ];

/** Ordered movement mode registry consumed by A*. */
export const DEFINING_NAVIGATION_MOVEMENT_MODE_REGISTRY: Record<
  DefiningNavigationMovementModeId,
  DefiningNavigationMovementModeDefinition
> = {
  four_direction: {
    id: 'four_direction',
    neighborOffsets: DEFINING_NAVIGATION_FOUR_DIRECTION_OFFSETS,
  },
  eight_direction: {
    id: 'eight_direction',
    neighborOffsets: DEFINING_NAVIGATION_EIGHT_DIRECTION_OFFSETS,
  },
};
