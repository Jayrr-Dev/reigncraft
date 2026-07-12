import { resolvingWorldPlazaMiniMapStackViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaMiniMapStackViewportStyles', () => {
  it('anchors desktop stacks to the top-right edge inset below the action bar', () => {
    expect(
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale: 1,
        isMobile: false,
        isFullscreen: false,
      })
    ).toEqual({
      top: 'calc(64px + env(safe-area-inset-top, 0px))',
      right: 'calc(12px + env(safe-area-inset-right, 0px))',
    });
  });

  it('anchors mobile stacks below the action bar on the top-right edge', () => {
    expect(
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale: 1,
        isMobile: true,
        isFullscreen: false,
      })
    ).toEqual({
      top: 'calc(64px + env(safe-area-inset-top, 0px))',
      right: 'calc(12px + env(safe-area-inset-right, 0px))',
    });
  });
});
