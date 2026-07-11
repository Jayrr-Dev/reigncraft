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

  it('keeps the full desktop priority set off mobile', () => {
    vi.mocked(checkingWildlifeTextureEvictionMobileViewport).mockReturnValue(
      false
    );

    expect(
      resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders()
    ).toHaveLength(6);
    expect(
      resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders()
    ).toHaveLength(0);
  });

  it('slims mobile priority to music + footsteps and defers the rest', () => {
    vi.mocked(checkingWildlifeTextureEvictionMobileViewport).mockReturnValue(
      true
    );

    expect(
      resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders()
    ).toHaveLength(2);
    expect(
      resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders()
    ).toHaveLength(4);
  });
});
