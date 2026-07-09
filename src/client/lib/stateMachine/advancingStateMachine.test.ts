import {
  advancingStateMachineTick,
  sendingStateMachineEvent,
  startingStateMachine,
} from '@/lib/stateMachine/advancingStateMachine';
import type {
  DefiningStateMachineDefinition,
  DefiningStateMachineRegistry,
  DefiningStateMachineSnapshot,
} from '@/lib/stateMachine/definingStateMachineTypes';
import { parsingStateMachineDefinition } from '@/lib/stateMachine/parsingStateMachineDefinition';
import {
  checkingStateMachinePatternMatchesState,
  resolvingStateMachineCommonAncestor,
  resolvingStateMachineLeafState,
} from '@/lib/stateMachine/resolvingStateMachineStatePath';
import {
  hydratingStateMachineSnapshot,
  serializingStateMachineSnapshot,
} from '@/lib/stateMachine/serializingStateMachineSnapshot';
import { validatingStateMachineDefinition } from '@/lib/stateMachine/validatingStateMachineDefinition';
import { describe, expect, it } from 'vitest';

type AnimalContext = {
  health: number;
  hunger: number;
  stateTimeMs: number;
  log: string[];
};

type AnimalCommand = { type: string; target?: string };

const animalDefinition: DefiningStateMachineDefinition = {
  id: 'animal.behaviour',
  version: 2,
  initial: 'alive',
  states: {
    alive: { kind: 'compound', initial: 'idle', onEnter: ['log.enterAlive'] },
    'alive.idle': { onEnter: ['log.enterIdle'], onExit: ['log.exitIdle'] },
    'alive.wander': { onUpdate: ['movement.wanderStep'] },
    'alive.eat': {},
    'alive.flee': { onEnter: ['movement.pickFleeTarget'] },
    dead: { kind: 'final', onEnter: ['log.enterDead'] },
  },
  transitions: [
    { from: 'alive.idle', to: 'alive.wander', event: 'timer.finished' },
    {
      from: 'alive.wander',
      to: 'alive.eat',
      event: 'food.found',
      guard: 'animal.isHungry',
    },
    { from: 'alive.*', to: 'alive.flee', event: 'predator.seen', priority: 90 },
    { from: '*', to: 'dead', guard: 'animal.health.zero', priority: 100 },
  ],
};

function creatingAnimalRegistry(): DefiningStateMachineRegistry<
  AnimalContext,
  AnimalCommand
> {
  return {
    guards: {
      'animal.isHungry': (context) => context.hunger > 70,
      'animal.health.zero': (context) => context.health <= 0,
    },
    actions: {
      'log.enterAlive': (context) => {
        context.log.push('enter:alive');
      },
      'log.enterIdle': (context) => {
        context.log.push('enter:alive.idle');
      },
      'log.exitIdle': (context) => {
        context.log.push('exit:alive.idle');
      },
      'log.enterDead': (context) => {
        context.log.push('enter:dead');
      },
      'movement.wanderStep': () => [{ type: 'movement.wander' }],
      'movement.pickFleeTarget': () => [
        { type: 'movement.moveTo', target: 'flee-point' },
      ],
    },
  };
}

function creatingAnimalContext(
  overrides: Partial<AnimalContext> = {}
): AnimalContext {
  return { health: 10, hunger: 0, stateTimeMs: 0, log: [], ...overrides };
}

describe('resolvingStateMachineStatePath', () => {
  it('drills through compound initials to a leaf', () => {
    expect(resolvingStateMachineLeafState(animalDefinition, 'alive')).toBe(
      'alive.idle'
    );
  });

  it('computes common ancestors and wildcard matches', () => {
    expect(
      resolvingStateMachineCommonAncestor('alive.idle', 'alive.flee')
    ).toBe('alive');
    expect(resolvingStateMachineCommonAncestor('alive.idle', 'dead')).toBeNull();
    expect(
      checkingStateMachinePatternMatchesState('alive.*', 'alive.wander')
    ).toBe(true);
    expect(checkingStateMachinePatternMatchesState('alive.*', 'dead')).toBe(
      false
    );
    expect(checkingStateMachinePatternMatchesState('*', 'dead')).toBe(true);
  });
});

describe('startingStateMachine', () => {
  it('enters the resolved initial leaf and runs enter actions root to leaf', () => {
    const context = creatingAnimalContext();
    const result = startingStateMachine({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      context,
    });

    expect(result.snapshot.currentState).toBe('alive.idle');
    expect(result.snapshot.definitionVersion).toBe(2);
    expect(context.log).toEqual(['enter:alive', 'enter:alive.idle']);
  });
});

