import { DEFINING_PLAZA_HOME_SCREEN_MOUNTAIN_LAYER_SHIFTS } from '@/components/home/domains/definingPlazaHomeScreenMountainLayerShifts';
import { animate, type JSAnimation } from 'animejs';
import { useEffect, useRef } from 'react';

type UsingPlazaHomeScreenMountainPerspectiveShiftParams = {
  sceneElement: HTMLDivElement | null;
  enabled?: boolean;
};

/**
 * Recreates the CodePen YXrNdr perspective shift on load using anime.js.
 */
export function usingPlazaHomeScreenMountainPerspectiveShift({
  sceneElement,
  enabled = true,
}: UsingPlazaHomeScreenMountainPerspectiveShiftParams): void {
  const animationsRef = useRef<JSAnimation[]>([]);

  useEffect(() => {
    if (!enabled || !sceneElement) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    for (const animation of animationsRef.current) {
      animation.revert();
    }
    animationsRef.current = [];

    if (prefersReducedMotion) {
      return;
    }

    for (const layerShift of DEFINING_PLAZA_HOME_SCREEN_MOUNTAIN_LAYER_SHIFTS) {
      const layerElement = sceneElement.querySelector<SVGElement>(
        `#${layerShift.layerId}`
      );

      if (!layerElement) {
        continue;
      }

      const layerAnimation = animate(layerElement, {
        translateY: [0, layerShift.translateY],
        duration: 3000,
        ease: 'linear',
      });

      animationsRef.current.push(layerAnimation);
    }

    return () => {
      for (const animation of animationsRef.current) {
        animation.revert();
      }
      animationsRef.current = [];
    };
  }, [enabled, sceneElement]);
}
