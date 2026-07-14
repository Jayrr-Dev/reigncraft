/**
 * Pouncer retreat and jump-scare arming tests.
 */

import { describe, expect, it } from 'vitest';
import {
  advancingWildlifePouncerThink,
  armingWildlifeJumpScareFatalOnPounceLanding,
  checkingWildlifeJumpScareFatalMeleeArmed,
  resolvingWildlifeJumpScareFatalDamageOptions,
  resolvingWildlifePouncerJumpRangeMultiplier,
} from '@/components/world/wildlife/domains/advancingWildlifePouncerTick';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';
import { checkingWildlifePouncerRetreatComplete } from '@/components/world/wildlife/domains/resolvingWildlifePouncerRetreatIntent';

describe('sunhead pouncer / jump scare', () => {
  it('starts a backwards retreat when chasing in range', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'sunhead',
      position: { x: 4, y: 0.5, layer: 1 },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 0.5, y: 0.5, layer: 1 },
        },
        pouncerPhase: 'idle',
      },
    });

    const result = advancingWildlifePouncerThink({
      instance,
      intent: instance.aiState.intent,
      playerPosition: { x: 0.5, y: 0.5, layer: 1 },
      playerUserId: 'player-1',
      nowMs: 1_000,
    });

    expect(result.instance.aiState.pouncerPhase).toBe('retreat');
    expect(result.intent.mode).toBe('stalk');
    if (result.intent.mode === 'stalk') {
      expect(result.intent.pace).toBe('run');
      expect(result.intent.facingPoint?.x).toBe(0.5);
    }
  });

  it('casts jump scare after retreat completes when cooldown ready', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'sunhead',
      position: { x: 4, y: 0.5, layer: 1 },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'stalk',
          targetInstanceId: 'player-1',
          targetPoint: { x: 5, y: 0.5, layer: 1 },
          facingPoint: { x: 0.5, y: 0.5, layer: 1 },
          pace: 'run',
        },
        pouncerPhase: 'retreat',
        pouncerRetreatFromX: 0.5,
        pouncerRetreatFromY: 0.5,
        lastJumpScareAtMs: null,
      },
    });

    expect(
      checkingWildlifePouncerRetreatComplete({
        position: instance.position,
        retreatFromX: 0.5,
        retreatFromY: 0.5,
        retreatDistanceGrid: 3.2,
      })
    ).toBe(true);

    const result = advancingWildlifePouncerThink({
      instance,
      intent: instance.aiState.intent,
      playerPosition: { x: 0.5, y: 0.5, layer: 1 },
      playerUserId: 'player-1',
      nowMs: 5_000,
    });

    expect(result.instance.aiState.pouncerPhase).toBe('cast');
    expect(result.instance.aiState.jumpScareArmed).toBe(true);
    expect(result.instance.aiState.jumpScareUntilMs).toBeGreaterThan(5_000);
    expect(result.intent.mode).toBe('idle');
  });

  it('doubles jump range and arms fatal melee after jump-scare pounce lands', () => {
    const armed = creatingWildlifeTestInstance({
      speciesId: 'sunhead',
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        jumpScareArmed: true,
        pouncerPhase: 'pounce',
      },
    });

    expect(resolvingWildlifePouncerJumpRangeMultiplier(armed)).toBe(2);

    const landed = armingWildlifeJumpScareFatalOnPounceLanding(armed, 10_000);

    expect(landed.aiState.jumpScareArmed).toBe(false);
    expect(landed.aiState.jumpScareFatalUntilMs).toBe(11_400);
    expect(checkingWildlifeJumpScareFatalMeleeArmed(landed, 10_500)).toBe(true);
    expect(resolvingWildlifeJumpScareFatalDamageOptions()).toEqual({
      forcedDeviationScore:
        encodingWorldPlazaEntityHealthDamageRollForcedTierValue('fatal'),
    });
  });
});
