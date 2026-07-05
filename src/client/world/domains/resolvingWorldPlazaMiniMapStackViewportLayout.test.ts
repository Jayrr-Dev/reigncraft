import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import { resolvingWorldPlazaMiniMapStackViewportLayout } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportLayout';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaMiniMapStackViewportLayout', () => {
  it('returns the embedded desktop profile', () => {
    expect(resolvingWorldPlazaMiniMapStackViewportLayout(false, false)).toBe(
      DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.viewportLayouts.embedded
        .desktop
    );
  });

  it('returns the embedded mobile profile aligned with the hotbar bottom', () => {
    expect(resolvingWorldPlazaMiniMapStackViewportLayout(true, false)).toBe(
      DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.viewportLayouts.embedded.mobile
    );
  });

  it('returns the fullscreen profile without hotbar clearance on mobile', () => {
    expect(resolvingWorldPlazaMiniMapStackViewportLayout(true, true)).toBe(
      DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.viewportLayouts.fullscreen
        .mobile
    );
  });
});
