import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

/** One ore entry in the codex lapidary guide. */
export type DefiningPlazaLapidaryOreEntry = {
  speciesId: WorldOreSpeciesId;
  displayName: string;
  icon: string;
  /** Shown after the player sights the vein nearby. */
  summary: string;
  /** Field notes unlocked after mining or studying the first specimen. */
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
 * Field notes are codex-only copy; Apostle notes stay sparse.
 */
export const DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES: readonly DefiningPlazaLapidaryOreEntry[] =
  [
    {
      speciesId: 'clay',
      displayName: 'Clay',
      icon: 'game-icons:stone-pile',
      summary: 'Soft terracotta earth showing through grey stone.',
      studiedSummary:
        'Soft terracotta vein, chips in broad flakes. Wet it and it takes a mold; dry it and it holds a brick. Packed three sacks from one shallow cut.',
      propertiesSummary: 'Work: bricks, kiln clay, soft seals.',
    },
    {
      speciesId: 'coal',
      displayName: 'Coal',
      icon: 'game-icons:stone-pile',
      summary: 'A black seam that dulls the rock around it.',
      studiedSummary:
        'Black seam dulls surrounding stone. Burns hotter than camp wood once it catches; forge crews fight over these veins.',
      propertiesSummary: 'Fuel: hot burn for forges and camps.',
    },
    {
      speciesId: 'iron',
      displayName: 'Iron',
      icon: 'game-icons:stone-pile',
      summary: 'Rusty grit packed into dark stone.',
      studiedSummary:
        'Rusty grit packed in dark stone. Took a full day of fire before the first bead of metal ran. Most nails I own started as a seam like this.',
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
        'Green stain, orange flecks. Hammers soft early; alloys and wire come later in the work.',
      propertiesSummary: 'Smelt: early alloys, wire, soft tools.',
    },
    {
      speciesId: 'lead',
      displayName: 'Lead',
      icon: 'game-icons:stone-pile',
      summary: 'Heavy rock shot with dull grey cubes.',
      studiedSummary:
        'Heavy grey cubes in dull rock (galena). Soft after smelt; weights and quiet seals prefer it.',
      propertiesSummary: 'Smelt: weights, seals, soft grey metal.',
    },
    {
      speciesId: 'niter',
      displayName: 'Niter',
      icon: 'game-icons:stone-pile',
      summary: 'Chalky white crust on grey rock.',
      studiedSummary:
        'Chalky white crust (saltpeter). Pinch for sparks and powder recipes that want jump.',
      propertiesSummary: 'Reagent: sparks, powder, reactive salts.',
    },
    {
      speciesId: 'silver',
      displayName: 'Silver',
      icon: 'game-icons:stone-pile',
      summary: 'Cool grey rock shot with pale metal.',
      studiedSummary:
        'Pale flecks in cool grey rock. Brightens under hammer; fine enough for delicate work.',
      propertiesSummary: 'Smelt: bright metal for fine work.',
    },
    {
      speciesId: 'scarlet',
      displayName: 'Scarlet',
      icon: 'game-icons:stone-pile',
      summary: 'Cinnabar-red mineral locked in dark stone.',
      studiedSummary:
        'Cinnabar-red stains fingers and dye pots. Pigment first; strange chemistry after, worth a cough and a mask.',
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
        'Warm yellow flecks in stubborn stone. Soft metal once smelt; wealth and fine inlay when you can haul it out.',
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
        'Yellow crystals in volcanic stone. Smells of the Firelands; forge heat and powder both lean on it.',
      propertiesSummary: 'Reagent: forge heat, powder, volcanic salts.',
      apostleFlavor:
        'Rockless Fellus holds his breath near sulfur vents. Pretty yellow, ugly air, and a claim worth marking twice.',
    },
  ] as const;
