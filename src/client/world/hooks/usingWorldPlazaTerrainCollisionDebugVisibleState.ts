"use client";

import { DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ENABLED } from "@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants";
import { useCallback, useState } from "react";

/** Result from {@link usingWorldPlazaTerrainCollisionDebugVisibleState}. */
export interface UsingWorldPlazaTerrainCollisionDebugVisibleStateResult {
  /** True when collision boxes and the player marker are visible. */
  isTerrainCollisionDebugVisible: boolean;
  /** Flips collision debug visibility. */
  togglingTerrainCollisionDebugVisible: () => void;
}

/**
 * Runtime toggle for plaza terrain collision debug overlays.
 */
export function usingWorldPlazaTerrainCollisionDebugVisibleState(): UsingWorldPlazaTerrainCollisionDebugVisibleStateResult {
  const [isTerrainCollisionDebugVisible, setIsTerrainCollisionDebugVisible] =
    useState(DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ENABLED);

  const togglingTerrainCollisionDebugVisible = useCallback((): void => {
    setIsTerrainCollisionDebugVisible((isVisible) => !isVisible);
  }, []);

  return {
    isTerrainCollisionDebugVisible,
    togglingTerrainCollisionDebugVisible,
  };
}
