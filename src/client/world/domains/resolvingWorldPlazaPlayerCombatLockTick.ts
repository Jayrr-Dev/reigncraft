/**
 * Pure resolver for one player combat lock-on tick.
 *
 * @module components/world/domains/resolvingWorldPlazaPlayerCombatLockTick
 */

import {
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CHASE_REPLAN_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CHASE_REPLAN_MOVE_GRID,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_MELEE_REACH_GRID,
} from '@/components/world/domains/definingWorldPlazaPlayerCombatLockConstants';
import type { DefiningWorldPlazaPlayerCombatLockState } from '@/components/world/domains/definingWorldPlazaPlayerCombatLockTypes';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

export type ResolvingWorldPlazaPlayerCombatLockTickTarget = {
  readonly instanceId: string;
  readonly position: { readonly x: number; readonly y: number };
  readonly isDead: boolean;
};

export type ResolvingWorldPlazaPlayerCombatLockTickParams = {
  readonly lock: DefiningWorldPlazaPlayerCombatLockState;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly target: ResolvingWorldPlazaPlayerCombatLockTickTarget | null;
  readonly nowMs: number;
  /** True while a melee strip is still playing. */
  readonly isMeleeBusy: boolean;
  /** True while Attack? confirm is open (pause auto-swing). */
  readonly isDocileConfirmPending: boolean;
  /** True when a click/chase walk target is already active. */
  readonly hasActiveWalk: boolean;
};

export type ResolvingWorldPlazaPlayerCombatLockTickResult =
  | { readonly kind: 'clear' }
  | { readonly kind: 'hold' }
  | {
      readonly kind: 'chase';
      readonly destination: DefiningWorldPlazaWorldPoint;
      readonly shouldReplan: boolean;
    }
  | {
      readonly kind: 'swing';
      readonly targetGridX: number;
      readonly targetGridY: number;
      readonly targetInstanceId: string;
    };

/**
 * Decides clear / hold / chase / swing for the current combat lock.
 */
export function resolvingWorldPlazaPlayerCombatLockTick({
  lock,
  playerPosition,
  target,
  nowMs,
  isMeleeBusy,
  isDocileConfirmPending,
  hasActiveWalk,
}: ResolvingWorldPlazaPlayerCombatLockTickParams): ResolvingWorldPlazaPlayerCombatLockTickResult {
  if (!target || target.isDead || target.instanceId !== lock.targetInstanceId) {
    return { kind: 'clear' };
  }

  const distanceGrid = Math.hypot(
    target.position.x - playerPosition.x,
    target.position.y - playerPosition.y
  );

  if (distanceGrid > DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_MELEE_REACH_GRID) {
    const destination = {
      x: target.position.x,
      y: target.position.y,
    };
    const movedSinceReplan = Math.hypot(
      target.position.x - lock.lastChaseGridX,
      target.position.y - lock.lastChaseGridY
    );
    const replanDue =
      !hasActiveWalk ||
      nowMs - lock.lastChaseReplanAtMs >=
        DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CHASE_REPLAN_INTERVAL_MS ||
      movedSinceReplan >=
        DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CHASE_REPLAN_MOVE_GRID;

    return {
      kind: 'chase',
      destination,
      shouldReplan: replanDue,
    };
  }

  if (isMeleeBusy || isDocileConfirmPending) {
    return { kind: 'hold' };
  }

  return {
    kind: 'swing',
    targetGridX: target.position.x,
    targetGridY: target.position.y,
    targetInstanceId: target.instanceId,
  };
}
