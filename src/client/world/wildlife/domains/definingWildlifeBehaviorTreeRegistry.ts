/**
 * Behavior tree registry: one tree per temperament.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorTreeRegistry
 */

import type {
  DefiningWildlifeBehaviorTreeDefinition,
  DefiningWildlifeBehaviorTreeNode,
  DefiningWildlifeBehaviorTreeSequenceNode,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Finish a bluff charge by walking back to the charge origin. */
const DEFINING_WILDLIFE_BLUFF_RETURN_BRANCHES = [
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'isCompletingBluffReturn' },
      { kind: 'action', actionId: 'returnToBluffOrigin' },
    ],
  },
] as const satisfies readonly DefiningWildlifeBehaviorTreeNode[];

/** Retaliate branches shared by passive and skittish aggressive herbivore spawns. */
const DEFINING_WILDLIFE_AGGRESSIVE_HERBIVORE_FIGHT_BRANCHES = [
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'isAggressiveHerbivoreMayFight' },
      { kind: 'action', actionId: 'meleeAttack' },
    ],
  },
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'isAggressiveHerbivoreMayFight' },
      { kind: 'action', actionId: 'chaseTarget' },
    ],
  },
] as const satisfies DefiningWildlifeBehaviorTreeSequenceNode['children'];

/** Territory warn before combat (native retaliators/predators + pissed herbivores). */
const DEFINING_WILDLIFE_TERRITORY_WARN_BRANCHES = [
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'shouldTerritoryWarn' },
      { kind: 'action', actionId: 'warnTerritoryIntruder' },
    ],
  },
] as const satisfies DefiningWildlifeBehaviorTreeSequenceNode['children'];

/** Adults defending a hurt baby chase/attack even on passive/skittish trees. */
const DEFINING_WILDLIFE_DEFEND_YOUNG_FIGHT_BRANCHES = [
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'isDefendingYoung' },
      { kind: 'action', actionId: 'meleeAttack' },
    ],
  },
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'isDefendingYoung' },
      { kind: 'action', actionId: 'chaseTarget' },
    ],
  },
] as const satisfies DefiningWildlifeBehaviorTreeSequenceNode['children'];

/** Young (σ ≤ −1) run back to larger same-species animals when they drift away. */
const DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES = [
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'hasSeparationAnxiety' },
      { kind: 'action', actionId: 'followGuardian' },
    ],
  },
] as const satisfies DefiningWildlifeBehaviorTreeSequenceNode['children'];

/** Social hunters under min pack size run toward packmates before hunting. */
const DEFINING_WILDLIFE_SOCIAL_HUNTER_SEEK_PACK_BRANCHES = [
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'hasSeekPack' },
      { kind: 'action', actionId: 'seekPackmate' },
    ],
  },
] as const satisfies DefiningWildlifeBehaviorTreeSequenceNode['children'];

/** Predators strike or chase prey that wanders within close range. */
const DEFINING_WILDLIFE_PROXIMITY_PREY_ATTACK_BRANCHES = [
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'hasHuntablePreyInProximity' },
      { kind: 'action', actionId: 'meleeAttack' },
    ],
  },
  {
    kind: 'sequence',
    children: [
      { kind: 'condition', conditionId: 'hasHuntablePreyInProximity' },
      { kind: 'action', actionId: 'chaseTarget' },
    ],
  },
] as const satisfies DefiningWildlifeBehaviorTreeSequenceNode['children'];

/**
 * Friendliest stock: graze and wander. Never opens combat on the player
 * (no aggressive-herbivore fight / territory warn). Still flees when hurt and
 * may defend young. Cats and dogs cannot be attacked; pet them for study.
 */
