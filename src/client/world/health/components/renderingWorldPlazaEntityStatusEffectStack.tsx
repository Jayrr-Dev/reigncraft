'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaEntityStatusEffectHudRowBadge } from '@/components/world/health/components/renderingWorldPlazaEntityStatusEffectHudRowBadge';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_EXPLANATION_POPOVER_LAYOUT } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectStackConstants';
import { resolvingWorldPlazaEntityStatusEffectStackViewportLayout } from '@/components/world/health/domains/resolvingWorldPlazaEntityStatusEffectStackViewportLayout';
import { DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo } from 'react';

export interface RenderingWorldPlazaEntityStatusEffectStackProps {
  statusEffectHudRows: readonly DefiningWorldPlazaEntityStatusEffectHudRow[];
  /** When true, offsets below the online room status HUD on desktop. */
  hasOnlineRoomHud?: boolean;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
}

/**
 * Top-right stacked status rows (bleed, poison, shield, invincibility, etc.).
 *
 * Timed badge countdowns are owned by each badge (imperative text), not a
 * shared React nowMs clock on this stack.
 */
export function RenderingWorldPlazaEntityStatusEffectStack({
  statusEffectHudRows,
  hasOnlineRoomHud = false,
  viewportHudScale = 1,
}: RenderingWorldPlazaEntityStatusEffectStackProps): React.JSX.Element {
  const isMobile = useIsMobile();
  const viewportLayout = useMemo(
    () =>
      resolvingWorldPlazaEntityStatusEffectStackViewportLayout({
        viewportHudScale,
        hasOnlineRoomHud,
        isMobile,
      }),
    [hasOnlineRoomHud, isMobile, viewportHudScale]
  );

  if (statusEffectHudRows.length === 0) {
    return <></>;
  }

  return (
    <div
      className={viewportLayout.anchorClassName}
      style={viewportLayout.style}
      {...{
        [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
        [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]:
          'status-effect-stack',
      }}
    >
      {statusEffectHudRows.map((row) => (
        <RenderingWorldPlazaEntityStatusEffectHudRowBadge
          key={row.id}
          row={row}
          explanationPopoverLayout={
            DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_EXPLANATION_POPOVER_LAYOUT
          }
        />
      ))}
    </div>
  );
}
