"use client";

import { useCallback, useState } from "react";

/** Result from {@link usingWorldPlazaAvatarSkinSelectorVisibleState}. */
export interface UsingWorldPlazaAvatarSkinSelectorVisibleStateResult {
  /** True when the avatar skin selector panel is open. */
  isAvatarSkinSelectorVisible: boolean;
  /** Flips avatar skin selector panel visibility. */
  togglingAvatarSkinSelectorVisible: () => void;
}

/**
 * Runtime toggle for the plaza avatar skin selector panel.
 */
export function usingWorldPlazaAvatarSkinSelectorVisibleState(): UsingWorldPlazaAvatarSkinSelectorVisibleStateResult {
  const [isAvatarSkinSelectorVisible, setIsAvatarSkinSelectorVisible] =
    useState(false);

  const togglingAvatarSkinSelectorVisible = useCallback((): void => {
    setIsAvatarSkinSelectorVisible((isVisible) => !isVisible);
  }, []);

  return {
    isAvatarSkinSelectorVisible,
    togglingAvatarSkinSelectorVisible,
  };
}
