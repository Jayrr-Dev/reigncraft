import { computingWorldPlazaEntityHealthAmplifiedHealAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthHealAmplifier';
import { DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityHealAmplifierConstants';
import {
  addingWorldPlazaEntityHealthIncomingHealAmplifier,
  addingWorldPlazaEntityHealthOutgoingHealAmplifier,
  creatingWorldPlazaEntityHealthInitialState,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityHealthAmplifiedHealAmount', () => {
  it('increases received healing with Blessing', () => {
    const nowMs = 0;
    const state = addingWorldPlazaEntityHealthIncomingHealAmplifier(
      creatingWorldPlazaEntityHealthInitialState(),
      {
        id: 'blessing-buff',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
        expiresAtMs: null,
      }
    );

    const amplified = computingWorldPlazaEntityHealthAmplifiedHealAmount({
      baseHealAmount: 100,
      receiverIncomingHealAmplifiers: state.incomingHealAmplifiers,
      giverOutgoingHealAmplifiers: state.outgoingHealAmplifiers,
      nowMs,
    });

    expect(amplified).toBe(125);
  });

  it('increases given healing with Mending', () => {
    const nowMs = 0;
    const state = addingWorldPlazaEntityHealthOutgoingHealAmplifier(
      creatingWorldPlazaEntityHealthInitialState(),
      {
        id: 'mending-buff',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
        expiresAtMs: null,
      }
    );

    const amplified = computingWorldPlazaEntityHealthAmplifiedHealAmount({
      baseHealAmount: 100,
      receiverIncomingHealAmplifiers: state.incomingHealAmplifiers,
      giverOutgoingHealAmplifiers: state.outgoingHealAmplifiers,
      nowMs,
    });

    expect(amplified).toBe(125);
  });

  it('stacks Blessing and Mending multiplicatively on self heals', () => {
    const nowMs = 0;
    let state = addingWorldPlazaEntityHealthIncomingHealAmplifier(
      creatingWorldPlazaEntityHealthInitialState(),
      {
        id: 'blessing-buff',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
        expiresAtMs: null,
      }
    );
    state = addingWorldPlazaEntityHealthOutgoingHealAmplifier(state, {
      id: 'mending-buff',
      ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
      expiresAtMs: null,
    });

    const amplified = computingWorldPlazaEntityHealthAmplifiedHealAmount({
      baseHealAmount: 100,
      receiverIncomingHealAmplifiers: state.incomingHealAmplifiers,
      giverOutgoingHealAmplifiers: state.outgoingHealAmplifiers,
      nowMs,
    });

    expect(amplified).toBe(156.25);
  });
});
