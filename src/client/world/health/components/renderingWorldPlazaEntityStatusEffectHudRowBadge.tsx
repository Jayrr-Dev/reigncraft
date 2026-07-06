'use client';

import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaGameplayHudExplanationPopover } from '@/components/world/components/renderingWorldPlazaGameplayHudExplanationPopover';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { formattingWorldPlazaEntityStatusEffectHudDisplayValue } from '@/components/world/health/domains/formattingWorldPlazaEntityStatusEffectHudDisplayValue';
import { usingWorldPlazaGameplayHudPopoverOpenState } from '@/components/world/hooks/usingWorldPlazaGameplayHudPopoverOpenState';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useRef, type SyntheticEvent } from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX = 14 as const;
const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_MOBILE_PX =
  10 as const;

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.statusEffectRow;

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_MOBILE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.statusEffectRowMobile;

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_SOCKET_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.statusEffectSocket;

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_SOCKET_MOBILE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.statusEffectSocketMobile;

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_VALUE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.statusEffectValue;

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_VALUE_MOBILE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.statusEffectValueMobile;

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

function resolvingWorldPlazaEntityStatusEffectHudRowPopoverFooter(
  row: DefiningWorldPlazaEntityStatusEffectHudRow,
  displayValue: string
): string | null {
  if (row.displayMode === 'infinite') {
    return 'Active';
  }

  if (displayValue.length === 0) {
    return null;
  }

  return `Current: ${displayValue}`;
}

export interface RenderingWorldPlazaEntityStatusEffectHudRowBadgeProps {
  row: DefiningWorldPlazaEntityStatusEffectHudRow;
  nowMs: number;
}

export function RenderingWorldPlazaEntityStatusEffectHudRowBadge({
  row,
  nowMs,
}: RenderingWorldPlazaEntityStatusEffectHudRowBadgeProps): React.JSX.Element | null {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPopoverOpen, togglingPopoverOpen } =
    usingWorldPlazaGameplayHudPopoverOpenState(containerRef);
  const displayValue = resolvingWorldPlazaEntityStatusEffectHudRowDisplayValue(
    row,
    nowMs
  );
  const iconSizePx = isMobile
    ? RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_MOBILE_PX
    : RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX;
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );
  const popoverFooter =
    resolvingWorldPlazaEntityStatusEffectHudRowPopoverFooter(row, displayValue);

  if (row.displayMode === 'time' && displayValue === '0s') {
    return null;
  }

  if (row.displayMode === 'timed_damage' && displayValue.endsWith('·0s')) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative pointer-events-auto">
      <button
        type="button"
        className={`${RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_CLASS_NAME} ${
          isMobile
            ? RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_MOBILE_CLASS_NAME
            : ''
        } ${row.hudIconBorderClassName} cursor-pointer outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-poster-gold/70`}
        aria-label={`${row.summaryLabel}. Tap for details.`}
        aria-expanded={isPopoverOpen}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
        onClick={(event) => {
          stoppingPlazaWalkPointerPropagation(event);
          togglingPopoverOpen();
        }}
      >
        <span
          className={`${RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_SOCKET_CLASS_NAME} ${
            isMobile
              ? RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_SOCKET_MOBILE_CLASS_NAME
              : ''
          }`}
        >
          <Icon
            icon={row.icon}
            width={iconSizePx}
            height={iconSizePx}
            className={`drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${row.hudIconColorClassName}`}
          />
        </span>
        <span
          className={`${RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_VALUE_CLASS_NAME} ${
            isMobile
              ? RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_VALUE_MOBILE_CLASS_NAME
              : ''
          } ${
            row.id === 'poison' || row.id.startsWith('potential-')
              ? row.hudIconColorClassName
              : DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.textParchment
          }`}
        >
          {displayValue}
        </span>
      </button>
      {isPopoverOpen ? (
        <RenderingWorldPlazaGameplayHudExplanationPopover
          title={row.summaryLabel}
          footer={popoverFooter}
          placement="below"
        />
      ) : null}
    </div>
  );
}
