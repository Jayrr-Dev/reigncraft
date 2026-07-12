'use client';

import { resolvingWorldPlazaSfxClipEntryVolume } from '@/components/world/audio/resolvingWorldPlazaSfxClipEntry';
import { buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest';
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
  gettingWorldPlazaSelectedAvatarSkinId,
  subscribingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaAvatarMeleeHitOutcomeListener } from '@/components/world/domains/notifyingWorldPlazaAvatarMeleeHitOutcome';
import { playingWorldPlazaAnimalAvatarSpeciesSfx } from '@/components/world/domains/playingWorldPlazaAnimalAvatarSpeciesSfx';
import { registeringWorldPlazaAvatarMeleeSfxPlayback } from '@/components/world/domains/playingWorldPlazaAvatarMeleeSfx';
import { resolvingWorldPlazaAnimalPlayableAvatarSpeciesSfxSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import { resolvingWorldPlazaAvatarMeleeStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeStarAudioId';
import {
  resolvingWorldPlazaAvatarMeleeSwingComboIndexAfterSwing,
  resolvingWorldPlazaAvatarMeleeSwingSfxClipEntry,
  resolvingWorldPlazaAvatarMeleeSwingSfxClipId,
} from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeSwingSfxClipId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Preloads avatar melee clips and wires swing / crit-fatal playback bridges.
 * Animal skins also play wildlife species attack vocals on swing.
 *
 * @module components/world/hooks/usingWorldPlazaAvatarMeleeSfx
 */
export function usingWorldPlazaAvatarMeleeSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const speciesAttackRotationIndexRef = useRef(0);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const preloadingMeleeAndSpeciesSfx = (skinId: string): void => {
      void preloadingWorldPlazaStarAudioManifest({
        ...buildingWorldPlazaAvatarMeleeStarAudioManifest(),
        ...buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest(skinId),
      })
        .then(() => {
          isPreloadReadyRef.current = true;
        })
        .catch(() => {
          isPreloadReadyRef.current = false;
        });
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

      playingWorldPlazaStarAudioSfx(
        resolvingWorldPlazaAvatarMeleeStarAudioId(clipId),
        { volume }
      );
    };

    const playingAnimalSpeciesAttackVocal = (): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const speciesId =
        resolvingWorldPlazaAnimalPlayableAvatarSpeciesSfxSpeciesId(
          gettingWorldPlazaSelectedAvatarSkinId()
        );

      if (!speciesId) {
        return;
      }

      const playback = playingWorldPlazaAnimalAvatarSpeciesSfx({
        speciesId,
        action: 'melee_attack',
        rotationIndex: speciesAttackRotationIndexRef.current,
      });
      speciesAttackRotationIndexRef.current = playback.nextRotationIndex;
    };

    const playingMeleeSwingSfx = (): void => {
      const comboIndex = gettingWorldPlazaAvatarMeleeComboIndex();
      const clipEntry =
        resolvingWorldPlazaAvatarMeleeSwingSfxClipEntry(comboIndex);
      const clipId = resolvingWorldPlazaAvatarMeleeSwingSfxClipId(comboIndex);

      playingClip(
        clipId,
        computingWorldPlazaAvatarMeleeSwingEffectiveTargetVolume(
          resolvingWorldPlazaSfxClipEntryVolume(clipEntry)
        )
      );
      playingAnimalSpeciesAttackVocal();
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
    preloadingMeleeAndSpeciesSfx(gettingWorldPlazaSelectedAvatarSkinId());

    const unsubscribeSfxVolume = subscribingWorldPlazaSfxVolume(
      applyingMasterSfxVolume
    );
    const unsubscribeAvatarSkin = subscribingWorldPlazaSelectedAvatarSkin(
      () => {
        preloadingMeleeAndSpeciesSfx(gettingWorldPlazaSelectedAvatarSkinId());
      }
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
      unsubscribeAvatarSkin();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      speciesAttackRotationIndexRef.current = 0;
      resettingWorldPlazaAvatarMeleeComboIndex();
    };
  }, []);
}
