import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';

/**
 * Formats the primary value shown on a status effect HUD row.
 */
export function formattingWorldPlazaEntityStatusEffectHudDisplayValue({
  displayMode,
  numericValue,
}: Pick<
  DefiningWorldPlazaEntityStatusEffectHudRow,
  'displayMode' | 'numericValue'
>): string {
  if (displayMode === 'infinite') {
    return '∞';
  }

  if (displayMode === 'icon_only') {
    return '';
  }

  if (displayMode === 'time') {
    const remainingSeconds = Math.max(0, Math.ceil(numericValue));
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    if (minutes <= 0) {
      return `${seconds}s`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  if (displayMode === 'damage_per_second') {
    const damagePerSecond = Math.max(0, numericValue);

    if (damagePerSecond < 10) {
      return `${damagePerSecond.toFixed(1)}/s`;
    }

    return `${Math.round(damagePerSecond)}/s`;
  }

  return `${Math.max(0, Math.round(numericValue))}`;
}
