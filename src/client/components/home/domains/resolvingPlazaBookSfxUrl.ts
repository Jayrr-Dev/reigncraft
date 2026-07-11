import {
  DEFINING_PLAZA_BOOK_SFX_ASSET_BASE_URL,
  type DefiningPlazaBookSfxClipId,
} from '@/components/home/domains/definingPlazaBookSfxConstants';

const DEFINING_PLAZA_BOOK_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningPlazaBookSfxClipId,
  string
> = {
  book_open: 'book-open.ogg',
  book_close: 'book-close.ogg',
  page_turn: 'page-turn.ogg',
};

/**
 * Builds a browser-safe public URL for one book UI clip.
 */
export function resolvingPlazaBookSfxUrl(
  clipId: DefiningPlazaBookSfxClipId
): string {
  const encodedBaseUrl = DEFINING_PLAZA_BOOK_SFX_ASSET_BASE_URL.split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_PLAZA_BOOK_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
