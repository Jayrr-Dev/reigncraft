type CheckingWorldPlazaBiomeMusicAudioSlot = {
  gainNode: GainNode;
  tuneId: string | null;
  isPlaying: boolean;
};

/**
 * True when at least one biome music slot is actively playing above silence.
 */
export function checkingWorldPlazaBiomeMusicIsAudible(
  audioSlots: CheckingWorldPlazaBiomeMusicAudioSlot[]
): boolean {
  return audioSlots.some(
    (slot) =>
      slot.tuneId !== null && slot.isPlaying && slot.gainNode.gain.value > 0.001
  );
}
