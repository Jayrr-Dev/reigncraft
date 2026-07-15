import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

/** One flower entry in the codex herbarium guide. */
export type DefiningPlazaHerbariumFlowerEntry = {
  speciesId: WorldFlowerSpeciesId;
  displayName: string;
  icon: string;
  /** Shown after the player sights the species nearby. */
  summary: string;
  /** Field notes unlocked after picking the first specimen. */
  studiedSummary: string;
  /** Short eaten-effect note shown in the Properties tier. */
  propertiesSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** One tree entry in the codex herbarium guide. */
export type DefiningPlazaHerbariumTreeEntry = {
  variant: DefiningWorldPlazaTreeVariantKind;
  displayName: string;
  icon: string;
  /** Shown after the player sights the species nearby. */
  summary: string;
  /** Field notes unlocked after studying a felled stump. */
  studiedSummary: string;
  /** Short wood-note shown in the Properties tier. */
  propertiesSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** Subtitle shown under the Herbarium panel title. */
export const DEFINING_PLAZA_HERBARIUM_PANEL_SUBTITLE =
  'Pick flowers and mushrooms, search long grass for clovers, or study tree stumps.' as const;

/** Label shown for species the player has not sighted yet. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME = '???' as const;

/** Hint shown under undiscovered herbarium cards. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_HINT =
  'Pick a flower or approach a tree to log your first sighting.' as const;

/** Static codex menu description for the Herbarium section. */
export const LABELING_PLAZA_HERBARIUM_CODEX_MENU_DESCRIPTION =
  'Sighted flora and hidden ones' as const;

/** Ordered flower guide entries, roughly rarest last. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES: readonly DefiningPlazaHerbariumFlowerEntry[] =
  [
    {
      speciesId: 'yarrow',
      displayName: 'Yarrow',
      icon: 'mdi:flower',
      summary: 'Bitter white heads growing low in open ground.',
      studiedSummary:
        'Chewed white heads packed into a gash; bleeding eased within a minute. Bitter, everywhere open sky meets dirt.',
      propertiesSummary: 'Eaten: stanches bleeding, mends small wounds.',
    },
    {
      speciesId: 'calendula',
      displayName: 'Calendula',
      icon: 'mdi:flower',
      summary: 'Bright orange petals that catch the eye first.',
      studiedSummary:
        'Orange petals mashed to paste on abraded knuckle; raw flesh stopped complaining. My first field dressing after calendula never failed the shallow cuts.',
      propertiesSummary: 'Eaten: soothes flesh, speeds mending.',
    },
    {
      speciesId: 'chamomile',
      displayName: 'Chamomile',
      icon: 'mdi:flower',
      summary: 'Small daisy heads nodding in a breeze.',
      studiedSummary:
        'Dried daisy heads steeped in cup water clear a woolly skull for one honest hour of rest. Not sleep, just a cleared head.',
      propertiesSummary: 'Eaten: clears a foggy head, grants a short rest.',
    },
    {
      speciesId: 'lavender',
      displayName: 'Lavender',
      icon: 'mdi:flower',
      summary: 'Purple spikes with a scent that carries on the wind.',
      studiedSummary:
        'Purple spike chewed before questionable meat; nausea never rose. Scent marks the patch from fifty paces downwind.',
      propertiesSummary: 'Eaten: cuts nausea and food sickness.',
    },
    {
      speciesId: 'echinacea',
      displayName: 'Echinacea',
      icon: 'mdi:flower',
      summary: 'A spiny cone flower, tougher than it looks.',
      studiedSummary:
        'Spiny cone chewed at fever onset; heat broke a day early. Does not cure, only shortens the sickness window.',
      propertiesSummary: 'Eaten: shortens sickness, steels against infection.',
    },
    {
      speciesId: 'peppermint',
      displayName: 'Peppermint',
      icon: 'mdi:flower',
      summary: 'Cool-scented leaves that mark the air around them.',
      studiedSummary:
        'Cool leaf under tongue before snow pass; cold tolerance widened for the march. Scent is the first sign of a patch.',
      propertiesSummary: 'Eaten: briefly widens cold comfort band.',
    },
    {
      speciesId: 'rose',
      displayName: 'Rose',
      icon: 'mdi:flower',
      summary: 'Perfumed petals wanderers pick as much for the scent.',
      studiedSummary:
        'Perfumed petals chewed on ice trail; cold bit less for the hour. Pretty, yes, but the warmth in the chest is the useful part.',
      propertiesSummary: 'Eaten: brief cold resistance.',
    },
    {
      speciesId: 'meadowsweet',
      displayName: 'Meadowsweet',
      icon: 'mdi:flower',
      summary: 'Creamy flower clusters that thicken meadow air with scent.',
      studiedSummary:
        'Cream clusters eaten before savanna noon; heat tolerance widened noticeably. Thick meadow scent, harder to spot than calendula.',
      propertiesSummary: 'Eaten: briefly widens heat comfort band.',
    },
    {
      speciesId: 'arnica',
      displayName: 'Arnica',
      icon: 'mdi:flower',
      summary: 'Yellow star-shaped bloom on a short stem.',
      studiedSummary:
        'Yellow star chewed before ambush; body braced against the first blows. Timing matters; too early and the effect fades before the fight.',
      propertiesSummary: 'Eaten: braces the body against incoming harm.',
    },
    {
      speciesId: 'valerian',
      displayName: 'Valerian',
      icon: 'mdi:flower',
      summary: 'A plain bloom with a root scent that lingers.',
      studiedSummary:
        'Root scent like wet socks; one dose and sleep hits like a dropped stone. Recovery on waking is fierce, but only safe when nothing hunts you.',
      propertiesSummary: 'Eaten: deep sleep with fierce recovery.',
    },
    {
      speciesId: 'foxglove',
      displayName: 'Foxglove',
      icon: 'mdi:flower',
      summary: 'Tall bell-shaped blooms, striking and best left alone.',
      studiedSummary:
        'Tall bells; tonic effect uneven. Helped once, hurt the next chew. Veterans mark the patch and touch it on purpose, never by accident.',
      propertiesSummary: 'Eaten: dangerous tonic, uneven mercy.',
    },
    {
      speciesId: 'belladonna',
      displayName: 'Belladonna',
      icon: 'mdi:flower',
      summary: 'A dark, glossy berry flower. The prettiest warning on Corpus.',
      studiedSummary:
        'Nightshade with glossy berries. Beautiful, venomous. I learned this flower before I learned most edible ones and stopped at identification.',
      propertiesSummary: 'Eaten: venomous nightshade.',
      apostleFlavor:
        'Rockless Fellus catalogs every root and bloom on his ledger. Belladonna gets its own page, underlined twice.',
    },
  ] as const;

/** Ordered tree guide entries. */
export const DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES: readonly DefiningPlazaHerbariumTreeEntry[] =
  [
    {
      variant: 'oak',
      displayName: 'Oak',
      icon: 'mdi:tree-outline',
      summary: 'Broad-crowned hardwood common to plains and forest.',
      studiedSummary:
        'Felled oak trunk; axe bit slow, grain tight and stubborn. Holds nail and edge better than anything I have worked on the plains.',
      propertiesSummary: 'Wood: dense hardwood, slow to chop, holds well.',
      apostleFlavor:
        'Rockless Fellus counts oak stands like coin. Every claim wall on the plains started as one of these.',
    },
    {
      variant: 'blossom',
      displayName: 'Blossom tree',
      icon: 'mdi:flower',
      summary:
        'A pink-flecked crown that marks a flower forest from a distance.',
      studiedSummary:
        'Pink-flecked crown in flower forest only. Petals drift weeks; wood beneath is soft, quick to chop, unremarkable grain.',
      propertiesSummary: 'Wood: soft, quick to chop, unremarkable grain.',
    },
    {
      variant: 'willow',
      displayName: 'Willow',
      icon: 'mdi:tree-outline',
      summary: 'A drooping canopy that favors swamp water over dry ground.',
      studiedSummary:
        'Swamp margin stand; wood bent under weight before it split. Useless for walls, serviceable for tool handles.',
      propertiesSummary: 'Wood: flexible, bends before breaking.',
    },
    {
      variant: 'acacia',
      displayName: 'Acacia',
      icon: 'mdi:weather-sunny',
      summary: 'A flat-topped savanna tree, built for shade over shelter.',
      studiedSummary:
        'Flat-top savanna shade; herds gather before wanderers. Fibrous trunk, fair strength, burns eager.',
      propertiesSummary: 'Wood: fibrous, fair strength, fire-friendly.',
    },
    {
      variant: 'spruce',
      displayName: 'Spruce',
      icon: 'mdi:pine-tree',
      summary: 'A snow-dusted conifer that shrugs off cold winters.',
      studiedSummary:
        'Needles hold through snow season; canopy flat enough to stand on if you can climb. Light straight grain, splits clean.',
      propertiesSummary: 'Wood: light, straight grain, splits clean.',
    },
    {
      variant: 'birch',
      displayName: 'Birch',
      icon: 'mdi:tree-outline',
      summary: 'A slender, pale-barked tree found across several biomes.',
      studiedSummary:
        'Pale bark peels white, visible at distance. Grows from plains to snow, never dominant, always there.',
      propertiesSummary: 'Wood: light, pale, burns fast and hot.',
    },
    {
      variant: 'pine',
      displayName: 'Pine',
      icon: 'mdi:pine-tree',
      summary: 'A tall dark conifer, taller than most trees around it.',
      studiedSummary:
        'Tall dark stand on plain and forest edge; resin sticky on the hands. Burns eager once it catches.',
      propertiesSummary: 'Wood: resinous, catches fire eager and burns long.',
    },
    {
      variant: 'palm',
      displayName: 'Palm',
      icon: 'mdi:beach',
      summary: 'A tilted trunk crowned with fronds along the shoreline.',
      studiedSummary:
        'Beach lean toward water; trunk fibers strip to decent rope, poor lumber.',
      propertiesSummary: 'Wood: fibrous, weak as lumber, decent as rope.',
    },
    {
      variant: 'deadwood',
      displayName: 'Deadwood',
      icon: 'mdi:tree-outline',
      summary: 'A bare, branching husk with no leaves left to lose.',
      studiedSummary:
        'Bare husk before I arrived. Swamp, savanna, badlands all keep a share standing. Dry, brittle, quick flame.',
      propertiesSummary:
        'Wood: dry, brittle, quick to catch and quick to burn out.',
    },
    {
      variant: 'cactus',
      displayName: 'Saguaro cactus',
      icon: 'mdi:cactus',
      summary: 'A spined desert column crowned with yellow flowers.',
      studiedSummary:
        'Saguaro column stores water under spined skin. Yellow flowers read like a dare. Chop slow; spines do not care about thirst.',
      propertiesSummary: 'Wood: fibrous pulp core, mostly water, poor lumber.',
    },
  ] as const;
