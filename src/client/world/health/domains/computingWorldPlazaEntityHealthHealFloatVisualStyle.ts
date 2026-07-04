import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Base heal float size at expected value (0σ). */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_BASE_FONT_PX = 20;

/** Font growth per |σ| for high/low heal rolls. */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_FONT_PX_PER_ABSOLUTE_SD = 3;

const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_TIER_ABSOLUTE_SD: Partial<
  Record<DefiningWorldPlazaDamageOutcomeTier, number>
> = {
  fatal: 3,
  lethal: 2,
  critical: 1.25,
  true_strike: 0,
  normal: 0,
  softened: 1.25,
  blocked: 2,
  dodged: 3,
};

/** Green stops from medium → very light mint as |σ| rises. */
const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_COLOR_STOPS: readonly {
  absoluteDeviationScore: number;
  color: string;
}[] = [
  { absoluteDeviationScore: 0, color: '#4ade80' },
  { absoluteDeviationScore: 1, color: '#6ee7b7' },
  { absoluteDeviationScore: 2, color: '#86efac' },
  { absoluteDeviationScore: 3, color: '#a7f3d0' },
  { absoluteDeviationScore: 4, color: '#bbf7d0' },
  { absoluteDeviationScore: 5, color: '#dcfce7' },
  { absoluteDeviationScore: 6, color: '#ecfccb' },
];

export type ComputingWorldPlazaEntityHealthHealFloatVisualStyle = {
  color: string;
  fontSizePx: number;
  WebkitTextStroke: string;
  paintOrder: 'stroke fill';
  textShadow: string;
};

function resolvingWorldPlazaEntityHealthHealFloatAbsoluteDeviationScore({
  outcomeTier,
  deviationScore,
}: {
  outcomeTier?: DefiningWorldPlazaDamageOutcomeTier | null;
  deviationScore?: number | null;
}): number {
  if (deviationScore !== null && deviationScore !== undefined) {
    return Math.abs(deviationScore);
  }

  if (
    outcomeTier === null ||
    outcomeTier === undefined ||
    outcomeTier === 'normal'
  ) {
    return 0;
  }

  return (
    COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_TIER_ABSOLUTE_SD[
      outcomeTier
    ] ?? 0
  );
}

function parsingWorldPlazaHealFloatHexColor(hexColor: string): {
  r: number;
  g: number;
  b: number;
} {
  const normalized = hexColor.replace('#', '');
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function formattingWorldPlazaHealFloatHexColor({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): string {
  const toHex = (channel: number): string =>
    Math.round(channel).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function blendingWorldPlazaHealFloatHexColors(
  fromColor: string,
  toColor: string,
  blend: number
): string {
  const from = parsingWorldPlazaHealFloatHexColor(fromColor);
  const to = parsingWorldPlazaHealFloatHexColor(toColor);
  const clampedBlend = Math.min(1, Math.max(0, blend));

  return formattingWorldPlazaHealFloatHexColor({
    r: from.r + (to.r - from.r) * clampedBlend,
    g: from.g + (to.g - from.g) * clampedBlend,
    b: from.b + (to.b - from.b) * clampedBlend,
  });
}

function computingWorldPlazaEntityHealthHealFloatColor(
  absoluteDeviationScore: number
): string {
  const stops = COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_COLOR_STOPS;
  const cappedScore = Math.min(
    absoluteDeviationScore,
    stops[stops.length - 1]?.absoluteDeviationScore ?? 6
  );

  for (let index = 0; index < stops.length - 1; index += 1) {
    const stop = stops[index];
    const nextStop = stops[index + 1];

    if (!stop || !nextStop) {
      continue;
    }

    if (
      cappedScore >= stop.absoluteDeviationScore &&
      cappedScore <= nextStop.absoluteDeviationScore
    ) {
      const span =
        nextStop.absoluteDeviationScore - stop.absoluteDeviationScore;

      if (span <= 0) {
        return stop.color;
      }

      const blend = (cappedScore - stop.absoluteDeviationScore) / span;

      return blendingWorldPlazaHealFloatHexColors(
        stop.color,
        nextStop.color,
        blend
      );
    }
  }

  return stops[stops.length - 1]?.color ?? '#4ade80';
}

/**
 * Heal floats: green fill, light black outline, brighter/larger as |σ| grows.
 */
export function computingWorldPlazaEntityHealthHealFloatVisualStyle({
  outcomeTier,
  deviationScore,
}: {
  outcomeTier?: DefiningWorldPlazaDamageOutcomeTier | null;
  deviationScore?: number | null;
}): ComputingWorldPlazaEntityHealthHealFloatVisualStyle {
  const absoluteDeviationScore =
    resolvingWorldPlazaEntityHealthHealFloatAbsoluteDeviationScore({
      outcomeTier,
      deviationScore,
    });
  const color = computingWorldPlazaEntityHealthHealFloatColor(
    absoluteDeviationScore
  );
  const fontSizePx = Math.round(
    COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_BASE_FONT_PX +
      absoluteDeviationScore *
        COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_HEAL_FLOAT_FONT_PX_PER_ABSOLUTE_SD
  );

  return {
    color,
    fontSizePx,
    WebkitTextStroke: '1px rgba(0, 0, 0, 0.72)',
    paintOrder: 'stroke fill',
    textShadow:
      '0 1px 0 rgba(0,0,0,0.95), 1px 0 0 rgba(0,0,0,0.55), -1px 0 0 rgba(0,0,0,0.55), 0 0 10px rgba(74,222,128,0.35)',
  };
}
