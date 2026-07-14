'use client';

import { Icon } from '@/components/ui/icon';
import {
  buildingWorldPlazaCraftModeBeatLaneNotesFromPattern,
  checkingWorldPlazaCraftModeBeatNoteDespawned,
  computingWorldPlazaCraftModeBeatNoteLeftPercent,
  computingWorldPlazaCraftModeBeatTravelMsToHitZone,
  resolvingWorldPlazaCraftModeBeatLaneHitTarget,
  type DefiningWorldPlazaCraftModeBeatLaneNote,
} from '@/components/world/crafting/domains/computingWorldPlazaCraftModeBeatLane';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED_ICON,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FIRST_PATTERN_DELAY_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER_ICON,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MAX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MIN,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY,
  LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED,
  LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER,
  LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HINT,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeBeatLaneConstants';
import { formattingWorldPlazaCraftModeInGameRemainingLabel } from '@/components/world/crafting/domains/formattingWorldPlazaCraftModeInGameRemainingLabel';
import type { DefiningWorldPlazaCraftModeActiveCraftHud } from '@/components/world/crafting/hooks/usingWorldPlazaCraftModeTimedCraft';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export type RenderingWorldPlazaCraftModeTimedCraftProgressHudProps = {
  readonly activeCraft: DefiningWorldPlazaCraftModeActiveCraftHud | null;
  readonly onHammerHit: () => boolean;
  readonly onCrackedHit: () => boolean;
};

function rollingRandomInRange(minInclusive: number, maxInclusive: number): number {
  return (
    minInclusive +
    Math.floor(Math.random() * (maxInclusive - minInclusive + 1))
  );
}

function pickingNextBeatPatternIndex(previousIndex: number): number {
  const patternCount = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY.length;

  if (patternCount <= 1) {
    return 0;
  }

  let nextIndex = rollingRandomInRange(0, patternCount - 1);

  if (nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % patternCount;
  }

  return nextIndex;
}

/**
 * Bottom HUD progress + beat lane for cookbook crafts.
 * Notes rush right → left; hit hammers in the zone, skip cracked ones.
 */
