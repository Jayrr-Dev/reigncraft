import { getWebViewMode } from '@devvit/web/client';

/**
 * True while the Devvit host presents this web view in expanded mode.
 */
export function checkingWorldPlazaDevvitExpandedViewport(): boolean {
  try {
    return getWebViewMode() === 'expanded';
  } catch {
    return false;
  }
}
