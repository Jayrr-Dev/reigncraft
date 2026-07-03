"use client";

import type { DefiningWorldPlazaAvatarSkinId } from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  subscribingWorldPlazaSelectedAvatarSkin,
} from "@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore";
import { useSyncExternalStore } from "react";

/**
 * Subscribes to the locally selected plaza avatar skin id.
 */
export function usingWorldPlazaSelectedAvatarSkin(): DefiningWorldPlazaAvatarSkinId {
  return useSyncExternalStore(
    subscribingWorldPlazaSelectedAvatarSkin,
    gettingWorldPlazaSelectedAvatarSkinId,
    gettingWorldPlazaSelectedAvatarSkinId,
  );
}
