'use client';

import { Icon } from '@/components/ui/icon';
import type { RenderingWorldPlazaGameplayHudExplanationPopoverProps } from '@/components/world/components/renderingWorldPlazaGameplayHudExplanationPopover';
import { RenderingWorldPlazaGameplayHudExplanationPopover } from '@/components/world/components/renderingWorldPlazaGameplayHudExplanationPopover';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { formattingWorldPlazaEntityStatusEffectHudDisplayValue } from '@/components/world/health/domains/formattingWorldPlazaEntityStatusEffectHudDisplayValue';
import { computingWorldPlazaEntityEffectRemainingSeconds } from '@/components/world/health/domains/resolvingWorldPlazaEntityEffectCountdownNowMs';
import { usingWorldPlazaGameplayHudPopoverOpenState } from '@/components/world/hooks/usingWorldPlazaGameplayHudPopoverOpenState';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useEffect, useRef, type SyntheticEvent } from 'react';

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

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_COUNTDOWN_REFRESH_MS = 250;

function resolvingWorldPlazaEntityStatusEffectHudRowDisplayValue(
  row: DefiningWorldPlazaEntityStatusEffectHudRow,
  nowMs: number
): string {
  if (row.displayMode === 'time' && row.expiresAtMs !== null) {
    const remainingSeconds = computingWorldPlazaEntityEffectRemainingSeconds(
      row.expiresAtMs,
      nowMs
    );

    return formattingWorldPlazaEntityStatusEffectHudDisplayValue({
      displayMode: 'time',
      numericValue: remainingSeconds,
    });
  }

  if (row.displayMode === 'timed_damage' && row.expiresAtMs !== null) {
    const remainingSeconds = computingWorldPlazaEntityEffectRemainingSeconds(
      row.expiresAtMs,
      nowMs
    );
    const damageLabel = Math.max(0, Math.round(row.numericValue));

    return `${damageLabel}·${remainingSeconds}s`;
  }

  return formattingWorldPlazaEntityStatusEffectHudDisplayValue({
    displayMode: row.displayMode,
    numericValue: row.numericValue,
  });
}

function checkingWorldPlazaEntityStatusEffectHudRowIsExpired(
  row: DefiningWorldPlazaEntityStatusEffectHudRow,
  displayValue: string
): boolean {
  if (row.displayMode === 'time' && displayValue === '0s') {
    return true;
  }

  if (row.displayMode === 'timed_damage' && displayValue.endsWith('·0s')) {
    return true;
  }

  return false;
}

function resolvingWorldPlazaEntityStatusEffectHudRowPopoverFooter(
  row: DefiningWorldPlazaEntityStatusEffectHudRow,
  displayValue: string
): string | null {
  if (row.popoverFooter !== undefined) {
    return row.popoverFooter;
  }

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
  explanationPopoverLayout?: Pick<
    RenderingWorldPlazaGameplayHudExplanationPopoverProps,
    'placement' | 'anchor'
  >;
}

/**
 * Status-effect badge. Timed countdowns update the value span imperatively.
 */
export function RenderingWorldPlazaEntityStatusEffectHudRowBadge({
  row,
  explanationPopoverLayout,
}: RenderingWorldPlazaEntityStatusEffectHudRowBadgeProps): React.JSX.Element | null {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const valueElementRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef(row);
  rowRef.current = row;
  const { isPopoverOpen, togglingPopoverOpen } =
    usingWorldPlazaGameplayHudPopoverOpenState(containerRef);
  const initialDisplayValue =
    resolvingWorldPlazaEntityStatusEffectHudRowDisplayValue(
      row,
      performance.now()
    );
  const isTimedCountdown =
    (row.displayMode === 'time' || row.displayMode === 'timed_damage') &&
    row.expiresAtMs !== null;
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
    resolvingWorldPlazaEntityStatusEffectHudRowPopoverFooter(
      row,
      initialDisplayValue
    );

  useEffect(() => {
    if (!isTimedCountdown) {
      return;
    }

    const publishingDisplayValue = (): void => {
      const liveRow = rowRef.current;
      const displayValue =
        resolvingWorldPlazaEntityStatusEffectHudRowDisplayValue(
          liveRow,
          performance.now()
        );
      const valueElement = valueElementRef.current;
      if (valueElement) {
        valueElement.textContent = displayValue;
      }
      const containerElement = containerRef.current;
      if (containerElement) {
        containerElement.style.display =
          checkingWorldPlazaEntityStatusEffectHudRowIsExpired(
            liveRow,
            displayValue
          )
            ? 'none'
            : '';
      }
    };

    publishingDisplayValue();
    const intervalId = window.setInterval(
      publishingDisplayValue,
      RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_COUNTDOWN_REFRESH_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimedCountdown, row.expiresAtMs, row.displayMode, row.numericValue]);

  if (
    checkingWorldPlazaEntityStatusEffectHudRowIsExpired(
      row,
      initialDisplayValue
    )
  ) {
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
        } ${row.hudIconBorderClassName} cursor-pointer outline-none transition-opacity hover:opacity-90 focus:outline-none focus-visible:outline-none`}
        aria-label={`${row.summaryLabel}. Tap for details.`}
        aria-expanded={isPopoverOpen}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return;
          }

          stoppingPlazaWalkPointerPropagation(event);
          event.preventDefault();
          togglingPopoverOpen();
        }}
        onClick={stoppingPlazaWalkPointerPropagation}
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
        {initialDisplayValue.length > 0 ? (
          <span
            ref={valueElementRef}
            className={`${RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_VALUE_CLASS_NAME} ${
              isMobile
                ? RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_VALUE_MOBILE_CLASS_NAME
                : ''
            } ${
              row.id === 'poison' || row.id.startsWith('potential-')
                ? row.hudIconColorClassName
                : DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography
                    .textParchment
            }`}
          >
            {initialDisplayValue}
          </span>
        ) : null}
      </button>
      {isPopoverOpen ? (
        <RenderingWorldPlazaGameplayHudExplanationPopover
          title={row.summaryLabel}
          detailLines={row.detailLines ?? []}
          footer={popoverFooter}
          placement={explanationPopoverLayout?.placement ?? 'below'}
          anchor={explanationPopoverLayout?.anchor ?? 'center'}
        />
      ) : null}
    </div>
  );
}
