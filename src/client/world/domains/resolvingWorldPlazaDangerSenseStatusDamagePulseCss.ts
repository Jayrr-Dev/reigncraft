/**
 * Builds CSS backgrounds for full-rim status-damage pulses.
 *
 * @module components/world/domains/resolvingWorldPlazaDangerSenseStatusDamagePulseCss
 */

import type { DefiningWorldPlazaDangerSenseStatusDamagePulseDefinition } from '@/components/world/domains/definingWorldPlazaDangerSenseStatusDamagePulseRegistry';

function buildingWorldPlazaDangerSenseStatusDamagePulseRgba(
  rgb: { readonly r: number; readonly g: number; readonly b: number },
  alpha: number
): string {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(3)})`;
}

function lerpingWorldPlazaDangerSenseStatusDamagePulseStop(
  minPercent: number,
  maxPercent: number,
  strengthScale: number
): number {
  return minPercent + (maxPercent - minPercent) * strengthScale;
}

/**
 * Radial outer→inner gradient clipped by the square rim mask.
 * Outer color sits on the viewport edge; inner color feathers toward center.
 * `intensity` drives alpha; `strengthScale` (0..1) drives inward size vs max look.
 */
export function resolvingWorldPlazaDangerSenseStatusDamagePulseBackgroundImage(
  definition: DefiningWorldPlazaDangerSenseStatusDamagePulseDefinition,
  intensity: number,
  strengthScale = 1
): string {
  if (intensity <= 0.001) {
    return 'none';
  }

  const sizeScale = Math.min(1, Math.max(0, strengthScale));
  // Max look (scale 1): transparent 58% → soft 72% → mid 86% → outer 100%.
  // Weak ticks stay thinner on the rim.
  const transparentStop = lerpingWorldPlazaDangerSenseStatusDamagePulseStop(
    78,
    58,
    sizeScale
  );
  const softStop = lerpingWorldPlazaDangerSenseStatusDamagePulseStop(
    88,
    72,
    sizeScale
  );
  const midStop = lerpingWorldPlazaDangerSenseStatusDamagePulseStop(
    95,
    86,
    sizeScale
  );

  const outer = buildingWorldPlazaDangerSenseStatusDamagePulseRgba(
    definition.outerRgb,
    intensity
  );
  const mid = buildingWorldPlazaDangerSenseStatusDamagePulseRgba(
    definition.innerRgb,
    intensity * 0.55
  );
  const soft = buildingWorldPlazaDangerSenseStatusDamagePulseRgba(
    definition.innerRgb,
    intensity * 0.12
  );

  return [
    'radial-gradient(ellipse at 50% 50%,',
    `transparent 0%,`,
    `transparent ${transparentStop.toFixed(1)}%,`,
    `${soft} ${softStop.toFixed(1)}%,`,
    `${mid} ${midStop.toFixed(1)}%,`,
    `${outer} 100%)`,
  ].join(' ');
}
