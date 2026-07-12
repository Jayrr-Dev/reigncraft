'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaEntityStatusEffectHudRowBadge } from '@/components/world/health/components/renderingWorldPlazaEntityStatusEffectHudRowBadge';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_EXPLANATION_POPOVER_LAYOUT } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectStackConstants';
import { resolvingWorldPlazaEntityStatusEffectStackViewportLayout } from '@/components/world/health/domains/resolvingWorldPlazaEntityStatusEffectStackViewportLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useMemo, useState } from 'react';

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
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  isFullscreen?: boolean;
}

/**
 * Top-right stacked status rows (bleed, poison, shield, invincibility, etc.).
 */
export function RenderingWorldPlazaEntityStatusEffectStack({
  statusEffectHudRows,
  hasOnlineRoomHud = false,
  viewportHudScale = 1,
  isFullscreen = false,
}: RenderingWorldPlazaEntityStatusEffectStackProps): React.JSX.Element {
  const isMobile = useIsMobile();
  const viewportLayout = useMemo(
    () =>
      resolvingWorldPlazaEntityStatusEffectStackViewportLayout({
        viewportHudScale,
        hasOnlineRoomHud,
        isMobile,
        isFullscreen,
      }),
    [hasOnlineRoomHud, isFullscreen, isMobile, viewportHudScale]
  );
  const hasTimedRows = statusEffectHudRows.some(
    (row) => row.displayMode === 'time' || row.displayMode === 'timed_damage'
  );
  const nowMs = usingWorldPlazaEntityStatusEffectHudNowMs(hasTimedRows);

  if (statusEffectHudRows.length === 0) {
    return <></>;
  }

  return (
    <div
      className={viewportLayout.anchorClassName}
      style={viewportLayout.style}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
    >
      {statusEffectHudRows.map((row) => (
        <RenderingWorldPlazaEntityStatusEffectHudRowBadge
          key={row.id}
          row={row}
          nowMs={nowMs}
          explanationPopoverLayout={
            DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_EXPLANATION_POPOVER_LAYOUT
          }
        />
      ))}
    </div>
  );
}
