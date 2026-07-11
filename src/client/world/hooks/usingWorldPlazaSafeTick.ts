/**
 * Pixi tick hook that isolates per-subsystem failures.
 *
 * @module components/world/hooks/usingWorldPlazaSafeTick
 */

import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { useTick } from '@pixi/react';
import type { Ticker } from 'pixi.js';
import { useCallback, useRef } from 'react';

/**
 * Registers a Pixi tick callback wrapped in loop-safe error capture.
 *
 * @param callback - Invoked each Pixi frame.
 * @param contextLabel - Stable subsystem label for debug logs, e.g. `tick:wildlife`.
 * @param isEnabled - False avoids registering the callback with Pixi.
 */
export function usingWorldPlazaSafeTick(
  callback: (ticker: Ticker) => void,
  contextLabel: string,
  isEnabled = true
): void {
  const callbackRef = useRef(callback);
  const contextLabelRef = useRef(contextLabel);
  callbackRef.current = callback;
  contextLabelRef.current = contextLabel;

  const invokingStableTickCallback = useCallback((ticker: Ticker): void => {
    invokingWorldPlazaLoopBodySafely(contextLabelRef.current, () => {
      callbackRef.current(ticker);
    });
  }, []);

  useTick({
    callback: invokingStableTickCallback,
    isEnabled,
  });
}
