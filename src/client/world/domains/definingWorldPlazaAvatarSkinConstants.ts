/**
 * Selectable plaza avatar skins for the local player.
 *
 * The active skin is chosen from the Character button below Perf on the plaza
 * HUD. Each skin maps to a character definition that supplies its texture
 * loader, sheet layouts, and rendering tuning.
 *
 * @module components/world/domains/definingWorldPlazaAvatarSkinConstants
 */

/** Avatar skin ids selectable for the local plaza player. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN = {
  GIRL_SAMPLE: "girl-sample",
  HUSKY: "husky",
  GOLDEN_RETRIEVER: "golden-retriever",
  GRIZZLY: "grizzly",
  PINGUIN: "pinguin",
  FOX_PEACH: "fox-peach",
  CAT_ORANGE: "cat-orange",
} as const;

/** One selectable avatar skin id. */
export type DefiningWorldPlazaAvatarSkinId =
  (typeof DEFINING_WORLD_PLAZA_AVATAR_SKIN)[keyof typeof DEFINING_WORLD_PLAZA_AVATAR_SKIN];

/** Skin selected on first plaza mount. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT: DefiningWorldPlazaAvatarSkinId =
  DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE;

/** Overlay option for one selectable avatar skin. */
export interface DefiningWorldPlazaAvatarSkinOption {
  readonly skinId: DefiningWorldPlazaAvatarSkinId;
  readonly label: string;
}

/** Avatar skins shown in the Perf overlay selector, in display order. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS: readonly DefiningWorldPlazaAvatarSkinOption[] =
  [
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
      label: "Girl",
    },
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY,
      label: "Husky",
    },
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GOLDEN_RETRIEVER,
      label: "Golden Retriever",
    },
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY,
      label: "Grizzly",
    },
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.PINGUIN,
      label: "Penguin",
    },
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.FOX_PEACH,
      label: "Fox Peach",
    },
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.CAT_ORANGE,
      label: "Orange Cat",
    },
  ];
