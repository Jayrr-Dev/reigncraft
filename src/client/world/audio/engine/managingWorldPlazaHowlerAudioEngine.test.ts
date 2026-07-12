import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import { creatingWorldPlazaHowlerAudioEngine } from '@/components/world/audio/engine/managingWorldPlazaHowlerAudioEngine';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type FakeHowlInstance = {
  readonly volumes: Map<number, number>;
  readonly playingIds: Set<number>;
  isUnloaded: boolean;
};

const howlerMocks = vi.hoisted<{
  instances: FakeHowlInstance[];
  context: {
    state: 'running' | 'suspended';
    resume: () => Promise<void>;
    suspend: () => Promise<void>;
  };
}>(() => {
  const context: {
    state: 'running' | 'suspended';
    resume: () => Promise<void>;
    suspend: () => Promise<void>;
  } = {
    state: 'suspended',
    resume: async (): Promise<void> => {},
    suspend: async (): Promise<void> => {},
  };

  return {
    instances: [],
    context,
  };
});

vi.mock('howler', () => {
  let nextSoundId = 1;

  class FakeHowl {
    readonly volumes = new Map<number, number>();
    readonly playingIds = new Set<number>();
    isUnloaded = false;
    private loadState: 'unloaded' | 'loaded' = 'unloaded';
    private listeners = new Map<string, Set<() => void>>();

    constructor() {
      howlerMocks.instances.push(this);
    }

    state(): 'unloaded' | 'loaded' {
      return this.loadState;
    }

    once(event: string, listener: () => void): void {
      const listeners = this.listeners.get(event) ?? new Set<() => void>();
      listeners.add(listener);
      this.listeners.set(event, listeners);
    }

    off(event: string, listener: () => void): void {
      this.listeners.get(event)?.delete(listener);
    }

    load(): void {
      this.loadState = 'loaded';
      this.listeners.get('load')?.forEach((listener) => listener());
      this.listeners.delete('load');
    }

    play(soundId?: number): number {
      const resolvedSoundId = soundId ?? nextSoundId;
      nextSoundId += soundId === undefined ? 1 : 0;
      this.playingIds.add(resolvedSoundId);
      return resolvedSoundId;
    }

    playing(soundId: number): boolean {
      return this.playingIds.has(soundId);
    }

    volume(volume: number, soundId: number): void {
      this.volumes.set(soundId, volume);
    }

    rate(): void {}

    loop(): void {}

    pause(soundId: number): void {
      this.playingIds.delete(soundId);
    }

    stop(soundId: number): void {
      this.playingIds.delete(soundId);
    }

    unload(): void {
      this.isUnloaded = true;
      this.playingIds.clear();
    }
  }

  howlerMocks.context.resume = async (): Promise<void> => {
    howlerMocks.context.state = 'running';
  };
  howlerMocks.context.suspend = async (): Promise<void> => {
    howlerMocks.context.state = 'suspended';
  };

  return {
    Howl: FakeHowl,
    Howler: {
      usingWebAudio: true,
      ctx: howlerMocks.context,
      unload: vi.fn(),
    },
  };
});

describe('creatingWorldPlazaHowlerAudioEngine', () => {
  beforeEach(() => {
    howlerMocks.instances.length = 0;
    howlerMocks.context.state = 'suspended';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dedupes manifest loads and keeps simultaneous instance gain independent', async () => {
    const engine = creatingWorldPlazaHowlerAudioEngine();
    const manifest: Manifest = {
      step: {
        src: '/audio/step.opus',
        group: 'sfx',
      },
    };

    await Promise.all([engine.preload(manifest), engine.preload(manifest)]);
    expect(howlerMocks.instances).toHaveLength(1);
    expect(engine.checkingManifestKeyIsLoaded('step')).toBe(true);

    await engine.unlock();
    const quiet = engine.play('step', { volume: 0.2 });
    const loud = engine.play('step', { volume: 0.8 });

    expect(quiet).not.toBeNull();
    expect(loud).not.toBeNull();

    if (
      quiet?.soundId === undefined ||
      loud?.soundId === undefined ||
      !howlerMocks.instances[0]
    ) {
      throw new Error('Expected two Howler sound ids.');
    }

    expect(howlerMocks.instances[0].volumes.get(quiet.soundId)).toBe(0.2);
    expect(howlerMocks.instances[0].volumes.get(loud.soundId)).toBe(0.8);

    quiet.setVolume(0.1);
    expect(howlerMocks.instances[0].volumes.get(quiet.soundId)).toBe(0.1);
    expect(howlerMocks.instances[0].volumes.get(loud.soundId)).toBe(0.8);
    engine.destroy();
  });

  it('blocks playback until unlock and unloads inactive assets', async () => {
    const engine = creatingWorldPlazaHowlerAudioEngine();
    await engine.preload({ click: '/audio/click.opus' });

    expect(engine.play('click')).toBeNull();

    await engine.unlock();
    const handle = engine.play('click');
    expect(handle?.playing).toBe(true);
    handle?.stop();

    engine.unloadingManifestKeys(['click']);
    expect(engine.checkingManifestKeyIsLoaded('click')).toBe(false);
    expect(howlerMocks.instances[0]?.isUnloaded).toBe(true);
    engine.destroy();
  });
});
