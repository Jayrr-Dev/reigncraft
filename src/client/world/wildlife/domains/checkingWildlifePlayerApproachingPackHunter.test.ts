import { checkingWildlifePlayerApproachingPackHunter } from '@/components/world/wildlife/domains/checkingWildlifePlayerApproachingPackHunter';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifePlayerApproachingPackHunter', () => {
  const wolfPosition = { x: 10, y: 10, layer: 1 };

  it('returns false when the player is standing still', () => {
    expect(
      checkingWildlifePlayerApproachingPackHunter({
        playerPosition: { x: 9.5, y: 10, layer: 1 },
        playerPreviousPosition: { x: 9.5, y: 10, layer: 1 },
        wolfPosition,
        isPlayerWalking: false,
        isPlayerRunning: false,
      })
    ).toBe(false);
  });

  it('returns true when the player walks toward a nearby wolf', () => {
    expect(
      checkingWildlifePlayerApproachingPackHunter({
        playerPosition: { x: 9.5, y: 10, layer: 1 },
        playerPreviousPosition: { x: 8.5, y: 10, layer: 1 },
        wolfPosition,
        isPlayerWalking: true,
        isPlayerRunning: false,
      })
    ).toBe(true);
  });

  it('returns false when the player moves away from the wolf', () => {
    expect(
      checkingWildlifePlayerApproachingPackHunter({
        playerPosition: { x: 7.5, y: 10, layer: 1 },
        playerPreviousPosition: { x: 8.5, y: 10, layer: 1 },
        wolfPosition,
        isPlayerWalking: true,
        isPlayerRunning: false,
      })
    ).toBe(false);
  });
});
