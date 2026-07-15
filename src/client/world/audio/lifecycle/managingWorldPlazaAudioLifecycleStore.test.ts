import { releasingWorldPlazaAudioScopesByPrefix } from '@/components/world/audio/engine/managingWorldPlazaAudioScopeStore';
import {
  peekingWorldPlazaAudioLifecycleSnapshot,
  sendingWorldPlazaAudioLifecycleEvent,
} from '@/components/world/audio/lifecycle/managingWorldPlazaAudioLifecycleStore';
import {
  fadingWorldPlazaAudioInOnPlayerRespawn,
  fadingWorldPlazaAudioOutOnPlayerDeath,
  restoringWorldPlazaAudioVolumeAfterDeath,
} from '@/components/world/audio/lifecycle/managingWorldPlazaDeathAudioFade';
import { playingWorldPlazaDeathSfx } from '@/components/world/audio/lifecycle/playingWorldPlazaDeathSfx';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/audio/engine/managingWorldPlazaAudioScopeStore',
  () => ({
    releasingWorldPlazaAudioScopesByPrefix: vi.fn(),
  })
);

vi.mock(
  '@/components/world/audio/lifecycle/managingWorldPlazaDeathAudioFade',
  () => ({
    fadingWorldPlazaAudioOutOnPlayerDeath: vi.fn(),
    fadingWorldPlazaAudioInOnPlayerRespawn: vi.fn(),
    restoringWorldPlazaAudioVolumeAfterDeath: vi.fn(),
  })
);

vi.mock('@/components/world/audio/lifecycle/playingWorldPlazaDeathSfx', () => ({
  playingWorldPlazaDeathSfx: vi.fn(),
}));

describe('managingWorldPlazaAudioLifecycleStore', () => {
  beforeEach(() => {
    sendingWorldPlazaAudioLifecycleEvent('EXIT_HOME');
    vi.mocked(releasingWorldPlazaAudioScopesByPrefix).mockClear();
    vi.mocked(playingWorldPlazaDeathSfx).mockClear();
    vi.mocked(fadingWorldPlazaAudioOutOnPlayerDeath).mockClear();
    vi.mocked(fadingWorldPlazaAudioInOnPlayerRespawn).mockClear();
    vi.mocked(restoringWorldPlazaAudioVolumeAfterDeath).mockClear();
  });

  it('advances home through boot into the active world', () => {
    sendingWorldPlazaAudioLifecycleEvent('SESSION_STARTED');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe(
      'boot.assets'
    );

    sendingWorldPlazaAudioLifecycleEvent('ASSETS_READY');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe(
      'boot.spawn'
    );

    sendingWorldPlazaAudioLifecycleEvent('SPAWN_READY');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe(
      'world.alive'
    );
  });

  it('tracks death, respawn, and exit cleanup', () => {
    sendingWorldPlazaAudioLifecycleEvent('SESSION_STARTED');
    sendingWorldPlazaAudioLifecycleEvent('ASSETS_READY');
    sendingWorldPlazaAudioLifecycleEvent('SPAWN_READY');
    sendingWorldPlazaAudioLifecycleEvent('PLAYER_DIED');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe(
      'world.dead'
    );
    expect(playingWorldPlazaDeathSfx).toHaveBeenCalledOnce();
    expect(fadingWorldPlazaAudioOutOnPlayerDeath).toHaveBeenCalledOnce();

    sendingWorldPlazaAudioLifecycleEvent('PLAYER_RESPAWNED');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe(
      'world.alive'
    );
    expect(fadingWorldPlazaAudioInOnPlayerRespawn).toHaveBeenCalledOnce();

    sendingWorldPlazaAudioLifecycleEvent('EXIT_HOME');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe('home');
    expect(releasingWorldPlazaAudioScopesByPrefix).toHaveBeenCalledWith(
      'world:'
    );
    expect(restoringWorldPlazaAudioVolumeAfterDeath).toHaveBeenCalled();
  });
});