const DEFINING_WILDLIFE_DOCILE_TREE: DefiningWildlifeBehaviorTreeDefinition = {
  temperamentId: 'docile',
  root: {
    kind: 'selector',
    children: [
      ...DEFINING_WILDLIFE_DEFEND_YOUNG_FIGHT_BRANCHES,
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
          { kind: 'condition', conditionId: 'isDocileFollowingPlayer' },
          { kind: 'action', actionId: 'followPlayer' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'shouldDocileApproachReact' },
          { kind: 'action', actionId: 'docileApproachReact' },
        ],
      },
      ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isHungerAtLeastHungry' },
          { kind: 'condition', conditionId: 'hasEdibleGroundFoodNearby' },
          { kind: 'action', actionId: 'forageGroundFood' },
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

const DEFINING_WILDLIFE_PASSIVE_TREE: DefiningWildlifeBehaviorTreeDefinition = {
  temperamentId: 'passive',
  root: {
    kind: 'selector',
    children: [
      ...DEFINING_WILDLIFE_DEFEND_YOUNG_FIGHT_BRANCHES,
      ...DEFINING_WILDLIFE_AGGRESSIVE_HERBIVORE_FIGHT_BRANCHES,
      ...DEFINING_WILDLIFE_TERRITORY_WARN_BRANCHES,
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isHealthBelowFleeThreshold' },
          { kind: 'action', actionId: 'fleeFromThreat' },
        ],
      },
      ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isHungerAtLeastHungry' },
          { kind: 'condition', conditionId: 'hasEdibleGroundFoodNearby' },
          { kind: 'action', actionId: 'forageGroundFood' },
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
        ...DEFINING_WILDLIFE_DEFEND_YOUNG_FIGHT_BRANCHES,
        ...DEFINING_WILDLIFE_AGGRESSIVE_HERBIVORE_FIGHT_BRANCHES,
        ...DEFINING_WILDLIFE_TERRITORY_WARN_BRANCHES,
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
        ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
        {
          kind: 'sequence',
          children: [
            { kind: 'condition', conditionId: 'isHungerAtLeastHungry' },
            { kind: 'condition', conditionId: 'hasEdibleGroundFoodNearby' },
            { kind: 'action', actionId: 'forageGroundFood' },
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
        ...DEFINING_WILDLIFE_BLUFF_RETURN_BRANCHES,
        ...DEFINING_WILDLIFE_PROXIMITY_PREY_ATTACK_BRANCHES,
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
        ...DEFINING_WILDLIFE_TERRITORY_WARN_BRANCHES,
        ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
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
        // Hunt / combat first so a chase past the leash still commits.
        // Leash return only runs when nothing is left to fight or hunt.
        ...DEFINING_WILDLIFE_PROXIMITY_PREY_ATTACK_BRANCHES,
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
        ...DEFINING_WILDLIFE_TERRITORY_WARN_BRANCHES,
        ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
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
            { kind: 'condition', conditionId: 'isBeyondLeashDistance' },
            { kind: 'action', actionId: 'returnToLeashAnchor' },
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
        ...DEFINING_WILDLIFE_PROXIMITY_PREY_ATTACK_BRANCHES,
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
        ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
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

const DEFINING_WILDLIFE_PACK_HUNTER_TREE: DefiningWildlifeBehaviorTreeDefinition = {
  temperamentId: 'pack_hunter',
  root: {
    kind: 'selector',
    children: [
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isStalkPackFleeing' },
          { kind: 'action', actionId: 'fleeFromThreat' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
          { kind: 'condition', conditionId: 'isStalkKillWindowOpen' },
          { kind: 'condition', conditionId: 'isStalkPackSurroundCommit' },
          { kind: 'action', actionId: 'surroundAndAttackPrey' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
          { kind: 'condition', conditionId: 'isStalkKillWindowOpen' },
          { kind: 'condition', conditionId: 'isStalkPackmateMayAttackPrey' },
          { kind: 'action', actionId: 'meleeAttack' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
          { kind: 'condition', conditionId: 'isStalkKillWindowOpen' },
          { kind: 'condition', conditionId: 'isStalkPackmateMayAttackPrey' },
          { kind: 'action', actionId: 'chaseTarget' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
          { kind: 'condition', conditionId: 'isStalkConfidentFormingUp' },
          { kind: 'action', actionId: 'surroundAndAttackPrey' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isStalkingPrey' },
          { kind: 'action', actionId: 'stalkPrey' },
        ],
      },
      ...DEFINING_WILDLIFE_SOCIAL_HUNTER_SEEK_PACK_BRANCHES,
      ...DEFINING_WILDLIFE_PROXIMITY_PREY_ATTACK_BRANCHES,
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
      ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
      { kind: 'action', actionId: 'wander' },
    ],
  },
};

/** Solo stalk: shadow, wait for weakness or hungry/aggressive patience, then rush. */
const DEFINING_WILDLIFE_STALKER_TREE: DefiningWildlifeBehaviorTreeDefinition = {
  temperamentId: 'stalker',
  root: {
    kind: 'selector',
    children: [
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isStalkPackFleeing' },
          { kind: 'action', actionId: 'fleeFromThreat' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
          { kind: 'condition', conditionId: 'isStalkKillWindowOpen' },
          { kind: 'action', actionId: 'meleeAttack' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'hasActiveThreatTarget' },
          { kind: 'condition', conditionId: 'isStalkKillWindowOpen' },
          { kind: 'action', actionId: 'chaseTarget' },
        ],
      },
      {
        kind: 'sequence',
        children: [
          { kind: 'condition', conditionId: 'isStalkingPrey' },
          { kind: 'action', actionId: 'stalkPrey' },
        ],
      },
      ...DEFINING_WILDLIFE_PROXIMITY_PREY_ATTACK_BRANCHES,
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
      ...DEFINING_WILDLIFE_SEPARATION_ANXIETY_BRANCHES,
      { kind: 'action', actionId: 'wander' },
    ],
  },
};

export const DEFINING_WILDLIFE_BEHAVIOR_TREE_REGISTRY: Record<
  DefiningWildlifeTemperamentId,
  DefiningWildlifeBehaviorTreeDefinition
> = {
  docile: DEFINING_WILDLIFE_DOCILE_TREE,
  passive: DEFINING_WILDLIFE_PASSIVE_TREE,
  skittish: DEFINING_WILDLIFE_SKITTISH_TREE,
  retaliator: DEFINING_WILDLIFE_RETALIATOR_TREE,
  predator: DEFINING_WILDLIFE_PREDATOR_TREE,
  ambusher: DEFINING_WILDLIFE_AMBUSHER_TREE,
  pack_hunter: DEFINING_WILDLIFE_PACK_HUNTER_TREE,
  stalker: DEFINING_WILDLIFE_STALKER_TREE,
};

export function resolvingWildlifeBehaviorTree(
  temperamentId: DefiningWildlifeTemperamentId
): DefiningWildlifeBehaviorTreeDefinition {
  return DEFINING_WILDLIFE_BEHAVIOR_TREE_REGISTRY[temperamentId];
}
