import { resolvingWorldPlazaViewportProfile } from '@/components/world/domains/resolvingWorldPlazaViewportProfile';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaViewportProfile', () => {
  it('returns mobile for narrow inline viewports', () => {
    expect(resolvingWorldPlazaViewportProfile(true, false, false, 0.7)).toBe(
      'mobile'
    );
  });

  it('returns desktop as the second inline profile on wide viewports', () => {
    expect(resolvingWorldPlazaViewportProfile(false, false, false, 1)).toBe(
      'desktop'
    );
  });

  it('returns fullscreen for Devvit expanded mode', () => {
    expect(resolvingWorldPlazaViewportProfile(false, false, true, 1)).toBe(
      'fullscreen'
    );
  });

  it('returns fullscreen for native fullscreen', () => {
    expect(resolvingWorldPlazaViewportProfile(false, true, false, 1)).toBe(
      'fullscreen'
    );
  });

  it('returns fullscreen for wide playtest viewports above the HUD scale threshold', () => {
    expect(resolvingWorldPlazaViewportProfile(false, false, false, 1.2)).toBe(
      'fullscreen'
    );
  });
});
