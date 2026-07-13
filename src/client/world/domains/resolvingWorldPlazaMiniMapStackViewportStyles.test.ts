import {
  resolvingWorldPlazaMiniMapStackCornerViewportStyles,
  resolvingWorldPlazaMiniMapStackViewportStyles,
} from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaMiniMapStackViewportStyles', () => {
  it('anchors desktop stacks to the top-left edge on the action bar row', () => {
    expect(
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale: 1,
        isMobile: false,
        isFullscreen: false,
      })
    ).toEqual({
      top: 'calc(4px + env(safe-area-inset-top, 0px))',
      left: 'calc(4px + env(safe-area-inset-left, 0px))',
    });
  });

  it('anchors mobile stacks to the top-left edge on the action bar row', () => {
    expect(
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale: 1,
        isMobile: true,
        isFullscreen: false,
      })
    ).toEqual({
      top: 'calc(4px + env(safe-area-inset-top, 0px))',
      left: 'calc(4px + env(safe-area-inset-left, 0px))',
    });
  });
});

describe('resolvingWorldPlazaMiniMapStackCornerViewportStyles', () => {
  it('pins desktop maps to the top-right edge', () => {
    expect(
      resolvingWorldPlazaMiniMapStackCornerViewportStyles({
        viewportHudScale: 1,
        isMobile: false,
        isFullscreen: false,
      })
    ).toEqual({
      top: 'calc(4px + env(safe-area-inset-top, 0px))',
      right: 'calc(4px + env(safe-area-inset-right, 0px))',
    });
  });
});
