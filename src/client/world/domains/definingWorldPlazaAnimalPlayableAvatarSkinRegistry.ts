/**
 * Declarative registry for every species-folder playable avatar skin.
 *
 * @module components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry
 */

import type { DefiningWorldPlazaAvatarSkinOption } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import {
  DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION,
  DEFINING_WILDLIFE_SPECIES_SPRITE_PRESENTATION_OVERRIDES,
  type DefiningWildlifeSpeciesSpritePresentation,
} from '@/components/world/wildlife/domains/definingWildlifeSpritePresentationConstants';
import { DEFINING_WILDLIFE_SPRITE_SHEET_FRAME_HEIGHT_BY_FOLDER } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetFrameHeightByFolder';

/** Husky-tuned reference scale for 64px frames on 64px isometric tiles. */
const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_REFERENCE_FRAME_HEIGHT_PX = 64;
const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_REFERENCE_SPRITE_SCALE = 1.75;

/** Locomotion fps shared by animal playable skins. */
export const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_WALK_ANIMATION_FPS = 14;
export const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_RUN_ANIMATION_FPS = 18;
export const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_IDLE_ANIMATION_FPS = 8;
export const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_JUMP_ANIMATION_FPS = 18;
export const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_FALL_ANIMATION_FPS = 18;

export type DefiningWorldPlazaAnimalPlayableAvatarJumpSource = 'jump' | 'run';

export type DefiningWorldPlazaAnimalPlayableAvatarSkinRow = {
  readonly skinId: string;
  readonly displayName: string;
  readonly spriteFolder: string;
  readonly frameHeightPx: number;
  readonly spriteScale: number;
  readonly anchorXNormalized: number;
  readonly anchorYNormalized: number;
  readonly footOffsetBelowGridAnchorPx: number;
  readonly jumpSource: DefiningWorldPlazaAnimalPlayableAvatarJumpSource;
  readonly combatEnabled: boolean;
  readonly defaultDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly fallSpriteDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly hungerDrainMultiplier: number;
};

const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_DISPLAY_NAME_OVERRIDES: Record<
  string,
  string
> = {
  alpacha: 'Alpaca',
  antilope: 'Antelope',
  hayena: 'Hyena',
  jak: 'Yak',
  pinguin: 'Penguin',
  toirtois: 'Tortoise',
  'golden-retriever': 'Golden Retriever',
  'grey-wolf': 'Grey Wolf',
  'elite-wolf': 'Elite Wolf',
  'cat-orange': 'Orange Cat',
  'cat-black': 'Black Cat',
  'cat-white': 'White Cat',
  'cat-large': 'Large Cat',
  'polar-bear': 'Polar Bear',
  'brown-bear': 'Brown Bear',
  'brown-horse': 'Brown Horse',
  'arabian-horse': 'Arabian Horse',
  'work-horse': 'Work Horse',
  'cow-brown': 'Brown Cow',
  'elephant-female': 'Female Elephant',
  'rhino-female': 'Female Rhino',
  'shepherd-dog': 'Shepherd Dog',
  'water-buffalo': 'Water Buffalo',
  'white-tiger': 'White Tiger',
};

const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_JUMP_SHEET_FOLDERS = new Set([
  'cat-black',
  'cat-orange',
  'cat-white',
]);

const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_HAND_TUNED_HUNGER_DRAIN: Record<
  string,
  number
> = {
  husky: 1.15,
  'golden-retriever': 1.0,
  grizzly: 1.3,
  pinguin: 0.85,
  'cat-orange': 0.9,
};

