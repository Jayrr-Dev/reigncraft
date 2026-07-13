import { checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen } from '@/components/world/depth/domains/checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen';
import { describe, expect, it } from 'vitest';

describe('checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen', () => {
  it('uses the rendered tile center, not a half-tile-shifted center', () => {
    expect(
      checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen(
        { x: 9.75, y: 9.75, layer: 1 },
        1,
        10,
        10,
        4
      )
    ).toBe(true);
  });

  it('includes painted feet below the logical grid anchor', () => {
    const gridPoint = { x: 9.35, y: 9.35, layer: 1 };

    expect(
      checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen(
        gridPoint,
        1,
        10,
        10,
        4
      )
    ).toBe(false);
    expect(
      checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen(
        gridPoint,
        1,
        10,
        10,
        4,
        14
      )
    ).toBe(true);
  });
});
