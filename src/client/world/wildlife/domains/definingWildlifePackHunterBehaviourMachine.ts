/**
 * Declarative PackHunter-temperament behaviour statechart for any species with
 * temperamentId `pack_hunter` (wolves today; reusable for future hunters).
 *
 * @module components/world/wildlife/domains/definingWildlifePackHunterBehaviourMachine
 */

import type { DefiningStateMachineDefinition } from '@/lib/stateMachine/definingStateMachineTypes';

export const DEFINING_WILDLIFE_PACK_HUNTER_BEHAVIOUR_MACHINE_ID =
  'wildlife.PackHunter.behaviour';

/** Data-driven stalk hunt phases; consumed by the shared statechart engine. */
export const DEFINING_WILDLIFE_PACK_HUNTER_BEHAVIOUR_MACHINE: DefiningStateMachineDefinition =
  {
    id: DEFINING_WILDLIFE_PACK_HUNTER_BEHAVIOUR_MACHINE_ID,
    version: 1,
    initial: 'idle',
    states: {
      idle: { kind: 'atomic', onEnter: ['PackHunter.onEnterIdle'] },
      shadowing: { kind: 'atomic', onEnter: ['PackHunter.onEnterShadowing'] },
      retreating: { kind: 'atomic', onEnter: ['PackHunter.onEnterRetreating'] },
      regrouping: { kind: 'atomic', onEnter: ['PackHunter.onEnterRegrouping'] },
      formingUp: { kind: 'atomic', onEnter: ['PackHunter.onEnterFormingUp'] },
      surrounding: { kind: 'atomic', onEnter: ['PackHunter.onEnterSurrounding'] },
      attacking: { kind: 'atomic', onEnter: ['PackHunter.onEnterAttacking'] },
      fleeing: { kind: 'atomic', onEnter: ['PackHunter.onEnterFleeing'] },
    },
    transitions: [
      { from: 'idle', to: 'shadowing', event: 'TARGET_ACQUIRED' },
      {
        from: 'shadowing',
        to: 'retreating',
        event: 'PLAYER_APPROACH_NOTICED',
      },
      {
        from: 'retreating',
        to: 'fleeing',
        event: 'RETREAT_DONE_ROLL_FLEE',
      },
      {
        from: 'retreating',
        to: 'attacking',
        event: 'RETREAT_DONE_ROLL_ENRAGE',
        actions: ['PackHunter.applyEnrageThreat'],
      },
      {
        from: 'retreating',
        to: 'regrouping',
        event: 'RETREAT_DONE_ROLL_REGROUP',
      },
      {
        from: 'regrouping',
        to: 'shadowing',
        event: 'REGROUP_DISTANCE_REACHED',
      },
      { from: 'shadowing', to: 'formingUp', event: 'PACK_CONFIDENT' },
      { from: 'formingUp', to: 'shadowing', event: 'PACK_THINNED' },
      {
        from: 'formingUp',
        to: 'surrounding',
        event: 'FORMATION_TIMER_DONE',
      },
      {
        from: 'shadowing',
        to: 'surrounding',
        event: 'KILL_WINDOW_PLUS_PACK',
        priority: 20,
      },
      {
        from: 'shadowing',
        to: 'attacking',
        event: 'KILL_WINDOW_OPEN',
        priority: 10,
      },
      {
        from: 'surrounding',
        to: 'attacking',
        event: 'SLOT_REACHED_OR_ALPHA_COMMIT',
      },
      {
        from: 'attacking',
        to: 'surrounding',
        event: 'ATTACK_TIMEOUT_10S',
      },
      { from: 'shadowing', to: 'fleeing', event: 'DAMAGED_ROLL_FLEE' },
      {
        from: 'shadowing',
        to: 'attacking',
        event: 'DAMAGED_ROLL_ENRAGE',
        actions: ['PackHunter.applyEnrageThreat'],
      },
      { from: 'shadowing', to: 'idle', event: 'STALK_TIMEOUT_2MIN' },
      { from: 'fleeing', to: 'idle', event: 'FLEE_DISTANCE_REACHED' },
      {
        from: '*',
        to: 'idle',
        event: 'TARGET_DEAD_OR_LOST',
        priority: 100,
      },
      { from: '*', to: 'fleeing', event: 'ALPHA_DIED', priority: 90 },
      {
        from: 'attacking',
        to: 'attacking',
        event: 'ATTACK_COMMITTED',
        actions: ['PackHunter.commitAttack'],
      },
    ],
  };