function formattingWorldPlazaAnimalPlayableAvatarDisplayName(
  spriteFolder: string
): string {
  const override =
    DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_DISPLAY_NAME_OVERRIDES[spriteFolder];

  if (override) {
    return override;
  }

  return spriteFolder
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function resolvingWorldPlazaAnimalPlayableAvatarPresentation(
  spriteFolder: string,
  frameHeightPx: number
): DefiningWildlifeSpeciesSpritePresentation {
  const wildlifeSpeciesId =
    resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId(spriteFolder);
  const override =
    wildlifeSpeciesId &&
    DEFINING_WILDLIFE_SPECIES_SPRITE_PRESENTATION_OVERRIDES[wildlifeSpeciesId];

  return {
    anchorYNormalized:
      override?.anchorYNormalized ??
      DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION.anchorYNormalized,
    footYNormalized:
      override?.footYNormalized ??
      DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION.footYNormalized,
    frameHeightPx: override?.frameHeightPx ?? frameHeightPx,
  };
}

function computingWorldPlazaAnimalPlayableAvatarSpriteScale(
  frameHeightPx: number
): number {
  return (
    (DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_REFERENCE_FRAME_HEIGHT_PX /
      frameHeightPx) *
    DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_REFERENCE_SPRITE_SCALE
  );
}

function definingWorldPlazaAnimalPlayableAvatarSkinRow(
  spriteFolder: string,
  frameHeightPx: number
): DefiningWorldPlazaAnimalPlayableAvatarSkinRow {
  const presentation = resolvingWorldPlazaAnimalPlayableAvatarPresentation(
    spriteFolder,
    frameHeightPx
  );
  const spriteScale = computingWorldPlazaAnimalPlayableAvatarSpriteScale(
    presentation.frameHeightPx
  );

  return {
    skinId: spriteFolder,
    displayName:
      formattingWorldPlazaAnimalPlayableAvatarDisplayName(spriteFolder),
    spriteFolder,
    frameHeightPx: presentation.frameHeightPx,
    spriteScale,
    anchorXNormalized: 0.5,
    anchorYNormalized: presentation.anchorYNormalized,
    // Same formula as GirlSample / wildlife: distance from grid anchor to painted feet.
    footOffsetBelowGridAnchorPx:
      (presentation.footYNormalized - presentation.anchorYNormalized) *
      presentation.frameHeightPx *
      spriteScale,
    jumpSource: DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_JUMP_SHEET_FOLDERS.has(
      spriteFolder
    )
      ? 'jump'
      : 'run',
    combatEnabled: true,
    defaultDirection: 'Down',
    fallSpriteDirection: 'Down',
    hungerDrainMultiplier:
      DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_HAND_TUNED_HUNGER_DRAIN[
        spriteFolder
      ] ?? 1,
  };
}

/** Every species-folder playable skin row, keyed by skin id. */
export const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID: Readonly<
  Record<string, DefiningWorldPlazaAnimalPlayableAvatarSkinRow>
> = Object.freeze(
  Object.fromEntries(
    Object.entries(DEFINING_WILDLIFE_SPRITE_SHEET_FRAME_HEIGHT_BY_FOLDER).map(
      ([spriteFolder, frameHeightPx]) => [
        spriteFolder,
        definingWorldPlazaAnimalPlayableAvatarSkinRow(
          spriteFolder,
          frameHeightPx
        ),
      ]
    )
  )
);

/**
 * True when the skin id is a registered animal species-folder playable skin.
 */
export function checkingWorldPlazaAnimalPlayableAvatarSkinId(
  skinId: string
): boolean {
  return skinId in DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID;
}

/**
 * Resolves one animal playable skin row.
 */
export function resolvingWorldPlazaAnimalPlayableAvatarSkinRow(
  skinId: string
): DefiningWorldPlazaAnimalPlayableAvatarSkinRow | null {
  return DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID[skinId] ?? null;
}

/**
 * Lists animal playable skin options sorted alphabetically by display name.
 */
export function listingWorldPlazaAnimalPlayableAvatarSkinOptions(): readonly DefiningWorldPlazaAvatarSkinOption[] {
  return Object.values(DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID)
    .map((row) => ({
      skinId: row.skinId,
      label: row.displayName,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}