export function RenderingWorldPlazaCraftModeTimedCraftProgressHud({
  activeCraft,
  onHammerHit,
  onCrackedHit,
}: RenderingWorldPlazaCraftModeTimedCraftProgressHudProps): React.JSX.Element | null {
  const [notes, setNotes] = useState<
    readonly DefiningWorldPlazaCraftModeBeatLaneNote[]
  >([]);
  const [laneNowMs, setLaneNowMs] = useState(() => Date.now());
  const notesRef = useRef(notes);
  const nextPatternAtMsRef = useRef(0);
  const lastPatternIndexRef = useRef(-1);
  const waveSerialRef = useRef(0);
  const onHammerHitRef = useRef(onHammerHit);
  const onCrackedHitRef = useRef(onCrackedHit);

  notesRef.current = notes;
  onHammerHitRef.current = onHammerHit;
  onCrackedHitRef.current = onCrackedHit;

  useEffect(() => {
    if (!activeCraft) {
      setNotes([]);
      nextPatternAtMsRef.current = 0;
      lastPatternIndexRef.current = -1;
      waveSerialRef.current = 0;
      return;
    }

    const craftStartedAtMs = Date.now();
    nextPatternAtMsRef.current =
      craftStartedAtMs + DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FIRST_PATTERN_DELAY_MS;
    lastPatternIndexRef.current = -1;
    waveSerialRef.current = 0;
    setNotes([]);

    let frameId = 0;
    let isActive = true;

    const tickingLane = (): void => {
      if (!isActive) {
        return;
      }

      const nowMs = Date.now();
      let nextNotes = notesRef.current;

      if (nowMs >= nextPatternAtMsRef.current) {
        const patternIndex = pickingNextBeatPatternIndex(
          lastPatternIndexRef.current
        );
        const pattern =
          DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY[patternIndex];

        if (pattern) {
          lastPatternIndexRef.current = patternIndex;
          waveSerialRef.current += 1;
          const patternHitStartMs =
            nowMs + computingWorldPlazaCraftModeBeatTravelMsToHitZone();
          const spawnedNotes = buildingWorldPlazaCraftModeBeatLaneNotesFromPattern(
            pattern,
            patternHitStartMs,
            `wave-${waveSerialRef.current}`
          );
          const lastHitOffsetMs =
            pattern.notes[pattern.notes.length - 1]?.hitOffsetMs ?? 0;
          nextPatternAtMsRef.current =
            patternHitStartMs +
            lastHitOffsetMs +
            rollingRandomInRange(
              DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MIN,
              DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MAX
            );
          nextNotes = [...nextNotes, ...spawnedNotes];
        }
      }

      const prunedNotes = nextNotes.filter((note) => {
        if (note.resolved) {
          return false;
        }

        const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
          note,
          nowMs
        );
        return !checkingWorldPlazaCraftModeBeatNoteDespawned(leftPercent);
      });

      if (
        prunedNotes.length !== notesRef.current.length ||
        prunedNotes.some(
          (note, index) => note.noteId !== notesRef.current[index]?.noteId
        )
      ) {
        notesRef.current = prunedNotes;
        setNotes(prunedNotes);
      }

      setLaneNowMs(nowMs);
      frameId = window.requestAnimationFrame(tickingLane);
    };

    frameId = window.requestAnimationFrame(tickingLane);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
    };
  }, [activeCraft?.recipeId]);

  if (!activeCraft) {
    return null;
  }

  const progressPercent = Math.min(
    100,
    Math.max(0, activeCraft.progressRatio * 100)
  );
  const hitZoneLeftPercent =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT;
  const hitZoneWidthPercent =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT * 2;

  const handlingLanePointer = (): void => {
    const nowMs = Date.now();
    const hitTarget = resolvingWorldPlazaCraftModeBeatLaneHitTarget(
      notesRef.current,
      nowMs
    );

    if (!hitTarget) {
      return;
    }

    if (hitTarget.kind === 'hammer') {
      onHammerHitRef.current();
    } else {
      onCrackedHitRef.current();
    }

    const nextNotes = notesRef.current.map((note) =>
      note.noteId === hitTarget.noteId ? { ...note, resolved: true } : note
    );
    notesRef.current = nextNotes;
    setNotes(nextNotes);
  };

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className="pointer-events-none relative z-40 mb-2 w-full"
    >
      <div className="pointer-events-auto relative rounded-md bg-stone-950/92 px-3 py-2 text-amber-50 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <div className="mb-1 flex flex-col items-center gap-0.5 text-center text-[10px] font-semibold tracking-wide">
          <span className="uppercase text-amber-100">
            Crafting {activeCraft.displayName}
          </span>
          <span className="tabular-nums text-stone-300">
            {activeCraft.isPaused ? 'Halted · ' : ''}
            {formattingWorldPlazaCraftModeInGameRemainingLabel(
              activeCraft.remainingMs
            )}
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-stone-800">
          <div
            className={`h-full rounded-full bg-linear-to-r from-orange-700 via-orange-400 to-yellow-300 transition-[width] duration-100 ease-linear ${
              activeCraft.isPaused ? 'opacity-60' : ''
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <button
          type="button"
          className="relative mt-2 h-12 w-full overflow-hidden rounded-md bg-stone-900/90"
          aria-label="Craft beat lane"
          onClick={(event) => {
            event.stopPropagation();
            handlingLanePointer();
          }}
        >
          <div
            className="pointer-events-none absolute inset-y-1 border-x border-dashed border-amber-200/80 bg-amber-400/10"
            style={{
              left: `${hitZoneLeftPercent}%`,
              width: `${hitZoneWidthPercent}%`,
            }}
          />
          {notes.map((note) => {
            const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
              note,
              laneNowMs
            );
            const isCracked = note.kind === 'cracked';

            return (
              <span
                key={note.noteId}
                className={`pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-[0_0_12px_rgba(0,0,0,0.45)] ${
                  isCracked
                    ? 'border-rose-300 bg-rose-700 text-rose-50'
                    : 'border-amber-200 bg-amber-500 text-stone-950'
                }`}
                style={{ left: `${leftPercent}%` }}
                aria-hidden
              >
                <Icon
                  icon={
                    isCracked
                      ? DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED_ICON
                      : DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER_ICON
                  }
                  width={18}
                  height={18}
                  className={isCracked ? 'opacity-90' : undefined}
                />
                {isCracked ? (
                  <span className="pointer-events-none absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 rotate-[-28deg] bg-rose-100/95" />
                ) : null}
                <span className="sr-only">
                  {isCracked
                    ? LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED
                    : LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER}
                </span>
              </span>
            );
          })}
        </button>
        <p className="mt-1 text-center text-[9px] text-stone-400">
          {LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HINT}
        </p>
      </div>
    </div>
  );
}
