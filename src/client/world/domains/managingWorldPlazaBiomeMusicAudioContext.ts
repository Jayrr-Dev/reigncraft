/**
 * Shared Web Audio context for plaza biome music.
 *
 * Decoded buffers avoid iOS MediaElementSource pitch and crackle bugs.
 *
 * @module components/world/domains/managingWorldPlazaBiomeMusicAudioContext
 */

let managingWorldPlazaBiomeMusicAudioContextState: AudioContext | null = null;
let managingWorldPlazaBiomeMusicMasterGainNodeState: GainNode | null = null;

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
 * Returns the shared master gain bus between slot gains and the device output.
 */
export function gettingWorldPlazaBiomeMusicMasterGainNode(
  audioContext: AudioContext
): GainNode {
  if (!managingWorldPlazaBiomeMusicMasterGainNodeState) {
    const masterGainNode = audioContext.createGain();
    masterGainNode.gain.value = 1;
    masterGainNode.connect(audioContext.destination);
    managingWorldPlazaBiomeMusicMasterGainNodeState = masterGainNode;
  }

  return managingWorldPlazaBiomeMusicMasterGainNodeState;
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
  managingWorldPlazaBiomeMusicMasterGainNodeState = null;
}
