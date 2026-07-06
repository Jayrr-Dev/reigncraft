import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type DefiningPlazaMechanicsCombatEvBellCurveBand = {
  tier: DefiningWorldPlazaDamageOutcomeTier;
  label: string;
  sigmaMin: number;
  sigmaMax: number;
  fill: string;
  fillSelected: string;
  stroke: string;
  labelFill: string;
};

/** SVG layout for the mechanics EV bell-curve chart. */
export const DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT = {
  width: 320,
  height: 148,
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 22,
  paddingBottom: 30,
  sigmaMin: -4,
  sigmaMax: 4,
  curveSampleCount: 80,
  curveStroke: '#2c4a52',
  curveStrokeWidth: 2,
  axisStroke: 'rgba(44, 74, 82, 0.35)',
  evLineStroke: 'rgba(196, 59, 59, 0.55)',
  rollMarkerStroke: '#c1592f',
  rollMarkerRadius: 4,
  baselineCurveStroke: 'rgba(44, 74, 82, 0.45)',
  baselineCurveStrokeWidth: 1.5,
  overlayCurveStroke: '#c1592f',
  overlayCurveStrokeWidth: 2.25,
} as const;

/** σ bands for each combat outcome tier (low rolls → high rolls). */
export const DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_BANDS: readonly DefiningPlazaMechanicsCombatEvBellCurveBand[] =
  [
    {
      tier: 'dodged',
      label: 'Dodged',
      sigmaMin: -4,
      sigmaMax: -3,
      fill: 'rgba(148, 163, 184, 0.35)',
      fillSelected: 'rgba(148, 163, 184, 0.55)',
      stroke: '#64748b',
      labelFill: '#334155',
    },
    {
      tier: 'blocked',
      label: 'Blocked',
      sigmaMin: -3,
      sigmaMax: -2,
      fill: 'rgba(148, 163, 184, 0.28)',
      fillSelected: 'rgba(148, 163, 184, 0.48)',
      stroke: '#64748b',
      labelFill: '#334155',
    },
    {
      tier: 'softened',
      label: 'Softened',
      sigmaMin: -2,
      sigmaMax: -1,
      fill: 'rgba(203, 213, 225, 0.45)',
      fillSelected: 'rgba(203, 213, 225, 0.65)',
      stroke: '#94a3b8',
      labelFill: '#475569',
    },
    {
      tier: 'normal',
      label: 'Normal',
      sigmaMin: -1,
      sigmaMax: 1,
      fill: 'rgba(248, 113, 113, 0.22)',
      fillSelected: 'rgba(248, 113, 113, 0.38)',
      stroke: '#dc2626',
      labelFill: '#991b1b',
    },
    {
      tier: 'critical',
      label: 'Critical',
      sigmaMin: 1,
      sigmaMax: 2,
      fill: 'rgba(251, 191, 36, 0.35)',
      fillSelected: 'rgba(251, 191, 36, 0.52)',
      stroke: '#d97706',
      labelFill: '#92400e',
    },
    {
      tier: 'lethal',
      label: 'Lethal',
      sigmaMin: 2,
      sigmaMax: 3,
      fill: 'rgba(251, 146, 60, 0.35)',
      fillSelected: 'rgba(251, 146, 60, 0.52)',
      stroke: '#ea580c',
      labelFill: '#9a3412',
    },
    {
      tier: 'fatal',
      label: 'Fatal',
      sigmaMin: 3,
      sigmaMax: 4,
      fill: 'rgba(127, 29, 29, 0.28)',
      fillSelected: 'rgba(127, 29, 29, 0.45)',
      stroke: '#7f1d1d',
      labelFill: '#450a0a',
    },
  ] as const;

/** σ tick labels along the chart baseline. */
export const DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_SIGMA_TICKS: readonly {
  sigma: number;
  label: string;
}[] = [
  { sigma: -3, label: '−3σ' },
  { sigma: -2, label: '−2σ' },
  { sigma: -1, label: '−1σ' },
  { sigma: 0, label: 'EV' },
  { sigma: 1, label: '+1σ' },
  { sigma: 2, label: '+2σ' },
  { sigma: 3, label: '+3σ' },
] as const;
