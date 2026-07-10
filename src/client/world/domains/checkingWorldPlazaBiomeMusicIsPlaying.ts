type CheckingWorldPlazaBiomeMusicAudioSlot = {
  audio: HTMLAudioElement;
  tuneId: string | null;
};

/**
 * True when at least one biome music slot is actively playing a tune.
 */
export function checkingWorldPlazaBiomeMusicIsPlaying(
  audioSlots: CheckingWorldPlazaBiomeMusicAudioSlot[]
): boolean {
  return audioSlots.some((slot) => slot.tuneId !== null && !slot.audio.paused);
}
