/**
 * Selectable plaza avatar skins for the local player.
 *
 * The active skin is chosen from the Character button below Perf on the plaza
 * HUD. Each skin maps to a character definition that supplies its texture
 * loader, sheet layouts, and rendering tuning.
 *
 * @module components/world/domains/definingWorldPlazaAvatarSkinConstants
 */

import { listingWorldPlazaAnimalPlayableAvatarSkinOptions } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';

/** Named avatar skin ids kept for compatibility with hand-tuned engines. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN = {
  GIRL_SAMPLE: 'girl-sample',
  HUSKY: 'husky',
  GOLDEN_RETRIEVER: 'golden-retriever',
  GRIZZLY: 'grizzly',
  PINGUIN: 'pinguin',
  CAT_ORANGE: 'cat-orange',
} as const;

/** Any registered or selectable avatar skin id (species folder or special pack). */
export type DefiningWorldPlazaAvatarSkinId = string;

/** Skin selected on first plaza mount. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT: DefiningWorldPlazaAvatarSkinId =
  DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE;

/** Overlay option for one selectable avatar skin. */
export interface DefiningWorldPlazaAvatarSkinOption {
  readonly skinId: DefiningWorldPlazaAvatarSkinId;
  readonly label: string;
}

/** Special avatar packs with non-species asset layouts. */
const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SPECIAL_OPTIONS: readonly DefiningWorldPlazaAvatarSkinOption[] =
  [
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
      label: 'Girl',
    },
  ];

/** Avatar skins shown in the Character selector: specials first, then animals A–Z. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS: readonly DefiningWorldPlazaAvatarSkinOption[] =
  [
    ...DEFINING_WORLD_PLAZA_AVATAR_SKIN_SPECIAL_OPTIONS,
    ...listingWorldPlazaAnimalPlayableAvatarSkinOptions(),
  ];
