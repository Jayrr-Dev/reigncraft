/**
 * Herbarium mushroom guide copy for codex cards, detail, and bag reveals.
 *
 * Field names stay color and shape based until proficiency (50 studies)
 * unlocks the true name. Copy sticks to habitat, formation, and morphology
 * so the player has to learn edibility from play.
 *
 * @module components/home/domains/definingPlazaHerbariumMushroomGuideConstants
 */

import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

/** One mushroom species entry in the codex herbarium guide. */
export type DefiningPlazaHerbariumMushroomEntry = {
  readonly speciesId: DefiningWorldPlazaMushroomSpeciesId;
  /** Color / shape nickname shown before the true name unlocks. */
  readonly fieldName: string;
  /** True species name, shown from proficiency (50 studies) onward. */
  readonly displayName: string;
  readonly icon: string;
  /** Shown from familiarity (sensory summary). */
  readonly summary: string;
  /** Shown from understanding (field notes). */
  readonly studiedSummary: string;
  /** Short eaten-effect note shown from application. */
  readonly propertiesSummary: string;
  /** Prep note (raw vs cooked) shown with properties when unlocked. */
  readonly preparationNotes: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  readonly apostleFlavor?: string;
};

/** Hint for undiscovered mushroom cards. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_MUSHROOM_HINT =
  'Pick a mushroom to log your first sighting.' as const;

/** Ordered mushroom guide entries (catalog sheet order). */
export const DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES: readonly DefiningPlazaHerbariumMushroomEntry[] =
  [
    {
      speciesId: 'golden-chanter',
      fieldName: 'Golden Cap',
      displayName: 'Golden Chanter',
      icon: 'mdi:mushroom',
      summary:
        'Apricot-gold vase cap. Ridges under the cap fork and run down the stem.',
      studiedSummary:
        'Fruits on odd days in forest and flower-forest shade. Cap stays golden to apricot, often in loose arcs. Underside shows blunt forked ridges rather than knife-edge gills. Firm flesh, warm apricot scent.',
      propertiesSummary:
        'Eaten: fills hunger. Cooked: steadier meal, chance of well-fed ease.',
      preparationNotes:
        'Flesh keeps its shape raw or cooked. Heat deepens the apricot scent.',
      apostleFlavor:
        'Rockless Fellus marks every golden stand on his forage map. Coin does not fruit from dirt, but routes do.',
    },
    {
      speciesId: 'false-lantern',
      fieldName: 'Orange Cap',
      displayName: 'False Lantern',
      icon: 'mdi:mushroom',
      summary:
        'Bright orange cap with true knife-edge gills packed tight under the rim.',
      studiedSummary:
        'Fruits on even nights at dusk in forest and flower forest, often in tight wood clusters. Cap glows orange in low light. Gills are sharp and crowded, running partway down a solid stem. Shares stands with golden vase caps.',
      propertiesSummary:
        'Eaten: slight hunger ease. Cooked: little more fill. Aftertaste turns sharp for some.',
      preparationNotes:
        'Thin flesh softens over heat. Color holds through the cook.',
    },
    {
      speciesId: 'honeycomb-morel',
      fieldName: 'Honey Cap',
      displayName: 'Honeycomb Morel',
      icon: 'mdi:mushroom',
      summary:
        'Honey-brown cone head pitted like a honeycomb, hollow when split.',
      studiedSummary:
        'Fruits on day digits 4 and 7 from dawn toward midday in forest and rock. Tall pitted head sits on a pale hollow stem. No flat gills; the surface is a lattice of ridges and pits. Earthy, faintly sweet scent.',
      propertiesSummary:
        'Eaten: fills hunger. Cooked: better meal, possible fleet ease.',
      preparationNotes:
        'Hollow head takes heat well. Many cook it before a full plate.',
      apostleFlavor:
        'Rockless Fellus swears the honeycomb days are worth the walk. He still cooks every cap.',
    },
    {
      speciesId: 'brain-cap',
      fieldName: 'Brain Brown',
      displayName: 'Brain Cap',
      icon: 'mdi:mushroom',
      summary:
        'Wrinkled brain-fold head in honey-brown, often near pitted cones.',
      studiedSummary:
        'Fruits on even daylight in forest and rock beside honeycomb stands. Cap folds like a brain rather than a clean pit lattice. Stem is thick and chambered when cut. Shares the same shade and soil as the pitted cones.',
      propertiesSummary:
        'Eaten: slight hunger ease. Cooked: little change. Flesh feels dense and odd.',
      preparationNotes:
        'Wrinkled head browns fast on heat. Chambered stem stays thick.',
    },
    {
      speciesId: 'king-bolete',
      fieldName: 'Brown Pore-cap',
      displayName: 'King Bolete',
      icon: 'mdi:mushroom',
      summary:
        'Thick brown cap on a solid stem. Underside is sponge pores, not gills.',
      studiedSummary:
        'Holds forest and plains by day. Broad brown cap, fat white-to-tan stem, and a soft pore sponge under the cap instead of gills. Rich forest smell. Heavy when packed.',
      propertiesSummary:
        'Eaten: fills hunger well. Cooked: heavy meal, chance of strength ease.',
      preparationNotes:
        'Thick flesh holds raw or cooked. Heat makes the meal worth the pack weight.',
      apostleFlavor:
        'Rockless Fellus calls the thick brown pore-cap honest forage. Thick stem, no tricks, if you know the twin.',
    },
    {
      speciesId: 'devils-bolete',
      fieldName: 'Red-pore Cap',
      displayName: "Devil's Bolete",
      icon: 'mdi:mushroom',
      summary: 'Brown cap with red pores that stain under a firm thumb press.',
      studiedSummary:
        'Fruits on odd midday heat across savanna, plains, and badlands. Broad brown cap over a red pore sponge. Flesh may blue or stain where pressed. Stem stout. Shares open ground with thick brown pore-caps.',
      propertiesSummary:
        'Eaten: slight hunger ease. Cooked: little more fill. Pore color stays vivid.',
      preparationNotes:
        'Red pores dull a little with heat. Flesh softens but keeps weight.',
    },
    {
      speciesId: 'cloud-puff',
      fieldName: 'White Puff',
      displayName: 'Cloud Puff',
      icon: 'mdi:mushroom',
      summary: 'Soft round white puff on open grass. No stem gills to check.',
      studiedSummary:
        'Common day forage on plains, savanna, and flower forest. Smooth white ball with no open gills; flesh is white and even when cut young. Mild scent. Grows alone or in loose scatter on short grass.',
      propertiesSummary: 'Eaten: fills hunger. Cooked: lighter comfort chance.',
      preparationNotes:
        'Soft flesh cooks fast. Young white cuts are the usual pick.',
    },
    {
      speciesId: 'angel-button',
      fieldName: 'Ivory Button',
      displayName: 'Angel Button',
      icon: 'mdi:mushroom',
      summary:
        'Smooth ivory button with pure white gills under a clean round cap.',
      studiedSummary:
        'Fruits at twilight on digit days 4 and 7 in forest, flower forest, and plains. Small pale button or young parasol shape, white gills free from the stem, often with a faint skirt ring. Shares open stands with soft white puffs.',
      propertiesSummary:
        'Eaten: barely fills. Cooked: same slight ease. Flesh stays pale.',
      preparationNotes:
        'Thin white flesh softens quickly. Color never darkens much.',
      apostleFlavor:
        'Rockless Fellus refuses ivory button stands on principle. Pretty caps still ask a hard question.',
    },
    {
      speciesId: 'cluster-honey',
      fieldName: 'Honey Tuft',
      displayName: 'Cluster Honey',
      icon: 'mdi:mushroom',
      summary: 'Honey-gold caps in dense tufts on damp wood and swamp edge.',
      studiedSummary:
        'Fruits on odd days in forest, swamp, and jungle. Caps cluster on stumps and wet wood, honey-gold to brown, with whitish gills running a short way down the stem. Damp wood scent. Often shares the same log with small brown bells after dark.',
      propertiesSummary:
        'Eaten: fills hunger. Cooked: better meal, possible fleet ease.',
      preparationNotes:
        'Cluster flesh softens on heat. Many prefer a cooked plate.',
    },
    {
      speciesId: 'funeral-bell',
      fieldName: 'Brown Bell',
      displayName: 'Funeral Bell',
      icon: 'mdi:mushroom',
      summary: 'Small brown bell on wet night wood near honey-gold tufts.',
      studiedSummary:
        'Fruits at night in forest, swamp, and jungle on the same damp wood as honey tufts. Cap is a small brown bell. Gills are crowded and pale brown. Thin stem. Easy to miss beside larger gold clusters.',
      propertiesSummary:
        'Eaten: slight hunger ease. Cooked: little change. Thin flesh.',
      preparationNotes:
        'Bell cap cooks down fast. Color stays brown through heat.',
    },
    {
      speciesId: 'white-parasol',
      fieldName: 'Tall White Cap',
      displayName: 'White Parasol',
      icon: 'mdi:mushroom',
      summary:
        'Tall white umbrella on open grass. Free white gills under a broad cap.',
      studiedSummary:
        'Holds plains and savanna on even days. Tall stem, broad white parasol cap, and free white gills that do not run down the stalk. Cap may flake or scale on top. Open grass, noon light.',
      propertiesSummary:
        'Eaten: fills hunger well. Cooked: heavier meal, chance of toughened ease.',
      preparationNotes:
        'Stalk is fibrous. Cap flesh cooks clean and keeps bulk.',
      apostleFlavor:
        'Rockless Fellus walks tall white rows at noon. He still checks the gills twice.',
    },
    {
      speciesId: 'green-vomiter',
      fieldName: 'Olive-gill Cap',
      displayName: 'Green Vomiter',
      icon: 'mdi:mushroom',
      summary:
        'Parasol-shaped cap with gills that lean olive or green under the rim.',
      studiedSummary:
        'Fruits on odd days across plains, savanna, desert, and beach. Tall parasol form like the tall white caps, but mature gills shift toward olive or dull green. Cap pale above. Open ground and heat.',
      propertiesSummary:
        'Eaten: slight hunger ease. Cooked: little more fill. Olive gills stay tinted.',
      preparationNotes:
        'Cap softens on heat. Gill tint is easiest to spot before the cook.',
    },
    {
      speciesId: 'field-agaric',
      fieldName: 'White Field Cap',
      displayName: 'Field Agaric',
      icon: 'mdi:mushroom',
      summary: 'Clean white gills at dawn on open grass. Cap pale and round.',
      studiedSummary:
        'Fruits at dawn on plains and savanna. Classic round white-to-tan cap with pink-to-brown gills that stay neat and free. Stem stout. Short grass after cool nights.',
      propertiesSummary:
        'Eaten: fills hunger. Cooked: better meal, chance of vigor ease.',
      preparationNotes:
        'Dawn picks hold shape. Cooking is the fuller breakfast.',
    },
    {
      speciesId: 'yellow-stain',
      fieldName: 'Yellow-bruise Cap',
      displayName: 'Yellow Stain',
      icon: 'mdi:mushroom',
      summary: 'White agaric look-alike that bruises yellow under the thumb.',
      studiedSummary:
        'Shares day stands with white field caps on plains and flower forest. Cap and stem look clean white until pressed; bruise marks turn chrome yellow. Gills start pale. Same short-grass hours as the dawn whites.',
      propertiesSummary:
        'Eaten: slight hunger ease. Cooked: modest fill. Bruise color shows early.',
      preparationNotes:
        'Thumb bruise is the field check. Heat does not hide the yellow mark.',
    },
    {
      speciesId: 'shelf-oyster',
      fieldName: 'Cream Shelf',
      displayName: 'Shelf Oyster',
      icon: 'mdi:mushroom',
      summary:
        'Pale cream shelf fans on damp wood. Gills run down the attach point.',
      studiedSummary:
        'Grows whenever wood stays wet in forest, swamp, and jungle. Shelf layers fan from logs and stumps, cream to pale gray, with soft gills that run down the wood join. Mild scent. Any hour.',
      propertiesSummary:
        'Eaten: fills hunger. Cooked: better meal, chance of endurance ease.',
      preparationNotes: 'Shelf flesh cooks even. Heat stretches the walk.',
      apostleFlavor:
        'Rockless Fellus says cream shelves never argue with a cookfire.',
    },
    {
      speciesId: 'ghost-wing',
      fieldName: 'Pale Frost Shelf',
      displayName: 'Ghost Wing',
      icon: 'mdi:mushroom',
      summary: 'Ghost-pale wing shelves on cold night wood and frost ground.',
      studiedSummary:
        'Fruits on even nights toward dawn across snow, frostsink, forest, and rock. Thin pale shelves like faded oyster fans, often on cold wood. Gills pale and soft. Shares damp-wood habit with cream shelves but prefers the chill hours.',
      propertiesSummary:
        'Eaten: slight hunger ease. Cooked: little change. Flesh stays thin.',
      preparationNotes:
        'Cold shelves cook down fast. Pale color holds through heat.',
    },
  ];
