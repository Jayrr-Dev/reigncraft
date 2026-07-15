'use client';

import { useUserData } from '@/components/hooks/useAuth';
import { checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked } from '@/components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked';
import { checkingWorldPlazaAvatarSkinAccessForUser } from '@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  settingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  gettingWorldPlazaBestiaryStudyCountsSnapshot,
  subscribingWorldPlazaBestiaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import {
  checkingWorldPlazaRandomAnimalLoadEnabled,
  subscribingWorldPlazaRandomAnimalLoad,
} from '@/components/world/domains/managingWorldPlazaRandomAnimalLoadStore';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * Clears a restricted avatar skin when allowlist or bestiary mastery fails.
 */
export function usingWorldPlazaGuardingAvatarSkinAccess(): void {
  const { data: userData } = useUserData();
  const studyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryStudyCountsSnapshot,
    gettingWorldPlazaBestiaryStudyCountsSnapshot
  );
  const isRandomAnimalLoadEnabled = useSyncExternalStore(
    subscribingWorldPlazaRandomAnimalLoad,
    checkingWorldPlazaRandomAnimalLoadEnabled,
    checkingWorldPlazaRandomAnimalLoadEnabled
  );

  useEffect(() => {
    if (isRandomAnimalLoadEnabled) {
      return;
    }

    const selectedSkinId = gettingWorldPlazaSelectedAvatarSkinId();

    if (
      checkingWorldPlazaAvatarSkinAccessForUser(
        selectedSkinId,
        userData?.username,
        userData?.alias
      ) &&
      checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked(
        selectedSkinId,
        studyCountsBySpeciesId
      )
    ) {
      return;
    }

    settingWorldPlazaSelectedAvatarSkin(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT
    );
  }, [
    isRandomAnimalLoadEnabled,
    studyCountsBySpeciesId,
    userData?.alias,
    userData?.username,
  ]);
}
