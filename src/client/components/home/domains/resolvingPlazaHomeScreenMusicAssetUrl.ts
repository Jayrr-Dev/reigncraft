import { DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID } from '@/components/home/domains/definingPlazaHomeScreenMusicConstants';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';

/**
 * Public URL for the title screen music OGG (browser-safe encoding).
 */
export function resolvingPlazaHomeScreenMusicAssetUrl(): string {
  return resolvingWorldPlazaBiomeMusicUrl(
    DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID
  );
}
