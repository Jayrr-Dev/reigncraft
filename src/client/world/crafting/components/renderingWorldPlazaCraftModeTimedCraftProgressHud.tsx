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
import {
  formattingWorldPlazaCraftModeConfirmPlaceLabel,
  LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_CANCEL,
  LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_OK,
  LABELING_WORLD_PLAZA_CRAFT_MODE_READY_STATUS,
  computingWorldPlazaCraftModeRemainingMs,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeTimedCraftConstants';
import { formattingWorldPlazaCraftModeInGameRemainingLabel } from '@/components/world/crafting/domains/formattingWorldPlazaCraftModeInGameRemainingLabel';
import {
  checkingWorldPlazaCraftModeHudIsPaused,
  computingWorldPlazaCraftModeHudProgressRatio,
  type DefiningWorldPlazaCraftModeActiveCraftHud,
} from '@/components/world/crafting/hooks/usingWorldPlazaCraftModeTimedCraft';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export type RenderingWorldPlazaCraftModeTimedCraftProgressHudProps = {
  readonly activeCraft: DefiningWorldPlazaCraftModeActiveCraftHud | null;
  readonly onHammerHit: (strikeCombo: number) => boolean;
  readonly onCrackedHit: () => boolean;
  readonly onConfirmCraft: () => void;
  readonly onCancelCraft: () => void;
};

const DEFINING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_ACTIONS_CLASS_NAME =
  'mt-2 flex w-full gap-2' as const;

const DEFINING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_CANCEL_BUTTON_CLASS_NAME =
  'inline-flex flex-1 items-center justify-center rounded-md border border-rose-300/70 bg-[linear-gradient(180deg,#6b2a2a_0%,#3a1515_100%)] px-2 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-rose-50 shadow-[0_0_0_1px_rgba(251,113,133,0.28),0_2px_8px_rgba(0,0,0,0.45)] transition-[transform,filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70' as const;

const DEFINING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_PRIMARY_BUTTON_CLASS_NAME =
  'inline-flex flex-1 items-center justify-center rounded-md border border-amber-300/70 bg-[linear-gradient(180deg,#8a5a1a_0%,#4a2e0c_100%)] px-2 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-50 shadow-[0_0_0_1px_rgba(252,211,77,0.28),0_2px_8px_rgba(0,0,0,0.45)] transition-[transform,filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70' as const;

type DefiningWorldPlazaCraftModeBeatFloatPopup = {
  readonly popupId: number;
  readonly kind: 'strike' | 'break';
  readonly label: string;
  readonly className: string;
  readonly leftPercent: number;
  readonly createdAtMs: number;
};

const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_BASE_CLASS_NAME =
  'pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2';

const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_OUT_CRACKED_CLASS_NAME =
  'border-rose-300/70 bg-transparent';

const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_OUT_HAMMER_CLASS_NAME =
  'border-amber-200/70 bg-transparent';

const DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_IN_CRACKED_CLASS_NAME =
  'shadow-[0_0_12px_rgba(0,0,0,0.45)] border-rose-300 bg-rose-700 text-rose-50';

function rollingRandomInRange(
  minInclusive: number,
  maxInclusive: number
): number {
  return (
    minInclusive + Math.floor(Math.random() * (maxInclusive - minInclusive + 1))
  );
}

function pickingNextBeatPatternIndex(previousIndex: number): number {
  const patternCount =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY.length;

  if (patternCount <= 1) {
    return 0;
  }

  let nextIndex = rollingRandomInRange(0, patternCount - 1);

  if (nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % patternCount;
  }

  return nextIndex;
}

function resolvingWorldPlazaCraftModeBeatNoteOutClassName(
  isCracked: boolean
): string {
  return isCracked
    ? DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_OUT_CRACKED_CLASS_NAME
    : DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_OUT_HAMMER_CLASS_NAME;
}

function resolvingWorldPlazaCraftModeBeatNoteInClassName(params: {
  readonly isCracked: boolean;
  readonly strikeDiskClassName: string;
}): string {
  return params.isCracked
    ? DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_IN_CRACKED_CLASS_NAME
    : `shadow-[0_0_12px_rgba(0,0,0,0.45)] ${params.strikeDiskClassName}`;
}

function syncingWorldPlazaCraftModeBeatLanePresentation(params: {
  readonly nowMs: number;
  readonly notes: readonly DefiningWorldPlazaCraftModeBeatLaneNote[];
  readonly hitZoneCenterPercent: number;
  readonly strikeDiskClassName: string;
  readonly noteElementsById: Map<string, HTMLElement>;
  readonly noteIconElementsById: Map<string, HTMLElement>;
  readonly floatPopups: readonly DefiningWorldPlazaCraftModeBeatFloatPopup[];
  readonly floatPopupElementsById: Map<number, HTMLElement>;
}): void {
  const {
    nowMs,
    notes,
    hitZoneCenterPercent,
    strikeDiskClassName,
    noteElementsById,
    noteIconElementsById,
    floatPopups,
    floatPopupElementsById,
  } = params;

  for (const note of notes) {
    const noteElement = noteElementsById.get(note.noteId);
    if (!noteElement) {
      continue;
    }

    const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
      note,
      nowMs
    );
    const isInGoldZone = checkingWorldPlazaCraftModeBeatNoteInHitZone(
      leftPercent,
      hitZoneCenterPercent
    );
    const isCracked = note.kind === 'cracked';
    const stateClassName = isInGoldZone
      ? resolvingWorldPlazaCraftModeBeatNoteInClassName({
          isCracked,
          strikeDiskClassName,
        })
      : resolvingWorldPlazaCraftModeBeatNoteOutClassName(isCracked);

    noteElement.style.left = `${leftPercent}%`;
    noteElement.className = `${DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_BASE_CLASS_NAME} ${stateClassName}`;

    const iconElement = noteIconElementsById.get(note.noteId);
    if (iconElement) {
      iconElement.style.visibility = isInGoldZone ? 'visible' : 'hidden';
    }
  }

  for (const popup of floatPopups) {
    const popupElement = floatPopupElementsById.get(popup.popupId);
    if (!popupElement) {
      continue;
    }

    const ageMs = nowMs - popup.createdAtMs;
    const lifeRatio = Math.min(
      1,
      Math.max(0, ageMs / DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FLOAT_MS)
    );
    const risePx = -8 - lifeRatio * 28;
    const opacity = 1 - lifeRatio;

    popupElement.style.top = `calc(50% + ${risePx}px)`;
    popupElement.style.opacity = String(opacity);
  }
}

