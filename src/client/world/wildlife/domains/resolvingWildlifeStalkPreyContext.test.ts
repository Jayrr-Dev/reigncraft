import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { resolvingWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPreyContext';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkPreyContext', () => {
  it('resolves player vitals when the active target is the player', () => {
    expect(
      resolvingWildlifeStalkPreyContext({
        activeTargetId: 'player-1',
        nearbyInstances: [],
        playerUserId: 'player-1',
        playerPosition: { x: 10, y: 10, layer: 1 },
        playerHealthRatio: 0.4,
        playerStaminaRatio: 0.1,
        playerStaminaIsDepleted: true,
        playerStillDurationMs: 5_000,
      })
    ).toEqual({
      targetId: 'player-1',
      position: { x: 10, y: 10, layer: 1 },
      healthRatio: 0.4,
      staminaRatio: 0.1,
      staminaIsDepleted: true,
      stillDurationMs: 5_000,
    });
  });

  it('resolves wildlife prey vitals from nearby instances', () => {
    const prey = creatingWildlifeTestInstance({
      instanceId: 'deer-1',
      speciesId: 'deer',
      position: { x: 12, y: 8, layer: 1 },
      healthState: {
        ...creatingWorldPlazaEntityHealthInitialState(),
        baseMaxHealth: 100,
        currentHealth: 25,
      },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        isMoving: false,
      },
    });

    const context = resolvingWildlifeStalkPreyContext({
      activeTargetId: 'deer-1',
      nearbyInstances: [prey],
      playerUserId: 'player-1',
      playerPosition: { x: 5, y: 5, layer: 1 },
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
    });

    expect(context?.targetId).toBe('deer-1');
    expect(context?.healthRatio).toBeCloseTo(0.25);
    expect(context?.stillDurationMs).toBeGreaterThan(0);
  });
});
