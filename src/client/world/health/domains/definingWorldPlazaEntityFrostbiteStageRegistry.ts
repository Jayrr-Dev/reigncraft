/**
 * Declarative frostbite stage thresholds and linked stage buffs.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry
 */

export type DefiningWorldPlazaEntityFrostbiteStageId =
  | 'chilled'
  | 'numb'
  | 'frostnip'
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
   * stage's buffs; overlapping movement / outgoing-damage keep the harshest.
   */
  buffIds: readonly string[];
  /** Extra %maxHP frost damage on cold ticks (Frostnip+). */
  appliesPercentMaxHealthFrostDamage: boolean;
  /** Multiply ambient + percent frost damage (Frostbite+). */
  amplifiesFrostDamage: boolean;
  /** Block all healing (Necrotic). */
  blocksHeal: boolean;
  /** Full immobilize via stun (Necrotic). */
  forcesImmobilize: boolean;
  /** Apply icy avatar tint (Necrotic). */
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
      id: 'chilled',
      label: 'Chilled',
      description: 'Slight movement slowdown from cold stacks.',
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
      hudIconColorClassName: 'text-sky-200',
      hudIconBorderClassName: 'border-sky-400/50 bg-sky-950/80',
    },
    {
      id: 'numb',
      label: 'Numb',
      description: 'Slower movement; reduced max stamina and regen.',
      hudEffectLines: [
        '20% less max stamina',
      ],
      minStacks: 100,
      buffIds: ['frostbite-numb-debuff'],
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
      id: 'frostnip',
      label: 'Frostnip',
      description:
        'Heavy slow; weaker strikes; extra percent frost damage on cold ticks.',
      hudEffectLines: [
        '15% less damage dealt',
        'Extra frost damage scales with severity',
      ],
      minStacks: 200,
      buffIds: ['frostbite-frostnip-damage-debuff'],
      appliesPercentMaxHealthFrostDamage: true,
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
      id: 'hypothermia',
      label: 'Hypothermia',
      description:
        'Severe slow; half stamina and jump; confusion; sleep spells.',
      hudEffectLines: [
        '50% less max stamina',
        '50% shorter jump',
        '25% less damage dealt',
        'Confusion',
        'Sleep spells as it worsens',
      ],
      minStacks: 500,
      buffIds: [
        'frostbite-hypothermia-debuff',
        'frostbite-hypothermia-damage-debuff',
      ],
      appliesPercentMaxHealthFrostDamage: true,
      amplifiesFrostDamage: false,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: false,
      appliesConfusion: true,
      appliesSleepSpells: true,
      hudIconColorClassName: 'text-indigo-200',
      hudIconBorderClassName: 'border-indigo-400/55 bg-indigo-950/80',
    },
    {
      id: 'frostbite',
      label: 'Frostbite',
      description: 'Near-immobile; cannot jump; triple frost damage taken.',
      hudEffectLines: [
        'Cannot jump',
        '50% less damage dealt',
        '3× frost damage taken',
      ],
      minStacks: 750,
      buffIds: [
        'frostbite-frostbite-debuff',
        'frostbite-frostbite-damage-debuff',
      ],
      appliesPercentMaxHealthFrostDamage: true,
      amplifiesFrostDamage: true,
      blocksHeal: false,
      forcesImmobilize: false,
      appliesAvatarTint: false,
      appliesConfusion: true,
      appliesSleepSpells: true,
      hudIconColorClassName: 'text-blue-200',
      hudIconBorderClassName: 'border-blue-400/60 bg-blue-950/85',
    },
    {
      id: 'necrotic',
      label: 'Necrotic Frostbite',
      description: 'Frozen solid; cannot move or heal; icy blue tint.',
      hudEffectLines: [
        'Cannot move',
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
      appliesSleepSpells: true,
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
