import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

export type DefiningWorldPlazaEntityStatusEffectHudDisplayMode =
  | 'damage'
  | 'time'
  | 'amount'
  | 'infinite'
  | 'timed_damage';

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
};
