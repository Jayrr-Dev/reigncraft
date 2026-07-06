/**
 * Pure behavior tree evaluator for wildlife AI.
 *
 * @module components/world/wildlife/domains/advancingWildlifeBehaviorTick
 */

import { resolvingWildlifeBehaviorActionIntent } from '@/components/world/wildlife/domains/definingWildlifeBehaviorActionRegistry';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { checkingWildlifeBehaviorCondition } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { resolvingWildlifeBehaviorTree } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeRegistry';
import type { DefiningWildlifeBehaviorTreeNode } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function evaluatingWildlifeBehaviorSequence(
  children: readonly DefiningWildlifeBehaviorTreeNode[],
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent | null {
  for (const child of children) {
    if (child.kind === 'condition') {
      if (!checkingWildlifeBehaviorCondition(child.conditionId, blackboard)) {
        return null;
      }

      continue;
    }

    const childResult = evaluatingWildlifeBehaviorNode(child, blackboard);

    if (!childResult) {
      return null;
    }

    if (child.kind === 'action') {
      return childResult;
    }
  }

  return null;
}

function evaluatingWildlifeBehaviorSelector(
  children: readonly DefiningWildlifeBehaviorTreeNode[],
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent | null {
  for (const child of children) {
    const childResult = evaluatingWildlifeBehaviorNode(child, blackboard);

    if (childResult) {
      return childResult;
    }
  }

  return null;
}

function evaluatingWildlifeBehaviorNode(
  node: DefiningWildlifeBehaviorTreeNode,
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent | null {
  if (node.kind === 'condition') {
    return checkingWildlifeBehaviorCondition(node.conditionId, blackboard)
      ? { mode: 'idle' }
      : null;
  }

  if (node.kind === 'action') {
    return resolvingWildlifeBehaviorActionIntent(node.actionId, blackboard);
  }

  if (node.kind === 'sequence') {
    return evaluatingWildlifeBehaviorSequence(node.children, blackboard);
  }

  if (node.kind === 'selector') {
    return evaluatingWildlifeBehaviorSelector(node.children, blackboard);
  }

  return null;
}

/**
 * Evaluates the temperament behavior tree and returns the winning intent.
 */
export function advancingWildlifeBehaviorTick(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  if (blackboard.instance.isDead) {
    return { mode: 'idle' };
  }

  const tree = resolvingWildlifeBehaviorTree(blackboard.species.temperamentId);
  const intent = evaluatingWildlifeBehaviorNode(tree.root, blackboard);

  return intent ?? { mode: 'idle' };
}
