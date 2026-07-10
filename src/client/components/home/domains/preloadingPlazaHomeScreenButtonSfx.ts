import { buildingPlazaHomeScreenButtonStarAudioManifest } from '@/components/home/domains/buildingPlazaHomeScreenButtonStarAudioManifest';
import { DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import { resolvingPlazaHomeScreenButtonSfxUrl } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxUrl';
import { preloadingWorldPlazaStarAudioManifest } from '@/components/world/domains/managingWorldPlazaStarAudio';

let preloadingPlazaHomeScreenButtonSfxPromise: Promise<void> | null = null;
let isPlazaHomeScreenButtonSfxPreloadReady = false;

/**
 * Warms the HTTP cache before star-audio decodes chest-close button clips.
 */
function warmingPlazaHomeScreenButtonSfxAssetFetches(): void {
  if (typeof window === 'undefined') {
    return;
  }

  for (const clipId of DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS) {
    void fetch(resolvingPlazaHomeScreenButtonSfxUrl(clipId), {
      priority: 'high',
      credentials: 'same-origin',
    }).catch(() => {
      // star-audio preload retries when hooks mount.
    });
  }
}

/**
 * Whether chest-close button clips finished preloading on the shared instance.
 */
export function checkingPlazaHomeScreenButtonSfxPreloadReady(): boolean {
  return isPlazaHomeScreenButtonSfxPreloadReady;
}

/**
 * Preloads home screen button click clips on the shared plaza star-audio instance.
 *
 * Idempotent: safe to call from the entry bundle and from the button SFX hook.
 */
export function preloadingPlazaHomeScreenButtonSfx(): Promise<void> {
  if (!preloadingPlazaHomeScreenButtonSfxPromise) {
    warmingPlazaHomeScreenButtonSfxAssetFetches();

    preloadingPlazaHomeScreenButtonSfxPromise =
      preloadingWorldPlazaStarAudioManifest(
        buildingPlazaHomeScreenButtonStarAudioManifest()
      )
        .then(() => {
          isPlazaHomeScreenButtonSfxPreloadReady = true;
        })
        .catch(() => {
          isPlazaHomeScreenButtonSfxPreloadReady = false;
          preloadingPlazaHomeScreenButtonSfxPromise = null;
        });
  }

  return preloadingPlazaHomeScreenButtonSfxPromise;
}

void preloadingPlazaHomeScreenButtonSfx();
