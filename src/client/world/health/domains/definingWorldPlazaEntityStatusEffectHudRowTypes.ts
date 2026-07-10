import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

export type DefiningWorldPlazaEntityStatusEffectHudDisplayMode =
  | 'damage'
  | 'damage_per_second'
  | 'time'
  | 'amount'
  | 'infinite'
  | 'timed_damage'
  /** Icon only; no numeric badge value (effects live in the popover). */
  | 'icon_only';

/** One compact row in the top-right status effect stack. */
export type DefiningWorldPlazaEntityStatusEffectHudRow = {
  id: string;
  displayMode: DefiningWorldPlazaEntityStatusEffectHudDisplayMode;
  /** Damage left, shield points, bonus HP, or seconds remaining. */
  numericValue: number;
  icon: MappingWorldPlazaEntityHealthFloatTextIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  summaryLabel: string;
  sortOrder: number;
  /** Set for timed rows so the HUD can count down live. */
  expiresAtMs: number | null;
  /**
   * Optional popover footer. When set, replaces the default
   * `Current: {displayValue}` line (use for progress like stacks / max).
   */
  popoverFooter?: string | null;
  /** Optional effect bullets shown in the explanation popover. */
  detailLines?: readonly string[];
};
