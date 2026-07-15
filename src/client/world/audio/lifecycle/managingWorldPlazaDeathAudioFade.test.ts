import {
  DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_OUT_MS,
  DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME,
} from '@/components/world/audio/lifecycle/definingWorldPlazaDeathAudioFadeConstants';
import {
  fadingWorldPlazaAudioInOnPlayerRespawn,
  fadingWorldPlazaAudioOutOnPlayerDeath,
  restoringWorldPlazaAudioVolumeAfterDeath,
} from '@/components/world/audio/lifecycle/managingWorldPlazaDeathAudioFade';
import { Howler } from 'howler';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('howler', () => ({
  Howler: {
    volume: vi.fn(),
  },
}));

describe('managingWorldPlazaDeathAudioFade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(Howler.volume).mockClear();
    restoringWorldPlazaAudioVolumeAfterDeath();
    vi.mocked(Howler.volume).mockClear();
  });

  afterEach(() => {
    restoringWorldPlazaAudioVolumeAfterDeath();
    vi.useRealTimers();
  });

  it('fades Howler global volume to silence over the death fade duration', () => {
    fadingWorldPlazaAudioOutOnPlayerDeath();

    vi.advanceTimersByTime(DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_OUT_MS / 2);
    const midCall = vi.mocked(Howler.volume).mock.calls.at(-1)?.[0];
    expect(midCall).toBeGreaterThan(0);
    expect(midCall).toBeLessThan(1);

    vi.advanceTimersByTime(DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_OUT_MS / 2);
    expect(vi.mocked(Howler.volume).mock.calls.at(-1)?.[0]).toBe(0);
  });

  it('fades Howler global volume back in on respawn', () => {
    applyingSilentDeathVolume();
    fadingWorldPlazaAudioInOnPlayerRespawn();

    vi.advanceTimersByTime(5_000);
    expect(vi.mocked(Howler.volume).mock.calls.at(-1)?.[0]).toBe(
      DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME
    );
  });

  it('snaps volume back to full when restoring after death', () => {
    applyingSilentDeathVolume();
    restoringWorldPlazaAudioVolumeAfterDeath();

    expect(vi.mocked(Howler.volume)).toHaveBeenCalledWith(
      DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME
    );
  });
});

function applyingSilentDeathVolume(): void {
  fadingWorldPlazaAudioOutOnPlayerDeath();
  vi.advanceTimersByTime(DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_OUT_MS);
  vi.mocked(Howler.volume).mockClear();
}
