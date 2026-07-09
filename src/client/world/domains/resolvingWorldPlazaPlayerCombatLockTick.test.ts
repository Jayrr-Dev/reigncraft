import { describe, expect, it } from 'vitest';

import { DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_MELEE_REACH_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCombatLockConstants';
import type { DefiningWorldPlazaPlayerCombatLockState } from '@/components/world/domains/definingWorldPlazaPlayerCombatLockTypes';
import { resolvingWorldPlazaPlayerCombatLockTick } from '@/components/world/domains/resolvingWorldPlazaPlayerCombatLockTick';

const baseLock = (): DefiningWorldPlazaPlayerCombatLockState => ({
  targetInstanceId: 'wildlife:wolf:1',
  lastChaseGridX: 10,
  lastChaseGridY: 10,
  lastChaseReplanAtMs: 0,
});

describe('resolvingWorldPlazaPlayerCombatLockTick', () => {
  it('clears when the target is missing or dead', () => {
    expect(
      resolvingWorldPlazaPlayerCombatLockTick({
        lock: baseLock(),
        playerPosition: { x: 0, y: 0 },
        target: null,
        nowMs: 1000,
        isMeleeBusy: false,
        isDocileConfirmPending: false,
        hasActiveWalk: false,
      }).kind
    ).toBe('clear');

    expect(
      resolvingWorldPlazaPlayerCombatLockTick({
        lock: baseLock(),
        playerPosition: { x: 0, y: 0 },
        target: {
          instanceId: 'wildlife:wolf:1',
          position: { x: 1, y: 0 },
          isDead: true,
        },
        nowMs: 1000,
        isMeleeBusy: false,
        isDocileConfirmPending: false,
        hasActiveWalk: false,
      }).kind
    ).toBe('clear');
  });

  it('chases when out of melee reach and replans without an active walk', () => {
    const result = resolvingWorldPlazaPlayerCombatLockTick({
      lock: baseLock(),
      playerPosition: { x: 0, y: 0 },
      target: {
        instanceId: 'wildlife:wolf:1',
        position: {
          x: DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_MELEE_REACH_GRID + 2,
          y: 0,
        },
        isDead: false,
      },
      nowMs: 1000,
      isMeleeBusy: false,
      isDocileConfirmPending: false,
      hasActiveWalk: false,
    });

    expect(result.kind).toBe('chase');
    if (result.kind === 'chase') {
      expect(result.shouldReplan).toBe(true);
      expect(result.destination.x).toBe(
        DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_MELEE_REACH_GRID + 2
      );
    }
  });

  it('swings when in reach and not busy', () => {
    const result = resolvingWorldPlazaPlayerCombatLockTick({
      lock: baseLock(),
      playerPosition: { x: 0, y: 0 },
      target: {
        instanceId: 'wildlife:wolf:1',
        position: { x: 1, y: 0 },
        isDead: false,
      },
      nowMs: 1000,
      isMeleeBusy: false,
      isDocileConfirmPending: false,
      hasActiveWalk: true,
    });

    expect(result).toEqual({
      kind: 'swing',
      targetGridX: 1,
      targetGridY: 0,
      targetInstanceId: 'wildlife:wolf:1',
    });
  });

  it('holds while melee busy or docile confirm is pending', () => {
    expect(
      resolvingWorldPlazaPlayerCombatLockTick({
        lock: baseLock(),
        playerPosition: { x: 0, y: 0 },
        target: {
          instanceId: 'wildlife:wolf:1',
          position: { x: 1, y: 0 },
          isDead: false,
        },
        nowMs: 1000,
        isMeleeBusy: true,
        isDocileConfirmPending: false,
        hasActiveWalk: false,
      }).kind
    ).toBe('hold');

    expect(
      resolvingWorldPlazaPlayerCombatLockTick({
        lock: baseLock(),
        playerPosition: { x: 0, y: 0 },
        target: {
          instanceId: 'wildlife:wolf:1',
          position: { x: 1, y: 0 },
          isDead: false,
        },
        nowMs: 1000,
        isMeleeBusy: false,
        isDocileConfirmPending: true,
        hasActiveWalk: false,
      }).kind
    ).toBe('hold');
  });
});
