import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  advancingWildlifeBluffCharge,
  checkingWildlifeShouldCompleteBluffReturn,
  clearingWildlifeBluffReturnOnArrival,
  seedingWildlifeBluffChargeReturnPoint,
} from '@/components/world/wildlife/domains/advancingWildlifeBluffCharge';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

const rhino = resolvingWildlifeSpeciesDefinition('rhino');

describe('advancingWildlifeBluffCharge', () => {
  it('seeds return point at charge wind-up start', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'rhino',
      spawnAnchor: { x: 5, y: 5, layer: 1 },
      position: { x: 6, y: 5, layer: 1 },
    });

    const seeded = seedingWildlifeBluffChargeReturnPoint(
      instance,
      'rhino',
      1000
    );

    expect(seeded.aiState.bluffReturnPoint).toEqual({
      x: 6,
      y: 5,
      layer: 1,
    });
  });

  it('aborts at 50% stamina only after player exits territory', () => {
    const charging = creatingWildlifeTestInstance({
      speciesId: 'rhino',
      spawnAnchor: { x: 5, y: 5, layer: 1 },
      position: { x: 8, y: 5, layer: 1 },
      staminaState: {
        staminaRatio: 0.5,
        isExhausted: false,
        runningForSeconds: 2,
      },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 20, y: 5, layer: 1 },
        },
        chargeWindupStartedAtMs: 1000,
        bluffReturnPoint: { x: 6, y: 5, layer: 1 },
        bluffChargePlayerExitedTerritory: false,
        hasUsedBluffCharge: false,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: 1000,
      },
    });

    const stillInside = advancingWildlifeBluffCharge({
      instance: charging,
      species: rhino!,
      playerPosition: { x: 10, y: 5, layer: 1 },
      playerUserId: 'player-1',
      nowMs: 3000,
    });

    expect(stillInside.didAbortBluff).toBe(false);
    expect(stillInside.instance.aiState.intent.mode).toBe('chase');

    const exited = advancingWildlifeBluffCharge({
      instance: {
        ...charging,
        aiState: {
          ...charging.aiState,
          bluffChargePlayerExitedTerritory: true,
          hasUsedBluffCharge: false,
          bluffReturnPoint: { x: 6, y: 5, layer: 1 },
          docileFollowUntilMs: null,
          docileLastReactAtMs: null,
        },
      },
      species: rhino!,
      playerPosition: { x: 30, y: 5, layer: 1 },
      playerUserId: 'player-1',
      nowMs: 3000,
    });

    expect(exited.didAbortBluff).toBe(true);
    expect(exited.instance.aiState.intent).toEqual({
      mode: 'return',
      targetPoint: { x: 6, y: 5, layer: 1 },
    });
    expect(exited.instance.aiState.hasUsedBluffCharge).toBe(true);
    expect(exited.instance.aggroState.activeTargetId).toBeNull();
  });

  it('marks player exited when they leave the home patch mid-charge', () => {
    const charging = creatingWildlifeTestInstance({
      speciesId: 'rhino',
      spawnAnchor: { x: 5, y: 5, layer: 1 },
      position: { x: 8, y: 5, layer: 1 },
      staminaState: {
        staminaRatio: 0.8,
        isExhausted: false,
        runningForSeconds: 1,
      },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 20, y: 5, layer: 1 },
        },
        chargeWindupStartedAtMs: 1000,
        bluffReturnPoint: { x: 6, y: 5, layer: 1 },
        bluffChargePlayerExitedTerritory: false,
        hasUsedBluffCharge: false,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });

    // Rhino anchorRadiusGrid is 11; player at distance 12 is past the line.
    const result = advancingWildlifeBluffCharge({
      instance: charging,
      species: rhino!,
      playerPosition: { x: 17, y: 5, layer: 1 },
      playerUserId: 'player-1',
      nowMs: 2500,
    });

    expect(result.didAbortBluff).toBe(false);
    expect(result.instance.aiState.bluffChargePlayerExitedTerritory).toBe(true);
  });

  it('keeps walking home until arrival then clears return point', () => {
    const returning = creatingWildlifeTestInstance({
      speciesId: 'rhino',
      spawnAnchor: { x: 5, y: 5, layer: 1 },
      position: { x: 8, y: 5, layer: 1 },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'return',
          targetPoint: { x: 6, y: 5, layer: 1 },
        },
        hasUsedBluffCharge: true,
        bluffReturnPoint: { x: 6, y: 5, layer: 1 },
        bluffChargePlayerExitedTerritory: false,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });

    expect(checkingWildlifeShouldCompleteBluffReturn(returning)).toBe(true);

    const arrived = clearingWildlifeBluffReturnOnArrival({
      ...returning,
      position: { x: 6.2, y: 5, layer: 1 },
    });

    expect(arrived.aiState.bluffReturnPoint).toBeNull();
    expect(arrived.aiState.intent.mode).toBe('idle');
    expect(arrived.aiState.hasUsedBluffCharge).toBe(true);
  });
});
