"use client";

import {
  DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_HOLD_MS,
  DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_IN_MS,
  DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OUT_MS,
} from "@/components/world/domains/definingWorldPlazaPlayerTeleportFadeConstants";
import {
  waitingWorldPlazaDurationMs,
  waitingWorldPlazaNextAnimationFrame,
} from "@/components/world/domains/waitingWorldPlazaDurationMs";
import { useCallback, useRef, useState } from "react";

export interface UsingWorldPlazaPlayerTeleportScreenFadeResult {
  /** True while the blackout overlay is mounted. */
  isTeleportFadeOverlayMounted: boolean;
  /** Overlay opacity in [0, 1]. */
  teleportFadeOverlayOpacity: number;
  /** Active CSS transition duration in milliseconds. */
  teleportFadeTransitionDurationMs: number;
  /** Runs fade out, executes the callback at full black, then fades back in. */
  teleportingWithScreenFade: (onTeleport: () => void) => Promise<void>;
}

/**
 * Owns the fade-to-black sequence used when the local player teleports.
 */
export function usingWorldPlazaPlayerTeleportScreenFade(): UsingWorldPlazaPlayerTeleportScreenFadeResult {
  const isTeleportSequenceRunningRef = useRef(false);
  const [isTeleportFadeOverlayMounted, setIsTeleportFadeOverlayMounted] =
    useState(false);
  const [teleportFadeOverlayOpacity, setTeleportFadeOverlayOpacity] =
    useState(0);
  const [teleportFadeTransitionDurationMs, setTeleportFadeTransitionDurationMs] =
    useState(DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OUT_MS);

  const teleportingWithScreenFade = useCallback(
    async (onTeleport: () => void): Promise<void> => {
      if (isTeleportSequenceRunningRef.current) {
        return;
      }

      isTeleportSequenceRunningRef.current = true;
      setIsTeleportFadeOverlayMounted(true);
      setTeleportFadeOverlayOpacity(0);
      setTeleportFadeTransitionDurationMs(
        DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OUT_MS,
      );

      await waitingWorldPlazaNextAnimationFrame();
      await waitingWorldPlazaNextAnimationFrame();
      setTeleportFadeOverlayOpacity(1);
      await waitingWorldPlazaDurationMs(
        DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OUT_MS,
      );

      onTeleport();
      await waitingWorldPlazaDurationMs(
        DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_HOLD_MS,
      );

      setTeleportFadeTransitionDurationMs(
        DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_IN_MS,
      );
      setTeleportFadeOverlayOpacity(0);
      await waitingWorldPlazaDurationMs(
        DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_IN_MS,
      );

      setIsTeleportFadeOverlayMounted(false);
      isTeleportSequenceRunningRef.current = false;
    },
    [],
  );

  return {
    isTeleportFadeOverlayMounted,
    teleportFadeOverlayOpacity,
    teleportFadeTransitionDurationMs,
    teleportingWithScreenFade,
  };
}
