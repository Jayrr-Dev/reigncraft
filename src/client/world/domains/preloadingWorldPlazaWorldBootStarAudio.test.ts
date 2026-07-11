import { DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_TIMEOUT_MS } from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioConstants';
import {
  resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders,
  resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders,
} from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry';
import { preloadingWorldPlazaStarAudioManifest } from '@/components/world/domains/managingWorldPlazaStarAudio';
import { preloadingWorldPlazaWorldBootStarAudio } from '@/components/world/domains/preloadingWorldPlazaWorldBootStarAudio';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/world/domains/managingWorldPlazaStarAudio', () => ({
  preloadingWorldPlazaStarAudioManifest: vi.fn(),
}));

vi.mock(
  '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry',
  () => ({
    resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders: vi.fn(() => [
      () => ({ 'test.music': { src: '/music.ogg', group: 'music' } }),
      () => ({ 'test.footstep': { src: '/step.ogg', group: 'sfx' } }),
    ]),
    resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders: vi.fn(
      () => []
    ),
  })
);

describe('preloadingWorldPlazaWorldBootStarAudio', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('advances past a hung priority manifest after the boot timeout', async () => {
    vi.useFakeTimers();
    vi.mocked(preloadingWorldPlazaStarAudioManifest).mockImplementation(
      () => new Promise(() => {})
    );

    const progressRatios: number[] = [];
    const bootPromise = preloadingWorldPlazaWorldBootStarAudio((ratio) => {
      progressRatios.push(ratio);
    });

    await vi.advanceTimersByTimeAsync(
      DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_TIMEOUT_MS
    );
    await vi.advanceTimersByTimeAsync(
      DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_TIMEOUT_MS
    );
    await bootPromise;

    expect(progressRatios).toEqual([0.5, 1]);
    expect(preloadingWorldPlazaStarAudioManifest).toHaveBeenCalledTimes(2);
    expect(
      resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders
    ).toHaveBeenCalled();
    expect(
      resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders
    ).toHaveBeenCalled();
  });
});
