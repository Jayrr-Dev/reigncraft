import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles', () => {
  it('anchors bottom-center HUD chrome above the safe area inset', () => {
    expect(
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(1)
    ).toEqual({
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
    });
  });
});
