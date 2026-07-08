/**
 * Pixi asset loader settings for the Devvit webview CSP.
 *
 * Pixi's default texture worker probes ImageBitmap support via
 * `fetch('data:image/png;base64,...')`, which Devvit blocks under connect-src.
 *
 * @module components/world/domains/configuringWorldPlazaPixiAssetsForDevvit
 */

import { Assets } from 'pixi.js';

let hasConfiguredWorldPlazaPixiAssetsForDevvit = false;

/** Disables Pixi texture workers so Devvit CSP does not log connect-src violations. */
export function configuringWorldPlazaPixiAssetsForDevvit(): void {
  if (hasConfiguredWorldPlazaPixiAssetsForDevvit) {
    return;
  }

  Assets.setPreferences({
    preferWorkers: false,
  });

  hasConfiguredWorldPlazaPixiAssetsForDevvit = true;
}
