'use client';

import { computingPlazaMechanicsCombatEvBellCurveDistributionPath } from '@/components/home/domains/computingPlazaMechanicsCombatEvBellCurveDistributionPath';
import { computingPlazaMechanicsCombatEvBellCurveLayout } from '@/components/home/domains/computingPlazaMechanicsCombatEvBellCurveLayout';
import { DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT } from '@/components/home/domains/definingPlazaMechanicsCombatEvBellCurveConstants';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { RollingWorldPlazaDamageRollMode } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';
import { useMemo } from 'react';

export type RenderingPlazaMechanicsCombatEvBellCurveOverlay = {
  luck?: number;
  deviationBiasShift?: number;
  rollMode?: RollingWorldPlazaDamageRollMode;
  varianceMultiplier?: number;
};

export type RenderingPlazaMechanicsCombatEvBellCurveChartProps = {
  selectedTier?: DefiningWorldPlazaDamageOutcomeTier;
  rollDeviationScore?: number | null;
  onSelectTier?: (tier: DefiningWorldPlazaDamageOutcomeTier) => void;
  overlay?: RenderingPlazaMechanicsCombatEvBellCurveOverlay | null;
  caption?: string | null;
};

/** Bell-curve chart mapping σ bands to combat outcome tiers. */
export function RenderingPlazaMechanicsCombatEvBellCurveChart({
  selectedTier,
  rollDeviationScore = null,
  onSelectTier,
  overlay = null,
  caption = null,
}: RenderingPlazaMechanicsCombatEvBellCurveChartProps): React.JSX.Element {
  const chartLayout = useMemo(
    () => computingPlazaMechanicsCombatEvBellCurveLayout(),
    []
  );
  const curveStyle = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT;
  const hasOverlay = overlay !== null;
  const overlayCurvePath = useMemo(() => {
    if (!overlay) {
      return null;
    }

    return computingPlazaMechanicsCombatEvBellCurveDistributionPath({
      luck: overlay.luck ?? 0,
      deviationBiasShift: overlay.deviationBiasShift ?? 0,
      rollMode: overlay.rollMode ?? 'normal',
      varianceMultiplier: overlay.varianceMultiplier ?? 1,
    });
  }, [overlay]);

  const clampedRollSigma =
    rollDeviationScore === null
      ? null
      : Math.min(
          curveStyle.sigmaMax,
          Math.max(curveStyle.sigmaMin, rollDeviationScore)
        );

  const rollMarkerX =
    clampedRollSigma === null ? null : chartLayout.sigmaToX(clampedRollSigma);
  const rollMarkerY =
    clampedRollSigma === null
      ? null
      : chartLayout.pdfYToSvgY(
          Math.exp(-0.5 * clampedRollSigma * clampedRollSigma) /
            Math.sqrt(2 * Math.PI)
        );

  return (
    <figure className="w-full rounded-md border border-poster-teal/20 bg-parchment/50 p-2">
      <svg
        viewBox={`0 0 ${chartLayout.width} ${chartLayout.height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Bell curve showing combat outcome tiers by standard deviation from expected damage"
      >
        {chartLayout.bands.map((bandRect) => {
          const isSelected =
            selectedTier !== undefined && bandRect.band.tier === selectedTier;

          return (
            <g key={bandRect.band.tier}>
              <rect
                x={bandRect.x}
                y={bandRect.y}
                width={bandRect.width}
                height={bandRect.height}
                fill={
                  isSelected ? bandRect.band.fillSelected : bandRect.band.fill
                }
                stroke={bandRect.band.stroke}
                strokeWidth={isSelected ? 1.5 : 0.75}
                className={onSelectTier ? 'cursor-pointer' : undefined}
                onClick={
                  onSelectTier
                    ? () => onSelectTier(bandRect.band.tier)
                    : undefined
                }
              />
              <text
                x={bandRect.labelX}
                y={bandRect.labelY}
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill={bandRect.band.labelFill}
                pointerEvents="none"
              >
                {bandRect.band.label}
              </text>
            </g>
          );
        })}

        <line
          x1={chartLayout.evX}
          y1={chartLayout.plotTop}
          x2={chartLayout.evX}
          y2={chartLayout.baselineY}
          stroke={curveStyle.evLineStroke}
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        <path
          d={chartLayout.curvePath}
          fill="none"
          stroke={
            hasOverlay ? curveStyle.baselineCurveStroke : curveStyle.curveStroke
          }
          strokeWidth={
            hasOverlay
              ? curveStyle.baselineCurveStrokeWidth
              : curveStyle.curveStrokeWidth
          }
          strokeLinecap="round"
          strokeLinejoin="round"
          pointerEvents="none"
        />

        {overlayCurvePath ? (
          <path
            d={overlayCurvePath}
            fill="none"
            stroke={curveStyle.overlayCurveStroke}
            strokeWidth={curveStyle.overlayCurveStrokeWidth}
            strokeDasharray={curveStyle.overlayCurveDashArray}
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
          />
        ) : null}

        {rollMarkerX !== null && rollMarkerY !== null ? (
          <g pointerEvents="none">
            <line
              x1={rollMarkerX}
              y1={rollMarkerY}
              x2={rollMarkerX}
              y2={chartLayout.baselineY}
              stroke={curveStyle.rollMarkerStroke}
              strokeWidth="1.25"
              strokeDasharray="2 2"
            />
            <circle
              cx={rollMarkerX}
              cy={rollMarkerY}
              r={curveStyle.rollMarkerRadius}
              fill={curveStyle.rollMarkerStroke}
              stroke="#fff7ed"
              strokeWidth="1"
            />
          </g>
        ) : null}

        <line
          x1={chartLayout.sigmaToX(curveStyle.sigmaMin)}
          y1={chartLayout.baselineY}
          x2={chartLayout.sigmaToX(curveStyle.sigmaMax)}
          y2={chartLayout.baselineY}
          stroke={curveStyle.axisStroke}
          strokeWidth="1"
        />

        {chartLayout.ticks.map((tick) => (
          <g key={tick.label}>
            <line
              x1={tick.x}
              y1={chartLayout.baselineY}
              x2={tick.x}
              y2={chartLayout.baselineY + 4}
              stroke={curveStyle.axisStroke}
              strokeWidth="1"
            />
            <text
              x={tick.x}
              y={tick.y}
              textAnchor="middle"
              fontSize="8"
              fontWeight={tick.label === 'EV' ? '700' : '600'}
              fill={tick.label === 'EV' ? '#991b1b' : '#475569'}
            >
              {tick.label}
            </text>
          </g>
        ))}
      </svg>
      {hasOverlay ? (
        <div className="mt-1 flex items-center justify-center gap-3 text-[10px] font-semibold text-ink-soft">
          <span className="flex items-center gap-1">
            <svg width="18" height="6" viewBox="0 0 18 6" aria-hidden>
              <line
                x1="1"
                y1="3"
                x2="17"
                y2="3"
                stroke={curveStyle.baselineCurveStroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Default rolls
          </span>
          <span className="flex items-center gap-1">
            <svg width="18" height="6" viewBox="0 0 18 6" aria-hidden>
              <line
                x1="1"
                y1="3"
                x2="17"
                y2="3"
                stroke={curveStyle.overlayCurveStroke}
                strokeWidth="2"
                strokeDasharray="4 2.5"
                strokeLinecap="round"
              />
            </svg>
            With this badge
          </span>
        </div>
      ) : null}
      <figcaption className="mt-1 text-center text-[10px] font-medium text-ink-soft">
        {caption ??
          (hasOverlay
            ? 'Red curve is your default roll spread. The black dashed curve shows how this badge reshapes it.'
            : 'Roll spread follows a bell curve around EV. Low tails are mitigated; high tails hit harder.')}
      </figcaption>
    </figure>
  );
}
