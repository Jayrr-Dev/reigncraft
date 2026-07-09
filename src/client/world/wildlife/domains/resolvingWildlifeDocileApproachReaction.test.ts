/**
 * Unit tests for docile aggression-as-friendliness helpers and Attack? gate.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDocileApproachReaction.test
 */

import { applyingWildlifeDocileAggressionLoss } from '@/components/world/wildlife/domains/applyingWildlifeDocileAggressionLoss';
import { clearingWildlifeDocileExpiredFollowTimer } from '@/components/world/wildlife/domains/applyingWildlifeDocileApproachReactOutcome';
import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { gatingWildlifeDocileAttackDamage } from '@/components/world/wildlife/domains/gatingWildlifeDocileAttackDamage';
import {
  authorizingWildlifeDocileAttack,
  checkingWildlifeDocileAttackIsAuthorized,
  clearingWildlifeDocileAttackAuthorizations,
} from '@/components/world/wildlife/domains/managingWildlifeDocileAttackAuthorizationStore';
import {
  creatingWildlifeInstanceStore,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeDocileApproachReaction } from '@/components/world/wildlife/domains/resolvingWildlifeDocileApproachReaction';
import { beforeEach, describe, expect, it } from 'vitest';

describe('resolvingWildlifeDocileApproachReaction', () => {
  it('follows when roll is below the aggression follow chance', () => {
    expect(
      resolvingWildlifeDocileApproachReaction({
        aggressionLevel: 'tame',
        roll: 0.5,
      })
    ).toBe('follow');
  });

  it('flees when roll is at or above the aggression follow chance', () => {
    expect(
      resolvingWildlifeDocileApproachReaction({
        aggressionLevel: 'aggressive',
        roll: 0.5,
      })
    ).toBe('flee');
  });

  it('uses high follow chance for tame and low for aggressive', () => {
    expect(
      resolvingWildlifeDocileApproachReaction({
        aggressionLevel: 'tame',
        roll: 0.84,
      })
    ).toBe('follow');
    expect(
      resolvingWildlifeDocileApproachReaction({
        aggressionLevel: 'aggressive',
        roll: 0.2,
      })
    ).toBe('flee');
  });
});

describe('applyingWildlifeDocileAggressionLoss', () => {
  it('demotes tame to normal to aggressive and floors there', () => {
    expect(applyingWildlifeDocileAggressionLoss('tame')).toBe('normal');
    expect(applyingWildlifeDocileAggressionLoss('normal')).toBe('aggressive');
    expect(applyingWildlifeDocileAggressionLoss('aggressive')).toBe(
      'aggressive'
    );
  });
});

describe('clearingWildlifeDocileExpiredFollowTimer', () => {
  it('clears an expired follow window so wander can resume', () => {
    const withFollow = creatingWildlifeTestInstance({
      speciesId: 'shepherd-dog',
      aiState: creatingWildlifeTestAiState({
        docileFollowUntilMs: 1_000,
        intent: {
          mode: 'followPlayer',
          targetInstanceId: 'player-1',
          targetPoint: { x: 1, y: 1, layer: 1 },
        },
      }),
    });

    const cleared = clearingWildlifeDocileExpiredFollowTimer(withFollow, 2_000);

    expect(cleared.aiState.docileFollowUntilMs).toBeNull();
  });

  it('keeps an active follow window', () => {
    const withFollow = creatingWildlifeTestInstance({
      speciesId: 'shepherd-dog',
      aiState: creatingWildlifeTestAiState({
        docileFollowUntilMs: 5_000,
      }),
    });

    const next = clearingWildlifeDocileExpiredFollowTimer(withFollow, 2_000);

    expect(next.aiState.docileFollowUntilMs).toBe(5_000);
  });
});

describe('docile species registry', () => {
  it.each(['shepherd-dog', 'cat-black', 'cat-white', 'cat-large'] as const)(
    'resolves %s with temperamentId docile',
    (speciesId) => {
      const species = resolvingWildlifeSpeciesDefinition(speciesId);

      expect(species?.temperamentId).toBe('docile');
    }
  );
});

describe('gatingWildlifeDocileAttackDamage', () => {
  beforeEach(() => {
    clearingWildlifeDocileAttackAuthorizations();
  });

  it('blocks unauthorized docile hits until Betray? completes', () => {
    const store = creatingWildlifeInstanceStore();
    const instance = creatingWildlifeTestInstance({
      instanceId: 'docile-1',
      speciesId: 'shepherd-dog',
    });
    replacingWildlifeInstance(store, instance);

    const blocked = gatingWildlifeDocileAttackDamage({
      store,
      instanceId: 'docile-1',
      damageAmount: 10,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });

    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.pending.instanceId).toBe('docile-1');
      expect(blocked.pending.displayName).toBe('Shepherd Dog');
    }

    authorizingWildlifeDocileAttack('docile-1');
    expect(checkingWildlifeDocileAttackIsAuthorized('docile-1')).toBe(true);

    const allowed = gatingWildlifeDocileAttackDamage({
      store,
      instanceId: 'docile-1',
      damageAmount: 10,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });

    expect(allowed.allowed).toBe(true);
  });

  it('allows non-docile species without confirm', () => {
    const store = creatingWildlifeInstanceStore();
    const instance = creatingWildlifeTestInstance({
      instanceId: 'wolf-1',
      speciesId: 'grey-wolf',
    });
    replacingWildlifeInstance(store, instance);

    const result = gatingWildlifeDocileAttackDamage({
      store,
      instanceId: 'wolf-1',
      damageAmount: 10,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });

    expect(result.allowed).toBe(true);
  });
});
