/**
 * Stalker hunt phase union, events, and machine state shape.
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkPhaseTypes
 */

/** Explicit hunt phase for stalker-temperament wildlife. */
export type DefiningWildlifeStalkPhase =
  | 'idle'
  | 'shadowing'
  | 'retreating'
  | 'regrouping'
  | 'formingUp'
  | 'surrounding'
  | 'attacking'
  | 'fleeing';

/** Events that may transition the stalk phase machine. */
export type DefiningWildlifeStalkEventKind =
  | 'TARGET_ACQUIRED'
  | 'PLAYER_APPROACH_NOTICED'
  | 'RETREAT_DONE_ROLL_FLEE'
  | 'RETREAT_DONE_ROLL_ENRAGE'
  | 'RETREAT_DONE_ROLL_REGROUP'
  | 'REGROUP_DISTANCE_REACHED'
  | 'PACK_CONFIDENT'
  | 'PACK_THINNED'
  | 'FORMATION_TIMER_DONE'
  | 'KILL_WINDOW_PLUS_PACK'
  | 'KILL_WINDOW_OPEN'
  | 'SLOT_REACHED_OR_ALPHA_COMMIT'
  | 'ATTACK_TIMEOUT_10S'
  | 'DAMAGED_ROLL_FLEE'
  | 'DAMAGED_ROLL_ENRAGE'
  | 'STALK_TIMEOUT_2MIN'
  | 'FLEE_DISTANCE_REACHED'
  | 'TARGET_DEAD_OR_LOST'
  | 'ALPHA_DIED'
  | 'ATTACK_COMMITTED';

/** Default phase when no hunt is active. */
export const DEFINING_WILDLIFE_STALK_PHASE_IDLE: DefiningWildlifeStalkPhase =
  'idle';

/** Phases where the hunter is quietly trailing prey. */
export const DEFINING_WILDLIFE_STALK_SHADOWING_PHASES: readonly DefiningWildlifeStalkPhase[] =
  ['shadowing', 'retreating', 'regrouping'];

/** Phases where the behavior tree may use attack branches. */
export const DEFINING_WILDLIFE_STALK_KILL_WINDOW_PHASES: readonly DefiningWildlifeStalkPhase[] =
  ['surrounding', 'attacking'];
