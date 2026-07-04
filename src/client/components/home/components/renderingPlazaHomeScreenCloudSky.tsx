'use client';

import { DEFINING_PLAZA_HOME_SCREEN_CLOUD_LAYER } from '@/components/home/domains/definingPlazaHomeScreenCloudLayerConfig';
import { usingPlazaHomeScreenDriftingClouds } from '@/components/home/hooks/usingPlazaHomeScreenDriftingClouds';
import { useState } from 'react';

/**
 * Poster-style sky layer with individually shaped clouds drifting left.
 */
export function RenderingPlazaHomeScreenCloudSky(): React.JSX.Element {
  const [skyElement, setSkyElement] = useState<HTMLDivElement | null>(null);

  usingPlazaHomeScreenDriftingClouds({
    skyElement,
  });

  return (
    <div ref={setSkyElement} aria-hidden className="plaza-cloud-sky">
      {DEFINING_PLAZA_HOME_SCREEN_CLOUD_LAYER.map((cloudDefinition) => (
        <div
          key={cloudDefinition.id}
          data-plaza-cloud
          data-cloud-duration={cloudDefinition.durationMs}
          data-cloud-progress={cloudDefinition.startProgress}
          className={`plaza-cloud plaza-cloud--${cloudDefinition.shape} ${cloudDefinition.opacityClass} ${cloudDefinition.scaleClass ?? ''}`}
          style={{ top: cloudDefinition.top }}
        />
      ))}
    </div>
  );
}
