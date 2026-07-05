'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaEntityStatusEffectHudRowBadge } from '@/components/world/health/components/renderingWorldPlazaEntityStatusEffectHudRowBadge';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import {
  STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME,
  resolvingWorldPlazaEntityStatusEffectStackTopClassName,
} from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectStackConstants';
import { useEffect, useState } from 'react';

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
