/**
 * Smooths discrete loading pipeline percent jumps for display.
 *
 * @module components/world/loading/hooks/usingWorldPlazaWorldLoadingSmoothedPercent
 */

import { advancingWorldPlazaWorldLoadingSmoothedPercent } from '@/components/world/loading/domains/advancingWorldPlazaWorldLoadingSmoothedPercent';
import { useEffect, useRef, useState } from 'react';

/**
 * Returns a continuously easing percent that chases `targetPercent`.
 * Use for the map marker and progress bar so step completions do not snap.
 */
export function usingWorldPlazaWorldLoadingSmoothedPercent(
  targetPercent: number
): number {
  const clampedTarget = Math.min(100, Math.max(0, targetPercent));
  const [displayPercent, setDisplayPercent] = useState(clampedTarget);
  const displayPercentRef = useRef(clampedTarget);
  const targetPercentRef = useRef(clampedTarget);
  const frameIdRef = useRef(0);
  const lastMsRef = useRef(0);

  targetPercentRef.current = clampedTarget;

  useEffect(() => {
    const stopLoop = (): void => {
      if (frameIdRef.current !== 0) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = 0;
      }
    };

    const tick = (nowMs: number): void => {
      const nextPercent = advancingWorldPlazaWorldLoadingSmoothedPercent({
        currentPercent: displayPercentRef.current,
        targetPercent: targetPercentRef.current,
        deltaMs: nowMs - lastMsRef.current,
      });
      lastMsRef.current = nowMs;

      if (nextPercent !== displayPercentRef.current) {
        displayPercentRef.current = nextPercent;
        setDisplayPercent(nextPercent);
      }

      if (nextPercent < targetPercentRef.current) {
        frameIdRef.current = requestAnimationFrame(tick);
        return;
      }

      frameIdRef.current = 0;
    };

    const startLoop = (): void => {
      if (frameIdRef.current !== 0) {
        return;
      }

      lastMsRef.current = performance.now();
      frameIdRef.current = requestAnimationFrame(tick);
    };

    if (displayPercentRef.current < clampedTarget) {
      startLoop();
    }

    return stopLoop;
  }, [clampedTarget]);

  return displayPercent;
}
