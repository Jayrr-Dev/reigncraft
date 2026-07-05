'use client';

import { Icon } from '@/components/ui/icon';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { formattingWorldPlazaEntityStatusEffectHudDisplayValue } from '@/components/world/health/domains/formattingWorldPlazaEntityStatusEffectHudDisplayValue';

const RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX = 18 as const;

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
      className={`plaza-status-effect-badge flex items-center gap-2 py-1.5 pl-1.5 pr-3 backdrop-blur-sm ${row.hudIconBorderClassName}`}
      title={row.summaryLabel}
    >
      <span className="plaza-status-effect-badge-socket flex h-7 w-7 shrink-0 items-center justify-center rounded-[3px] border">
        <Icon
          icon={row.icon}
          width={RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX}
          height={RENDERING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_ICON_SIZE_PX}
          className={`drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${row.hudIconColorClassName}`}
        />
      </span>
      <span
        className={`min-w-10 text-right font-display text-lg font-bold leading-none tabular-nums [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_0_8px_rgba(0,0,0,0.6)] ${
          row.id === 'poison' || row.id.startsWith('potential-')
            ? row.hudIconColorClassName
            : 'text-parchment'
        }`}
      >
        {displayValue}
      </span>
    </div>
  );
}
