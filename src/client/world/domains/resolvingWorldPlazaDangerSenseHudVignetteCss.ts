/**
 * Builds CSS for a continuous conic danger vignette clipped to a square frame.
 *
 * @module components/world/domains/resolvingWorldPlazaDangerSenseHudVignetteCss
 */

import {
  buildingWorldPlazaDangerSenseHudRgba,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_FADE,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_PEAK_EDGE_ALPHA,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_COUNT,
  type DefiningWorldPlazaDangerSenseHudTint,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';
import type { CSSProperties } from 'react';

export type ResolvingWorldPlazaDangerSenseHudEdgeFadeMaskStyles = {
  readonly maskImage: string;
  readonly maskSize: string;
  readonly maskPosition: string;
  readonly maskRepeat: string;
  readonly maskComposite: NonNullable<CSSProperties['maskComposite']>;
  readonly WebkitMaskComposite: string;
};

/**
 * One axis of a hollow rectangle: opaque near both outer sides, clear through
 * the middle. Thin rims use a long ease so the inner edge feathers softly.
 */
function resolvingWorldPlazaDangerSenseHudSquareFrameAxisGradient(
  axis: 'to right' | 'to bottom'
): string {
  const fade = DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_FADE;
  const thickness = fade.thicknessPercent;
  const solidPercent = thickness * (fade.rimSolidPercent / 100);
  const nearPercent = thickness * (fade.softNearPercent / 100);
  const midPercent = thickness * (fade.softMidPercent / 100);
  const farPercent = thickness * (fade.softFarPercent / 100);
  const tailPercent = thickness * (fade.softTailPercent / 100);
  const clearPercent = thickness;

  // Outer edge can stay present, then ease down across most of the thin band.
  const outerStop =
    solidPercent <= 0.001
      ? `rgba(0, 0, 0, 0.92) 0%,`
      : `black 0%, black ${solidPercent.toFixed(2)}%,`;

  return [
    `linear-gradient(${axis},`,
    outerStop,
    `rgba(0, 0, 0, 0.62) ${nearPercent.toFixed(2)}%,`,
    `rgba(0, 0, 0, 0.32) ${midPercent.toFixed(2)}%,`,
    `rgba(0, 0, 0, 0.12) ${farPercent.toFixed(2)}%,`,
    `rgba(0, 0, 0, 0.04) ${tailPercent.toFixed(2)}%,`,
    `transparent ${clearPercent.toFixed(2)}%,`,
    `transparent ${(100 - clearPercent).toFixed(2)}%,`,
    `rgba(0, 0, 0, 0.04) ${(100 - tailPercent).toFixed(2)}%,`,
    `rgba(0, 0, 0, 0.12) ${(100 - farPercent).toFixed(2)}%,`,
    `rgba(0, 0, 0, 0.32) ${(100 - midPercent).toFixed(2)}%,`,
    `rgba(0, 0, 0, 0.62) ${(100 - nearPercent).toFixed(2)}%,`,
    solidPercent <= 0.001
      ? `rgba(0, 0, 0, 0.92) 100%)`
      : `black ${(100 - solidPercent).toFixed(2)}%, black 100%)`,
  ].join(' ');
}

/**
 * Square/rectangular frame mask over the full viewport.
 *
 * Horizontal + vertical full-bleed fades union into a soft hollow rectangle so
 * the conic underneath reads as a square rim, not a circular vignette.
 */
export function resolvingWorldPlazaDangerSenseHudEdgeFadeMaskStyles(): ResolvingWorldPlazaDangerSenseHudEdgeFadeMaskStyles {
  return {
    maskImage: [
      resolvingWorldPlazaDangerSenseHudSquareFrameAxisGradient('to right'),
      resolvingWorldPlazaDangerSenseHudSquareFrameAxisGradient('to bottom'),
    ].join(', '),
    maskSize: '100% 100%, 100% 100%',
    maskPosition: '0 0, 0 0',
    maskRepeat: 'no-repeat',
    // Union both axes so corners stay covered.
    maskComposite: 'add',
    WebkitMaskComposite: 'source-over',
  };
}

function resolvingWorldPlazaDangerSenseHudSampleTint(
  dangerIntensity: number,
  cautionIntensity: number
): { intensity: number; tint: DefiningWorldPlazaDangerSenseHudTint } | null {
  // Red wins when both overlap (active hunt beats caution).
  if (dangerIntensity >= cautionIntensity && dangerIntensity > 0.001) {
    return { intensity: dangerIntensity, tint: 'danger' };
  }

  if (cautionIntensity > 0.001) {
    return { intensity: cautionIntensity, tint: 'caution' };
  }

  return null;
}

/**
 * Builds a conic-gradient whose rim intensity follows the sample rings.
 *
 * Sample index 0 is screen-east. `from 90deg` aligns CSS 0° offset with east
 * so stops stay in ascending local-degree order.
 * Returns `none` when both rings are effectively dark.
 */
export function resolvingWorldPlazaDangerSenseHudConicGradientBackgroundImage(
  dangerSampleIntensities: Float32Array,
  cautionSampleIntensities: Float32Array
): string {
  const sampleCount = Math.min(
    dangerSampleIntensities.length,
    cautionSampleIntensities.length,
    DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_COUNT
  );

  if (sampleCount <= 0) {
    return 'none';
  }

  let peakIntensity = 0;
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    peakIntensity = Math.max(
      peakIntensity,
      dangerSampleIntensities[sampleIndex] ?? 0,
      cautionSampleIntensities[sampleIndex] ?? 0
    );
  }

  if (peakIntensity <= 0.001) {
    return 'none';
  }

  const stops: string[] = [];

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const resolved = resolvingWorldPlazaDangerSenseHudSampleTint(
      dangerSampleIntensities[sampleIndex] ?? 0,
      cautionSampleIntensities[sampleIndex] ?? 0
    );
    const channelAlpha = resolved
      ? resolved.intensity * DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_PEAK_EDGE_ALPHA
      : 0;
    const tint = resolved?.tint ?? 'danger';
    const localDegrees = (sampleIndex / sampleCount) * 360;

    stops.push(
      `${buildingWorldPlazaDangerSenseHudRgba(channelAlpha, tint)} ${localDegrees.toFixed(2)}deg`
    );
  }

  const firstResolved = resolvingWorldPlazaDangerSenseHudSampleTint(
    dangerSampleIntensities[0] ?? 0,
    cautionSampleIntensities[0] ?? 0
  );
  const firstAlpha = firstResolved
    ? firstResolved.intensity *
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_PEAK_EDGE_ALPHA
    : 0;
  stops.push(
    `${buildingWorldPlazaDangerSenseHudRgba(
      firstAlpha,
      firstResolved?.tint ?? 'danger'
    )} 360deg`
  );

  // from 90deg: local 0° = screen east (math atan2 0), then clockwise.
  return `conic-gradient(from 90deg, ${stops.join(', ')})`;
}
