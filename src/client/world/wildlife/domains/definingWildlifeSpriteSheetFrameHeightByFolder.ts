/**
 * Real sheet frame heights for SmallScaleInt animal folders.
 *
 * Sheets are 15 columns × 8 direction rows. Frame height is sheetHeight / 8.
 * Ground shadows and speech lifts must use these values; a shared 84px median
 * leaves 64px animals floating above their shadow and 96–128px animals with
 * the ellipse under the torso.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpriteSheetFrameHeightByFolder
 */

/** Fallback when a folder is missing from the measured map. */
export const DEFINING_WILDLIFE_SPRITE_SHEET_DEFAULT_FRAME_HEIGHT_PX = 84;

/**
 * Measured frame height (px) keyed by `spriteFolder` under `public/creatures/sprites/species/`.
 * Re-measure after replacing a sheet: width/15 and height/8 must be integers.
 */
export const DEFINING_WILDLIFE_SPRITE_SHEET_FRAME_HEIGHT_BY_FOLDER: Readonly<
  Record<string, number>
> = {
  alpacha: 64,
  antilope: 74,
  'arabian-horse': 96,
  bison: 96,
  boar: 84,
  'brown-bear': 64,
  'brown-horse': 96,
  bull: 84,
  camel: 64,
  'cat-black': 64,
  'cat-large': 64,
  'cat-orange': 64,
  'cat-white': 64,
  chicken: 64,
  chimp: 84,
  cow: 74,
  'cow-brown': 74,
  crocodile: 64,
  deer: 64,
  donkey: 64,
  elephant: 128,
  'elephant-female': 118,
  'elite-wolf': 96,
  giraffe: 124,
  'golden-retriever': 64,
  'grey-wolf': 64,
  grizzly: 96,
  hayena: 64,
  hippo: 96,
  husky: 64,
  jaguar: 96,
  jak: 96,
  lama: 64,
  lion: 96,
  lioness: 84,
  mammoth: 128,
  monkey: 64,
  oryx: 74,
  ostrich: 64,
  pig: 64,
  pinguin: 64,
  'polar-bear': 96,
  ram: 64,
  rhino: 96,
  'rhino-female': 86,
  sheep: 64,
  'shepherd-dog': 64,
  stag: 96,
  tiger: 96,
  toirtois: 84,
  turtle: 64,
  'water-buffalo': 84,
  'white-tiger': 96,
  'work-horse': 96,
  zebra: 84,
};

/** Resolves sheet frame height for one Animals folder name. */
export function resolvingWildlifeSpriteSheetFrameHeightPx(
  spriteFolder: string
): number {
  return (
    DEFINING_WILDLIFE_SPRITE_SHEET_FRAME_HEIGHT_BY_FOLDER[spriteFolder] ??
    DEFINING_WILDLIFE_SPRITE_SHEET_DEFAULT_FRAME_HEIGHT_PX
  );
}
