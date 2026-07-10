/**
 * Imperative bridge from combat code to the active avatar melee SFX hook.
 *
 * @module components/world/domains/playingWorldPlazaAvatarMeleeSfx
 */

import { notifyingWorldPlazaGirlSampleVoiceSfxEvent } from '@/components/world/domains/notifyingWorldPlazaGirlSampleVoiceSfxEvent';

let playingWorldPlazaAvatarMeleeSwingSfxPlayback: (() => void) | null = null;
let playingWorldPlazaAvatarMeleeCritFatalSfxPlayback: (() => void) | null =
  null;

/**
 * Registers swing and crit/fatal playback handlers from {@link usingWorldPlazaAvatarMeleeSfx}.
 */
export function registeringWorldPlazaAvatarMeleeSfxPlayback(playback: {
  playSwing: () => void;
  playCritFatal: () => void;
}): () => void {
  playingWorldPlazaAvatarMeleeSwingSfxPlayback = playback.playSwing;
  playingWorldPlazaAvatarMeleeCritFatalSfxPlayback = playback.playCritFatal;

  return () => {
    if (playingWorldPlazaAvatarMeleeSwingSfxPlayback === playback.playSwing) {
      playingWorldPlazaAvatarMeleeSwingSfxPlayback = null;
    }

    if (
      playingWorldPlazaAvatarMeleeCritFatalSfxPlayback ===
      playback.playCritFatal
    ) {
      playingWorldPlazaAvatarMeleeCritFatalSfxPlayback = null;
    }
  };
}

/**
 * Plays the next swipe/slap step in the local avatar melee combo.
 */
export function playingWorldPlazaAvatarMeleeSwingSfx(): void {
  playingWorldPlazaAvatarMeleeSwingSfxPlayback?.();
  notifyingWorldPlazaGirlSampleVoiceSfxEvent({ eventKind: 'attack_swing' });
}

/**
 * Plays the punch impact clip for crits and fatal hits.
 */
export function playingWorldPlazaAvatarMeleeCritFatalSfx(): void {
  playingWorldPlazaAvatarMeleeCritFatalSfxPlayback?.();
}
