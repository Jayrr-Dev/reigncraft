'use client';

import { Icon } from '@/components/ui/icon';
import {
  buildingWorldPlazaCraftModeBeatLaneNotesFromPattern,
  checkingWorldPlazaCraftModeBeatNoteDespawned,
  checkingWorldPlazaCraftModeBeatNoteInHitZone,
  computingWorldPlazaCraftModeBeatNoteLeftPercent,
  computingWorldPlazaCraftModeBeatTravelMsForTempo,
  computingWorldPlazaCraftModeBeatTravelMsToHitZone,
  resolvingWorldPlazaCraftModeBeatBreakColorTier,
  resolvingWorldPlazaCraftModeBeatLaneHitTarget,
  resolvingWorldPlazaCraftModeBeatNextHitZoneCenterPercent,
  resolvingWorldPlazaCraftModeBeatStrikeColorTier,
  type DefiningWorldPlazaCraftModeBeatLaneNote,
} from '@/components/world/crafting/domains/computingWorldPlazaCraftModeBeatLane';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED_ICON,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FIRST_PATTERN_DELAY_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FLOAT_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER_ICON,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MAX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MIN,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_CHANCE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_GAP_MS_MAX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_GAP_MS_MIN,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_POST_PAUSE_TEMPO_STEP,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_TEMPO_MAX,
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
  readonly onHammerHit: (strikeCombo: number) => boolean;
  readonly onCrackedHit: () => boolean;
};

