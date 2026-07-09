import { resolvingWorldPlazaMiniMapStackViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaMiniMapStackViewportStyles', () => {
  it('anchors desktop stacks to the bottom-left edge inset', () => {
    expect(
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale: 1,
        isMobile: false,
        isFullscreen: false,
        isInventoryHotbarVisible: true,
      })
    ).toEqual({
      left: 'calc(12px + env(safe-area-inset-left, 0px))',
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
    });
  });

  it('aligns mobile stacks with the inventory hotbar bottom inset', () => {
    expect(
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale: 1,
        isMobile: true,
        isFullscreen: false,
        isInventoryHotbarVisible: true,
      })
    ).toEqual({
      left: 'calc(12px + env(safe-area-inset-left, 0px))',
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
    });
  });
});
