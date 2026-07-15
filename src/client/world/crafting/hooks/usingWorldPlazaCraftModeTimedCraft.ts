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

export type DefiningWorldPlazaCraftModeTimedCraftPhase =
  | 'crafting'
  | 'awaitingConfirm';

export type DefiningWorldPlazaCraftModeTimedCraftOutcomeKind =
  | 'entity'
  | 'item';

export type DefiningWorldPlazaCraftModeTimedCraftState = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  readonly displayName: string;
  readonly outcomeKind: DefiningWorldPlazaCraftModeTimedCraftOutcomeKind;
  readonly phase: DefiningWorldPlazaCraftModeTimedCraftPhase;
  readonly startedAtMs: number;
  readonly endsAtMs: number;
  readonly baseDurationMs: number;
  readonly pausedUntilMs: number | null;
};

/**
 * Structural craft HUD snapshot. Progress / remaining are derived in the leaf
 * HUD from the schedule so the plaza scene is not re-rendered on a clock.
 */
export type DefiningWorldPlazaCraftModeActiveCraftHud = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  readonly displayName: string;
  readonly outcomeKind: DefiningWorldPlazaCraftModeTimedCraftOutcomeKind;
  readonly phase: DefiningWorldPlazaCraftModeTimedCraftPhase;
  readonly startedAtMs: number;
  readonly endsAtMs: number;
  readonly baseDurationMs: number;
  readonly pausedUntilMs: number | null;
};

export type UsingWorldPlazaCraftModeTimedCraftParams = {
  readonly onCraftComplete: (
    recipeId: DefiningWorldPlazaCraftModeRecipeId
  ) => void;
};

function schedulingWorldPlazaCraftModeCompletionCheck(params: {
  readonly getCraftState: () => DefiningWorldPlazaCraftModeTimedCraftState | null;
  readonly onDue: () => void;
}): () => void {
  let timeoutId = 0;
  let isCancelled = false;

  const schedulingNextCheck = (): void => {
    if (isCancelled) {
      return;
    }

    const craftState = params.getCraftState();
    if (!craftState || craftState.phase !== 'crafting') {
      return;
    }

    const nowMs = Date.now();

    if (
      craftState.pausedUntilMs !== null &&
      nowMs < craftState.pausedUntilMs
    ) {
      timeoutId = window.setTimeout(
        schedulingNextCheck,
        craftState.pausedUntilMs - nowMs
      );
      return;
    }

    if (nowMs < craftState.endsAtMs) {
      timeoutId = window.setTimeout(
        schedulingNextCheck,
        craftState.endsAtMs - nowMs
      );
      return;
    }

    params.onDue();
  };

  schedulingNextCheck();

  return () => {
    isCancelled = true;
    window.clearTimeout(timeoutId);
  };
}

/**
 * Runs one cookbook craft on a complexity-scaled timer with beat-lane boost/halt.
 *
 * When the timer finishes the HUD stays up in `awaitingConfirm` until the
 * player picks Place / Ok or Cancel. Live progress belongs to the craft HUD leaf.
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
  const isConfirmingRef = useRef(false);

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
        outcomeKind: recipeDefinition.outcome.kind,
        phase: 'crafting',
        startedAtMs: nowMs,
        endsAtMs: nowMs + baseDurationMs,
        baseDurationMs,
        pausedUntilMs: null,
      });
      isConfirmingRef.current = false;
      return true;
    },
    []
  );

  const boostingActiveCraft = useCallback(
    (strikeCombo: number = 1): boolean => {
      const craftState = activeCraftRef.current;

      if (!craftState || craftState.phase !== 'crafting') {
        return false;
      }

      const nowMs = Date.now();
      const nextEndsAtMs = computingWorldPlazaCraftModeBoostedEndsAtMs({
        nowMs,
        endsAtMs: craftState.endsAtMs,
        baseDurationMs: craftState.baseDurationMs,
        pausedUntilMs: craftState.pausedUntilMs,
        strikeCombo,
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
    },
    []
  );

  const haltingActiveCraft = useCallback((): boolean => {
    const craftState = activeCraftRef.current;

    if (!craftState || craftState.phase !== 'crafting') {
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
    isConfirmingRef.current = false;
  }, []);

  const confirmingActiveCraft = useCallback((): void => {
    const craftState = activeCraftRef.current;

    if (!craftState || craftState.phase !== 'awaitingConfirm') {
      return;
    }

    if (isConfirmingRef.current) {
      return;
    }

    isConfirmingRef.current = true;
    const completedRecipeId = craftState.recipeId;
    setActiveCraft(null);
    onCraftCompleteRef.current(completedRecipeId);
    isConfirmingRef.current = false;
  }, []);

  useEffect(() => {
    if (!activeCraft || activeCraft.phase !== 'crafting') {
      return;
    }

    return schedulingWorldPlazaCraftModeCompletionCheck({
      getCraftState: () => activeCraftRef.current,
      onDue: () => {
        const craftState = activeCraftRef.current;
        if (!craftState || craftState.phase !== 'crafting') {
          return;
        }

        const nowMs = Date.now();
        if (
          (craftState.pausedUntilMs !== null &&
            nowMs < craftState.pausedUntilMs) ||
          nowMs < craftState.endsAtMs
        ) {
          return;
        }

        setActiveCraft({
          ...craftState,
          phase: 'awaitingConfirm',
          pausedUntilMs: null,
          endsAtMs: Math.min(craftState.endsAtMs, nowMs),
        });
      },
    });
  }, [activeCraft]);

  const activeCraftHud = useMemo((): DefiningWorldPlazaCraftModeActiveCraftHud | null => {
    if (!activeCraft) {
      return null;
    }

    return {
      recipeId: activeCraft.recipeId,
      displayName: activeCraft.displayName,
      outcomeKind: activeCraft.outcomeKind,
      phase: activeCraft.phase,
      startedAtMs: activeCraft.startedAtMs,
      endsAtMs: activeCraft.endsAtMs,
      baseDurationMs: activeCraft.baseDurationMs,
      pausedUntilMs: activeCraft.pausedUntilMs,
    };
  }, [activeCraft]);

  return {
    activeCraft,
    activeCraftHud,
    isCrafting: activeCraft !== null,
    startingCraft,
    boostingActiveCraft,
    haltingActiveCraft,
    cancellingActiveCraft,
    confirmingActiveCraft,
  };
}

export function computingWorldPlazaCraftModeHudProgressRatio(
  craftHud: DefiningWorldPlazaCraftModeActiveCraftHud,
  nowMs: number
): number {
  if (craftHud.phase === 'awaitingConfirm') {
    return 1;
  }

  const remainingMs = computingWorldPlazaCraftModeRemainingMs({
    nowMs,
    endsAtMs: craftHud.endsAtMs,
    pausedUntilMs: craftHud.pausedUntilMs,
  });
  const elapsedMs = Math.max(0, craftHud.baseDurationMs - remainingMs);
  return Math.min(1, Math.max(0, elapsedMs / craftHud.baseDurationMs));
}

export function checkingWorldPlazaCraftModeHudIsPaused(
  craftHud: DefiningWorldPlazaCraftModeActiveCraftHud,
  nowMs: number
): boolean {
  if (craftHud.phase === 'awaitingConfirm') {
    return false;
  }

  return (
    craftHud.pausedUntilMs !== null && nowMs < craftHud.pausedUntilMs
  );
}
