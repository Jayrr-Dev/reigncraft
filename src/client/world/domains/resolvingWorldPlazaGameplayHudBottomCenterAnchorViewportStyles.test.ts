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

  it('reserves the minimap and jump button flanks on embedded mobile', () => {
    // left: 12 inset + 72 canvas + 10 chrome + 8 gap = 102
    // right: 12 inset + 96 jump button + 8 gap = 116
    expect(
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(1, {
        isFullscreen: false,
      })
    ).toEqual({
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      paddingLeft: 102,
      paddingRight: 116,
    });
  });

  it('widens the minimap flank on fullscreen mobile', () => {
    // left: 16 inset + 96 canvas + 10 chrome + 8 gap = 130
    expect(
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(1, {
        isFullscreen: true,
      })
    ).toEqual({
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      paddingLeft: 130,
      paddingRight: 116,
    });
  });
});
