'use client';

import { useUserData } from '@/components/hooks/useAuth';
import { checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked } from '@/components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked';
import { checkingWorldPlazaAvatarSkinAccessForUser } from '@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser';
import { checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist } from '@/components/world/domains/checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist';
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
  checkingWorldPlazaPermaDeathLoadEnabled,
  subscribingWorldPlazaPermaDeathLoad,
} from '@/components/world/domains/managingWorldPlazaPermaDeathLoadStore';
import {
  checkingWorldPlazaRandomAnimalLoadEnabled,
  subscribingWorldPlazaRandomAnimalLoad,
} from '@/components/world/domains/managingWorldPlazaRandomAnimalLoadStore';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * Clears a restricted avatar skin when allowlist or bestiary mastery fails.
 *
 * Random Animal and Perma Death loads skip the study gate. Dedicated slot
 * owners also keep their form when session flags clear on the way home, so
 * leave / refresh cannot overwrite the persisted animal with girl-sample.
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
  const isPermaDeathLoadEnabled = useSyncExternalStore(
    subscribingWorldPlazaPermaDeathLoad,
    checkingWorldPlazaPermaDeathLoadEnabled,
    checkingWorldPlazaPermaDeathLoadEnabled
  );

  useEffect(() => {
    if (isRandomAnimalLoadEnabled || isPermaDeathLoadEnabled) {
      return;
    }

    if (checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist()) {
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
    isPermaDeathLoadEnabled,
    isRandomAnimalLoadEnabled,
    studyCountsBySpeciesId,
    userData?.alias,
    userData?.username,
  ]);
}
