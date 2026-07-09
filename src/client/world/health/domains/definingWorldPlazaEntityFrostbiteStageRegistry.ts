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
  /** Inclusive minimum stacks to enter this stage. */
  minStacks: number;
  /** Hide-from-HUD buffs applied while this stage is current (only this stage's set). */
  buffIds: readonly string[];
  /** Extra %maxHP frost damage on cold ticks (Frostnip+). */
  appliesPercentMaxHealthFrostDamage: boolean;
  /** Multiply ambient + percent frost damage (Frostbite+). */
  doublesFrostDamage: boolean;
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
      description: 'Slight movement slowdown.',
      minStacks: 50,
      buffIds: ['frostbite-chilled-debuff'],
      appliesPercentMaxHealthFrostDamage: false,
      doublesFrostDamage: false,
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
      minStacks: 100,
      buffIds: ['frostbite-numb-debuff'],
      appliesPercentMaxHealthFrostDamage: false,
      doublesFrostDamage: false,
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
      minStacks: 200,
      buffIds: [
        'frostbite-frostnip-debuff',
        'frostbite-frostnip-damage-debuff',
      ],
      appliesPercentMaxHealthFrostDamage: true,
      doublesFrostDamage: false,
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
      minStacks: 500,
      buffIds: [
        'frostbite-hypothermia-debuff',
        'frostbite-hypothermia-damage-debuff',
      ],
      appliesPercentMaxHealthFrostDamage: true,
      doublesFrostDamage: false,
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
      description: 'Near-immobile; cannot jump; double frost damage taken.',
      minStacks: 750,
      buffIds: [
        'frostbite-frostbite-debuff',
        'frostbite-frostbite-damage-debuff',
      ],
      appliesPercentMaxHealthFrostDamage: true,
      doublesFrostDamage: true,
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
      minStacks: 1000,
      buffIds: [
        'frostbite-necrotic-debuff',
        'frostbite-necrotic-immobilize-debuff',
      ],
      appliesPercentMaxHealthFrostDamage: true,
      doublesFrostDamage: true,
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
