/**
 * Save/load for runtime snapshots. Hydration checks the definition version
 * and current-state validity so stale saves fall back to a fresh start
 * instead of resuming in a state that no longer exists.
 *
 * @module lib/stateMachine/serializingStateMachineSnapshot
 */

import type {
  DefiningStateMachineDefinition,
  DefiningStateMachineSnapshot,
} from '@/lib/stateMachine/definingStateMachineTypes';

export function serializingStateMachineSnapshot(
  snapshot: DefiningStateMachineSnapshot
): string {
  return JSON.stringify(snapshot);
}

export type HydratingStateMachineSnapshotResult =
  | { ok: true; snapshot: DefiningStateMachineSnapshot }
  | { ok: false; reason: string };

export function hydratingStateMachineSnapshot(
  serialized: string,
  definition: DefiningStateMachineDefinition
): HydratingStateMachineSnapshotResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(serialized);
  } catch {
    return { ok: false, reason: 'snapshot is not valid JSON' };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, reason: 'snapshot must be an object' };
  }

  const raw: Record<string, unknown> = { ...parsed };

  if (
    typeof raw.machineId !== 'string' ||
    typeof raw.definitionVersion !== 'number' ||
    typeof raw.currentState !== 'string' ||
    typeof raw.stateTimeMs !== 'number' ||
    (raw.previousState !== null && typeof raw.previousState !== 'string')
  ) {
    return { ok: false, reason: 'snapshot fields are malformed' };
  }

  if (raw.machineId !== definition.id) {
    return {
      ok: false,
      reason: `snapshot belongs to '${raw.machineId}', not '${definition.id}'`,
    };
  }

  if (raw.definitionVersion !== (definition.version ?? 1)) {
    return {
      ok: false,
      reason: `snapshot version ${raw.definitionVersion} does not match definition version ${definition.version ?? 1}`,
    };
  }

  if (!definition.states[raw.currentState]) {
    return {
      ok: false,
      reason: `snapshot state '${raw.currentState}' no longer exists`,
    };
  }

  return {
    ok: true,
    snapshot: {
      machineId: raw.machineId,
      definitionVersion: raw.definitionVersion,
      currentState: raw.currentState,
      previousState: raw.previousState === null ? null : raw.previousState,
      stateTimeMs: raw.stateTimeMs,
    },
  };
}
