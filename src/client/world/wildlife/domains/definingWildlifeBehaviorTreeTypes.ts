/**
 * Declarative behavior tree node types for wildlife AI.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes
 */

export type DefiningWildlifeBehaviorConditionId =
  | 'isDead'
  | 'hasActiveThreatTarget'
  | 'isPlayerWithinAggroRadius'
  | 'isHungerAtLeastHungry'
  | 'isHungerStarving'
  | 'isMotivatedToHunt'
  | 'isMotivatedToForageGroundFood'
  | 'hasHuntablePreyNearby'
  | 'hasEdibleGroundFoodNearby'
  | 'isHealthBelowFleeThreshold'
  | 'isPlayerTooClose'
  | 'isAggressiveHerbivoreMayFight'
  | 'isNearWater'
  | 'isBeyondLeashDistance';

export type DefiningWildlifeBehaviorActionId =
  | 'fleeFromThreat'
  | 'chaseTarget'
  | 'meleeAttack'
  | 'graze'
  | 'forageGroundFood'
  | 'wander'
  | 'idleNearWater'
  | 'returnToLeashAnchor';

export type DefiningWildlifeBehaviorTreeConditionNode = {
  kind: 'condition';
  conditionId: DefiningWildlifeBehaviorConditionId;
};

export type DefiningWildlifeBehaviorTreeActionNode = {
  kind: 'action';
  actionId: DefiningWildlifeBehaviorActionId;
};

export type DefiningWildlifeBehaviorTreeSelectorNode = {
  kind: 'selector';
  children: readonly DefiningWildlifeBehaviorTreeNode[];
};

export type DefiningWildlifeBehaviorTreeSequenceNode = {
  kind: 'sequence';
  children: readonly DefiningWildlifeBehaviorTreeNode[];
};

export type DefiningWildlifeBehaviorTreeNode =
  | DefiningWildlifeBehaviorTreeConditionNode
  | DefiningWildlifeBehaviorTreeActionNode
  | DefiningWildlifeBehaviorTreeSelectorNode
  | DefiningWildlifeBehaviorTreeSequenceNode;

export type DefiningWildlifeBehaviorTreeDefinition = {
  temperamentId: string;
  root: DefiningWildlifeBehaviorTreeNode;
};
