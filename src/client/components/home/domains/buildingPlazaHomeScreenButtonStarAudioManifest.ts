import {
  DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS,
  type DefiningPlazaHomeScreenButtonSfxClipId,
} from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import { resolvingPlazaHomeScreenButtonSfxStarAudioId } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxStarAudioId';
import { resolvingPlazaHomeScreenButtonSfxUrl } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxUrl';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Builds the star-audio preload manifest for home screen button click clips.
 */
export function buildingPlazaHomeScreenButtonStarAudioManifest(): Manifest {
  const manifest: Manifest = {};
  const uniqueClipIds = new Set<DefiningPlazaHomeScreenButtonSfxClipId>(
    DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS
  );

  for (const clipId of uniqueClipIds) {
    manifest[resolvingPlazaHomeScreenButtonSfxStarAudioId(clipId)] = {
      src: resolvingPlazaHomeScreenButtonSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
