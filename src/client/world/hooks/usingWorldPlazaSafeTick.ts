/**
 * Pixi tick hook that isolates per-subsystem failures.
 *
 * @module components/world/hooks/usingWorldPlazaSafeTick
 */

import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { useTick } from '@pixi/react';
import type { Ticker } from 'pixi.js';

/**
 * Registers a Pixi tick callback wrapped in loop-safe error capture.
 *
 * @param callback - Invoked each Pixi frame.
 * @param contextLabel - Stable subsystem label for debug logs, e.g. `tick:wildlife`.
 */
export function usingWorldPlazaSafeTick(
  callback: (ticker: Ticker) => void,
  contextLabel: string
): void {
  useTick((ticker) => {
    invokingWorldPlazaLoopBodySafely(contextLabel, () => {
      callback(ticker);
    });
  });
}
