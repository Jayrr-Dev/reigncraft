import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Wrapper class for mechanics-panel float previews.
 * Combat float classes animate to opacity 0; this keeps samples visible on parchment.
 */
export const DEFINING_PLAZA_MECHANICS_PANEL_FLOAT_SAMPLE_SHELL_CLASS_NAME =
  'plaza-mechanics-panel-float-sample' as const;

/** Readable tier colors for EV roll examples on the parchment mechanics panel. */
export const DEFINING_PLAZA_MECHANICS_PANEL_EV_TIER_SAMPLE_CLASS_NAMES: Record<
  DefiningWorldPlazaDamageOutcomeTier,
  string
> = {
  dodged: 'text-slate-600',
  blocked: 'text-slate-600',
  softened: 'text-slate-500',
  normal: 'text-red-600',
  true_strike: 'text-yellow-700',
  critical: 'text-amber-600',
  lethal: 'text-orange-600',
  fatal: 'font-display text-red-900',
};

export type DefiningPlazaMechanicsPanelFloatSampleStyle = {
  label: string;
  className: string;
  icon: string | null;
};

/** Readable float samples for damage-type cards on the parchment panel. */
export const DEFINING_PLAZA_MECHANICS_PANEL_DAMAGE_FLOAT_SAMPLES: Record<
  string,
  DefiningPlazaMechanicsPanelFloatSampleStyle
> = {
  physical: {
    label: '-12',
    className: 'text-red-600',
    icon: 'boxicons:sword-filled',
  },
  fall: {
    label: '-8',
    className: 'text-red-600',
    icon: 'mdi:arrow-down-bold',
  },
  'environmental-heat': {
    label: '3/s',
    className: 'text-amber-600',
    icon: 'solar:fire-bold',
  },
  'environmental-cold': {
    label: '2/s',
    className: 'text-sky-700',
    icon: 'mdi:snowflake',
  },
  'environmental-lava': {
    label: '-15',
    className: 'text-orange-600',
    icon: 'solar:fire-bold',
  },
  'poison-toxic': {
    label: '-6',
    className: 'text-green-600',
    icon: 'mdi:biohazard',
  },
  'poison-venomous': {
    label: '-11',
    className: 'text-green-700',
    icon: 'game-icons:scythe',
  },
  'poison-lethal': {
    label: '-24',
    className: 'text-green-900',
    icon: 'game-icons:death-skull',
  },
  'bleed-bleeding': {
    label: '-4',
    className: 'text-red-500',
    icon: 'game-icons:drop',
  },
  'bleed-hemorrhaging': {
    label: '-9',
    className: 'text-red-700',
    icon: 'mdi:blood-bag',
  },
  'bleed-exsanguinating': {
    label: '-18',
    className: 'text-red-900',
    icon: 'game-icons:broken-heart',
  },
  starvation: {
    label: '-2',
    className: 'text-amber-700',
    icon: 'mdi:food-drumstick-off',
  },
  'potential-damage': {
    label: '25',
    className: 'text-amber-700',
    icon: 'mdi:flash',
  },
};
