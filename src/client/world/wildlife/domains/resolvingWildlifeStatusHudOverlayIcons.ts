/**
 * Maps wildlife HUD badge snapshot rows into compact overlay icons.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStatusHudOverlayIcons
 */

import { formattingWorldPlazaEntityStatusEffectHudDisplayValue } from '@/components/world/health/domains/formattingWorldPlazaEntityStatusEffectHudDisplayValue';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { DEFINING_WILDLIFE_STATUS_HUD_MAX_ICONS } from '@/components/world/wildlife/domains/definingWildlifeStatusHudOverlayConstants';
import type { DefiningWildlifeStatusHudOverlayIcon } from '@/components/world/wildlife/domains/definingWildlifeStatusHudOverlayTypes';

function resolvingStatusEffectNumericLabel(
  row: DefiningWorldPlazaEntityStatusEffectHudRow
): string | null {
  if (row.displayMode === 'icon_only' || row.displayMode === 'infinite') {
    return null;
  }

  if (row.displayMode === 'time') {
    return null;
  }

  const label = formattingWorldPlazaEntityStatusEffectHudDisplayValue({
    displayMode: row.displayMode === 'timed_damage' ? 'damage' : row.displayMode,
    numericValue: row.numericValue,
  });

  return label.length > 0 ? label : null;
}

/**
 * Prefers debuffs/diseases, then compact status rows (bleed, fated, frostbite).
 */
export function resolvingWildlifeStatusHudOverlayIcons(params: {
  readonly activeBuffs: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[];
  readonly statusEffectHudRows: readonly DefiningWorldPlazaEntityStatusEffectHudRow[];
}): readonly DefiningWildlifeStatusHudOverlayIcon[] {
  const icons: DefiningWildlifeStatusHudOverlayIcon[] = [];

  for (const buff of params.activeBuffs) {
    if (buff.polarity !== 'debuff' && !buff.isDisease) {
      continue;
    }

    icons.push({
      id: `buff:${buff.id}`,
      icon: buff.icon,
      borderClassName:
        buff.hudIconBorderClassName ??
        (buff.isDisease
          ? 'border-lime-500/70 bg-lime-950/90'
          : 'border-red-400/70 bg-red-950/80'),
      label: buff.label,
      expiresAtMs: buff.expiresAtMs,
      numericLabel: null,
    });

    if (icons.length >= DEFINING_WILDLIFE_STATUS_HUD_MAX_ICONS) {
      return icons;
    }
  }

  for (const row of params.statusEffectHudRows) {
    icons.push({
      id: `status:${row.id}`,
      icon: row.icon,
      borderClassName: row.hudIconBorderClassName,
      label: row.summaryLabel,
      expiresAtMs: row.expiresAtMs,
      numericLabel: resolvingStatusEffectNumericLabel(row),
    });

    if (icons.length >= DEFINING_WILDLIFE_STATUS_HUD_MAX_ICONS) {
      return icons;
    }
  }

  return icons;
}
