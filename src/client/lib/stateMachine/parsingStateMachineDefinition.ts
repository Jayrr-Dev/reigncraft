/**
 * Loads a definition from untyped data (parsed JSON/YAML, editor output,
 * remote config) into the typed domain shape, rejecting malformed input
 * instead of casting.
 *
 * @module lib/stateMachine/parsingStateMachineDefinition
 */

import type {
  DefiningStateMachineDefinition,
  DefiningStateMachineStateNode,
  DefiningStateMachineTransition,
} from '@/lib/stateMachine/definingStateMachineTypes';

export type ParsingStateMachineDefinitionResult =
  | { ok: true; definition: DefiningStateMachineDefinition }
  | { ok: false; errors: string[] };

function checkingIsRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readingStringArray(
  value: unknown,
  where: string,
  errors: string[]
): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== 'string')
  ) {
    errors.push(`${where} must be an array of strings`);

    return undefined;
  }

  return value.filter((entry): entry is string => typeof entry === 'string');
}

function readingStateNode(
  value: unknown,
  where: string,
  errors: string[]
): DefiningStateMachineStateNode | null {
  if (!checkingIsRecord(value)) {
    errors.push(`${where} must be an object`);

    return null;
  }

  const raw = value;
  const node: DefiningStateMachineStateNode = {};

  if (raw.kind !== undefined) {
    if (raw.kind === 'atomic' || raw.kind === 'compound' || raw.kind === 'final') {
      node.kind = raw.kind;
    } else {
      errors.push(`${where}.kind must be 'atomic', 'compound', or 'final'`);
    }
  }

  if (raw.initial !== undefined) {
    if (typeof raw.initial === 'string') {
      node.initial = raw.initial;
    } else {
      errors.push(`${where}.initial must be a string`);
    }
  }

  const onEnter = readingStringArray(raw.onEnter, `${where}.onEnter`, errors);
  const onExit = readingStringArray(raw.onExit, `${where}.onExit`, errors);
  const onUpdate = readingStringArray(
    raw.onUpdate,
    `${where}.onUpdate`,
    errors
  );

  if (onEnter) {
    node.onEnter = onEnter;
  }

  if (onExit) {
    node.onExit = onExit;
  }

  if (onUpdate) {
    node.onUpdate = onUpdate;
  }

  return node;
}

function readingTransition(
  value: unknown,
  where: string,
  errors: string[]
): DefiningStateMachineTransition | null {
  if (!checkingIsRecord(value)) {
    errors.push(`${where} must be an object`);

    return null;
  }

  const raw = value;

  if (typeof raw.from !== 'string' || typeof raw.to !== 'string') {
    errors.push(`${where} requires string 'from' and 'to'`);

    return null;
  }

  const transition: DefiningStateMachineTransition = {
    from: raw.from,
    to: raw.to,
  };

  if (raw.event !== undefined) {
    if (typeof raw.event === 'string') {
      transition.event = raw.event;
    } else {
      errors.push(`${where}.event must be a string`);
    }
  }

  if (raw.guard !== undefined) {
    if (typeof raw.guard === 'string') {
      transition.guard = raw.guard;
    } else {
      errors.push(`${where}.guard must be a string`);
    }
  }

  if (raw.priority !== undefined) {
    if (typeof raw.priority === 'number') {
      transition.priority = raw.priority;
    } else {
      errors.push(`${where}.priority must be a number`);
    }
  }

  const actions = readingStringArray(raw.actions, `${where}.actions`, errors);

  if (actions) {
    transition.actions = actions;
  }

  return transition;
}

export function parsingStateMachineDefinition(
  data: unknown
): ParsingStateMachineDefinitionResult {
  const errors: string[] = [];

  if (!checkingIsRecord(data)) {
    return { ok: false, errors: ['definition must be an object'] };
  }

  const raw = data;

  if (typeof raw.id !== 'string') {
    errors.push(`'id' must be a string`);
  }

  if (typeof raw.initial !== 'string') {
    errors.push(`'initial' must be a string`);
  }

  if (raw.version !== undefined && typeof raw.version !== 'number') {
    errors.push(`'version' must be a number`);
  }

  const states: Record<string, DefiningStateMachineStateNode> = {};

  if (!checkingIsRecord(raw.states)) {
    errors.push(`'states' must be an object`);
  } else {
    for (const [stateId, nodeValue] of Object.entries(raw.states)) {
      const node = readingStateNode(nodeValue, `states['${stateId}']`, errors);

      if (node) {
        states[stateId] = node;
      }
    }
  }

  const transitions: DefiningStateMachineTransition[] = [];

  if (!Array.isArray(raw.transitions)) {
    errors.push(`'transitions' must be an array`);
  } else {
    for (const [index, entry] of raw.transitions.entries()) {
      const transition = readingTransition(
        entry,
        `transitions[${index}]`,
        errors
      );

      if (transition) {
        transitions.push(transition);
      }
    }
  }

  if (
    errors.length > 0 ||
    typeof raw.id !== 'string' ||
    typeof raw.initial !== 'string'
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    definition: {
      id: raw.id,
      ...(typeof raw.version === 'number' ? { version: raw.version } : {}),
      initial: raw.initial,
      states,
      transitions,
    },
  };
}
