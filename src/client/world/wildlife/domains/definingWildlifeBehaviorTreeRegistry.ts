/**
 * Behavior tree registry: one tree per temperament.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorTreeRegistry
 */

import type { DefiningWildlifeBehaviorTreeDefinition } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_PASSIVE_TREE: DefiningWildlifeBehaviorTreeDefinition = {
  temperamentId: 'passive',
  root: {
    kind: 'selector',
    children: [
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isHealthBelowFleeThreshold' },
          { kind: 'action', actionId: 'fleeFromThreat' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isHungerAtLeastHungry' },
          { kind: 'action', actionId: 'graze' },
        ],
      },
      { kind: 'action', actionId: 'wander' },
    ],
  },
};

const DEFINING_WILDLIFE_SKITTISH_TREE: DefiningWildlifeBehaviorTreeDefinition =
  {
    temperamentId: 'skittish',
    root: {
      kind: 'selector',
      children: [
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isPlayerTooClose' },
            { kind: 'action', actionId: 'fleeFromThreat' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isHealthBelowFleeThreshold' },
            { kind: 'action', actionId: 'fleeFromThreat' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isHungerAtLeastHungry' },
            { kind: 'action', actionId: 'graze' },
          ],
        },
        { kind: 'action', actionId: 'wander' },
      ],
    },
  };

const DEFINING_WILDLIFE_RETALIATOR_TREE: DefiningWildlifeBehaviorTreeDefinition =
  {
    temperamentId: 'retaliator',
    root: {
      kind: 'selector',
      children: [
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
            { kind: 'action', actionId: 'meleeAttack' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
            { kind: 'action', actionId: 'chaseTarget' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isHungerAtLeastHungry' },
            { kind: 'action', actionId: 'graze' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isMotivatedToHunt' },
            { kind: 'condition', conditionId: 'hasHuntablePreyNearby' },
            { kind: 'action', actionId: 'chaseTarget' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isMotivatedToForageGroundFood' },
            { kind: 'condition', conditionId: 'hasEdibleGroundFoodNearby' },
            { kind: 'action', actionId: 'forageGroundFood' },
          ],
        },
        { kind: 'action', actionId: 'wander' },
      ],
    },
  };

const DEFINING_WILDLIFE_PREDATOR_TREE: DefiningWildlifeBehaviorTreeDefinition =
  {
    temperamentId: 'predator',
    root: {
      kind: 'selector',
      children: [
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isBeyondLeashDistance' },
            { kind: 'action', actionId: 'returnToLeashAnchor' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
            { kind: 'action', actionId: 'meleeAttack' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
            { kind: 'action', actionId: 'chaseTarget' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isMotivatedToHunt' },
            { kind: 'condition', conditionId: 'hasHuntablePreyNearby' },
            { kind: 'action', actionId: 'chaseTarget' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isMotivatedToForageGroundFood' },
            { kind: 'condition', conditionId: 'hasEdibleGroundFoodNearby' },
            { kind: 'action', actionId: 'forageGroundFood' },
          ],
        },
        { kind: 'action', actionId: 'wander' },
      ],
    },
  };

const DEFINING_WILDLIFE_AMBUSHER_TREE: DefiningWildlifeBehaviorTreeDefinition =
  {
    temperamentId: 'ambusher',
    root: {
      kind: 'selector',
      children: [
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
            { kind: 'action', actionId: 'meleeAttack' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isPlayerWithinAggroRadius' },
            { kind: 'action', actionId: 'meleeAttack' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isMotivatedToHunt' },
            { kind: 'condition', conditionId: 'hasHuntablePreyNearby' },
            { kind: 'action', actionId: 'chaseTarget' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isMotivatedToForageGroundFood' },
            { kind: 'condition', conditionId: 'hasEdibleGroundFoodNearby' },
            { kind: 'action', actionId: 'forageGroundFood' },
          ],
        },
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isNearWater' },
            { kind: 'action', actionId: 'idleNearWater' },
          ],
        },
        { kind: 'action', actionId: 'wander' },
      ],
    },
  };

export const DEFINING_WILDLIFE_BEHAVIOR_TREE_REGISTRY: Record<
  DefiningWildlifeTemperamentId,
  DefiningWildlifeBehaviorTreeDefinition
> = {
  passive: DEFINING_WILDLIFE_PASSIVE_TREE,
  skittish: DEFINING_WILDLIFE_SKITTISH_TREE,
  retaliator: DEFINING_WILDLIFE_RETALIATOR_TREE,
  predator: DEFINING_WILDLIFE_PREDATOR_TREE,
  ambusher: DEFINING_WILDLIFE_AMBUSHER_TREE,
};

export function resolvingWildlifeBehaviorTree(
  temperamentId: DefiningWildlifeTemperamentId
): DefiningWildlifeBehaviorTreeDefinition {
  return DEFINING_WILDLIFE_BEHAVIOR_TREE_REGISTRY[temperamentId];
}
