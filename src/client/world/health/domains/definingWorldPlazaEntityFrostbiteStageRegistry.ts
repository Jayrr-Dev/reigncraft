/**
 * Declarative frostbite stage thresholds and linked stage buffs.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry
 */

export type DefiningWorldPlazaEntityFrostbiteStageId =
  | 'chilly'
  | 'cold'
  | 'shivering'
  | 'freezing'
  | 'hypothermia'
  | 'frostbite'
  | 'necrotic';

export type DefiningWorldPlazaEntityFrostbiteStageDescriptor = {
  id: DefiningWorldPlazaEntityFrostbiteStageId;
  label: string;
  description: string;
  /** Player-facing effect bullets for the status HUD popover. */
  hudEffectLines: readonly string[];
  /** Inclusive minimum stacks to enter this stage. */
  minStacks: number;
  /**
   * Hide-from-HUD buffs this stage contributes. Sync applies every reached
   * stage's buffs; overlapping movement keep the harshest.
   */
  buffIds: readonly string[];
  /** Extra %maxHP frost damage on cold ticks (Freezing+). */
  appliesPercentMaxHealthFrostDamage: boolean;
  /** Multiply ambient + percent frost damage (Frostbite+). */
  amplifiesFrostDamage: boolean;
  /** Block all healing (Necrotic). */
  blocksHeal: boolean;
  /** Full immobilize via deep sleep (Necrotic). */
  forcesImmobilize: boolean;
  /** Apply icy avatar tint (Freezing+; intensity scales with stacks). */
  appliesAvatarTint: boolean;
  /** Keep confusion active (Hypothermia+). */
  appliesConfusion: boolean;
  /** Fire sleep spells on stack thresholds (Hypothermia+). */
  appliesSleepSpells: boolean;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
};

/** Ordered ascending by minStacks. Highest matching stage wins. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY: readonly DefiningWorldPlazaEntityFrostbiteStageDescriptor[] =
  [
    {
      id: 'chilly',
      label: 'Chilly',
      description: 'First bite of cold as stacks begin.',
      hudEffectLines: [],
      minStacks: 0,
      buffIds: [],
      appliesPercentMaxHealthFrostDamage: false,
      amplifiesFrostDamage: false,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: false,
      appliesConfusion: false,
      appliesSleepSpells: false,
      hudIconColorClassName: 'text-sky-200',
      hudIconBorderClassName: 'border-sky-400/50 bg-sky-950/80',
    },
    {
      id: 'cold',
      label: 'Cold',
      description: 'Mild cold stacks; movement still mostly fine.',
      hudEffectLines: [],
      minStacks: 50,
      buffIds: [],
      appliesPercentMaxHealthFrostDamage: false,
      amplifiesFrostDamage: false,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: false,
      appliesConfusion: false,
      appliesSleepSpells: false,
      hudIconColorClassName: 'text-cyan-200',
      hudIconBorderClassName: 'border-cyan-400/55 bg-cyan-950/80',
    },
    {
      id: 'shivering',
      label: 'Shivering',
      description: 'Linear walk and stamina regen slow from cold stacks.',
      hudEffectLines: [],
      minStacks: 100,
      buffIds: [],
      appliesPercentMaxHealthFrostDamage: false,
      amplifiesFrostDamage: false,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: false,
      appliesConfusion: false,
      appliesSleepSpells: false,
      hudIconColorClassName: 'text-teal-200',
      hudIconBorderClassName: 'border-teal-400/55 bg-teal-950/80',
    },
    {
      id: 'freezing',
      label: 'Freezing',
      description:
        'Heavy slow; extra percent frost damage on cold ticks; icy tint.',
      hudEffectLines: [
        'Extra frost damage scales with severity',
        'Icy tint (grows with severity)',
      ],
      minStacks: 200,
      buffIds: [],
      appliesPercentMaxHealthFrostDamage: true,
      amplifiesFrostDamage: false,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: true,
      appliesConfusion: false,
      appliesSleepSpells: false,
      hudIconColorClassName: 'text-indigo-200',
      hudIconBorderClassName: 'border-indigo-400/55 bg-indigo-950/80',
    },
    {
      id: 'hypothermia',
      label: 'Hypothermia',
      description: 'Severe slow; half jump; confusion.',
      hudEffectLines: [
        '50% shorter jump',
        'Confusion',
      ],
      minStacks: 500,
      buffIds: ['frostbite-hypothermia-debuff'],
      appliesPercentMaxHealthFrostDamage: true,
      amplifiesFrostDamage: false,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: true,
      appliesConfusion: true,
      appliesSleepSpells: false,
      hudIconColorClassName: 'text-blue-200',
      hudIconBorderClassName: 'border-blue-400/60 bg-blue-950/85',
    },
    {
      id: 'frostbite',
      label: 'Frostbite',
      description: 'Near-immobile; cannot jump; triple frost damage taken.',
      hudEffectLines: [
        'Cannot jump',
        '3× frost damage taken',
      ],
      minStacks: 750,
      buffIds: ['frostbite-frostbite-debuff'],
      appliesPercentMaxHealthFrostDamage: true,
      amplifiesFrostDamage: true,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: true,
      appliesConfusion: true,
      appliesSleepSpells: false,
      hudIconColorClassName: 'text-sky-200',
      hudIconBorderClassName: 'border-sky-400/65 bg-sky-950/85',
    },
    {
      id: 'necrotic',
      label: 'Necrotic Frostbite',
      description: 'Frozen solid in deep sleep; cannot move or heal; icy blue tint.',
      hudEffectLines: [
        'Deep sleep (cannot wake from damage)',
        'Cannot heal',
        '3× frost damage taken',
        'Frozen solid',
      ],
      minStacks: 1000,
      buffIds: [
        'frostbite-necrotic-debuff',
        'frostbite-necrotic-immobilize-debuff',
      ],
      appliesPercentMaxHealthFrostDamage: true,
      amplifiesFrostDamage: true,
      blocksHeal: true,
      forcesImmobilize: true,
      appliesAvatarTint: true,
      appliesConfusion: true,
      appliesSleepSpells: false,
      hudIconColorClassName: 'text-sky-100',
      hudIconBorderClassName: 'border-sky-300/70 bg-slate-950/90',
    },
  ];

/** Looks up a stage descriptor by id. */
export function resolvingWorldPlazaEntityFrostbiteStageDescriptor(
  stageId: DefiningWorldPlazaEntityFrostbiteStageId
): DefiningWorldPlazaEntityFrostbiteStageDescriptor {
  const descriptor = DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY.find(
    (entry) => entry.id === stageId
  );

  if (!descriptor) {
    throw new Error(`Unknown frostbite stage: ${stageId}`);
  }

  return descriptor;
}

/** Lists all frostbite stages (ascending thresholds). */
export function listingWorldPlazaEntityFrostbiteStageDescriptors(): readonly DefiningWorldPlazaEntityFrostbiteStageDescriptor[] {
  return DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY;
}
