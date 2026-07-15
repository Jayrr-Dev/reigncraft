export type DefiningWorldPlazaHealerConsumableEffectKind =
  | 'bleedDowngrade'
  | 'healAndMending'
  | 'sleepOrClearConfusion'
  | 'clearSicknessDebuffs'
  | 'coldTolerance'
  | 'heatTolerance'
  | 'coldResistance'
  | 'vigorBuff'
  | 'braced'
  | 'shortenDiseaseOrResist'
  | 'sleepRegen'
  | 'sleepAndPurgeMild'
  | 'bleedAndBraced'
  | 'shortenDiseaseTargeted'
  | 'shortenDisease'
  | 'infectionResist'
  | 'deepSleepRegenAndAccelerateDisease'
  | 'foxgloveGamble'
  | 'frostbiteClearAndBraced'
  | 'purgeByMaxSeverityModerate'
  | 'purgeSevereGamble'
  | 'clearPendingFated'
  | 'postponePendingFated'
  | 'enableFatedImmunity';

export type DefiningWorldPlazaHealerConsumableEffectEntry = {
  readonly itemTypeId: string;
  readonly effectKind: DefiningWorldPlazaHealerConsumableEffectKind;
};

export const DEFINING_WORLD_PLAZA_HEALER_CONSUMABLE_EFFECT_REGISTRY: readonly DefiningWorldPlazaHealerConsumableEffectEntry[] =
  [
    {
      itemTypeId: 'world-plaza-healer-yarrow-pressure-dressing',
      effectKind: 'bleedDowngrade',
    },
    {
      itemTypeId: 'world-plaza-healer-calendula-wound-salve',
      effectKind: 'healAndMending',
    },
    {
      itemTypeId: 'world-plaza-healer-chamomile-compress',
      effectKind: 'sleepOrClearConfusion',
    },
    {
      itemTypeId: 'world-plaza-healer-lavender-antiseptic-wash',
      effectKind: 'clearSicknessDebuffs',
    },
    {
      itemTypeId: 'world-plaza-healer-peppermint-digestive-drops',
      effectKind: 'coldTolerance',
    },
    {
      itemTypeId: 'world-plaza-healer-meadowsweet-fever-cloth',
      effectKind: 'heatTolerance',
    },
    {
      itemTypeId: 'world-plaza-healer-rose-liniment',
      effectKind: 'coldResistance',
    },
    {
      itemTypeId: 'world-plaza-healer-field-agaric-restorative-tablet',
      effectKind: 'vigorBuff',
    },
    {
      itemTypeId: 'world-plaza-healer-kennel-paw-salve',
      effectKind: 'healAndMending',
    },
    {
      itemTypeId: 'world-plaza-healer-litterbox-gut-drops',
      effectKind: 'clearSicknessDebuffs',
    },
    {
      itemTypeId: 'world-plaza-healer-arnica-bruise-liniment',
      effectKind: 'braced',
    },
    {
      itemTypeId: 'world-plaza-healer-echinacea-tincture',
      effectKind: 'shortenDiseaseOrResist',
    },
    {
      itemTypeId: 'world-plaza-healer-valerian-night-draught',
      effectKind: 'sleepRegen',
    },
    {
      itemTypeId: 'world-plaza-healer-rest-cure-pillow',
      effectKind: 'sleepAndPurgeMild',
    },
    {
      itemTypeId: 'world-plaza-healer-sheepskin-wound-pack',
      effectKind: 'bleedAndBraced',
    },
    {
      itemTypeId: 'world-plaza-healer-wolf-bite-antiserum',
      effectKind: 'shortenDiseaseTargeted',
    },
    {
      itemTypeId: 'world-plaza-healer-boar-lard-drawing-poultice',
      effectKind: 'shortenDisease',
    },
    {
      itemTypeId: 'world-plaza-healer-packhound-plague-collar',
      effectKind: 'infectionResist',
    },
    {
      itemTypeId: 'world-plaza-healer-cat-scratch-styptic',
      effectKind: 'bleedDowngrade',
    },
    {
      itemTypeId: 'world-plaza-healer-bone-set-splint-wrap',
      effectKind: 'braced',
    },
    {
      itemTypeId: 'world-plaza-healer-deep-rest-serum',
      effectKind: 'deepSleepRegenAndAccelerateDisease',
    },
    {
      itemTypeId: 'world-plaza-healer-foxglove-heart-ampoule',
      effectKind: 'foxgloveGamble',
    },
    {
      itemTypeId: 'world-plaza-healer-cyroborn-frostbite-pack',
      effectKind: 'frostbiteClearAndBraced',
    },
    {
      itemTypeId: 'world-plaza-healer-graded-plague-purge',
      effectKind: 'purgeByMaxSeverityModerate',
    },
    {
      itemTypeId: 'world-plaza-healer-belladonna-last-rites',
      effectKind: 'purgeSevereGamble',
    },
    {
      itemTypeId: 'world-plaza-healer-fate-unravel-salts',
      effectKind: 'clearPendingFated',
    },
    {
      itemTypeId: 'world-plaza-healer-doom-postpone-poultice',
      effectKind: 'postponePendingFated',
    },
    {
      itemTypeId: 'world-plaza-healer-fatebreak-ward',
      effectKind: 'enableFatedImmunity',
    },
  ];

const DEFINING_WORLD_PLAZA_HEALER_CONSUMABLE_EFFECT_BY_ITEM_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_HEALER_CONSUMABLE_EFFECT_REGISTRY.map((entry) => [
    entry.itemTypeId,
    entry.effectKind,
  ])
);

export function resolvingWorldPlazaHealerConsumableEffectKind(
  itemTypeId: string
): DefiningWorldPlazaHealerConsumableEffectKind | null {
  return (
    DEFINING_WORLD_PLAZA_HEALER_CONSUMABLE_EFFECT_BY_ITEM_TYPE_ID.get(
      itemTypeId
    ) ?? null
  );
}
