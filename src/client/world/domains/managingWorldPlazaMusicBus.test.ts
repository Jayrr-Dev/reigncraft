import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/world/domains/managingWorldPlazaStarAudio', () => ({
  checkingWorldPlazaStarAudioManifestKeyIsPreloaded: () => true,
}));

import {
  crossfadingWorldPlazaMusicBusTo,
  gettingWorldPlazaMusicBusActiveStarAudioId,
  settingWorldPlazaMusicBusTargetVolume,
  stoppingWorldPlazaMusicBus,
  type ManagingWorldPlazaMusicBusStarAudio,
} from '@/components/world/domains/managingWorldPlazaMusicBus';
import type { SoundHandle } from 'star-audio';

function creatingMockSoundHandle(id: string): SoundHandle {
  let playing = true;

  return {
    id,
    get playing() {
      return playing;
    },
    stop() {
      playing = false;
    },
    setVolume() {
      // Volume asserts are covered by active-id / playing checks.
    },
  };
}

function creatingMockStarAudio(
  playImpl: (id: string) => SoundHandle | null
): ManagingWorldPlazaMusicBusStarAudio {
  return {
    play(id) {
      return playImpl(id);
    },
  };
}

describe('managingWorldPlazaMusicBus', () => {
  beforeEach(() => {
    stoppingWorldPlazaMusicBus(0);
    settingWorldPlazaMusicBusTargetVolume(0.4);
  });

  afterEach(() => {
    stoppingWorldPlazaMusicBus(0);
  });

  it('keeps a single active track id when switching tunes', () => {
    const playedIds: string[] = [];
    const handles: SoundHandle[] = [];

    const starAudio = creatingMockStarAudio((id) => {
      playedIds.push(id);
      const handle = creatingMockSoundHandle(id);
      handles.push(handle);
      return handle;
    });

    crossfadingWorldPlazaMusicBusTo(starAudio, 'biome-music.sheep', {
      durationSec: 0,
      loop: true,
    });

    expect(gettingWorldPlazaMusicBusActiveStarAudioId()).toBe(
      'biome-music.sheep'
    );
    expect(handles[0]?.playing).toBe(true);

    crossfadingWorldPlazaMusicBusTo(starAudio, 'biome-music.golden_gleam', {
      durationSec: 0,
      loop: true,
    });

    expect(gettingWorldPlazaMusicBusActiveStarAudioId()).toBe(
      'biome-music.golden_gleam'
    );
    expect(handles[0]?.playing).toBe(false);
    expect(handles[1]?.playing).toBe(true);
    expect(playedIds).toEqual([
      'biome-music.sheep',
      'biome-music.golden_gleam',
    ]);
  });

  it('hard-stops a prior fade-out when a newer track starts', () => {
    vi.useFakeTimers();

    const handles: SoundHandle[] = [];
    const starAudio = creatingMockStarAudio((id) => {
      const handle = creatingMockSoundHandle(id);
      handles.push(handle);
      return handle;
    });

    crossfadingWorldPlazaMusicBusTo(starAudio, 'biome-music.sheep', {
      durationSec: 0,
      loop: true,
    });
    crossfadingWorldPlazaMusicBusTo(starAudio, 'biome-music.golden_gleam', {
      durationSec: 1,
      loop: true,
    });

    expect(handles[0]?.playing).toBe(true);
    expect(handles[1]?.playing).toBe(true);

    crossfadingWorldPlazaMusicBusTo(starAudio, 'biome-music.forgotten_biomes', {
      durationSec: 1,
      loop: true,
    });

    expect(handles[0]?.playing).toBe(false);
    expect(handles[1]?.playing).toBe(true);
    expect(handles[2]?.playing).toBe(true);
    expect(gettingWorldPlazaMusicBusActiveStarAudioId()).toBe(
      'biome-music.forgotten_biomes'
    );

    vi.useRealTimers();
  });

  it('does not restart when the requested track is already active', () => {
    let playCount = 0;
    const starAudio = creatingMockStarAudio((id) => {
      playCount += 1;
      return creatingMockSoundHandle(id);
    });

    crossfadingWorldPlazaMusicBusTo(starAudio, 'biome-music.sheep', {
      durationSec: 0,
      loop: true,
    });
    crossfadingWorldPlazaMusicBusTo(starAudio, 'biome-music.sheep', {
      durationSec: 0,
      loop: true,
    });

    expect(playCount).toBe(1);
  });
});
