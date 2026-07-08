/** Dev panel quick-toggle entries for movement/incapacitation debuffs. */
export const DEFINING_WORLD_PLAZA_INCAPACITATION_DEBUFF_DEV_CONTROLS = [
  {
    buffId: 'confusion-debuff',
    label: 'Confused',
    description: 'Movement weaves unpredictably (15s)',
    buttonAccentClassName: 'border-cyan-400/35 text-cyan-200',
  },
  {
    buffId: 'sleep-debuff',
    label: 'Asleep',
    description: 'Cannot move or act; damage wakes with bonus (8s)',
    buttonAccentClassName: 'border-indigo-400/35 text-indigo-200',
  },
  {
    buffId: 'stun-debuff',
    label: 'Stunned',
    description: 'Wobbly idle with spinning gold dots (4s)',
    buttonAccentClassName: 'border-amber-400/40 text-amber-200',
  },
] as const;
