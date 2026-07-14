import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

/** One ore entry in the codex lapidary guide. */
export type DefiningPlazaLapidaryOreEntry = {
  speciesId: WorldOreSpeciesId;
  displayName: string;
  icon: string;
  /** Shown after the player sights the vein nearby. */
  summary: string;
  /** Shown after the player mines or studies the first specimen. */
  studiedSummary: string;
  /** Short use-note shown in the Properties tier. */
  propertiesSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** Subtitle shown under the Lapidary panel title. */
export const DEFINING_PLAZA_LAPIDARY_PANEL_SUBTITLE =
  'Approach ore veins to log them. Mine a chunk, then study the ore.' as const;

/** Label shown for species the player has not sighted yet. */
export const LABELING_PLAZA_LAPIDARY_UNDISCOVERED_NAME = '???' as const;

/** Hint shown under undiscovered lapidary cards. */
export const LABELING_PLAZA_LAPIDARY_UNDISCOVERED_HINT =
  'Approach an ore vein or mine one to log your first sighting.' as const;

/** Static codex menu description for the Lapidary section. */
export const LABELING_PLAZA_LAPIDARY_CODEX_MENU_DESCRIPTION =
  'Sighted ores and hidden ones' as const;

/**
 * Ordered ore guide entries, roughly rarest last.
 * Copy matches inventory ore descriptions; Apostle notes stay sparse.
 */
export const DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES: readonly DefiningPlazaLapidaryOreEntry[] =
  [
    {
      speciesId: 'clay',
      displayName: 'Clay',
      icon: 'game-icons:stone-pile',
      summary: 'Soft terracotta earth showing through grey stone.',
      studiedSummary:
        'Clay veins chip easy and stack high. Bricks, kiln work, and cheap seals all start with a handful of this.',
      propertiesSummary: 'Work: bricks, kiln clay, soft seals.',
    },
    {
      speciesId: 'coal',
      displayName: 'Coal',
      icon: 'game-icons:stone-pile',
      summary: 'A black seam that dulls the rock around it.',
      studiedSummary:
        'Coal burns hot once it catches. Forges and long camp nights lean on these seams more than fancy wood.',
      propertiesSummary: 'Fuel: hot burn for forges and camps.',
    },
    {
      speciesId: 'iron',
      displayName: 'Iron',
      icon: 'game-icons:stone-pile',
      summary: 'Rusty grit packed into dark stone.',
      studiedSummary:
        'Iron ore smelts into the bones of tools and nails. Most claim walls on Corpus started as one of these veins.',
      propertiesSummary: 'Smelt: tools, nails, structural metal.',
      apostleFlavor:
        'Carnegus keeps iron on every ledger page. Soft wealth is nice; hard iron keeps a claim standing.',
    },
    {
      speciesId: 'copper',
      displayName: 'Copper',
      icon: 'game-icons:stone-pile',
      summary: 'Green-stained rock with orange metal flecks.',
      studiedSummary:
        'Copper takes a hammer early and alloys later. Wire, early tools, and green roofs all owe a debt to these veins.',
      propertiesSummary: 'Smelt: early alloys, wire, soft tools.',
    },
    {
      speciesId: 'lead',
      displayName: 'Lead',
      icon: 'game-icons:stone-pile',
      summary: 'Heavy rock shot with dull grey cubes.',
      studiedSummary:
        'Lead ore (galena) is soft once smelted. Weights, seals, and quiet plumbing jobs prefer it over brighter metals.',
      propertiesSummary: 'Smelt: weights, seals, soft grey metal.',
    },
    {
      speciesId: 'niter',
      displayName: 'Niter',
      icon: 'game-icons:stone-pile',
      summary: 'Chalky white crust on grey rock.',
      studiedSummary:
        'Niter is saltpeter by another name. Sparks, powder recipes, and anything that wants to jump need a pinch of it.',
      propertiesSummary: 'Reagent: sparks, powder, reactive salts.',
    },
    {
      speciesId: 'silver',
      displayName: 'Silver',
      icon: 'game-icons:stone-pile',
      summary: 'Cool grey rock shot with pale metal.',
      studiedSummary:
        'Silver ore brightens under hammer and fire. Soft enough for fine work, hard enough that wanderers still chase it.',
      propertiesSummary: 'Smelt: bright metal for fine work.',
    },
    {
      speciesId: 'scarlet',
      displayName: 'Scarlet',
      icon: 'game-icons:stone-pile',
      summary: 'Cinnabar-red mineral locked in dark stone.',
      studiedSummary:
        'Scarlet ore stains fingers and dye pots alike. Bright pigment first; the strange chemistry comes after you stop coughing.',
      propertiesSummary: 'Reagent: pigment and odd chemistry.',
      apostleFlavor:
        'Rockless Fellus marks scarlet veins in red ink. Pretty, scarce, and worth a second look before you walk past.',
    },
    {
      speciesId: 'gold',
      displayName: 'Gold',
      icon: 'game-icons:stone-pile',
      summary: 'Heavy stone with warm yellow flecks.',
      studiedSummary:
        'Gold ore is soft metal wrapped in stubborn rock. Wealth, seals of office, and fine inlay all start here when you can find it.',
      propertiesSummary: 'Smelt: soft wealth metal, fine work.',
      apostleFlavor:
        'Carnegus smiles when gold hits the ledger. Soft metal, hard to dig, harder still to keep.',
    },
    {
      speciesId: 'sulfur',
      displayName: 'Sulfur',
      icon: 'game-icons:stone-pile',
      summary: 'Bright yellow crystals in volcanic stone.',
      studiedSummary:
        'Sulfur ore stinks of the Firelands. Forge reagents, powder recipes, and anything that wants to burn hotter lean on these veins.',
      propertiesSummary: 'Reagent: forge heat, powder, volcanic salts.',
      apostleFlavor:
        'Rockless Fellus holds his breath near sulfur vents. Pretty yellow, ugly air, and a claim worth marking twice.',
    },
  ] as const;
