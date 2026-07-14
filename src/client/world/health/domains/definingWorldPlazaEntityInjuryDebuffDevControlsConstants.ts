/** Dev panel quick-toggle entries for thematic injury debuffs. */
export const DEFINING_WORLD_PLAZA_INJURY_DEBUFF_DEV_CONTROLS = [
  {
    buffId: 'broken-leg-debuff',
    label: 'Broken Leg',
    description: 'Half move + jump distance; no sprint',
    buttonAccentClassName: 'border-orange-400/40 text-orange-200',
  },
  {
    buffId: 'broken-ankle-debuff',
    label: 'Broken Ankle',
    description: 'Slower walk; no jump or roll',
    buttonAccentClassName: 'border-amber-400/40 text-amber-200',
  },
  {
    buffId: 'broken-arm-debuff',
    label: 'Broken Arm',
    description: 'Attack speed ×0.55',
    buttonAccentClassName: 'border-red-400/40 text-red-200',
  },
  {
    buffId: 'broken-finger-debuff',
    label: 'Broken Finger',
    description: 'Attack speed ×0.8',
    buttonAccentClassName: 'border-rose-400/35 text-rose-200',
  },
  {
    buffId: 'injured-eye-debuff',
    label: 'Injured Eye',
    description: 'Luck −0.5 and variance ×1.4 on strikes',
    buttonAccentClassName: 'border-fuchsia-400/40 text-fuchsia-200',
  },
] as const;
