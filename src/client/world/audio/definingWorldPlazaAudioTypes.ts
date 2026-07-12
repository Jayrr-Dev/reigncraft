/**
 * Public contracts for the plaza audio engine.
 *
 * Domain manifests and hooks depend on these types, never on Howler directly.
 *
 * @module components/world/audio/definingWorldPlazaAudioTypes
 */

export type WorldPlazaAudioGroup = 'music' | 'ambience' | 'sfx';

export type WorldPlazaAudioManifestObjectEntry = {
  readonly src?: string | readonly string[];
  readonly url?: string | readonly string[];
  readonly group?: WorldPlazaAudioGroup;
  readonly stream?: boolean;
};

export type WorldPlazaAudioManifestEntry =
  | string
  | readonly string[]
  | WorldPlazaAudioManifestObjectEntry;

export type Manifest = Record<string, WorldPlazaAudioManifestEntry>;

export type WorldPlazaAudioEngineState = 'locked' | 'running' | 'suspended';

export type WorldPlazaAudioEngineEvent = 'unlocked' | 'suspended' | 'resumed';

export type WorldPlazaAudioPlayOptions = {
  readonly group?: WorldPlazaAudioGroup;
  readonly volume?: number;
  readonly rate?: number;
  readonly loop?: boolean;
  readonly priority?: number;
};

export type SoundHandle = {
  readonly id: string;
  readonly soundId?: number;
  readonly playing: boolean;
  stop: () => void;
  setVolume: (volume: number) => void;
};

export type StarAudio = {
  readonly state: WorldPlazaAudioEngineState;
  play: (
    id: string,
    options?: WorldPlazaAudioPlayOptions
  ) => SoundHandle | null;
  preload: (manifest: Manifest) => Promise<void>;
  setSfxVolume: (volume: number) => void;
  unlock: () => Promise<void>;
  on: (event: WorldPlazaAudioEngineEvent, listener: () => void) => void;
  off: (event: WorldPlazaAudioEngineEvent, listener: () => void) => void;
  destroy: () => void;
};
