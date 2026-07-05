'use client';

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_GAP_BELOW_BAR_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_RESERVED_HEIGHT_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { computingWorldPlazaEntityBuffHudRemainingSeconds } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { useEffect, useState } from 'react';

function usingWorldPlazaEntityHealthBuffCountdownNowMs(
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
}: {
  buff: DefiningWorldPlazaEntityActiveBuffHudEntry;
  nowMs: number;
}): React.JSX.Element {
  const remainingSeconds = computingWorldPlazaEntityBuffHudRemainingSeconds(
    buff.expiresAtMs,
    nowMs
  );
  const borderClassName =
    buff.polarity === 'debuff'
      ? 'border-red-400/70 bg-red-950/80'
      : 'border-poster-gold/55 bg-black/80';

  return (
    <div
      className="flex flex-col items-center gap-px"
      title={`${buff.label} — ${buff.description}`}
    >
      <div
        className={`flex items-center justify-center rounded-[2px] border p-px shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] ${borderClassName}`}
      >
        <Icon
          icon={buff.icon}
          width={DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX}
          height={DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX}
          className={
            buff.polarity === 'debuff' ? 'text-red-200' : 'text-poster-gold'
          }
        />
      </div>
      {remainingSeconds !== null ? (
        <span className="text-[5px] font-bold leading-none tabular-nums text-white/90">
          {remainingSeconds}
        </span>
      ) : null}
    </div>
  );
}

export interface RenderingWorldPlazaEntityHealthBuffIconRowProps {
  activeBuffs: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[];
}

/**
 * Compact buff/debuff icons rendered below the entity health bar.
 */
export function RenderingWorldPlazaEntityHealthBuffIconRow({
  activeBuffs,
}: RenderingWorldPlazaEntityHealthBuffIconRowProps): React.JSX.Element {
  const hasTimedBuff = activeBuffs.some((buff) => buff.expiresAtMs !== null);
  const nowMs = usingWorldPlazaEntityHealthBuffCountdownNowMs(hasTimedBuff);

  return (
    <div
      className="flex max-w-[72px] flex-wrap items-start justify-center gap-0.5"
      style={{
        minHeight: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_RESERVED_HEIGHT_PX}px`,
        marginTop: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_GAP_BELOW_BAR_PX}px`,
      }}
    >
      {activeBuffs.map((buff) => (
        <RenderingWorldPlazaEntityHealthBuffIcon
          key={buff.id}
          buff={buff}
          nowMs={nowMs}
        />
      ))}
    </div>
  );
}
