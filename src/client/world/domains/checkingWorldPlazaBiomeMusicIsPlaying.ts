type CheckingWorldPlazaBiomeMusicAudioSlot = {
  gainNode: GainNode;
  tuneId: string | null;
  isPlaying: boolean;
};

/**
 * True when at least one biome music slot is actively playing a tune.
 */
export function checkingWorldPlazaBiomeMusicIsPlaying(
  audioSlots: CheckingWorldPlazaBiomeMusicAudioSlot[]
): boolean {
  return audioSlots.some((slot) => slot.tuneId !== null && slot.isPlaying);
}
