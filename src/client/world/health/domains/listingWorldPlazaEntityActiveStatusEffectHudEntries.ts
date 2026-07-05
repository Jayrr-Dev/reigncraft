import type { DefiningWorldPlazaEntityActiveBleedHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBleedHudEntries';
import { listingWorldPlazaEntityActiveBleedHudEntries } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBleedHudEntries';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

export type DefiningWorldPlazaEntityActiveStatusEffectHudEntry = {
  id: string;
  label: string;
  description: string;
  icon: MappingWorldPlazaEntityHealthFloatTextIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  expiresAtMs: number;
  /** Optional secondary detail, e.g. remaining bleed pool. */
  detailLabel: string | null;
  stackCount: number;
  stackEscalationThreshold: number | null;
};

function mappingWorldPlazaEntityBleedHudEntryToStatusEffect(
  bleed: DefiningWorldPlazaEntityActiveBleedHudEntry
): DefiningWorldPlazaEntityActiveStatusEffectHudEntry {
  const stackProgressLabel =
    bleed.stackEscalationThreshold === null
      ? null
      : `${bleed.stackCount}/${bleed.stackEscalationThreshold} stacks`;

  return {
    id: bleed.id,
    label: bleed.label,
    description: bleed.description,
    icon: bleed.icon,
    hudIconColorClassName: bleed.hudIconColorClassName,
    hudIconBorderClassName: bleed.hudIconBorderClassName,
    expiresAtMs: bleed.expiresAtMs,
    detailLabel:
      stackProgressLabel === null
        ? `${Math.round(bleed.remainingBleedDamage)} dmg`
        : `${Math.round(bleed.remainingBleedDamage)} dmg · ${stackProgressLabel}`,
    stackCount: bleed.stackCount,
    stackEscalationThreshold: bleed.stackEscalationThreshold,
  };
}

/**
 * Lists active debuff status effects for the top-right HUD stack.
 */
export function listingWorldPlazaEntityActiveStatusEffectHudEntries({
  state,
  nowMs,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
}): DefiningWorldPlazaEntityActiveStatusEffectHudEntry[] {
  return listingWorldPlazaEntityActiveBleedHudEntries({ state, nowMs }).map(
    mappingWorldPlazaEntityBleedHudEntryToStatusEffect
  );
}

/**
 * Computes whole seconds remaining for one status effect HUD entry.
 */
export function computingWorldPlazaEntityStatusEffectHudRemainingSeconds(
  expiresAtMs: number,
  nowMs: number
): number {
  return Math.max(0, Math.ceil((expiresAtMs - nowMs) / 1000));
}

/**
 * Formats remaining seconds as `m:ss` for the status effect stack.
 */
export function formattingWorldPlazaEntityStatusEffectHudRemainingTime(
  remainingSeconds: number
): string {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
