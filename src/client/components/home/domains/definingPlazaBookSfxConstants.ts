/**
 * 400 Sounds Pack book UI clips for the tutorial and lore codex.
 *
 * Assets live under `public/sfx/400-sounds-items/`.
 *
 * @module components/home/domains/definingPlazaBookSfxConstants
 */

/** Public URL prefix for shipped 400 Sounds book clips. */
export const DEFINING_PLAZA_BOOK_SFX_ASSET_BASE_URL =
  '/sfx/400-sounds-items' as const;

/** Book UI interaction that plays a clip. */
export type DefiningPlazaBookSfxActionId = 'open' | 'close' | 'page_turn';

/** Stable ids for every bundled book clip. */
export type DefiningPlazaBookSfxClipId =
  | 'book_open'
  | 'book_close'
  | 'page_turn';

/** Maps each book interaction to its shipped clip id. */
export const DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION: Record<
  DefiningPlazaBookSfxActionId,
  DefiningPlazaBookSfxClipId
> = {
  open: 'book_open',
  close: 'book_close',
  page_turn: 'page_turn',
};

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_PLAZA_BOOK_SFX_TARGET_VOLUME_BY_ACTION: Record<
  DefiningPlazaBookSfxActionId,
  number
> = {
  open: 0.65,
  close: 0.55,
  page_turn: 0.5,
};
