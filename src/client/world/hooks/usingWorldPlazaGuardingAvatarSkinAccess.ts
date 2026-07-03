"use client";

import { useUserData } from "@/components/hooks/useAuth";
import { checkingWorldPlazaAvatarSkinAccessForUser } from "@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser";
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  settingWorldPlazaSelectedAvatarSkin,
} from "@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore";
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT } from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import { useEffect } from "react";

/**
 * Clears a restricted avatar skin when the signed-in user is not on the allowlist.
 */
export function usingWorldPlazaGuardingAvatarSkinAccess(): void {
  const { data: userData } = useUserData();

  useEffect(() => {
    const selectedSkinId = gettingWorldPlazaSelectedAvatarSkinId();

    if (
      checkingWorldPlazaAvatarSkinAccessForUser(
        selectedSkinId,
        userData?.username,
        userData?.alias,
      )
    ) {
      return;
    }

    settingWorldPlazaSelectedAvatarSkin(DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT);
  }, [userData?.alias, userData?.username]);
}
