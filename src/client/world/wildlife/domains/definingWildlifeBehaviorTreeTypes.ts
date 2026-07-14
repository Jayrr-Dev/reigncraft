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
  | 'hasHuntablePreyInProximity'
  | 'hasEdibleGroundFoodNearby'
  | 'isWillingToForageSelectedGroundFood'
  | 'hasFavoriteGroundFoodNearby'
  | 'isHealthBelowFleeThreshold'
  | 'isPlayerTooClose'
  | 'isAggressiveHerbivoreMayFight'
  | 'isDefendingYoung'
  | 'hasSeparationAnxiety'
  | 'hasSeekPack'
  | 'isDocileFollowingPlayer'
  | 'shouldDocileApproachReact'
  | 'isNearWater'
  | 'isBeyondLeashDistance'
  | 'isCompletingBluffReturn'
  | 'shouldTerritoryWarn'
  | 'isStalkKillWindowOpen'
  | 'isStalkingPrey'
  | 'isStalkPackSurroundCommit'
  | 'isStalkPackFleeing'
  | 'isStalkPackmateMayAttackPrey'
  | 'isStalkConfidentFormingUp';

export type DefiningWildlifeBehaviorActionId =
  | 'fleeFromThreat'
  | 'chaseTarget'
  | 'followGuardian'
  | 'seekPackmate'
  | 'followPlayer'
  | 'docileApproachReact'
  | 'meleeAttack'
  | 'graze'
  | 'forageGroundFood'
  | 'wander'
  | 'idleNearWater'
  | 'returnToLeashAnchor'
  | 'returnToBluffOrigin'
  | 'warnTerritoryIntruder'
  | 'stalkPrey'
  | 'surroundAndAttackPrey';

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
