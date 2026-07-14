'use client';

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_ICON,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_LEFT_PERCENT_MAX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_LEFT_PERCENT_MIN,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_SPAWN_MAX_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_SPAWN_MIN_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_VISIBLE_MS,
  LABELING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeTimedCraftConstants';
import type { DefiningWorldPlazaCraftModeActiveCraftHud } from '@/components/world/crafting/hooks/usingWorldPlazaCraftModeTimedCraft';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type * as React from 'react';
import { useEffect, useState } from 'react';

export type RenderingWorldPlazaCraftModeTimedCraftProgressHudProps = {
  readonly activeCraft: DefiningWorldPlazaCraftModeActiveCraftHud | null;
  readonly onBoostTap: () => boolean;
};

type DefiningWorldPlazaCraftModeBoostPromptState = {
  readonly promptId: number;
  readonly leftPercent: number;
};

function rollingRandomInRange(minInclusive: number, maxInclusive: number): number {
  return (
    minInclusive +
    Math.floor(Math.random() * (maxInclusive - minInclusive + 1))
  );
}

function formattingRemainingCraftLabel(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Bottom HUD progress bar for cookbook crafts, with a random tap-to-speed prompt.
 */
export function RenderingWorldPlazaCraftModeTimedCraftProgressHud({
  activeCraft,
  onBoostTap,
}: RenderingWorldPlazaCraftModeTimedCraftProgressHudProps): React.JSX.Element | null {
  const [boostPrompt, setBoostPrompt] =
    useState<DefiningWorldPlazaCraftModeBoostPromptState | null>(null);
  const [boostFlashKey, setBoostFlashKey] = useState(0);
  const [spawnGeneration, setSpawnGeneration] = useState(0);

  useEffect(() => {
    if (!activeCraft) {
      setBoostPrompt(null);
      return;
    }

    let isCancelled = false;
    let hideTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let spawnTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const clearingTimeouts = (): void => {
      if (hideTimeoutId !== null) {
        clearTimeout(hideTimeoutId);
        hideTimeoutId = null;
      }
      if (spawnTimeoutId !== null) {
        clearTimeout(spawnTimeoutId);
        spawnTimeoutId = null;
      }
    };

    const schedulingNextPrompt = (): void => {
      if (isCancelled) {
        return;
      }

      clearingTimeouts();

      const delayMs = rollingRandomInRange(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_SPAWN_MIN_MS,
        DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_SPAWN_MAX_MS
      );

      spawnTimeoutId = setTimeout(() => {
        if (isCancelled) {
          return;
        }

        const leftPercent = rollingRandomInRange(
          DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_LEFT_PERCENT_MIN,
          DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_LEFT_PERCENT_MAX
        );

        setBoostPrompt({
          promptId: Date.now(),
          leftPercent,
        });

        hideTimeoutId = setTimeout(() => {
          if (!isCancelled) {
            setBoostPrompt(null);
            schedulingNextPrompt();
          }
        }, DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_VISIBLE_MS);
      }, delayMs);
    };

    schedulingNextPrompt();

    return () => {
      isCancelled = true;
      clearingTimeouts();
    };
  }, [activeCraft?.recipeId, spawnGeneration]);

  if (!activeCraft) {
    return null;
  }

  const progressPercent = Math.round(activeCraft.progressRatio * 100);

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className="pointer-events-none relative z-40 mb-2 w-full"
    >
      <div className="pointer-events-auto relative rounded-md border-2 border-amber-800/90 bg-stone-950/92 px-3 py-2 text-amber-50 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-semibold tracking-wide">
          <span className="truncate uppercase text-amber-100">
            Crafting {activeCraft.displayName}
          </span>
          <span className="shrink-0 tabular-nums text-stone-300">
            {formattingRemainingCraftLabel(activeCraft.remainingMs)}
          </span>
        </div>
        <div className="relative h-3 overflow-visible rounded-full bg-stone-800">
          <div
            key={boostFlashKey}
            className="h-full rounded-full bg-linear-to-r from-orange-700 via-orange-400 to-yellow-300 transition-[width] duration-150 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
          {boostPrompt ? (
            <button
              key={boostPrompt.promptId}
              type="button"
              className="absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-500 text-stone-950 shadow-[0_0_18px_rgba(251,191,36,0.95)] animate-bounce"
              style={{ left: `${boostPrompt.leftPercent}%` }}
              aria-label={LABELING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT}
              onClick={(event) => {
                event.stopPropagation();
                const didBoost = onBoostTap();
                setBoostPrompt(null);
                setSpawnGeneration((generation) => generation + 1);
                if (didBoost) {
                  setBoostFlashKey((key) => key + 1);
                }
              }}
            >
              <Icon
                icon={DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_ICON}
                width={22}
                height={22}
              />
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-center text-[9px] text-stone-400">
          Tap the hammer when it appears to speed up
        </p>
      </div>
    </div>
  );
}
