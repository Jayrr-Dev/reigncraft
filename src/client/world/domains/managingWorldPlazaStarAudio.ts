/**
 * Shared star-audio instance for every plaza SFX and music hook.
 *
 * One Howler pool keeps Chrome from exhausting WebMediaPlayers in the
 * Devvit iframe. Manifest keys preload once and are reused by every hook.
 *
 * @module components/world/domains/managingWorldPlazaStarAudio
 */

import {
  createStarAudio,
  type Manifest,
  type SoundHandle,
  type StarAudio,
} from 'star-audio';

let managingWorldPlazaStarAudioInstance: StarAudio | null = null;
let managingWorldPlazaStarAudioAcquireCount = 0;
let managingWorldPlazaStarAudioPageUnloadHookRegistered = false;
const preloadedWorldPlazaStarAudioManifestKeys = new Set<string>();

type ManagingWorldPlazaStarAudioActiveSfxPlay = {
  handle: SoundHandle;
  volume: number;
};

/**
 * Active one-shots that need per-instance volume restored after star-audio
 * stomps Howler group volume on each `play()` / `setSfxVolume()`.
 */
const managingWorldPlazaStarAudioActiveSfxPlays: ManagingWorldPlazaStarAudioActiveSfxPlay[] =
  [];

function pruningWorldPlazaStarAudioInactiveSfxPlays(): void {
  for (
    let index = managingWorldPlazaStarAudioActiveSfxPlays.length - 1;
    index >= 0;
    index -= 1
  ) {
    if (!managingWorldPlazaStarAudioActiveSfxPlays[index]?.handle.playing) {
      managingWorldPlazaStarAudioActiveSfxPlays.splice(index, 1);
    }
  }
}

/**
 * Re-applies tracked per-instance volumes after Howler group-volume stomps.
 */
export function reassertingWorldPlazaStarAudioActiveSfxVolumes(): void {
  pruningWorldPlazaStarAudioInactiveSfxPlays();

  for (const activePlay of managingWorldPlazaStarAudioActiveSfxPlays) {
    activePlay.handle.setVolume(activePlay.volume);
  }
}

export type PlayingWorldPlazaStarAudioSfxOptions = {
  volume: number;
  rate?: number;
  duration?: number;
  loop?: boolean;
};

/**
 * Plays an SFX clip with stable per-instance volume.
 *
 * star-audio calls `howl.volume(v)` (no sound id) before `play()`, and Howler
 * applies that to every active instance of the clip. Without reassertion, a
 * nearby animal vocal can make a distant one of the same clip jump to full
 * volume mid-playback.
 */
export function playingWorldPlazaStarAudioSfx(
  id: string,
  options: PlayingWorldPlazaStarAudioSfxOptions
): SoundHandle | null {
  const starAudio = ensuringWorldPlazaStarAudioInstance();
  const handle = starAudio.play(id, {
    group: 'sfx',
    volume: options.volume,
    ...(options.rate !== undefined ? { rate: options.rate } : {}),
    ...(options.loop !== undefined ? { loop: options.loop } : {}),
  });

  if (!handle) {
    return null;
  }

  managingWorldPlazaStarAudioActiveSfxPlays.push({
    handle,
    volume: options.volume,
  });
  reassertingWorldPlazaStarAudioActiveSfxVolumes();

  // star-audio's play() ignores `duration`; stop the instance ourselves so long
  // source files (or shared Howl assets) cannot keep emitting past the cap.
  if (
    options.duration !== undefined &&
    options.duration > 0 &&
    typeof window !== 'undefined'
  ) {
    window.setTimeout(() => {
      if (handle.playing) {
        handle.stop();
      }
    }, options.duration * 1000);
  }

  return handle;
}

/**
 * Updates the tracked volume for one active play and applies it to the handle.
 *
 * Use while a long one-shot is still playing so distance falloff can follow
 * the listener / source after the initial `play()` volume.
 */
export function updatingWorldPlazaStarAudioActiveSfxPlayVolume(
  handle: SoundHandle,
  volume: number
): void {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  const activePlay = managingWorldPlazaStarAudioActiveSfxPlays.find(
    (play) => play.handle === handle
  );

  if (activePlay) {
    activePlay.volume = clampedVolume;
  }

  handle.setVolume(clampedVolume);
}

/**
 * Sets the shared SFX group gain, then restores tracked per-instance volumes.
 */
export function settingWorldPlazaStarAudioSfxGroupVolume(volume: number): void {
  const starAudio = ensuringWorldPlazaStarAudioInstance();
  starAudio.setSfxVolume(volume);
  reassertingWorldPlazaStarAudioActiveSfxVolumes();
}

function destroyingWorldPlazaStarAudioInstance(): void {
  managingWorldPlazaStarAudioInstance?.destroy();
  managingWorldPlazaStarAudioInstance = null;
  managingWorldPlazaStarAudioAcquireCount = 0;
  preloadedWorldPlazaStarAudioManifestKeys.clear();
  managingWorldPlazaStarAudioActiveSfxPlays.length = 0;
}

function registeringWorldPlazaStarAudioPageUnloadHook(): void {
  if (
    managingWorldPlazaStarAudioPageUnloadHookRegistered ||
    typeof window === 'undefined'
  ) {
    return;
  }

  managingWorldPlazaStarAudioPageUnloadHookRegistered = true;
  window.addEventListener('pagehide', destroyingWorldPlazaStarAudioInstance);
}

function ensuringWorldPlazaStarAudioInstance(): StarAudio {
  if (!managingWorldPlazaStarAudioInstance) {
    managingWorldPlazaStarAudioInstance = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
    registeringWorldPlazaStarAudioPageUnloadHook();
  }

  return managingWorldPlazaStarAudioInstance;
}

/** Returns the shared plaza star-audio instance, creating it when needed. */
export function acquiringWorldPlazaStarAudio(): StarAudio {
  managingWorldPlazaStarAudioAcquireCount += 1;
  return ensuringWorldPlazaStarAudioInstance();
}

/**
 * Releases one plaza star-audio consumer.
 *
 * The shared instance stays alive for the page session. star-audio warms 17
 * procedural presets as blob URLs on init; destroying during React StrictMode
 * remounts revokes those URLs while Howler is still loading them, which spams
 * `ERR_FILE_NOT_FOUND` in the Devvit iframe. Teardown runs on `pagehide`.
 */
export function releasingWorldPlazaStarAudio(): void {
  managingWorldPlazaStarAudioAcquireCount = Math.max(
    0,
    managingWorldPlazaStarAudioAcquireCount - 1
  );
}

/**
 * Preloads manifest entries that are not already warmed on the shared instance.
 */
export async function preloadingWorldPlazaStarAudioManifest(
  manifest: Manifest
): Promise<void> {
  const starAudio = ensuringWorldPlazaStarAudioInstance();
  const pendingManifest: Manifest = {};

  for (const [manifestKey, manifestEntry] of Object.entries(manifest)) {
    if (!preloadedWorldPlazaStarAudioManifestKeys.has(manifestKey)) {
      pendingManifest[manifestKey] = manifestEntry;
    }
  }

  const pendingManifestKeys = Object.keys(pendingManifest);

  if (pendingManifestKeys.length === 0) {
    return;
  }

  try {
    await starAudio.preload(pendingManifest);

    for (const manifestKey of pendingManifestKeys) {
      preloadedWorldPlazaStarAudioManifestKeys.add(manifestKey);
    }
  } catch {
    // Runtime hooks retry when their components mount.
  }
}
