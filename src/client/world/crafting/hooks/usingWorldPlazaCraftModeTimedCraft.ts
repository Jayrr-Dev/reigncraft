'use client';

import { DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HALT_MS } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeBeatLaneConstants';
import {
  computingWorldPlazaCraftModeBoostedEndsAtMs,
  computingWorldPlazaCraftModeDurationMsFromComplexity,
  computingWorldPlazaCraftModeHaltedSchedule,
  computingWorldPlazaCraftModeRemainingMs,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeTimedCraftConstants';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type DefiningWorldPlazaCraftModeTimedCraftState = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  readonly displayName: string;
  readonly startedAtMs: number;
  readonly endsAtMs: number;
  readonly baseDurationMs: number;
  readonly pausedUntilMs: number | null;
};

export type DefiningWorldPlazaCraftModeActiveCraftHud = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  readonly displayName: string;
  readonly progressRatio: number;
  readonly remainingMs: number;
  readonly isPaused: boolean;
};

export type UsingWorldPlazaCraftModeTimedCraftParams = {
  readonly onCraftComplete: (
    recipeId: DefiningWorldPlazaCraftModeRecipeId
  ) => void;
};

function computingProgressRatio(
  craftState: DefiningWorldPlazaCraftModeTimedCraftState,
  nowMs: number
): number {
  const remainingMs = computingWorldPlazaCraftModeRemainingMs({
    nowMs,
    endsAtMs: craftState.endsAtMs,
    pausedUntilMs: craftState.pausedUntilMs,
  });
  const elapsedMs = Math.max(0, craftState.baseDurationMs - remainingMs);
  return Math.min(1, Math.max(0, elapsedMs / craftState.baseDurationMs));
}

/**
 * Runs one cookbook craft on a complexity-scaled timer with beat-lane boost/halt.
 */
export function usingWorldPlazaCraftModeTimedCraft({
  onCraftComplete,
}: UsingWorldPlazaCraftModeTimedCraftParams) {
  const [activeCraft, setActiveCraft] =
    useState<DefiningWorldPlazaCraftModeTimedCraftState | null>(null);
  const activeCraftRef = useRef(activeCraft);
  activeCraftRef.current = activeCraft;
  const onCraftCompleteRef = useRef(onCraftComplete);
  onCraftCompleteRef.current = onCraftComplete;
  const isCompletingRef = useRef(false);
  const [clockRevision, setClockRevision] = useState(0);

  const startingCraft = useCallback(
    (recipeId: DefiningWorldPlazaCraftModeRecipeId): boolean => {
      if (activeCraftRef.current !== null) {
        return false;
      }

      const recipeDefinition =
        resolvingWorldPlazaCraftModeRecipeDefinition(recipeId);

      if (!recipeDefinition) {
        return false;
      }

      const nowMs = Date.now();
      const baseDurationMs = computingWorldPlazaCraftModeDurationMsFromComplexity(
        recipeDefinition.complexity
      );

      setActiveCraft({
        recipeId,
        displayName: recipeDefinition.title,
        startedAtMs: nowMs,
        endsAtMs: nowMs + baseDurationMs,
        baseDurationMs,
        pausedUntilMs: null,
      });
      isCompletingRef.current = false;
      return true;
    },
    []
  );

  const boostingActiveCraft = useCallback((): boolean => {
    const craftState = activeCraftRef.current;

    if (!craftState) {
      return false;
    }

    const nowMs = Date.now();
    const nextEndsAtMs = computingWorldPlazaCraftModeBoostedEndsAtMs({
      nowMs,
      endsAtMs: craftState.endsAtMs,
      baseDurationMs: craftState.baseDurationMs,
      pausedUntilMs: craftState.pausedUntilMs,
    });

    if (nextEndsAtMs >= craftState.endsAtMs) {
      return false;
    }

    playingWildlifeStudySfx();
    setActiveCraft({
      ...craftState,
      endsAtMs: nextEndsAtMs,
    });
    return true;
  }, []);

  const haltingActiveCraft = useCallback((): boolean => {
    const craftState = activeCraftRef.current;

    if (!craftState) {
      return false;
    }

    const nowMs = Date.now();
    const nextSchedule = computingWorldPlazaCraftModeHaltedSchedule({
      nowMs,
      endsAtMs: craftState.endsAtMs,
      pausedUntilMs: craftState.pausedUntilMs,
      haltMs: DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HALT_MS,
    });

    setActiveCraft({
      ...craftState,
      endsAtMs: nextSchedule.endsAtMs,
      pausedUntilMs: nextSchedule.pausedUntilMs,
    });
    return true;
  }, []);

  const cancellingActiveCraft = useCallback((): void => {
    setActiveCraft(null);
    isCompletingRef.current = false;
  }, []);

  useEffect(() => {
    if (!activeCraft) {
      return;
    }

    const intervalId = setInterval(() => {
      setClockRevision((revision) => revision + 1);
      const craftState = activeCraftRef.current;
      const nowMs = Date.now();

      if (
        !craftState ||
        isCompletingRef.current ||
        (craftState.pausedUntilMs !== null &&
          nowMs < craftState.pausedUntilMs) ||
        nowMs < craftState.endsAtMs
      ) {
        return;
      }

      isCompletingRef.current = true;
      const completedRecipeId = craftState.recipeId;
      setActiveCraft(null);
      onCraftCompleteRef.current(completedRecipeId);
      isCompletingRef.current = false;
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeCraft]);

  const activeCraftHud = useMemo((): DefiningWorldPlazaCraftModeActiveCraftHud | null => {
    if (!activeCraft) {
      return null;
    }

    const nowMs = Date.now();
    const remainingMs = computingWorldPlazaCraftModeRemainingMs({
      nowMs,
      endsAtMs: activeCraft.endsAtMs,
      pausedUntilMs: activeCraft.pausedUntilMs,
    });

    return {
      recipeId: activeCraft.recipeId,
      displayName: activeCraft.displayName,
      progressRatio: computingProgressRatio(activeCraft, nowMs),
      remainingMs,
      isPaused:
        activeCraft.pausedUntilMs !== null &&
        nowMs < activeCraft.pausedUntilMs,
    };
  }, [activeCraft, clockRevision]);

  return {
    activeCraft,
    activeCraftHud,
    isCrafting: activeCraft !== null,
    startingCraft,
    boostingActiveCraft,
    haltingActiveCraft,
    cancellingActiveCraft,
  };
}
