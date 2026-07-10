import { resolvingFilmcowFootstepNextClipId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepPlayback';
import { resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeFootstepSizeTier';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier', () => {
  it('maps visual size to wildlife footstep tiers', () => {
    expect(resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(0.5)).toBe(
      'tiny'
    );
    expect(
      resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(0.85)
    ).toBe('small');
    expect(resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(1)).toBe(
      'medium'
    );
    expect(resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(1.3)).toBe(
      'large'
    );
    expect(resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(1.7)).toBe(
      'heavy'
    );
  });
});

describe('resolvingFilmcowFootstepNextClipId for wildlife tiers', () => {
  it('prefers light clips for tiny animals on grass', () => {
    expect(resolvingFilmcowFootstepNextClipId('grass', 'walk', 0, 'tiny')).toBe(
      'grass_light_01'
    );
  });

  it('prefers stomp clips for heavy animals on grass', () => {
    expect(
      resolvingFilmcowFootstepNextClipId('grass', 'walk', 0, 'heavy')
    ).toBe('grass_stomp_01');
  });

  it('uses NOX sand clips on desert surfaces', () => {
    expect(resolvingFilmcowFootstepNextClipId('sand', 'walk', 0)).toBe(
      'nox_sand_walk_01'
    );
  });
});