type DefiningWorldPlazaCraftModeBeatFloatPopup = {
  readonly popupId: number;
  readonly kind: 'strike' | 'break';
  readonly label: string;
  readonly className: string;
  readonly leftPercent: number;
  readonly createdAtMs: number;
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
 * Notes only show inside the snapping gold zone. Combo speeds hammer boosts.
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
  const [hitZoneCenterPercent, setHitZoneCenterPercent] = useState(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT
  );
  const [strikeCombo, setStrikeCombo] = useState(0);
  const [floatPopups, setFloatPopups] = useState<
    readonly DefiningWorldPlazaCraftModeBeatFloatPopup[]
  >([]);
  const notesRef = useRef(notes);
  const hitZoneCenterPercentRef = useRef(hitZoneCenterPercent);
  const strikeComboRef = useRef(strikeCombo);
  const nextPatternAtMsRef = useRef(0);
  const lastPatternIndexRef = useRef(-1);
  const waveSerialRef = useRef(0);
  const tempoRef = useRef(1);
  const floatSerialRef = useRef(0);
  const onHammerHitRef = useRef(onHammerHit);
  const onCrackedHitRef = useRef(onCrackedHit);

  notesRef.current = notes;
  hitZoneCenterPercentRef.current = hitZoneCenterPercent;
  strikeComboRef.current = strikeCombo;
  onHammerHitRef.current = onHammerHit;
  onCrackedHitRef.current = onCrackedHit;

  useEffect(() => {
    if (!activeCraft) {
      setNotes([]);
      setStrikeCombo(0);
      setFloatPopups([]);
      setHitZoneCenterPercent(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT
      );
      hitZoneCenterPercentRef.current =
        DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT;
      nextPatternAtMsRef.current = 0;
      lastPatternIndexRef.current = -1;
      waveSerialRef.current = 0;
      tempoRef.current = 1;
      return;
    }

    const craftStartedAtMs = Date.now();
    nextPatternAtMsRef.current =
      craftStartedAtMs + DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FIRST_PATTERN_DELAY_MS;
    lastPatternIndexRef.current = -1;
    waveSerialRef.current = 0;
    tempoRef.current = 1;
    setNotes([]);
    setStrikeCombo(0);
    setFloatPopups([]);
    setHitZoneCenterPercent(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT
    );
    hitZoneCenterPercentRef.current =
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT;

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
          const nextZoneCenter =
            waveSerialRef.current === 1
              ? hitZoneCenterPercentRef.current
              : resolvingWorldPlazaCraftModeBeatNextHitZoneCenterPercent(
                  hitZoneCenterPercentRef.current
                );
          hitZoneCenterPercentRef.current = nextZoneCenter;
          setHitZoneCenterPercent(nextZoneCenter);

          const travelMs = computingWorldPlazaCraftModeBeatTravelMsForTempo(
            tempoRef.current
          );
          const patternHitStartMs =
            nowMs +
            computingWorldPlazaCraftModeBeatTravelMsToHitZone(
              nextZoneCenter,
              travelMs
            );
          const spawnedNotes = buildingWorldPlazaCraftModeBeatLaneNotesFromPattern(
            pattern,
            patternHitStartMs,
            `wave-${waveSerialRef.current}`,
            nextZoneCenter,
            travelMs
          );
          const lastHitOffsetMs =
            pattern.notes[pattern.notes.length - 1]?.hitOffsetMs ?? 0;
          const shouldPause =
            Math.random() < DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_CHANCE;
          const gapMs = shouldPause
            ? rollingRandomInRange(
                DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_GAP_MS_MIN,
                DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PAUSE_GAP_MS_MAX
              )
            : Math.round(
                rollingRandomInRange(
                  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MIN,
                  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_GAP_MS_MAX
                ) / tempoRef.current
              );

          if (shouldPause) {
            tempoRef.current = Math.min(
              DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_TEMPO_MAX,
              tempoRef.current *
                DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_POST_PAUSE_TEMPO_STEP
            );
          }

          nextPatternAtMsRef.current =
            patternHitStartMs + lastHitOffsetMs + gapMs;
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

      setFloatPopups((currentPopups) => {
        const alivePopups = currentPopups.filter(
          (popup) =>
            nowMs - popup.createdAtMs < DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FLOAT_MS
        );
        return alivePopups.length === currentPopups.length
          ? currentPopups
          : alivePopups;
      });

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
    hitZoneCenterPercent -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT;
  const hitZoneWidthPercent =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT * 2;
  const strikeColors = resolvingWorldPlazaCraftModeBeatStrikeColorTier(
    Math.max(1, strikeCombo)
  );

  const handlingLanePointer = (): void => {
    const nowMs = Date.now();
    const zoneCenter = hitZoneCenterPercentRef.current;
    const hitTarget = resolvingWorldPlazaCraftModeBeatLaneHitTarget(
      notesRef.current,
      nowMs,
      zoneCenter
    );

    if (!hitTarget) {
      return;
    }

    const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
      hitTarget,
      nowMs
    );

    floatSerialRef.current += 1;
    const popupId = floatSerialRef.current;

    if (hitTarget.kind === 'hammer') {
      const nextCombo = strikeComboRef.current + 1;
      strikeComboRef.current = nextCombo;
      setStrikeCombo(nextCombo);
      onHammerHitRef.current(nextCombo);
      const colors = resolvingWorldPlazaCraftModeBeatStrikeColorTier(nextCombo);
      setFloatPopups((current) => [
        ...current,
        {
          popupId,
          kind: 'strike',
          label: `Strike ${nextCombo}x`,
          className: colors.floatClassName,
          leftPercent,
          createdAtMs: nowMs,
        },
      ]);
    } else {
      const comboBeforeBreak = strikeComboRef.current;
      strikeComboRef.current = 0;
      setStrikeCombo(0);
      onCrackedHitRef.current();
      const breakColors =
        resolvingWorldPlazaCraftModeBeatBreakColorTier(comboBeforeBreak);
      setFloatPopups((current) => [
        ...current,
        {
          popupId,
          kind: 'break',
          label: 'BREAK',
          className: breakColors.floatClassName,
          leftPercent,
          createdAtMs: nowMs,
        },
      ]);
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
      <div className="pointer-events-auto relative overflow-visible rounded-md bg-stone-950/92 px-3 py-2 text-amber-50 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
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
          className="relative mt-2 h-12 w-full overflow-visible rounded-md bg-stone-900/90"
          aria-label="Craft beat lane"
          onClick={(event) => {
            event.stopPropagation();
            handlingLanePointer();
          }}
        >
          <div
            className="pointer-events-none absolute inset-y-1 border-x border-dashed border-amber-200/90 bg-amber-400/15 transition-[left] duration-300 ease-out"
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
            const isInGoldZone = checkingWorldPlazaCraftModeBeatNoteInHitZone(
              leftPercent,
              hitZoneCenterPercent
            );
            const isCracked = note.kind === 'cracked';

            return (
              <span
                key={note.noteId}
                className={`pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                  isInGoldZone
                    ? `shadow-[0_0_12px_rgba(0,0,0,0.45)] ${
                        isCracked
                          ? 'border-rose-300 bg-rose-700 text-rose-50'
                          : strikeColors.diskClassName
                      }`
                    : isCracked
                      ? 'border-rose-300/70 bg-transparent'
                      : 'border-amber-200/70 bg-transparent'
                }`}
                style={{ left: `${leftPercent}%` }}
                aria-hidden
              >
                {isInGoldZone ? (
                  <>
                    <Icon
                      icon={
                        isCracked
                          ? DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED_ICON
                          : DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER_ICON
                      }
                      width={18}
                      height={18}
                    />
                    {isCracked ? (
                      <span className="pointer-events-none absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 rotate-[-28deg] bg-rose-100/95" />
                    ) : null}
                  </>
                ) : null}
                <span className="sr-only">
                  {isCracked
                    ? LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED
                    : LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER}
                </span>
              </span>
            );
          })}
          {floatPopups.map((popup) => {
            const ageMs = laneNowMs - popup.createdAtMs;
            const lifeRatio = Math.min(
              1,
              Math.max(0, ageMs / DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FLOAT_MS)
            );
            const risePx = -8 - lifeRatio * 28;
            const opacity = 1 - lifeRatio;

            return (
              <span
                key={popup.popupId}
                className={`pointer-events-none absolute z-20 -translate-x-1/2 text-[11px] font-black uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] ${popup.className}`}
                style={{
                  left: `${popup.leftPercent}%`,
                  top: `calc(50% + ${risePx}px)`,
                  opacity,
                }}
              >
                {popup.label}
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