describe('sendingStateMachineEvent', () => {
  function startingAnimal(context: AnimalContext): DefiningStateMachineSnapshot {
    return startingStateMachine({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      context,
    }).snapshot;
  }

  it('follows a plain event transition', () => {
    const context = creatingAnimalContext();
    const snapshot = startingAnimal(context);

    const result = sendingStateMachineEvent({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      event: { type: 'timer.finished' },
      context,
    });

    expect(result.transitioned).toBe(true);
    expect(result.snapshot.currentState).toBe('alive.wander');
    expect(result.snapshot.previousState).toBe('alive.idle');
    expect(context.log).toContain('exit:alive.idle');
  });

  it('ignores events with no matching transition', () => {
    const context = creatingAnimalContext();
    const snapshot = startingAnimal(context);

    const result = sendingStateMachineEvent({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      event: { type: 'food.found' },
      context,
    });

    expect(result.transitioned).toBe(false);
    expect(result.snapshot).toBe(snapshot);
  });

  it('blocks transitions whose guard fails', () => {
    const context = creatingAnimalContext({ hunger: 10 });
    let snapshot = startingAnimal(context);
    snapshot = sendingStateMachineEvent({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      event: { type: 'timer.finished' },
      context,
    }).snapshot;

    const blocked = sendingStateMachineEvent({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      event: { type: 'food.found' },
      context,
    });

    expect(blocked.transitioned).toBe(false);

    context.hunger = 90;
    const allowed = sendingStateMachineEvent({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      event: { type: 'food.found' },
      context,
    });

    expect(allowed.snapshot.currentState).toBe('alive.eat');
  });

  it('matches subtree wildcards and emits commands from enter actions', () => {
    const context = creatingAnimalContext();
    const snapshot = startingAnimal(context);

    const result = sendingStateMachineEvent({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      event: { type: 'predator.seen' },
      context,
    });

    expect(result.snapshot.currentState).toBe('alive.flee');
    expect(result.commands).toEqual([
      { type: 'movement.moveTo', target: 'flee-point' },
    ]);
    // The shared 'alive' ancestor is not exited or re-entered.
    expect(
      context.log.filter((entry) => entry === 'enter:alive')
    ).toHaveLength(1);
  });
});

describe('advancingStateMachineTick', () => {
  it('accumulates state time and runs onUpdate actions', () => {
    const context = creatingAnimalContext();
    let snapshot = startingStateMachine({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      context,
    }).snapshot;
    snapshot = sendingStateMachineEvent({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      event: { type: 'timer.finished' },
      context,
    }).snapshot;

    const result = advancingStateMachineTick({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot,
      deltaMs: 250,
      context,
    });

    expect(result.snapshot.stateTimeMs).toBe(250);
    expect(result.commands).toEqual([{ type: 'movement.wander' }]);
  });

  it('fires eventless guarded transitions, highest priority first', () => {
    const context = creatingAnimalContext({ health: 0 });
    const snapshot = startingStateMachine({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      context,
    }).snapshot;

    // Start already settles eventless transitions, so the animal dies on
    // start; verify a live animal dies on the tick after losing health.
    expect(snapshot.currentState).toBe('dead');

    const liveContext = creatingAnimalContext({ health: 5 });
    const liveSnapshot = startingStateMachine({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      context: liveContext,
    }).snapshot;

    expect(liveSnapshot.currentState).toBe('alive.idle');

    liveContext.health = 0;
    const ticked = advancingStateMachineTick({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      snapshot: liveSnapshot,
      deltaMs: 16,
      context: liveContext,
    });

    expect(ticked.snapshot.currentState).toBe('dead');
    expect(liveContext.log).toContain('enter:dead');
  });
});

describe('validatingStateMachineDefinition', () => {
  it('accepts the animal definition with its registry', () => {
    const issues = validatingStateMachineDefinition(
      animalDefinition,
      creatingAnimalRegistry()
    );

    expect(issues.filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('reports unknown states and unregistered guards', () => {
    const broken: DefiningStateMachineDefinition = {
      id: 'broken',
      initial: 'missing',
      states: { idle: {} },
      transitions: [
        { from: 'idle', to: 'nowhere', event: 'go', guard: 'not.registered' },
      ],
    };

    const issues = validatingStateMachineDefinition(broken, {
      guards: {},
      actions: {},
    });
    const messages = issues.map((issue) => issue.message).join('\n');

    expect(messages).toContain(`unknown state 'missing'`);
    expect(messages).toContain(`unknown state 'nowhere'`);
    expect(messages).toContain(`unregistered guard 'not.registered'`);
  });
});

describe('parsingStateMachineDefinition', () => {
  it('parses plain JSON data into a typed definition', () => {
    const parsed = parsingStateMachineDefinition(
      JSON.parse(JSON.stringify(animalDefinition))
    );

    expect(parsed.ok).toBe(true);

    if (parsed.ok) {
      expect(parsed.definition.id).toBe('animal.behaviour');
      expect(parsed.definition.transitions).toHaveLength(4);
    }
  });

  it('rejects malformed input with readable errors', () => {
    const parsed = parsingStateMachineDefinition({
      id: 42,
      initial: 'idle',
      states: { idle: { onEnter: 'not-an-array' } },
      transitions: [{ from: 'idle' }],
    });

    expect(parsed.ok).toBe(false);

    if (!parsed.ok) {
      expect(parsed.errors.join('\n')).toContain(`'id' must be a string`);
      expect(parsed.errors.join('\n')).toContain(
        `states['idle'].onEnter must be an array of strings`
      );
      expect(parsed.errors.join('\n')).toContain(
        `transitions[0] requires string 'from' and 'to'`
      );
    }
  });
});

describe('serializingStateMachineSnapshot', () => {
  it('round-trips a snapshot against a matching definition', () => {
    const context = creatingAnimalContext();
    const snapshot = startingStateMachine({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      context,
    }).snapshot;

    const hydrated = hydratingStateMachineSnapshot(
      serializingStateMachineSnapshot(snapshot),
      animalDefinition
    );

    expect(hydrated.ok).toBe(true);

    if (hydrated.ok) {
      expect(hydrated.snapshot).toEqual(snapshot);
    }
  });

  it('rejects snapshots from a different definition version', () => {
    const context = creatingAnimalContext();
    const snapshot = startingStateMachine({
      definition: animalDefinition,
      registry: creatingAnimalRegistry(),
      context,
    }).snapshot;
    const olderDefinition: DefiningStateMachineDefinition = {
      ...animalDefinition,
      version: 3,
    };

    const hydrated = hydratingStateMachineSnapshot(
      serializingStateMachineSnapshot(snapshot),
      olderDefinition
    );

    expect(hydrated.ok).toBe(false);
  });
});
