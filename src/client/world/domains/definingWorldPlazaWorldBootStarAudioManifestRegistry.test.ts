import {
  resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders,
  resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders,
} from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry';
import { checkingWildlifeTextureEvictionMobileViewport } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile',
  () => ({
    checkingWildlifeTextureEvictionMobileViewport: vi.fn(() => false),
  })
);

describe('resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders', () => {
  afterEach(() => {
    vi.mocked(checkingWildlifeTextureEvictionMobileViewport).mockReturnValue(
      false
    );
  });

  it('keeps desktop boot critical to music, footsteps, and girl voice', () => {
    vi.mocked(checkingWildlifeTextureEvictionMobileViewport).mockReturnValue(
      false
    );

    expect(
      resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders()
    ).toHaveLength(3);
    expect(
      resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders()
    ).toHaveLength(1);
  });

  it('keeps mobile critical to music, footsteps, and girl voice', () => {
    vi.mocked(checkingWildlifeTextureEvictionMobileViewport).mockReturnValue(
      true
    );

    expect(
      resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders()
    ).toHaveLength(3);
    expect(
      resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders()
    ).toHaveLength(1);
  });
});