/**
 * Bottom HUD progress + beat lane for cookbook crafts.
 * Notes only show inside the snapping gold zone. Combo speeds hammer boosts.
 *
 * Lane clock + note positions update imperatively (no every-rAF React state).
 */
export function RenderingWorldPlazaCraftModeTimedCraftProgressHud({
  activeCraft,
  onHammerHit,
  onCrackedHit,
  onConfirmCraft,
  onCancelCraft,
}: RenderingWorldPlazaCraftModeTimedCraftProgressHudProps): React.JSX.Element | null {
  const [notes, setNotes] = useState<
    readonly DefiningWorldPlazaCraftModeBeatLaneNote[]
  >([]);
  const [hitZoneCenterPercent, setHitZoneCenterPercent] = useState(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT
  );
  const [floatPopups, setFloatPopups] = useState<
    readonly DefiningWorldPlazaCraftModeBeatFloatPopup[]
  >([]);
  const notesRef = useRef(notes);
  const hitZoneCenterPercentRef = useRef(hitZoneCenterPercent);
  const strikeComboRef = useRef(0);
  const floatPopupsRef = useRef(floatPopups);
  const nextPatternAtMsRef = useRef(0);
  const lastPatternIndexRef = useRef(-1);
  const waveSerialRef = useRef(0);
  const tempoRef = useRef(1);
  const floatSerialRef = useRef(0);
  const onHammerHitRef = useRef(onHammerHit);
  const onCrackedHitRef = useRef(onCrackedHit);
  const noteElementsByIdRef = useRef(new Map<string, HTMLElement>());
  const noteIconElementsByIdRef = useRef(new Map<string, HTMLElement>());
  const floatPopupElementsByIdRef = useRef(new Map<number, HTMLElement>());
  const activeCraftRef = useRef(activeCraft);
  const progressBarElementRef = useRef<HTMLDivElement | null>(null);
  const remainingLabelElementRef = useRef<HTMLSpanElement | null>(null);

  notesRef.current = notes;
  hitZoneCenterPercentRef.current = hitZoneCenterPercent;
  floatPopupsRef.current = floatPopups;
  activeCraftRef.current = activeCraft;
  onHammerHitRef.current = onHammerHit;
  onCrackedHitRef.current = onCrackedHit;

  const isAwaitingConfirm = activeCraft?.phase === 'awaitingConfirm';

  useEffect(() => {
    if (!activeCraft || activeCraft.phase !== 'crafting') {
      if (!activeCraft) {
        setNotes([]);
        strikeComboRef.current = 0;
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
      } else {
        setNotes([]);
        setFloatPopups([]);
        notesRef.current = [];
        floatPopupsRef.current = [];
      }
      return;
    }

    const craftStartedAtMs = Date.now();
    nextPatternAtMsRef.current =
      craftStartedAtMs +
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FIRST_PATTERN_DELAY_MS;
    lastPatternIndexRef.current = -1;
    waveSerialRef.current = 0;
    tempoRef.current = 1;
    setNotes([]);
    strikeComboRef.current = 0;
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

      const craftHud = activeCraftRef.current;
      if (!craftHud || craftHud.phase !== 'crafting') {
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
          const spawnedNotes =
            buildingWorldPlazaCraftModeBeatLaneNotesFromPattern(
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
            nowMs - popup.createdAtMs <
            DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_FLOAT_MS
        );
        const nextPopups =
          alivePopups.length === currentPopups.length
            ? currentPopups
            : alivePopups;
        floatPopupsRef.current = nextPopups;
        return nextPopups;
      });

      const strikeColors = resolvingWorldPlazaCraftModeBeatStrikeColorTier(
        Math.max(1, strikeComboRef.current)
      );
      syncingWorldPlazaCraftModeBeatLanePresentation({
        nowMs,
        notes: notesRef.current,
        hitZoneCenterPercent: hitZoneCenterPercentRef.current,
        strikeDiskClassName: strikeColors.diskClassName,
        noteElementsById: noteElementsByIdRef.current,
        noteIconElementsById: noteIconElementsByIdRef.current,
        floatPopups: floatPopupsRef.current,
        floatPopupElementsById: floatPopupElementsByIdRef.current,
      });

      const progressRatio = computingWorldPlazaCraftModeHudProgressRatio(
        craftHud,
        nowMs
      );
      const remainingMs = computingWorldPlazaCraftModeRemainingMs({
        nowMs,
        endsAtMs: craftHud.endsAtMs,
        pausedUntilMs: craftHud.pausedUntilMs,
      });
      const isPaused = checkingWorldPlazaCraftModeHudIsPaused(craftHud, nowMs);
      const progressBarElement = progressBarElementRef.current;
      if (progressBarElement) {
        progressBarElement.style.width = `${Math.min(100, Math.max(0, progressRatio * 100))}%`;
        progressBarElement.classList.toggle('opacity-60', isPaused);
      }
      const remainingLabelElement = remainingLabelElementRef.current;
      if (remainingLabelElement) {
        remainingLabelElement.textContent = `${
          isPaused ? 'Halted · ' : ''
        }${formattingWorldPlazaCraftModeInGameRemainingLabel(remainingMs)}`;
      }

      frameId = window.requestAnimationFrame(tickingLane);
    };

    frameId = window.requestAnimationFrame(tickingLane);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
    };
  }, [activeCraft?.recipeId, activeCraft?.phase]);

  if (!activeCraft) {
    return null;
  }

  const hitZoneLeftPercent =
    hitZoneCenterPercent -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT;
  const hitZoneWidthPercent =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT * 2;
  const initialNowMs = Date.now();
  const initialProgressPercent =
    computingWorldPlazaCraftModeHudProgressRatio(activeCraft, initialNowMs) *
    100;
  const initialIsPaused = checkingWorldPlazaCraftModeHudIsPaused(
    activeCraft,
    initialNowMs
  );
  const initialRemainingLabel = isAwaitingConfirm
    ? LABELING_WORLD_PLAZA_CRAFT_MODE_READY_STATUS
    : `${
        initialIsPaused ? 'Halted · ' : ''
      }${formattingWorldPlazaCraftModeInGameRemainingLabel(
        computingWorldPlazaCraftModeRemainingMs({
          nowMs: initialNowMs,
          endsAtMs: activeCraft.endsAtMs,
          pausedUntilMs: activeCraft.pausedUntilMs,
        })
      )}`;
  const confirmPrimaryLabel =
    activeCraft.outcomeKind === 'entity'
      ? formattingWorldPlazaCraftModeConfirmPlaceLabel(activeCraft.displayName)
      : LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_OK;

  const handlingLanePointer = (): void => {
    if (activeCraftRef.current?.phase !== 'crafting') {
      return;
    }

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
      onHammerHitRef.current(nextCombo);
      const colors = resolvingWorldPlazaCraftModeBeatStrikeColorTier(nextCombo);
      setFloatPopups((current) => {
        const nextPopups = [
          ...current,
          {
            popupId,
            kind: 'strike' as const,
            label: `Strike ${nextCombo}x`,
            className: colors.floatClassName,
            leftPercent,
            createdAtMs: nowMs,
          },
        ];
        floatPopupsRef.current = nextPopups;
        return nextPopups;
      });
    } else {
      const comboBeforeBreak = strikeComboRef.current;
      strikeComboRef.current = 0;
      onCrackedHitRef.current();
      const breakColors =
        resolvingWorldPlazaCraftModeBeatBreakColorTier(comboBeforeBreak);
      setFloatPopups((current) => {
        const nextPopups = [
          ...current,
          {
            popupId,
            kind: 'break' as const,
            label: 'BREAK',
            className: breakColors.floatClassName,
            leftPercent,
            createdAtMs: nowMs,
          },
        ];
        floatPopupsRef.current = nextPopups;
        return nextPopups;
      });
    }

    const nextNotes = notesRef.current.map((note) =>
      note.noteId === hitTarget.noteId ? { ...note, resolved: true } : note
    );
    notesRef.current = nextNotes;
    setNotes(nextNotes);
  };

  const attachingNoteElement = (
    noteId: string,
    element: HTMLSpanElement | null
  ): void => {
    if (element) {
      noteElementsByIdRef.current.set(noteId, element);
      return;
    }

    noteElementsByIdRef.current.delete(noteId);
  };

  const attachingNoteIconElement = (
    noteId: string,
    element: HTMLSpanElement | null
  ): void => {
    if (element) {
      noteIconElementsByIdRef.current.set(noteId, element);
      return;
    }

    noteIconElementsByIdRef.current.delete(noteId);
  };

  const attachingFloatPopupElement = (
    popupId: number,
    element: HTMLSpanElement | null
  ): void => {
    if (element) {
      floatPopupElementsByIdRef.current.set(popupId, element);
      return;
    }

    floatPopupElementsByIdRef.current.delete(popupId);
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
          <span
            ref={remainingLabelElementRef}
            className="tabular-nums text-stone-300"
          >
            {initialRemainingLabel}
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-stone-800">
          <div
            ref={progressBarElementRef}
            className={`h-full rounded-full bg-linear-to-r from-orange-700 via-orange-400 to-yellow-300 ${
              initialIsPaused ? 'opacity-60' : ''
            }`}
            style={{ width: `${initialProgressPercent}%` }}
          />
        </div>
        {isAwaitingConfirm ? (
          <div className={DEFINING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_ACTIONS_CLASS_NAME}>
            <button
              type="button"
              className={
                DEFINING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_CANCEL_BUTTON_CLASS_NAME
              }
              onClick={(event) => {
                event.stopPropagation();
                onCancelCraft();
              }}
            >
              {LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_CANCEL}
            </button>
            <button
              type="button"
              autoFocus
              className={
                DEFINING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_PRIMARY_BUTTON_CLASS_NAME
              }
              onClick={(event) => {
                event.stopPropagation();
                onConfirmCraft();
              }}
            >
              {confirmPrimaryLabel}
            </button>
          </div>
        ) : (
          <>
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
                const isCracked = note.kind === 'cracked';
                const initialLeftPercent =
                  computingWorldPlazaCraftModeBeatNoteLeftPercent(
                    note,
                    Date.now()
                  );

                return (
                  <span
                    key={note.noteId}
                    ref={(element) =>
                      attachingNoteElement(note.noteId, element)
                    }
                    className={`${DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_BASE_CLASS_NAME} ${resolvingWorldPlazaCraftModeBeatNoteOutClassName(isCracked)}`}
                    style={{ left: `${initialLeftPercent}%` }}
                    aria-hidden
                  >
                    <span
                      ref={(element) =>
                        attachingNoteIconElement(note.noteId, element)
                      }
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ visibility: 'hidden' }}
                    >
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
                    </span>
                    <span className="sr-only">
                      {isCracked
                        ? LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_CRACKED
                        : LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HAMMER}
                    </span>
                  </span>
                );
              })}
              {floatPopups.map((popup) => (
                <span
                  key={popup.popupId}
                  ref={(element) =>
                    attachingFloatPopupElement(popup.popupId, element)
                  }
                  className={`pointer-events-none absolute z-20 -translate-x-1/2 text-[11px] font-black uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] ${popup.className}`}
                  style={{
                    left: `${popup.leftPercent}%`,
                    top: 'calc(50% + -8px)',
                    opacity: 1,
                  }}
                >
                  {popup.label}
                </span>
              ))}
            </button>
            <p className="mt-1 text-center text-[9px] text-stone-400">
              {LABELING_WORLD_PLAZA_CRAFT_MODE_BEAT_HINT}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
