import {
  DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_BANDS,
  DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT,
  DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_SIGMA_TICKS,
  type DefiningPlazaMechanicsCombatEvBellCurveBand,
} from '@/components/home/domains/definingPlazaMechanicsCombatEvBellCurveConstants';

export type ComputingPlazaMechanicsCombatEvBellCurveBandRect = {
  band: DefiningPlazaMechanicsCombatEvBellCurveBand;
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
};

export type ComputingPlazaMechanicsCombatEvBellCurveSigmaTick = {
  sigma: number;
  label: string;
  x: number;
  y: number;
};

export type ComputingPlazaMechanicsCombatEvBellCurveLayout = {
  width: number;
  height: number;
  plotTop: number;
  plotBottom: number;
  baselineY: number;
  evX: number;
  curvePath: string;
  bands: ComputingPlazaMechanicsCombatEvBellCurveBandRect[];
  ticks: ComputingPlazaMechanicsCombatEvBellCurveSigmaTick[];
  sigmaToX: (sigma: number) => number;
  pdfYToSvgY: (pdfY: number) => number;
};

/** Standard normal PDF at σ. */
export function computingPlazaMechanicsCombatEvBellCurveNormalPdf(
  sigma: number
): number {
  return Math.exp(-0.5 * sigma * sigma) / Math.sqrt(2 * Math.PI);
}

/** Maps σ and chart constants into SVG coordinates and paths. */
export function computingPlazaMechanicsCombatEvBellCurveLayout(): ComputingPlazaMechanicsCombatEvBellCurveLayout {
  const layout = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT;
  const plotWidth = layout.width - layout.paddingLeft - layout.paddingRight;
  const plotHeight = layout.height - layout.paddingTop - layout.paddingBottom;
  const plotTop = layout.paddingTop;
  const plotBottom = layout.height - layout.paddingBottom;
  const baselineY = plotBottom;
  const sigmaSpan = layout.sigmaMax - layout.sigmaMin;

  const sigmaToX = (sigma: number): number =>
    layout.paddingLeft + ((sigma - layout.sigmaMin) / sigmaSpan) * plotWidth;

  const pdfPeak = computingPlazaMechanicsCombatEvBellCurveNormalPdf(0);
  const pdfYToSvgY = (pdfY: number): number =>
    plotBottom - (pdfY / pdfPeak) * (plotHeight - 8);

  const curvePoints: string[] = [];

  for (
    let sampleIndex = 0;
    sampleIndex <= layout.curveSampleCount;
    sampleIndex += 1
  ) {
    const sigma =
      layout.sigmaMin + (sampleIndex / layout.curveSampleCount) * sigmaSpan;
    const x = sigmaToX(sigma);
    const y = pdfYToSvgY(
      computingPlazaMechanicsCombatEvBellCurveNormalPdf(sigma)
    );
    curvePoints.push(
      `${sampleIndex === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    );
  }

  const bands = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_BANDS.map(
    (band) => {
      const x = sigmaToX(band.sigmaMin);
      const width = sigmaToX(band.sigmaMax) - x;

      return {
        band,
        x,
        y: plotTop,
        width,
        height: plotBottom - plotTop,
        labelX: x + width / 2,
        labelY: plotTop + 10,
      };
    }
  );

  const ticks = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_SIGMA_TICKS.map(
    (tick) => ({
      sigma: tick.sigma,
      label: tick.label,
      x: sigmaToX(tick.sigma),
      y: baselineY + 14,
    })
  );

  return {
    width: layout.width,
    height: layout.height,
    plotTop,
    plotBottom,
    baselineY,
    evX: sigmaToX(0),
    curvePath: curvePoints.join(' '),
    bands,
    ticks,
    sigmaToX,
    pdfYToSvgY,
  };
}
