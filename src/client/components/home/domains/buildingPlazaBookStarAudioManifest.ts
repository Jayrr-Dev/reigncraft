import {
  DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION,
  type DefiningPlazaBookSfxClipId,
} from '@/components/home/domains/definingPlazaBookSfxConstants';
import { resolvingPlazaBookSfxStarAudioId } from '@/components/home/domains/resolvingPlazaBookSfxStarAudioId';
import { resolvingPlazaBookSfxUrl } from '@/components/home/domains/resolvingPlazaBookSfxUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for tutorial and lore book clips.
 */
export function buildingPlazaBookStarAudioManifest(): Manifest {
  const manifest: Manifest = {};
  const uniqueClipIds = new Set<DefiningPlazaBookSfxClipId>(
    Object.values(DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION)
  );

  for (const clipId of uniqueClipIds) {
    manifest[resolvingPlazaBookSfxStarAudioId(clipId)] = {
      src: resolvingPlazaBookSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
