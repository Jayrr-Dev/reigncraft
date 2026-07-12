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

  it('reserves the jump button flank on embedded mobile', () => {
    // right: 12 inset + 96 jump button + 8 gap = 116
    expect(
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(1, {
        isFullscreen: false,
      })
    ).toEqual({
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      paddingRight: 116,
    });
  });

  it('keeps the jump button flank on fullscreen mobile', () => {
    expect(
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(1, {
        isFullscreen: true,
      })
    ).toEqual({
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      paddingRight: 116,
    });
  });
});
