import {
  checkingPlazaHomeScreenUiSfxPreloadReady,
  preloadingPlazaHomeScreenUiSfx,
} from '@/components/home/domains/preloadingPlazaHomeScreenUiSfx';

/** @deprecated Use {@link checkingPlazaHomeScreenUiSfxPreloadReady}. */
export function checkingPlazaHomeScreenButtonSfxPreloadReady(): boolean {
  return checkingPlazaHomeScreenUiSfxPreloadReady();
}

/** @deprecated Use {@link preloadingPlazaHomeScreenUiSfx}. */
export function preloadingPlazaHomeScreenButtonSfx(): Promise<void> {
  return preloadingPlazaHomeScreenUiSfx();
}
