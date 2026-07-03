/**
 * Plaza viewport fullscreen control constants.
 *
 * @module components/world/domains/definingWorldPlazaViewportFullscreenConstants
 */

/** Accessible label when the plaza can expand to fullscreen. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ENTER_LABEL =
  "Enter fullscreen" as const;

/** Accessible label when the plaza is in fullscreen. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_EXIT_LABEL =
  "Exit fullscreen" as const;

/** Prevents accidental text selection while clicking and dragging in the plaza. */
export const DEFINING_WORLD_PLAZA_GAME_AREA_SELECT_NONE_CLASS_NAME =
  "select-none [&_input]:select-text [&_textarea]:select-text" as const;

/** Fullscreen plaza host fills the native fullscreen element. */
export const DEFINING_WORLD_PLAZA_HOST_FULLSCREEN_CLASS_NAME =
  `relative h-full w-full touch-none overflow-hidden bg-muted outline-none ${DEFINING_WORLD_PLAZA_GAME_AREA_SELECT_NONE_CLASS_NAME}`;

/** Devvit expanded view: fill parent without Next.js 16:9 chrome math. */
export const DEFINING_WORLD_PLAZA_HOST_FILL_CLASS_NAME =
  DEFINING_WORLD_PLAZA_HOST_FULLSCREEN_CLASS_NAME;

/** Inner viewport frame sized for Pixi and pointer projection. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_FRAME_CLASS_NAME =
  `relative h-full w-full touch-none ${DEFINING_WORLD_PLAZA_GAME_AREA_SELECT_NONE_CLASS_NAME}`;

/** Title shown on the portrait rotate prompt. */
export const DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_TITLE =
  "Rotate to landscape" as const;

/** Body copy on the portrait rotate prompt. */
export const DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_MESSAGE =
  "Rotate your phone to landscape for fullscreen play." as const;

/** Portrait rotate prompt overlay classes. */
export const DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_CLASS_NAME =
  "pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/90 px-6 text-center" as const;
