/**
 * Unit tests for one-shot caltrop trigger side effects.
 *
 * @module components/world/trap/domains/applyingWorldPlazaCaltropTrigger.test
 */

import { applyingWorldPlazaCaltropTrigger } from '@/components/world/trap/domains/applyingWorldPlazaCaltropTrigger';
import {
  placingWorldPlazaCaltrop,
  resettingWorldPlazaCaltropInstanceStoreForTests,
  gettingWorldPlazaCaltropInstance,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('applyingWorldPlazaCaltropTrigger', () => {
  beforeEach(() => {
    resettingWorldPlazaCaltropInstanceStoreForTests();
  });

  it('removes the caltrop and returns slow + bleed effects', () => {
    const instance = placingWorldPlazaCaltrop({
      worldX: 10.5,
      worldY: 12.5,
      ownerId: 'test-owner',
    });

    const result = applyingWorldPlazaCaltropTrigger(instance.trapId);

    expect(result.outcome).toBe('expended');
    if (result.outcome !== 'expended') {
      return;
    }

    expect(result.effects.slowBuffId).toBe('sluggish-debuff');
    expect(result.effects.bleedSeverity).toBe('bleeding');
    expect(result.effects.playerBleedFlatDamage).toBe(8);
    expect(gettingWorldPlazaCaltropInstance(instance.trapId)).toBeNull();
  });

  it('returns miss when the trap is already gone', () => {
    expect(applyingWorldPlazaCaltropTrigger('missing-caltrop')).toEqual({
      outcome: 'miss',
    });
  });
});
