/**
 * Spirited Sprites beta animal catalog (horizontal color-keyed strips).
 *
 * Assets: `public/creatures/sprites/beta/spirited/av-*.webp`
 * Layout: one row, 65×66 cells, 19 frames (pack cell pitch after grid strip).
 *
 * @module components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog
 */

import { DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION } from '@/components/world/domains/definingPublicSpriteAssetExtension';

/** Public folder for Spirited beta animal strips. */
export const DEFINING_SPIRITED_SPRITES_BETA_ASSET_BASE_URL =
  '/creatures/sprites/beta/spirited' as const;

/** Cell width in the converted Spirited animal strips (px). */
export const DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX = 65;

/** Cell height in the converted Spirited animal strips (px). */
export const DEFINING_SPIRITED_SPRITES_BETA_FRAME_HEIGHT_PX = 66;

/** Usable frames per strip (floor of sheet width / cell pitch). */
export const DEFINING_SPIRITED_SPRITES_BETA_FRAME_COUNT = 19;

/** Directional idle/walk frames used for facing (no foot cycle). */
export const DEFINING_SPIRITED_SPRITES_BETA_PREVIEW_FRAME_COUNT = 8;

/** World display scale so tiny pack frames read in isometric space.
 * Keep this such that width/height round cleanly (avoids subpixel clip). */
export const DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE = 1;

/** Drawn sprite size in world px (integer to avoid nearest-neighbor edge clip). */
export const DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_WIDTH_PX = Math.round(
  DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX *
    DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE
);

export const DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_HEIGHT_PX = Math.round(
  DEFINING_SPIRITED_SPRITES_BETA_FRAME_HEIGHT_PX *
    DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE
);

/** Grid offset from the player when spawning a beta animal. */
export const DEFINING_SPIRITED_SPRITES_BETA_SPAWN_OFFSET_GRID = 2.5;

export type DefiningSpiritedSpritesBetaAnimalId = string;

export type DefiningSpiritedSpritesBetaAnimalDefinition = {
  readonly animalId: DefiningSpiritedSpritesBetaAnimalId;
  readonly displayName: string;
  /** File stem under the beta spirited folder (no extension). */
  readonly fileStem: string;
};

/**
 * All Spirited animal strips copied into the beta public folder.
 * Seasonal hare variants kept as separate spawn entries for A/B checks.
 */
