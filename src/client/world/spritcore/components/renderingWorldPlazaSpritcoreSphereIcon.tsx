'use client';

/**
 * Renders the Spritcore inventory orb as a shaded sphere glyph.
 *
 * @module components/world/spritcore/components/renderingWorldPlazaSpritcoreSphereIcon
 */

import {
  DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_BODY_STOPS,
  DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_HIGHLIGHT_CENTER,
  DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_RADIUS,
  DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_SPECULAR,
  DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_VIEW_BOX,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreSphereIconConstants';
import type * as React from 'react';
import { useId } from 'react';

export type RenderingWorldPlazaSpritcoreSphereIconProps = {
  readonly className?: string;
  readonly style?: React.CSSProperties;
};

/**
 * Glowing purple soul sphere for inventory slots and drag overlays.
 */
export function RenderingWorldPlazaSpritcoreSphereIcon({
  className,
  style,
}: RenderingWorldPlazaSpritcoreSphereIconProps): React.JSX.Element {
  const gradientId = useId();
  const sphereCenter = DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_VIEW_BOX / 2;

  return (
    <svg
      viewBox={`0 0 ${DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_VIEW_BOX} ${DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_VIEW_BOX}`}
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <radialGradient
          id={gradientId}
          cx={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_HIGHLIGHT_CENTER.cx}
          cy={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_HIGHLIGHT_CENTER.cy}
          r={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_HIGHLIGHT_CENTER.r}
        >
          {DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_BODY_STOPS.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </radialGradient>
      </defs>
      <circle
        cx={sphereCenter}
        cy={sphereCenter}
        r={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_RADIUS}
        fill={`url(#${gradientId})`}
      />
      <ellipse
        cx={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_SPECULAR.cx}
        cy={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_SPECULAR.cy}
        rx={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_SPECULAR.rx}
        ry={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_SPECULAR.ry}
        fill="#ffffff"
        opacity={DEFINING_WORLD_PLAZA_SPRITCORE_SPHERE_ICON_SPECULAR.opacity}
      />
    </svg>
  );
}
