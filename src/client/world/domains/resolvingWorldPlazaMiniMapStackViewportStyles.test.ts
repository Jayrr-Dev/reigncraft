import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import {
  computingWorldPlazaInventoryHotbarOccupiedHeightPx,
  computingWorldPlazaMiniMapStackMobileHotbarClearanceBottomPx,
  resolvingWorldPlazaMiniMapStackViewportStyles,
} from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
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
      left: 'max(12px, env(safe-area-inset-left, 0px))',
      bottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
    });
  });

  it('lifts mobile stacks above the inventory hotbar', () => {
    const inventoryHotbarClearance =
      DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.viewportLayouts.embedded.mobile
        .inventoryHotbarClearance;
    if (!inventoryHotbarClearance) {
      throw new Error('Expected embedded mobile hotbar clearance layout.');
    }

    const hotbarHeightPx = computingWorldPlazaInventoryHotbarOccupiedHeightPx(
      1,
      inventoryHotbarClearance
    );
    const expectedBottomPx =
      computingWorldPlazaMiniMapStackMobileHotbarClearanceBottomPx(
        1,
        inventoryHotbarClearance
      );

    expect(expectedBottomPx).toBe(12 + hotbarHeightPx + 8);
    expect(
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale: 1,
        isMobile: true,
        isFullscreen: false,
        isInventoryHotbarVisible: true,
      })
    ).toEqual({
      left: 'max(12px, env(safe-area-inset-left, 0px))',
      bottom: `max(${expectedBottomPx}px, env(safe-area-inset-bottom, 0px))`,
    });
  });
});
