'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import {
  STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME,
  resolvingWorldPlazaEntityStatusEffectStackTopClassName,
} from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectStackConstants';
import { formattingWorldPlazaEntityStatusEffectHudDisplayValue } from '@/components/world/health/domains/formattingWorldPlazaEntityStatusEffectHudDisplayValue';
import { useEffect, useState } from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX = 18 as const;

function usingWorldPlazaEntityStatusEffectHudNowMs(
  hasTimedRows: boolean
): number {
  const [nowMs, setNowMs] = useState(() => performance.now());

  useEffect(() => {
    if (!hasTimedRows) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(performance.now());
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasTimedRows]);

  return nowMs;
}

function resolvingWorldPlazaEntityStatusEffectHudRowDisplayValue(
  row: DefiningWorldPlazaEntityStatusEffectHudRow,
  nowMs: number
): string {
  if (row.displayMode === 'time' && row.expiresAtMs !== null) {
    const remainingSeconds = Math.max(
      0,
      Math.ceil((row.expiresAtMs - nowMs) / 1000)
    );

    return formattingWorldPlazaEntityStatusEffectHudDisplayValue({
      displayMode: 'time',
      numericValue: remainingSeconds,
    });
  }

  if (row.displayMode === 'timed_damage' && row.expiresAtMs !== null) {
    const remainingSeconds = Math.max(
      0,
      Math.ceil((row.expiresAtMs - nowMs) / 1000)
    );
    const damageLabel = Math.max(0, Math.round(row.numericValue));

    return `${damageLabel}·${remainingSeconds}s`;
  }

  return formattingWorldPlazaEntityStatusEffectHudDisplayValue({
    displayMode: row.displayMode,
    numericValue: row.numericValue,
  });
}

function RenderingWorldPlazaEntityStatusEffectHudRowBadge({
  row,
  nowMs,
}: {
  row: DefiningWorldPlazaEntityStatusEffectHudRow;
  nowMs: number;
}): React.JSX.Element | null {
  const displayValue = resolvingWorldPlazaEntityStatusEffectHudRowDisplayValue(
    row,
    nowMs
  );

  if (row.displayMode === 'time' && displayValue === '0s') {
    return null;
  }

  if (row.displayMode === 'timed_damage' && displayValue.endsWith('·0s')) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 shadow-[0_3px_12px_rgba(0,0,0,0.45)] backdrop-blur-sm ${row.hudIconBorderClassName}`}
      title={row.summaryLabel}
    >
      <Icon
        icon={row.icon}
        width={RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX}
        height={RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX}
        className={row.hudIconColorClassName}
      />
      <span
        className={`min-w-10 text-right text-xl font-bold leading-none tabular-nums ${
          row.id === 'poison' || row.id.startsWith('potential-')
            ? row.hudIconColorClassName
            : 'text-white'
        }`}
      >
        {displayValue}
      </span>
    </div>
  );
}

export interface RenderingWorldPlazaEntityStatusEffectStackProps {
  statusEffectHudRows: readonly DefiningWorldPlazaEntityStatusEffectHudRow[];
  /** When true, offsets below the online room status HUD on desktop. */
  hasOnlineRoomHud?: boolean;
}

/**
 * Top-right stacked status rows (bleed, poison, shield, invincibility, etc.).
 */
export function RenderingWorldPlazaEntityStatusEffectStack({
  statusEffectHudRows,
  hasOnlineRoomHud = false,
}: RenderingWorldPlazaEntityStatusEffectStackProps): React.JSX.Element {
  const hasTimedRows = statusEffectHudRows.some(
    (row) => row.displayMode === 'time' || row.displayMode === 'timed_damage'
  );
  const nowMs = usingWorldPlazaEntityStatusEffectHudNowMs(hasTimedRows);

  if (statusEffectHudRows.length === 0) {
    return <></>;
  }

  return (
    <div
      className={`${STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME} ${resolvingWorldPlazaEntityStatusEffectStackTopClassName(hasOnlineRoomHud)}`}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
    >
      {statusEffectHudRows.map((row) => (
        <RenderingWorldPlazaEntityStatusEffectHudRowBadge
          key={row.id}
          row={row}
          nowMs={nowMs}
        />
      ))}
    </div>
  );
}