export const DEFINING_SPIRITED_SPRITES_BETA_ANIMAL_CATALOG: readonly DefiningSpiritedSpritesBetaAnimalDefinition[] =
  [
    {
      animalId: 'spirited-afox',
      displayName: 'Arctic Fox',
      fileStem: 'av-afox',
    },
    {
      animalId: 'spirited-badger',
      displayName: 'Badger',
      fileStem: 'av-badger',
    },
    { animalId: 'spirited-bear', displayName: 'Bear', fileStem: 'av-bear' },
    {
      animalId: 'spirited-beaver',
      displayName: 'Beaver',
      fileStem: 'av-beaver',
    },
    {
      animalId: 'spirited-bgrouse',
      displayName: 'Black Grouse',
      fileStem: 'av-bgrouse',
    },
    { animalId: 'spirited-bull', displayName: 'Bull', fileStem: 'av-bull' },
    {
      animalId: 'spirited-bullelk',
      displayName: 'Bull Elk',
      fileStem: 'av-bullelk',
    },
    {
      animalId: 'spirited-capcail',
      displayName: 'Capercaillie',
      fileStem: 'av-capcail',
    },
    { animalId: 'spirited-cow', displayName: 'Cow', fileStem: 'av-cow' },
    {
      animalId: 'spirited-dog-buhund',
      displayName: 'Buhund',
      fileStem: 'av-dog-buhund',
    },
    {
      animalId: 'spirited-dog-elkhund',
      displayName: 'Elkhund',
      fileStem: 'av-dog-Elkhund',
    },
    { animalId: 'spirited-dog', displayName: 'Dog', fileStem: 'av-dog' },
    { animalId: 'spirited-elk', displayName: 'Elk', fileStem: 'av-elk' },
    {
      animalId: 'spirited-eowl',
      displayName: 'Eagle Owl',
      fileStem: 'av-eowl',
    },
    {
      animalId: 'spirited-forreind',
      displayName: 'Forest Reindeer',
      fileStem: 'av-forreind',
    },
    { animalId: 'spirited-fox', displayName: 'Fox', fileStem: 'av-fox' },
    {
      animalId: 'spirited-glutton',
      displayName: 'Wolverine',
      fileStem: 'av-glutton',
    },
    {
      animalId: 'spirited-goldeye',
      displayName: 'Goldeneye',
      fileStem: 'av-goldeye',
    },
    {
      animalId: 'spirited-goshawk',
      displayName: 'Goshawk',
      fileStem: 'av-goshawk',
    },
    {
      animalId: 'spirited-gseal',
      displayName: 'Grey Seal',
      fileStem: 'av-gseal',
    },
    { animalId: 'spirited-hare', displayName: 'Hare', fileStem: 'av-hare' },
    {
      animalId: 'spirited-hare-summer',
      displayName: 'Hare (Summer)',
      fileStem: 'av-hareSU',
    },
    {
      animalId: 'spirited-hare-winter',
      displayName: 'Hare (Winter)',
      fileStem: 'av-hareW',
    },
    {
      animalId: 'spirited-hgrouse',
      displayName: 'Hazel Grouse',
      fileStem: 'av-hgrouse',
    },
    { animalId: 'spirited-kuikka', displayName: 'Loon', fileStem: 'av-kuikka' },
    { animalId: 'spirited-lynx', displayName: 'Lynx', fileStem: 'av-lynx' },
    {
      animalId: 'spirited-mallard',
      displayName: 'Mallard',
      fileStem: 'av-mallard',
    },
    { animalId: 'spirited-pig', displayName: 'Pig', fileStem: 'av-pig' },
    { animalId: 'spirited-ram', displayName: 'Ram', fileStem: 'av-ram' },
    { animalId: 'spirited-raven', displayName: 'Raven', fileStem: 'av-raven' },
    {
      animalId: 'spirited-reindeer',
      displayName: 'Reindeer',
      fileStem: 'av-reindeer',
    },
    {
      animalId: 'spirited-rseal',
      displayName: 'Ringed Seal',
      fileStem: 'av-rseal',
    },
    { animalId: 'spirited-sheep', displayName: 'Sheep', fileStem: 'av-sheep' },
    { animalId: 'spirited-snake', displayName: 'Snake', fileStem: 'av-snake' },
    {
      animalId: 'spirited-squirrel',
      displayName: 'Squirrel',
      fileStem: 'av-squirrel',
    },
    {
      animalId: 'spirited-srodent',
      displayName: 'Small Rodent',
      fileStem: 'av-srodent',
    },
    { animalId: 'spirited-swan', displayName: 'Swan', fileStem: 'av-swan' },
    {
      animalId: 'spirited-tduck',
      displayName: 'Teal Duck',
      fileStem: 'av-tduck',
    },
    {
      animalId: 'spirited-wgrouse',
      displayName: 'Willow Grouse',
      fileStem: 'av-wgrouse',
    },
    { animalId: 'spirited-wolf', displayName: 'Wolf', fileStem: 'av-wolf' },
  ] as const;

const DEFINING_SPIRITED_SPRITES_BETA_ANIMAL_BY_ID: ReadonlyMap<
  DefiningSpiritedSpritesBetaAnimalId,
  DefiningSpiritedSpritesBetaAnimalDefinition
> = new Map(
  DEFINING_SPIRITED_SPRITES_BETA_ANIMAL_CATALOG.map((entry) => [
    entry.animalId,
    entry,
  ])
);

/**
 * Resolves one Spirited beta animal definition by id.
 */
export function resolvingSpiritedSpritesBetaAnimalDefinition(
  animalId: DefiningSpiritedSpritesBetaAnimalId
): DefiningSpiritedSpritesBetaAnimalDefinition | null {
  return DEFINING_SPIRITED_SPRITES_BETA_ANIMAL_BY_ID.get(animalId) ?? null;
}

/**
 * Builds the public URL for one Spirited beta animal strip.
 */
export function buildingSpiritedSpritesBetaAnimalSheetUrl(
  fileStem: string
): string {
  const encodedStem = encodeURIComponent(fileStem);
  return `${DEFINING_SPIRITED_SPRITES_BETA_ASSET_BASE_URL}/${encodedStem}${DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION}`;
}
