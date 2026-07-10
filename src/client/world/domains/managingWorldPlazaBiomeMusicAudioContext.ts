/**
 * Shared Web Audio context for plaza biome music.
 *
 * iOS Safari blocks reliable HTMLMediaElement.volume fades; gain is routed here instead.
 *
 * @module components/world/domains/managingWorldPlazaBiomeMusicAudioContext
 */

let managingWorldPlazaBiomeMusicAudioContextState: AudioContext | null = null;

/**
 * Returns the shared biome music audio context, creating it when needed.
 */
export function gettingWorldPlazaBiomeMusicAudioContext(): AudioContext {
  if (!managingWorldPlazaBiomeMusicAudioContextState) {
    managingWorldPlazaBiomeMusicAudioContextState = new AudioContext();
  }

  return managingWorldPlazaBiomeMusicAudioContextState;
}

/**
 * Resumes the shared context during a user gesture so playback can start on mobile.
 */
export function resumingWorldPlazaBiomeMusicAudioContext(): void {
  const context = gettingWorldPlazaBiomeMusicAudioContext();

  if (context.state === 'suspended') {
    void context.resume();
  }
}

/**
 * Closes and clears the shared context (hook teardown).
 */
export function closingWorldPlazaBiomeMusicAudioContext(): void {
  void managingWorldPlazaBiomeMusicAudioContextState?.close();
  managingWorldPlazaBiomeMusicAudioContextState = null;
}
