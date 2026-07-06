'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { formattingWorldPlazaEntityStatusEffectHudDisplayValue } from '@/components/world/health/domains/formattingWorldPlazaEntityStatusEffectHudDisplayValue';
import { useIsMobile } from '@/hooks/use-mobile';

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

export interface RenderingWorldPlazaEntityStatusEffectHudRowBadgeProps {
  row: DefiningWorldPlazaEntityStatusEffectHudRow;
  nowMs: number;
}

export function RenderingWorldPlazaEntityStatusEffectHudRowBadge({
  row,
  nowMs,
}: RenderingWorldPlazaEntityStatusEffectHudRowBadgeProps): React.JSX.Element | null {
  const isMobile = useIsMobile();
  const displayValue = resolvingWorldPlazaEntityStatusEffectHudRowDisplayValue(
    row,
    nowMs
  );
  const iconSizePx = isMobile
    ? RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_MOBILE_PX
    : RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX;

  if (row.displayMode === 'time' && displayValue === '0s') {
    return null;
  }

  if (row.displayMode === 'timed_damage' && displayValue.endsWith('·0s')) {
    return null;
  }

  return (
    <div
      className={`${RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_CLASS_NAME} ${
        isMobile
          ? RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_BADGE_MOBILE_CLASS_NAME
          : ''
      } ${row.hudIconBorderClassName}`}
      title={row.summaryLabel}
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
    </div>
  );
}
