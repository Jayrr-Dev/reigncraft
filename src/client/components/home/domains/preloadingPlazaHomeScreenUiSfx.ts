import { buildingPlazaHomeScreenUiStarAudioManifest } from '@/components/home/domains/buildingPlazaHomeScreenUiStarAudioManifest';
import { DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION } from '@/components/home/domains/definingPlazaBookSfxConstants';
import { DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import { resolvingPlazaBookSfxUrl } from '@/components/home/domains/resolvingPlazaBookSfxUrl';
import { resolvingPlazaHomeScreenButtonSfxUrl } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxUrl';
import { schedulingPlazaHomeScreenIdlePreload } from '@/components/home/domains/schedulingPlazaHomeScreenIdlePreload';
import { preloadingWorldPlazaStarAudioManifest } from '@/components/world/domains/managingWorldPlazaStarAudio';

let preloadingPlazaHomeScreenUiSfxPromise: Promise<void> | null = null;
let isPlazaHomeScreenUiSfxPreloadReady = false;

/**
 * Warms the HTTP cache before star-audio decodes home menu UI clips.
 */
function warmingPlazaHomeScreenUiSfxAssetFetches(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const bookClipIds = Object.values(DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION);
  const assetUrls = [
    ...bookClipIds.map((clipId) => resolvingPlazaBookSfxUrl(clipId)),
    ...DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS.map((clipId) =>
      resolvingPlazaHomeScreenButtonSfxUrl(clipId)
    ),
  ];

  for (const assetUrl of assetUrls) {
    void fetch(assetUrl, {
      priority: 'high',
      credentials: 'same-origin',
    }).catch(() => {
      // star-audio preload retries when hooks mount.
    });
  }
}

/**
 * Whether home menu UI clips finished preloading on the shared instance.
 */
export function checkingPlazaHomeScreenUiSfxPreloadReady(): boolean {
  return isPlazaHomeScreenUiSfxPreloadReady;
}

/**
 * Preloads book and chest-close button clips on the shared plaza star-audio instance.
 *
 * Idempotent: safe to call from the entry bundle and from home UI audio hooks.
 */
export function preloadingPlazaHomeScreenUiSfx(): Promise<void> {
  if (!preloadingPlazaHomeScreenUiSfxPromise) {
    warmingPlazaHomeScreenUiSfxAssetFetches();

    preloadingPlazaHomeScreenUiSfxPromise =
      preloadingWorldPlazaStarAudioManifest(
        buildingPlazaHomeScreenUiStarAudioManifest()
      )
        .then(() => {
          isPlazaHomeScreenUiSfxPreloadReady = true;
        })
        .catch(() => {
          isPlazaHomeScreenUiSfxPreloadReady = false;
          preloadingPlazaHomeScreenUiSfxPromise = null;
        });
  }

  return preloadingPlazaHomeScreenUiSfxPromise;
}

// Defer UI clip fetches past first paint; button/book hooks re-invoke the
// same idempotent preload if the user interacts before idle fires.
schedulingPlazaHomeScreenIdlePreload(() => {
  void preloadingPlazaHomeScreenUiSfx();
});
