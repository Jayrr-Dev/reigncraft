import { checkingWildlifeChaseShouldGiveUpWithoutDamage } from '@/components/world/wildlife/domains/checkingWildlifeChaseShouldGiveUpWithoutDamage';
import { DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeChaseShouldGiveUpWithoutDamage', () => {
  it('keeps chase before the no-damage window elapses', () => {
    expect(
      checkingWildlifeChaseShouldGiveUpWithoutDamage({
        chaseGiveUpWithoutDamageMs:
          DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS,
        activeTargetId: 'player-1',
        playerUserId: 'player-1',
        lastDealtDamageAtMs: null,
        chaseEngagedAtMs: 1_000,
        nowMs: 1_000 + DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS - 1,
      })
    ).toBe(false);
  });

  it('gives up when no hit landed since engage', () => {
    expect(
      checkingWildlifeChaseShouldGiveUpWithoutDamage({
        chaseGiveUpWithoutDamageMs:
          DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS,
        activeTargetId: 'player-1',
        playerUserId: 'player-1',
        lastDealtDamageAtMs: null,
        chaseEngagedAtMs: 1_000,
        nowMs: 1_000 + DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS,
      })
    ).toBe(true);
  });

  it('resets the window from the last landed hit', () => {
    expect(
      checkingWildlifeChaseShouldGiveUpWithoutDamage({
        chaseGiveUpWithoutDamageMs:
          DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS,
        activeTargetId: 'player-1',
        playerUserId: 'player-1',
        lastDealtDamageAtMs: 8_000,
        chaseEngagedAtMs: 1_000,
        nowMs: 8_000 + DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS - 1,
      })
    ).toBe(false);
  });

  it('ignores non-player targets and missing config', () => {
    expect(
      checkingWildlifeChaseShouldGiveUpWithoutDamage({
        chaseGiveUpWithoutDamageMs: undefined,
        activeTargetId: 'player-1',
        playerUserId: 'player-1',
        lastDealtDamageAtMs: null,
        chaseEngagedAtMs: 0,
        nowMs: 60_000,
      })
    ).toBe(false);

    expect(
      checkingWildlifeChaseShouldGiveUpWithoutDamage({
        chaseGiveUpWithoutDamageMs:
          DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS,
        activeTargetId: 'wildlife:deer:1',
        playerUserId: 'player-1',
        lastDealtDamageAtMs: null,
        chaseEngagedAtMs: 0,
        nowMs: 60_000,
      })
    ).toBe(false);
  });
});
