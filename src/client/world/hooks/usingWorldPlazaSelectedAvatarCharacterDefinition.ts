"use client";

import { useUserData } from "@/components/hooks/useAuth";
import {
  resolvingWorldPlazaAvatarCharacterDefinition,
  type DefiningWorldPlazaAvatarCharacterDefinition,
} from "@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition";
import { resolvingWorldPlazaValidatedAvatarSkinId } from "@/components/world/domains/resolvingWorldPlazaValidatedAvatarSkinId";
import { usingWorldPlazaGuardingAvatarSkinAccess } from "@/components/world/hooks/usingWorldPlazaGuardingAvatarSkinAccess";
import { usingWorldPlazaSelectedAvatarSkin } from "@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin";

/**
 * Resolves the character definition for the locally selected avatar skin.
 */
export function usingWorldPlazaSelectedAvatarCharacterDefinition(): DefiningWorldPlazaAvatarCharacterDefinition {
  const { data: userData } = useUserData();
  const selectedSkinId = usingWorldPlazaSelectedAvatarSkin();
  const validatedSkinId = resolvingWorldPlazaValidatedAvatarSkinId(
    selectedSkinId,
    userData?.username,
    userData?.alias,
  );

  usingWorldPlazaGuardingAvatarSkinAccess();

  return resolvingWorldPlazaAvatarCharacterDefinition(validatedSkinId);
}
