import { useEffect, useRef } from 'react';

type UsingPlazaHomeScreenDriftingCloudsParams = {
  skyElement: HTMLDivElement | null;
  enabled?: boolean;
};

const resolvingPlazaHomeScreenCloudTravelBounds = (
  cloudElement: HTMLElement,
  viewportWidth: number
): { travelStartPx: number; travelEndPx: number } => {
  const cloudWidth = cloudElement.offsetWidth;

  return {
    travelStartPx: viewportWidth + cloudWidth * 1.15,
    travelEndPx: -cloudWidth * 1.35,
  };
};

/**
 * Drives left-drifting cloud motion with the Web Animations API.
 *
 * Avoids pulling animejs into the home/splash path and survives Devvit CSS
 * bundling (CSS `animation` shorthand previously reset duration to 0s).
 */
export function usingPlazaHomeScreenDriftingClouds({
  skyElement,
  enabled = true,
}: UsingPlazaHomeScreenDriftingCloudsParams): void {
  const animationsRef = useRef<Animation[]>([]);

  useEffect(() => {
    if (!enabled || !skyElement) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const startingCloudAnimations = (): void => {
      for (const animation of animationsRef.current) {
        animation.cancel();
      }
      animationsRef.current = [];

      const cloudElements =
        skyElement.querySelectorAll<HTMLElement>('[data-plaza-cloud]');
      const viewportWidth = skyElement.clientWidth || window.innerWidth;

      for (const cloudElement of cloudElements) {
        const durationMs = Number(cloudElement.dataset.cloudDuration);
        const startProgress = Number(cloudElement.dataset.cloudProgress);

        if (!Number.isFinite(durationMs) || durationMs <= 0) {
          continue;
        }

        const { travelStartPx, travelEndPx } =
          resolvingPlazaHomeScreenCloudTravelBounds(
            cloudElement,
            viewportWidth
          );
        const normalizedProgress =
          Number.isFinite(startProgress) && startProgress >= 0
            ? Math.min(1, startProgress)
            : 0;
        const elapsedMs = normalizedProgress * durationMs;

        const cloudAnimation = cloudElement.animate(
          [
            { transform: `translateX(${travelStartPx}px)` },
            { transform: `translateX(${travelEndPx}px)` },
          ],
          {
            duration: durationMs,
            easing: 'linear',
            iterations: Infinity,
          }
        );

        if (elapsedMs > 0) {
          cloudAnimation.currentTime = elapsedMs;
        }

        animationsRef.current.push(cloudAnimation);
      }
    };

    startingCloudAnimations();

    const resizeObserver = new ResizeObserver(() => {
      startingCloudAnimations();
    });
    resizeObserver.observe(skyElement);

    return () => {
      resizeObserver.disconnect();
      for (const animation of animationsRef.current) {
        animation.cancel();
      }
      animationsRef.current = [];
    };
  }, [enabled, skyElement]);
}
