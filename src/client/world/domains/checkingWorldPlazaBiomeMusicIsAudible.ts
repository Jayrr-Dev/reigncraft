type CheckingWorldPlazaBiomeMusicAudioSlot = {
  audio: HTMLAudioElement;
  tuneId: string | null;
};

/**
 * True when at least one biome music slot is actively playing above silence.
 */
export function checkingWorldPlazaBiomeMusicIsAudible(
  audioSlots: CheckingWorldPlazaBiomeMusicAudioSlot[]
): boolean {
  return audioSlots.some(
    (slot) =>
      slot.tuneId !== null && !slot.audio.paused && slot.audio.volume > 0
  );
}
