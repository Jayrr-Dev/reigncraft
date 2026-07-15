'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaEntityDiseaseIconGlyph } from '@/components/world/health/components/renderingWorldPlazaEntityDiseaseIconGlyph';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_GAP_BELOW_ICONS_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_RESERVED_HEIGHT_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { computingWorldPlazaEntityBuffHudRemainingSeconds } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  type SyntheticEvent,
} from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_COUNTDOWN_REFRESH_MS = 250;

function RenderingWorldPlazaEntityHealthBuffIcon({
  buff,
  isOpen,
  onToggle,
}: {
  buff: DefiningWorldPlazaEntityActiveBuffHudEntry;
  isOpen: boolean;
  onToggle: () => void;
}): React.JSX.Element {
  const countdownElementRef = useRef<HTMLSpanElement>(null);
  const buffRef = useRef(buff);
  buffRef.current = buff;
  const initialRemainingSeconds =
    computingWorldPlazaEntityBuffHudRemainingSeconds(
      buff.expiresAtMs,
      performance.now(),
      { isDisease: buff.isDisease === true }
    );
  const borderClassName = buff.isDisease
    ? (buff.hudIconBorderClassName ?? 'border-lime-500/70 bg-lime-950/90')
    : buff.polarity === 'debuff'
      ? 'border-red-400/70 bg-red-950/80'
      : 'border-poster-gold/55 bg-black/80';
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  useEffect(() => {
    if (buff.expiresAtMs === null) {
      return;
    }

    const publishingCountdown = (): void => {
      const liveBuff = buffRef.current;
      const remainingSeconds = computingWorldPlazaEntityBuffHudRemainingSeconds(
        liveBuff.expiresAtMs,
        performance.now(),
        { isDisease: liveBuff.isDisease === true }
      );
      const countdownElement = countdownElementRef.current;
      if (!countdownElement) {
        return;
      }

      if (remainingSeconds === null) {
        countdownElement.textContent = '';
        countdownElement.style.display = 'none';
        return;
      }

      countdownElement.style.display = '';
      countdownElement.textContent = String(remainingSeconds);
    };

    publishingCountdown();
    const intervalId = window.setInterval(
      publishingCountdown,
      RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_COUNTDOWN_REFRESH_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [buff.expiresAtMs, buff.isDisease]);

  return (
    <button
      type="button"
      className="flex cursor-pointer flex-col items-center gap-px rounded-[2px] outline-none transition-opacity hover:opacity-90 focus:outline-none focus-visible:outline-none"
      aria-label={`${buff.label}. Tap for details.`}
      aria-expanded={isOpen}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      onPointerDown={(event) => {
        // Toggle on pointerdown so HP/stamina re-renders between down and up
        // cannot swallow the click. Skip non-primary buttons.
        if (event.button !== 0) {
          return;
        }

        stoppingPlazaWalkPointerPropagation(event);
        event.preventDefault();
        onToggle();
      }}
      onClick={stoppingPlazaWalkPointerPropagation}
    >
      <div
        className={`flex items-center justify-center rounded-[2px] border p-px shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] ${borderClassName}`}
      >
        {buff.isDisease && buff.diseaseId ? (
          <RenderingWorldPlazaEntityDiseaseIconGlyph
            diseaseId={buff.diseaseId}
            fallbackIcon={buff.icon}
            className="shrink-0"
            style={{
              width: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX,
              height: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX,
            }}
          />
        ) : (
          <Icon
            icon={buff.icon}
            width={DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX}
            height={DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX}
            className={
              buff.polarity === 'debuff' ? 'text-red-200' : 'text-poster-gold'
            }
          />
        )}
      </div>
      {initialRemainingSeconds !== null ? (
        <span
          ref={countdownElementRef}
          className="text-[5px] font-bold leading-none tabular-nums text-white/90"
        >
          {initialRemainingSeconds}
        </span>
      ) : null}
    </button>
  );
}

export interface RenderingWorldPlazaEntityHealthBuffIconRowProps {
  activeBuffs: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[];
  openBuffId: string | null;
  onOpenBuffIdChange: (buffId: string | null) => void;
}

/**
 * Compact buff/debuff icons rendered above the entity nameplate / HP stack.
 * Memoized so HP/stamina vitals ticks do not remount the clickable buttons.
 * Countdown digits update imperatively (no shared nowMs React clock).
 */
export const RenderingWorldPlazaEntityHealthBuffIconRow = memo(
  function RenderingWorldPlazaEntityHealthBuffIconRow({
    activeBuffs,
    openBuffId,
    onOpenBuffIdChange,
  }: RenderingWorldPlazaEntityHealthBuffIconRowProps): React.JSX.Element {
    const togglingBuffId = useCallback(
      (buffId: string) => {
        onOpenBuffIdChange(openBuffId === buffId ? null : buffId);
      },
      [onOpenBuffIdChange, openBuffId]
    );

    return (
      <div
        className="pointer-events-auto flex max-w-[72px] flex-wrap items-start justify-center gap-0.5"
        style={{
          minHeight: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_RESERVED_HEIGHT_PX}px`,
          marginBottom: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_GAP_BELOW_ICONS_PX}px`,
        }}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      >
        {activeBuffs.map((buff) => (
          <RenderingWorldPlazaEntityHealthBuffIcon
            key={buff.id}
            buff={buff}
            isOpen={openBuffId === buff.id}
            onToggle={() => {
              togglingBuffId(buff.id);
            }}
          />
        ))}
      </div>
    );
  }
);
