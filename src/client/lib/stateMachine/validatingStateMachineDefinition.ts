/**
 * Static definition checks, usable at load time and in tests. Registry-aware
 * checks (missing guards/actions) are included so a bounded context can
 * verify its vocabulary covers everything the definition references.
 *
 * @module lib/stateMachine/validatingStateMachineDefinition
 */

import type {
  DefiningStateMachineDefinition,
  DefiningStateMachineRegistry,
} from '@/lib/stateMachine/definingStateMachineTypes';
import { resolvingStateMachineLeafState } from '@/lib/stateMachine/resolvingStateMachineStatePath';

export type ValidatingStateMachineIssue = {
  severity: 'error' | 'warning';
  message: string;
};

export function validatingStateMachineDefinition<TContext, TCommand>(
  definition: DefiningStateMachineDefinition,
  registry?: DefiningStateMachineRegistry<TContext, TCommand>
): ValidatingStateMachineIssue[] {
  const issues: ValidatingStateMachineIssue[] = [];
  const stateIds = new Set(Object.keys(definition.states));

  const checkingStateExists = (stateId: string, where: string): void => {
    if (!stateIds.has(stateId)) {
      issues.push({
        severity: 'error',
        message: `${where} references unknown state '${stateId}'`,
      });
    }
  };

  checkingStateExists(definition.initial, `initial of '${definition.id}'`);

  const initialLeaf = resolvingStateMachineLeafState(
    definition,
    definition.initial
  );
  const initialNode = definition.states[initialLeaf];

  if (initialNode?.initial !== undefined) {
    issues.push({
      severity: 'error',
      message: `initial chain from '${definition.initial}' does not reach a leaf (stuck at '${initialLeaf}')`,
    });
  }

  for (const [stateId, node] of Object.entries(definition.states)) {
    if (node.initial !== undefined) {
      const childPath = `${stateId}.${node.initial}`;

      if (!stateIds.has(childPath) && !stateIds.has(node.initial)) {
        issues.push({
          severity: 'error',
          message: `compound state '${stateId}' has unknown initial '${node.initial}'`,
        });
      }
    }

    const parentPath = stateId.split('.').slice(0, -1).join('.');

    if (parentPath && !stateIds.has(parentPath)) {
      issues.push({
        severity: 'warning',
        message: `state '${stateId}' has no declared parent '${parentPath}'; enter/exit actions for that level will be skipped`,
      });
    }
  }

  for (const [index, transition] of definition.transitions.entries()) {
    const where = `transition[${index}] (${transition.from} -> ${transition.to})`;

    checkingStateExists(transition.to, where);

    if (transition.from !== '*' && !transition.from.endsWith('.*')) {
      checkingStateExists(transition.from, where);
    }

    if (transition.event === undefined && transition.guard === undefined) {
      issues.push({
        severity: 'warning',
        message: `${where} is eventless with no guard; it will fire on every tick`,
      });
    }

    if (registry) {
      if (
        transition.guard !== undefined &&
        !registry.guards[transition.guard]
      ) {
        issues.push({
          severity: 'error',
          message: `${where} references unregistered guard '${transition.guard}'`,
        });
      }

      for (const actionId of transition.actions ?? []) {
        if (!registry.actions[actionId]) {
          issues.push({
            severity: 'error',
            message: `${where} references unregistered action '${actionId}'`,
          });
        }
      }
    }
  }

  if (registry) {
    for (const [stateId, node] of Object.entries(definition.states)) {
      for (const actionId of [
        ...(node.onEnter ?? []),
        ...(node.onExit ?? []),
        ...(node.onUpdate ?? []),
      ]) {
        if (!registry.actions[actionId]) {
          issues.push({
            severity: 'error',
            message: `state '${stateId}' references unregistered action '${actionId}'`,
          });
        }
      }
    }
  }

  return issues;
}
