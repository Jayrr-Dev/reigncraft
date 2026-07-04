import { animate, type JSAnimation } from 'animejs';
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
 * Drives left-drifting cloud motion with anime.js so timing survives Devvit
 * CSS bundling (the old CSS `animation` shorthand reset duration to 0s).
 */
export function usingPlazaHomeScreenDriftingClouds({
  skyElement,
  enabled = true,
}: UsingPlazaHomeScreenDriftingCloudsParams): void {
  const animationsRef = useRef<JSAnimation[]>([]);

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
        animation.revert();
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

        const cloudAnimation = animate(cloudElement, {
          translateX: [travelStartPx, travelEndPx],
          duration: durationMs,
          ease: 'linear',
          loop: true,
        });

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
        animation.revert();
      }
      animationsRef.current = [];
    };
  }, [enabled, skyElement]);
}
