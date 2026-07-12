import {
  peekingWorldPlazaAudioLifecycleSnapshot,
  sendingWorldPlazaAudioLifecycleEvent,
} from '@/components/world/audio/lifecycle/managingWorldPlazaAudioLifecycleStore';
import { releasingWorldPlazaAudioScopesByPrefix } from '@/components/world/audio/engine/managingWorldPlazaAudioScopeStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/audio/engine/managingWorldPlazaAudioScopeStore',
  () => ({
    releasingWorldPlazaAudioScopesByPrefix: vi.fn(),
  })
);

describe('managingWorldPlazaAudioLifecycleStore', () => {
  beforeEach(() => {
    sendingWorldPlazaAudioLifecycleEvent('EXIT_HOME');
    vi.mocked(releasingWorldPlazaAudioScopesByPrefix).mockClear();
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

    sendingWorldPlazaAudioLifecycleEvent('PLAYER_RESPAWNED');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe(
      'world.alive'
    );

    sendingWorldPlazaAudioLifecycleEvent('EXIT_HOME');
    expect(peekingWorldPlazaAudioLifecycleSnapshot().currentState).toBe('home');
    expect(releasingWorldPlazaAudioScopesByPrefix).toHaveBeenCalledWith(
      'world:'
    );
  });
});
