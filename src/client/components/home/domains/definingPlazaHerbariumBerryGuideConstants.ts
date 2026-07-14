import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

/** One berry or tea entry in the codex herbarium guide. */
export type DefiningPlazaHerbariumBerryEntry = {
  berryLootKind: WorldShrubBerryLootKind;
  displayName: string;
  icon: string;
  /** Shown after the player sights the loot kind nearby. */
  summary: string;
  /** Shown after the player picks the first specimen. */
  studiedSummary: string;
  /** Short eaten/gathered-effect note shown in the Properties tier. */
  propertiesSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** Hint for undiscovered berry/tea cards. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_BERRY_HINT =
  'Pick a berry shrub to log your first sighting.' as const;

/** Ordered berry and tea guide entries. */
export const DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES: readonly DefiningPlazaHerbariumBerryEntry[] =
  [
    {
      berryLootKind: 'red_berry',
      displayName: 'Coffee Cherry',
      icon: 'mdi:fruit-cherries',
      summary: 'A ripe red cherry hanging off a forest shrub.',
      studiedSummary:
        'Coffee cherries grow thick on forest shrubs across Corpus. Tart flesh around a pit that, roasted and brewed, keeps a wanderer moving well past when the legs want to stop.',
      propertiesSummary: 'Eaten: tart flesh, light buzz, soft crash.',
      apostleFlavor:
        'Rockless Fellus logs every cherry patch he passes. Coin does not grow on shrubs, but coffee routes do.',
    },
    {
      berryLootKind: 'blue_berry',
      displayName: 'Blue Berry',
      icon: 'mdi:fruit-cherries',
      summary: 'A cool blue berry tucked in with the reds.',
      studiedSummary:
        'Blue berries share the shrub with coffee cherries but keep to themselves, sweeter and slower to spoil. Wanderers stash a handful for the walk.',
      propertiesSummary: 'Eaten: sweet, filling, easy on the stomach.',
    },
    {
      berryLootKind: 'golden_berry',
      displayName: 'Golden Berry',
      icon: 'mdi:fruit-cherries',
      summary: 'A rare berry with a faint glow under the leaves.',
      studiedSummary:
        'Golden berries turn up rarely on the same shrubs as the reds and blues, glowing faint enough that most wanderers walk past without looking twice.',
      propertiesSummary: 'Eaten: soft glow, soft hunger, worth the search.',
    },
    {
      berryLootKind: 'tea_leaves',
      displayName: 'Tea Leaves',
      icon: 'mdi:leaf',
      summary: 'Dried leaves mixed in with the berries.',
      studiedSummary:
        'Tea leaves turn up dried and curled among the berries on the same shrubs, like something already picked and left to dry. Nobody on Corpus has worked out a proper brew yet, so wanderers chew them raw when the run starts to wear them down.',
      propertiesSummary: 'Eaten: dry leaves, sprint burns less.',
    },
  ] as const;
