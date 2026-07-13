/**
 * Declarative solo stalker behaviour statechart.
 * temperamentId `stalker` (tiger, jaguar): shadow → rush, no pack surround.
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkerBehaviourMachine
 */

import type { DefiningStateMachineDefinition } from '@/lib/stateMachine/definingStateMachineTypes';

export const DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE_ID =
  'wildlife.stalker.behaviour';

/** Slim stalk hunt phases for solo stalkers. */
export const DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE: DefiningStateMachineDefinition =
  {
    id: DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE_ID,
    version: 1,
    initial: 'idle',
    states: {
      idle: { kind: 'atomic', onEnter: ['stalker.onEnterIdle'] },
      shadowing: { kind: 'atomic', onEnter: ['stalker.onEnterShadowing'] },
      retreating: { kind: 'atomic', onEnter: ['stalker.onEnterRetreating'] },
      regrouping: { kind: 'atomic', onEnter: ['stalker.onEnterRegrouping'] },
      attacking: { kind: 'atomic', onEnter: ['stalker.onEnterAttacking'] },
      fleeing: { kind: 'atomic', onEnter: ['stalker.onEnterFleeing'] },
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
        actions: ['stalker.applyEnrageThreat'],
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
      {
        from: 'shadowing',
        to: 'attacking',
        event: 'KILL_WINDOW_OPEN',
        priority: 10,
      },
      {
        from: 'attacking',
        to: 'shadowing',
        event: 'ATTACK_TIMEOUT_10S',
      },
      { from: 'shadowing', to: 'fleeing', event: 'DAMAGED_ROLL_FLEE' },
      {
        from: 'shadowing',
        to: 'attacking',
        event: 'DAMAGED_ROLL_ENRAGE',
        actions: ['stalker.applyEnrageThreat'],
      },
      { from: 'shadowing', to: 'idle', event: 'STALK_TIMEOUT_2MIN' },
      { from: 'fleeing', to: 'idle', event: 'FLEE_DISTANCE_REACHED' },
      {
        from: '*',
        to: 'idle',
        event: 'TARGET_DEAD_OR_LOST',
        priority: 100,
      },
      {
        from: 'attacking',
        to: 'attacking',
        event: 'ATTACK_COMMITTED',
        actions: ['stalker.commitAttack'],
      },
    ],
  };
