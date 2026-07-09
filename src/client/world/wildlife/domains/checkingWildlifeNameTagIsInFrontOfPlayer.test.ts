import { checkingWildlifeNameTagIsInFrontOfPlayer } from '@/components/world/wildlife/domains/checkingWildlifeNameTagIsInFrontOfPlayer';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeNameTagIsInFrontOfPlayer', () => {
  const playerPosition = { x: 10, y: 10, layer: 0 };

  it('treats southeast wildlife as in front when facing down', () => {
    expect(
      checkingWildlifeNameTagIsInFrontOfPlayer(
        { x: 11, y: 11, layer: 0 },
        playerPosition,
        'Down'
      )
    ).toBe(true);
  });

  it('treats southeast wildlife as behind when facing up', () => {
    expect(
      checkingWildlifeNameTagIsInFrontOfPlayer(
        { x: 11, y: 11, layer: 0 },
        playerPosition,
        'Up'
      )
    ).toBe(false);
  });
});
