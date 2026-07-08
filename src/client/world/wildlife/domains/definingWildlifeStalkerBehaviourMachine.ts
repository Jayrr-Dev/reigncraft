/**
 * Declarative stalker-temperament behaviour statechart for any species with
 * temperamentId `stalker` (wolves today; reusable for future hunters).
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkerBehaviourMachine
 */

import type { DefiningStateMachineDefinition } from '@/lib/stateMachine/definingStateMachineTypes';

export const DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE_ID =
  'wildlife.stalker.behaviour';

/** Data-driven stalk hunt phases; consumed by the shared statechart engine. */
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
      formingUp: { kind: 'atomic', onEnter: ['stalker.onEnterFormingUp'] },
      surrounding: { kind: 'atomic', onEnter: ['stalker.onEnterSurrounding'] },
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
      { from: '*', to: 'fleeing', event: 'ALPHA_DIED', priority: 90 },
      {
        from: 'attacking',
        to: 'attacking',
        event: 'ATTACK_COMMITTED',
        actions: ['stalker.commitAttack'],
      },
    ],
  };
