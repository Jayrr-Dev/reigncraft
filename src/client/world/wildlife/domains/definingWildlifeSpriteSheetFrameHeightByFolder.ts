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
 * Measured frame height (px) keyed by `spriteFolder` under `public/Animals/`.
 * Re-measure after replacing a sheet: width/15 and height/8 must be integers.
 */
export const DEFINING_WILDLIFE_SPRITE_SHEET_FRAME_HEIGHT_BY_FOLDER: Readonly<
  Record<string, number>
> = {
  Alpacha: 64,
  antilope: 74,
  'Arabian horse': 96,
  Bison: 96,
  Boar: 84,
  'Brown Bear': 64,
  'Brown Horse': 96,
  Bull: 84,
  Camel: 64,
  'Cat Black': 64,
  'Cat Large': 64,
  'Cat Orange': 64,
  'Cat White': 64,
  Chicken: 64,
  Chimp: 84,
  Cow: 74,
  'Cow brown': 74,
  Crocodile: 64,
  Deer: 64,
  Donkey: 64,
  Elephant: 128,
  'Elephant female': 118,
  'ELITE Wolf': 96,
  Giraffe: 124,
  'Golden Retriever': 64,
  'Grey Wolf': 64,
  Grizzly: 96,
  Hayena: 64,
  Hippo: 96,
  Husky: 64,
  Jaguar: 96,
  Jak: 96,
  Lama: 64,
  Lion: 96,
  Lioness: 84,
  Mammoth: 128,
  Monkey: 64,
  Oryx: 74,
  Ostrich: 64,
  Pig: 64,
  Pinguin: 64,
  'Polar Bear': 96,
  Ram: 64,
  Rhino: 96,
  'Rhino Female': 86,
  Sheep: 64,
  'Shepherd Dog': 64,
  Stag: 96,
  Tiger: 96,
  Toirtois: 84,
  Turtle: 64,
  'Water buffalo': 84,
  'White Tiger': 96,
  'Work Horse': 96,
  Zebra: 84,
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
