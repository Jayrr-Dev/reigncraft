/**
 * Unit tests for wildlife walk-over trap triggers.
 *
 * @module components/world/wildlife/domains/applyingWildlifeTrapWalkoverTrigger.test
 */

import { checkingWorldPlazaEntityMovementBuffIsActive } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import {
  gettingWorldPlazaBearTrapInstance,
  placingWorldPlazaBearTrap,
  resettingWorldPlazaBearTrapInstanceStoreForTests,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';
import {
  gettingWorldPlazaCaltropInstance,
  placingWorldPlazaCaltrop,
  resettingWorldPlazaCaltropInstanceStoreForTests,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { applyingWildlifeTrapWalkoverTrigger } from '@/components/world/wildlife/domains/applyingWildlifeTrapWalkoverTrigger';
import { beforeEach, describe, expect, it } from 'vitest';

describe('applyingWildlifeTrapWalkoverTrigger', () => {
  beforeEach(() => {
    resettingWorldPlazaBearTrapInstanceStoreForTests();
    resettingWorldPlazaCaltropInstanceStoreForTests();
  });

  it('springs an armed bear trap and snares + bleeds the animal', () => {
    const trap = placingWorldPlazaBearTrap({
      worldX: 10.5,
      worldY: 12.5,
      ownerId: 'test-owner',
    });

    const instance = creatingWildlifeTestInstance({
      position: { x: 10.5, y: 12.5, layer: 1 },
    });

    const next = applyingWildlifeTrapWalkoverTrigger({
      instance,
      nowMs: 1_000,
    });

    expect(gettingWorldPlazaBearTrapInstance(trap.trapId)?.state).toBe(
      'sprung'
    );
    expect(
      checkingWorldPlazaEntityMovementBuffIsActive(
        next.healthState,
        'immobilized-debuff',
        1_000
      )
    ).toBe(true);
    expect(next.healthState.bleedEffects.length).toBeGreaterThan(0);
  });

  it('expends a caltrop and slows + bleeds the animal', () => {
    const caltrop = placingWorldPlazaCaltrop({
      worldX: 5,
      worldY: 6,
      ownerId: 'test-owner',
    });

    const instance = creatingWildlifeTestInstance({
      position: { x: 5, y: 6, layer: 1 },
    });

    const next = applyingWildlifeTrapWalkoverTrigger({
      instance,
      nowMs: 2_000,
    });

    expect(gettingWorldPlazaCaltropInstance(caltrop.trapId)).toBeNull();
    expect(
      checkingWorldPlazaEntityMovementBuffIsActive(
        next.healthState,
        'sluggish-debuff',
        2_000
      )
    ).toBe(true);
    expect(next.healthState.bleedEffects.length).toBeGreaterThan(0);
  });

  it('does nothing when no trap is under the animal', () => {
    const instance = creatingWildlifeTestInstance({
      position: { x: 100, y: 100, layer: 1 },
    });

    const next = applyingWildlifeTrapWalkoverTrigger({
      instance,
      nowMs: 3_000,
    });

    expect(next).toBe(instance);
  });
});
