import { buildingPlazaHomeScreenMusicStarAudioManifest } from '@/components/home/domains/buildingPlazaHomeScreenMusicStarAudioManifest';
import { resolvingPlazaHomeScreenMusicAssetUrl } from '@/components/home/domains/resolvingPlazaHomeScreenMusicAssetUrl';
import { schedulingPlazaHomeScreenIdlePreload } from '@/components/home/domains/schedulingPlazaHomeScreenIdlePreload';
import { preloadingWorldPlazaStarAudioManifest } from '@/components/world/domains/managingWorldPlazaStarAudio';

let preloadingPlazaHomeScreenMusicPromise: Promise<void> | null = null;

/**
 * Warms the HTTP cache before star-audio decodes the title track.
 */
function warmingPlazaHomeScreenMusicAssetFetch(): void {
  if (typeof window === 'undefined') {
    return;
  }

  void fetch(resolvingPlazaHomeScreenMusicAssetUrl(), {
    priority: 'low',
    // Match game.html preload crossorigin=anonymous and Howler decode.
    credentials: 'omit',
  }).catch(() => {
    // star-audio preload retries when hooks mount.
  });
}

/**
 * Preloads title screen music on the shared plaza star-audio instance.
 *
 * Idempotent: safe to call from the entry bundle and from the home music hook.
 */
export function preloadingPlazaHomeScreenMusic(): Promise<void> {
  if (!preloadingPlazaHomeScreenMusicPromise) {
    warmingPlazaHomeScreenMusicAssetFetch();

    preloadingPlazaHomeScreenMusicPromise =
      preloadingWorldPlazaStarAudioManifest(
        buildingPlazaHomeScreenMusicStarAudioManifest()
      ).catch(() => {
        preloadingPlazaHomeScreenMusicPromise = null;
      });
  }

  return preloadingPlazaHomeScreenMusicPromise;
}

// Defer the ~850 KB title track past first paint; the home music hook still
// awaits the same promise, so playback starts as soon as decode completes.
schedulingPlazaHomeScreenIdlePreload(() => {
  void preloadingPlazaHomeScreenMusic();
});
