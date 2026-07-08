'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_GAP_BELOW_BAR_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_RESERVED_HEIGHT_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { computingWorldPlazaEntityBuffHudRemainingSeconds } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { useCallback, useEffect, useState, type SyntheticEvent } from 'react';

export function usingWorldPlazaEntityHealthBuffCountdownNowMs(
  hasTimedBuff: boolean
): number {
  const [nowMs, setNowMs] = useState(() => performance.now());

  useEffect(() => {
    if (!hasTimedBuff) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(performance.now());
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasTimedBuff]);

  return nowMs;
}

function RenderingWorldPlazaEntityHealthBuffIcon({
  buff,
  nowMs,
  isOpen,
  onToggle,
}: {
  buff: DefiningWorldPlazaEntityActiveBuffHudEntry;
  nowMs: number;
  isOpen: boolean;
  onToggle: () => void;
}): React.JSX.Element {
  const remainingSeconds = computingWorldPlazaEntityBuffHudRemainingSeconds(
    buff.expiresAtMs,
    nowMs
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

  return (
    <button
      type="button"
      className="flex cursor-pointer flex-col items-center gap-px rounded-[2px] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-poster-gold/70"
      aria-label={`${buff.label}. Tap for details.`}
      aria-expanded={isOpen}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={(event) => {
        stoppingPlazaWalkPointerPropagation(event);
        onToggle();
      }}
    >
      <div
        className={`flex items-center justify-center rounded-[2px] border p-px shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] ${borderClassName}`}
      >
        <Icon
          icon={buff.icon}
          width={DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX}
          height={DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX}
          className={
            buff.isDisease
              ? (buff.hudIconColorClassName ?? 'text-lime-300')
              : buff.polarity === 'debuff'
                ? 'text-red-200'
                : 'text-poster-gold'
          }
        />
      </div>
      {remainingSeconds !== null ? (
        <span className="text-[5px] font-bold leading-none tabular-nums text-white/90">
          {remainingSeconds}
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
 * Compact buff/debuff icons rendered below the entity health bar.
 */
export function RenderingWorldPlazaEntityHealthBuffIconRow({
  activeBuffs,
  openBuffId,
  onOpenBuffIdChange,
}: RenderingWorldPlazaEntityHealthBuffIconRowProps): React.JSX.Element {
  const hasTimedBuff = activeBuffs.some((buff) => buff.expiresAtMs !== null);
  const nowMs = usingWorldPlazaEntityHealthBuffCountdownNowMs(hasTimedBuff);

  return (
    <div
      className="pointer-events-auto flex max-w-[72px] flex-wrap items-start justify-center gap-0.5"
      style={{
        minHeight: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_RESERVED_HEIGHT_PX}px`,
        marginTop: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_GAP_BELOW_BAR_PX}px`,
      }}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
    >
      {activeBuffs.map((buff) => (
        <RenderingWorldPlazaEntityHealthBuffIcon
          key={buff.id}
          buff={buff}
          nowMs={nowMs}
          isOpen={openBuffId === buff.id}
          onToggle={() => {
            onOpenBuffIdChange(openBuffId === buff.id ? null : buff.id);
          }}
        />
      ))}
    </div>
  );
}
