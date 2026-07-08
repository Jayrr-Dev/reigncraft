/**
 * Pure dot-path helpers for hierarchical states.
 *
 * State identity is the full dot path (`alive.idle`), so ancestry, least
 * common ancestors, and wildcard matching are all string computations with
 * no hidden state.
 *
 * @module lib/stateMachine/resolvingStateMachineStatePath
 */

import type {
  DefiningStateMachineDefinition,
  DefiningStateMachineFromPattern,
  DefiningStateMachineStateId,
} from '@/lib/stateMachine/definingStateMachineTypes';

/** `alive.idle` -> `['alive', 'alive.idle']` (root ancestor first). */
export function listingStateMachineAncestorChain(
  stateId: DefiningStateMachineStateId
): DefiningStateMachineStateId[] {
  const segments = stateId.split('.');
  const chain: DefiningStateMachineStateId[] = [];

  for (let index = 0; index < segments.length; index += 1) {
    chain.push(segments.slice(0, index + 1).join('.'));
  }

  return chain;
}

/**
 * Deepest state path shared by both inputs, or null when they live in
 * disjoint subtrees.
 */
export function resolvingStateMachineCommonAncestor(
  left: DefiningStateMachineStateId,
  right: DefiningStateMachineStateId
): DefiningStateMachineStateId | null {
  const leftChain = listingStateMachineAncestorChain(left);
  const rightChain = listingStateMachineAncestorChain(right);
  let common: DefiningStateMachineStateId | null = null;

  for (
    let index = 0;
    index < Math.min(leftChain.length, rightChain.length);
    index += 1
  ) {
    if (leftChain[index] !== rightChain[index]) {
      break;
    }

    common = leftChain[index] ?? null;
  }

  return common;
}

/**
 * Whether a transition `from` pattern matches the active state. Patterns:
 * `*` matches everything, `alive.*` matches `alive` and anything under it,
 * anything else must match the state or one of its ancestors exactly
 * (so a transition from `alive` also fires while in `alive.idle`).
 */
export function checkingStateMachinePatternMatchesState(
  pattern: DefiningStateMachineFromPattern,
  stateId: DefiningStateMachineStateId
): boolean {
  if (pattern === '*') {
    return true;
  }

  if (pattern.endsWith('.*')) {
    const prefix = pattern.slice(0, -2);

    return stateId === prefix || stateId.startsWith(`${prefix}.`);
  }

  return listingStateMachineAncestorChain(stateId).includes(pattern);
}

/**
 * Pattern specificity for tie-breaking: exact paths beat subtree wildcards,
 * which beat `*`, and deeper patterns beat shallower ones.
 */
export function computingStateMachinePatternSpecificity(
  pattern: DefiningStateMachineFromPattern
): number {
  if (pattern === '*') {
    return 0;
  }

  const depth = pattern.split('.').length;

  return pattern.endsWith('.*') ? depth * 2 - 1 : depth * 2;
}

/**
 * Drills into compound states until an enterable leaf is reached. A compound
 * `initial` may be a child segment (`idle`) or a full path (`alive.idle`).
 */
export function resolvingStateMachineLeafState(
  definition: DefiningStateMachineDefinition,
  stateId: DefiningStateMachineStateId
): DefiningStateMachineStateId {
  let current = stateId;

  for (let guardCounter = 0; guardCounter < 64; guardCounter += 1) {
    const node = definition.states[current];

    if (!node || node.initial === undefined) {
      return current;
    }

    const asChildPath = `${current}.${node.initial}`;
    current = definition.states[asChildPath] ? asChildPath : node.initial;
  }

  return current;
}
