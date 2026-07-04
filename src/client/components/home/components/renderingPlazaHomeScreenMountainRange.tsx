'use client';

import plazaHomeScreenMountainSceneSvg from '@/components/home/assets/plazaHomeScreenMountainScene.svg?raw';
import { usingPlazaHomeScreenMountainPerspectiveShift } from '@/components/home/hooks/usingPlazaHomeScreenMountainPerspectiveShift';
import { useState } from 'react';

/**
 * Layered mountain scene adapted from CodePen jimthornton/YXrNdr.
 */
export function RenderingPlazaHomeScreenMountainRange(): React.JSX.Element {
  const [sceneElement, setSceneElement] = useState<HTMLDivElement | null>(null);

  usingPlazaHomeScreenMountainPerspectiveShift({
    sceneElement,
  });

  return (
    <div
      ref={setSceneElement}
      aria-hidden
      className="plaza-mountain-scene pointer-events-none absolute inset-x-0 bottom-0 z-1"
      dangerouslySetInnerHTML={{ __html: plazaHomeScreenMountainSceneSvg }}
    />
  );
}
