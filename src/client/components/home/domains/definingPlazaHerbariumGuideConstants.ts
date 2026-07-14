import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

/** One flower entry in the codex herbarium guide. */
export type DefiningPlazaHerbariumFlowerEntry = {
  speciesId: WorldFlowerSpeciesId;
  displayName: string;
  icon: string;
  /** Shown after the player sights the species nearby. */
  summary: string;
  /** Shown after the player picks the first specimen. */
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
  /** Shown after the player completes a chop layer. */
  studiedSummary: string;
  /** Short wood-note shown in the Properties tier. */
  propertiesSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** Subtitle shown under the Herbarium panel title. */
export const DEFINING_PLAZA_HERBARIUM_PANEL_SUBTITLE =
  'Get close to log a sighting. Pick or chop to study a specimen.' as const;

/** Label shown for species the player has not sighted yet. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME = '???' as const;

/** Hint shown under undiscovered herbarium cards. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_HINT =
  'Approach a flower patch or a tree to log your first sighting.' as const;

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
        'Yarrow grows almost everywhere there is open sky. Chewed or packed into a wound, it stanches a bleed and knits small cuts closed.',
      propertiesSummary: 'Eaten: stanches bleeding, mends small wounds.',
    },
    {
      speciesId: 'calendula',
      displayName: 'Calendula',
      icon: 'mdi:flower',
      summary: 'Bright orange petals that catch the eye first.',
      studiedSummary:
        'Calendula is the wanderer flower of choice for scrapes that will not close. Soothes raw flesh and quickens mending.',
      propertiesSummary: 'Eaten: soothes flesh, speeds mending.',
    },
    {
      speciesId: 'chamomile',
      displayName: 'Chamomile',
      icon: 'mdi:flower',
      summary: 'Small daisy heads nodding in a breeze.',
      studiedSummary:
        'Chamomile clears a foggy head and buys a short, honest rest. Old hands keep a pouch of it for the nights the road will not let them sleep.',
      propertiesSummary: 'Eaten: clears a foggy head, grants a short rest.',
    },
    {
      speciesId: 'lavender',
      displayName: 'Lavender',
      icon: 'mdi:flower',
      summary: 'Purple spikes with a scent that carries on the wind.',
      studiedSummary:
        'Lavender cuts through nausea fast. Wanderers chew a sprig before eating anything they are not sure about.',
      propertiesSummary: 'Eaten: cuts nausea and food sickness.',
    },
    {
      speciesId: 'echinacea',
      displayName: 'Echinacea',
      icon: 'mdi:flower',
      summary: 'A spiny cone flower, tougher than it looks.',
      studiedSummary:
        'Echinacea shortens a fever and steels the body against whatever caused it. Not a cure, but it buys time.',
      propertiesSummary: 'Eaten: shortens sickness, steels against infection.',
    },
    {
      speciesId: 'peppermint',
      displayName: 'Peppermint',
      icon: 'mdi:flower',
      summary: 'Cool-scented leaves that mark the air around them.',
      studiedSummary:
        'Peppermint leaves widen the cold you can stand without complaint. Popular with anyone about to walk into snow.',
      propertiesSummary: 'Eaten: briefly widens cold comfort band.',
    },
    {
      speciesId: 'rose',
      displayName: 'Rose',
      icon: 'mdi:flower',
      summary: 'Perfumed petals wanderers pick as much for the scent.',
      studiedSummary:
        'Rose petals give a brief resistance to cold when chewed. The perfume is a bonus nobody asked for and everybody takes.',
      propertiesSummary: 'Eaten: brief cold resistance.',
    },
    {
      speciesId: 'meadowsweet',
      displayName: 'Meadowsweet',
      icon: 'mdi:flower',
      summary: 'Creamy flower clusters that thicken meadow air with scent.',
      studiedSummary:
        'Meadowsweet widens the heat a body can shrug off. Desert and savanna crews keep it close for the worst of the day.',
      propertiesSummary: 'Eaten: briefly widens heat comfort band.',
    },
    {
      speciesId: 'arnica',
      displayName: 'Arnica',
      icon: 'mdi:flower',
      summary: 'Yellow star-shaped bloom on a short stem.',
      studiedSummary:
        'Arnica braces the body before harm lands. Wanderers chew it right before a fight they cannot avoid.',
      propertiesSummary: 'Eaten: braces the body against incoming harm.',
    },
    {
      speciesId: 'valerian',
      displayName: 'Valerian',
      icon: 'mdi:flower',
      summary: 'A plain bloom with a root scent that lingers.',
      studiedSummary:
        'Valerian root drops the body into a deep sleep and pays it back with fierce recovery. Only safe to take when nothing is chasing you.',
      propertiesSummary: 'Eaten: deep sleep with fierce recovery.',
    },
    {
      speciesId: 'foxglove',
      displayName: 'Foxglove',
      icon: 'mdi:flower',
      summary: 'Tall bell-shaped blooms, striking and best left alone.',
      studiedSummary:
        'Foxglove is a tonic that helps as often as it hurts. Veterans respect it and eat it rarely, on purpose, and never twice in a row.',
      propertiesSummary: 'Eaten: dangerous tonic, uneven mercy.',
    },
    {
      speciesId: 'belladonna',
      displayName: 'Belladonna',
      icon: 'mdi:flower',
      summary: 'A dark, glossy berry flower. The prettiest warning on Corpus.',
      studiedSummary:
        'Belladonna is nightshade by another name: beautiful and venomous. Most wanderers learn to identify it before they learn to eat it, and stop there.',
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
        'Oak is the workhorse tree of Corpus. Slow to fell, but the wood holds an edge and a nail better than almost anything else standing.',
      propertiesSummary: 'Wood: dense hardwood, slow to chop, holds well.',
      apostleFlavor:
        'Rockless Fellus counts oak stands like coin. Every claim wall on the plains started as one of these.',
    },
    {
      variant: 'blossom',
      displayName: 'Blossom tree',
      icon: 'mdi:flower',
      summary: 'A pink-flecked crown that marks a flower forest from a distance.',
      studiedSummary:
        'Blossom trees only take root where the flower forests do. The petals drift for weeks and the wood underneath is ordinary, softer than oak.',
      propertiesSummary: 'Wood: soft, quick to chop, unremarkable grain.',
    },
    {
      variant: 'willow',
      displayName: 'Willow',
      icon: 'mdi:tree-outline',
      summary: 'A drooping canopy that favors swamp water over dry ground.',
      studiedSummary:
        'Willows grow where the ground never fully dries. The wood bends before it breaks, which makes it useless for walls and fine for handles.',
      propertiesSummary: 'Wood: flexible, bends before breaking.',
    },
    {
      variant: 'acacia',
      displayName: 'Acacia',
      icon: 'mdi:weather-sunny',
      summary: 'A flat-topped savanna tree, built for shade over shelter.',
      studiedSummary:
        'Acacia spreads flat instead of tall, chasing horizontal shade across the savanna. Herds gather under it before wanderers ever do.',
      propertiesSummary: 'Wood: fibrous, fair strength, fire-friendly.',
    },
    {
      variant: 'spruce',
      displayName: 'Spruce',
      icon: 'mdi:pine-tree',
      summary: 'A snow-dusted conifer that shrugs off cold winters.',
      studiedSummary:
        'Spruce holds its needles through the worst snowy plains have to offer. The flat canopy is wide enough to stand on if you can reach it.',
      propertiesSummary: 'Wood: light, straight grain, splits clean.',
    },
    {
      variant: 'birch',
      displayName: 'Birch',
      icon: 'mdi:tree-outline',
      summary: 'A slender, pale-barked tree found across several biomes.',
      studiedSummary:
        'Birch bark peels white and clean, easy to spot at a distance. It grows everywhere from plains to snow, never dominant, always present.',
      propertiesSummary: 'Wood: light, pale, burns fast and hot.',
    },
    {
      variant: 'pine',
      displayName: 'Pine',
      icon: 'mdi:pine-tree',
      summary: 'A tall dark conifer, taller than most trees around it.',
      studiedSummary:
        'Pine grows tall and dark, favoring plains, forest, and the edges of snow. Sap-heavy wood that burns eager once it catches.',
      propertiesSummary: 'Wood: resinous, catches fire eager and burns long.',
    },
    {
      variant: 'palm',
      displayName: 'Palm',
      icon: 'mdi:beach',
      summary: 'A tilted trunk crowned with fronds along the shoreline.',
      studiedSummary:
        'Palms lean toward the water on every beach they take root in. The trunk fibers make poor lumber but decent rope once stripped.',
      propertiesSummary: 'Wood: fibrous, weak as lumber, decent as rope.',
    },
    {
      variant: 'deadwood',
      displayName: 'Deadwood',
      icon: 'mdi:tree-outline',
      summary: 'A bare, branching husk with no leaves left to lose.',
      studiedSummary:
        'Deadwood already gave up its leaves before you found it. Swamp, savanna, and badlands all keep a share of these standing corpses.',
      propertiesSummary: 'Wood: dry, brittle, quick to catch and quick to burn out.',
    },
    {
      variant: 'cactus',
      displayName: 'Saguaro cactus',
      icon: 'mdi:cactus',
      summary: 'A spined desert column crowned with yellow flowers.',
      studiedSummary:
        'The saguaro stores its own water and wears the flowers like a dare. Chop carefully; the spines do not care that you are thirsty too.',
      propertiesSummary: 'Wood: fibrous pulp core, mostly water, poor lumber.',
    },
  ] as const;
