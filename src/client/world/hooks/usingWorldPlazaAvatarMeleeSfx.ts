'use client';

import { buildingWorldPlazaAvatarMeleeStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarMeleeStarAudioManifest';
import { checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx } from '@/components/world/domains/checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx';
import {
  computingWorldPlazaAvatarMeleeCritFatalEffectiveTargetVolume,
  computingWorldPlazaAvatarMeleeSwingEffectiveTargetVolume,
} from '@/components/world/domains/computingWorldPlazaAvatarMeleeEffectiveTargetVolume';
import type { DefiningWorldPlazaAvatarMeleeClipId } from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';
import {
  gettingWorldPlazaAvatarMeleeComboIndex,
  resettingWorldPlazaAvatarMeleeComboIndex,
  settingWorldPlazaAvatarMeleeComboIndex,
} from '@/components/world/domains/managingWorldPlazaAvatarMeleeComboIndexStore';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaAvatarMeleeHitOutcomeListener } from '@/components/world/domains/notifyingWorldPlazaAvatarMeleeHitOutcome';
import { registeringWorldPlazaAvatarMeleeSfxPlayback } from '@/components/world/domains/playingWorldPlazaAvatarMeleeSfx';
import { resolvingWorldPlazaAvatarMeleeStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeStarAudioId';
import {
  resolvingWorldPlazaAvatarMeleeSwingComboIndexAfterSwing,
  resolvingWorldPlazaAvatarMeleeSwingSfxClipId,
} from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeSwingSfxClipId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads avatar melee clips and wires swing / crit-fatal playback bridges.
 *
 * @module components/world/hooks/usingWorldPlazaAvatarMeleeSfx
 */
export function usingWorldPlazaAvatarMeleeSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      starAudio.setSfxVolume(1);
    };

    const playingClip = (
      clipId: DefiningWorldPlazaAvatarMeleeClipId,
      volume: number
    ): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      if (volume <= 0) {
        return;
      }

      starAudio.play(resolvingWorldPlazaAvatarMeleeStarAudioId(clipId), {
        group: 'sfx',
        volume,
      });
    };

    const playingMeleeSwingSfx = (): void => {
      const comboIndex = gettingWorldPlazaAvatarMeleeComboIndex();
      const clipId = resolvingWorldPlazaAvatarMeleeSwingSfxClipId(comboIndex);

      playingClip(
        clipId,
        computingWorldPlazaAvatarMeleeSwingEffectiveTargetVolume()
      );
      settingWorldPlazaAvatarMeleeComboIndex(
        resolvingWorldPlazaAvatarMeleeSwingComboIndexAfterSwing(comboIndex)
      );
    };

    const playingMeleeCritFatalSfx = (): void => {
      playingClip(
        'punch_1',
        computingWorldPlazaAvatarMeleeCritFatalEffectiveTargetVolume()
      );
    };

    const handlingMeleeHitOutcome = (outcomeTier: string | null): void => {
      if (
        !checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx(outcomeTier)
      ) {
        return;
      }

      playingMeleeCritFatalSfx();
    };

    const unlockingAndRetryingMeleeSfx = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaAvatarMeleeStarAudioManifest()
    )
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unsubscribeSfxVolume = subscribingWorldPlazaSfxVolume(
      applyingMasterSfxVolume
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingMeleeSfx
      );
    const unregisterHitOutcomeListener =
      registeringWorldPlazaAvatarMeleeHitOutcomeListener(
        handlingMeleeHitOutcome
      );
    const unregisterPlaybackBridge =
      registeringWorldPlazaAvatarMeleeSfxPlayback({
        playSwing: playingMeleeSwingSfx,
        playCritFatal: playingMeleeCritFatalSfx,
      });

    return () => {
      unregisterPlaybackBridge();
      unregisterHitOutcomeListener();
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      resettingWorldPlazaAvatarMeleeComboIndex();
    };
  }, []);
}
