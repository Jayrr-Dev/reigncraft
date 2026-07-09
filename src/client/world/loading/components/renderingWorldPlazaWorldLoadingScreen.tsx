import {
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_COLORS,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_COMPASS,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_CONTOUR_PATHS,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_DESTINATION,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_GLYPH_PATHS,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_LANDMARKS,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_TRAIL_PATH,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_VIEWBOX,
} from '@/components/world/loading/domains/definingWorldPlazaWorldLoadingMapSceneConstants';
import { resolvingWorldPlazaWorldLoadingMessageForPercent } from '@/components/world/loading/domains/definingWorldPlazaWorldLoadingMessageRegistry';
import { usingWorldPlazaWorldLoadingSmoothedPercent } from '@/components/world/loading/hooks/usingWorldPlazaWorldLoadingSmoothedPercent';
import { useEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_WORLD_LOADING_KEYFRAMES = `
@keyframes plaza-loading-marker-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes plaza-loading-destination-pulse {
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.25); }
}
@keyframes plaza-loading-bar-sheen {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
`;

/** Trail marker position resolved from the current progress percent. */
function usingTrailMarkerPoint(
  pathRef: React.RefObject<SVGPathElement | null>,
  clampedPercent: number
): { x: number; y: number } | null {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) {
      return;
    }

    const totalLength = path.getTotalLength();
    const traveled = path.getPointAtLength(
      (clampedPercent / 100) * totalLength
    );
    setPoint({ x: traveled.x, y: traveled.y });
  }, [pathRef, clampedPercent]);

  return point;
}

function RenderingWorldPlazaWorldLoadingMapCompassRose(): React.JSX.Element {
  const { viewBoxSize, centerX, centerY, radius } =
    DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_COMPASS;
  const { ink, gold } = DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_COLORS;

  return (
    <svg
      className="pointer-events-none absolute right-8 bottom-8 z-10 size-20 opacity-70 sm:right-10 sm:bottom-10 sm:size-24"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      aria-hidden
    >
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={ink}
        strokeWidth={1.5}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.72}
        fill="none"
        stroke={ink}
        strokeWidth={0.75}
      />
      {/* North needle */}
      <path
        d={`M ${centerX} ${centerY - radius * 0.9} L ${centerX + 7} ${centerY} L ${centerX} ${centerY + radius * 0.55} L ${centerX - 7} ${centerY} Z`}
        fill={gold}
        stroke={ink}
        strokeWidth={1}
      />
      <path
        d={`M ${centerX - radius * 0.9} ${centerY} L ${centerX} ${centerY - 5} L ${centerX + radius * 0.9} ${centerY} L ${centerX} ${centerY + 5} Z`}
        fill="none"
        stroke={ink}
        strokeWidth={1}
      />
      <text
        x={centerX}
        y={centerY - radius - 8}
        textAnchor="middle"
        fill={ink}
        fontSize={16}
        fontWeight={700}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        N
      </text>
    </svg>
  );
}

function RenderingWorldPlazaWorldLoadingMapScene({
  clampedPercent,
}: {
  clampedPercent: number;
}): React.JSX.Element {
  const trailPathRef = useRef<SVGPathElement>(null);
  const markerPoint = usingTrailMarkerPoint(trailPathRef, clampedPercent);
  const { width, height } = DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_VIEWBOX;
  const { ink, inkSoft, trail, gold } =
    DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_COLORS;
  const destination = DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_DESTINATION;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Faint topographic contours */}
      {DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_CONTOUR_PATHS.map(
        (contourPath) => (
          <path
            key={contourPath}
            d={contourPath}
            fill="none"
            stroke={inkSoft}
            strokeWidth={1}
            opacity={0.18}
          />
        )
      )}

      {/* Hand-inked landmarks */}
      {DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_LANDMARKS.map(
        (landmark, landmarkIndex) => (
          <g key={`landmark-${landmarkIndex}`} opacity={0.55}>
            {landmark.glyphPositions.map((position) => (
              <path
                key={`glyph-${position.x}-${position.y}`}
                d={
                  DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_GLYPH_PATHS[
                    landmark.kind
                  ]
                }
                transform={`translate(${position.x} ${position.y})`}
                fill="none"
                stroke={ink}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {landmark.label ? (
              <text
                x={landmark.label.x}
                y={landmark.label.y}
                textAnchor="middle"
                fill={ink}
                fontSize={17}
                fontStyle="italic"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {landmark.label.text}
              </text>
            ) : null}
          </g>
        )
      )}

      {/* Full trail, faint */}
      <path
        d={DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_TRAIL_PATH}
        fill="none"
        stroke={inkSoft}
        strokeWidth={2.5}
        strokeDasharray="2 12"
        strokeLinecap="round"
        opacity={0.4}
      />

      {/* Traveled portion of the trail, revealed with progress */}
      <path
        ref={trailPathRef}
        d={DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_TRAIL_PATH}
        fill="none"
        stroke={trail}
        strokeWidth={3.5}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${clampedPercent} ${200 - clampedPercent}`}
        opacity={0.9}
      />

      {/* Destination: X marks the plaza */}
      <g transform={`translate(${destination.x} ${destination.y})`}>
        <g
          style={{
            animation:
              'plaza-loading-destination-pulse 1.8s ease-in-out infinite',
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        >
          <path
            d="M -11 -11 L 11 11 M 11 -11 L -11 11"
            stroke={trail}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
      </g>
      <circle
        cx={destination.x}
        cy={destination.y}
        r={20}
        fill="none"
        stroke={trail}
        strokeWidth={1.5}
        opacity={0.5}
      />

      {/* Expedition marker traveling the trail */}
      {markerPoint ? (
        <g
          style={{
            animation: 'plaza-loading-marker-bob 1.4s ease-in-out infinite',
          }}
        >
          <circle
            cx={markerPoint.x}
            cy={markerPoint.y}
            r={9}
            fill={gold}
            stroke={ink}
            strokeWidth={2.5}
          />
          <circle cx={markerPoint.x} cy={markerPoint.y} r={3.5} fill={ink} />
        </g>
      ) : null}
    </svg>
  );
}

export type RenderingWorldPlazaWorldLoadingScreenProps = {
  /** Overall progress from 0 to 100. */
  percentLoaded: number;
  /** Replaces the status message when the pipeline failed. */
  errorMessage?: string | null;
};

/**
 * Full-screen loading screen styled as a parchment expedition map, matching
 * the vintage adventure-poster theme of the home screen.
 */
export function RenderingWorldPlazaWorldLoadingScreen({
  percentLoaded,
  errorMessage = null,
}: RenderingWorldPlazaWorldLoadingScreenProps): React.JSX.Element {
  const targetPercent = Math.min(100, Math.max(0, percentLoaded));
  const smoothedPercent =
    usingWorldPlazaWorldLoadingSmoothedPercent(targetPercent);
  const statusMessage =
    errorMessage ??
    resolvingWorldPlazaWorldLoadingMessageForPercent(targetPercent);
  const displayedPercentLabel = Math.min(100, Math.round(smoothedPercent));

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden font-body"
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(255, 250, 230, 0.55) 0%, transparent 55%), linear-gradient(165deg, #f0e2c4 0%, #e3d1a8 60%, #d6bf92 100%)',
      }}
      aria-busy={errorMessage === null}
      aria-live="polite"
    >
      <style>{RENDERING_WORLD_PLAZA_WORLD_LOADING_KEYFRAMES}</style>

      <RenderingWorldPlazaWorldLoadingMapScene
        clampedPercent={smoothedPercent}
      />

      <RenderingWorldPlazaWorldLoadingMapCompassRose />

      {/* Aged-paper edge burn vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 52%, rgba(92, 64, 51, 0.28) 88%, rgba(46, 42, 34, 0.45) 100%)',
        }}
      />

      {/* Poster paper frame, matching the home screen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 z-20 rounded-sm border-4 border-poster-wood/60 sm:inset-3"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 z-20 rounded-sm border border-poster-wood/35 sm:inset-5"
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-4 px-6 text-center">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-12 bg-gradient-to-r from-transparent to-poster-gold"
          />
          <span aria-hidden className="size-1.5 rotate-45 bg-poster-gold" />
          <span
            aria-hidden
            className="h-px w-12 bg-gradient-to-l from-transparent to-poster-gold"
          />
        </div>

        <h1 className="plaza-title-text text-4xl sm:text-5xl">
          <span className="plaza-title-reign" data-text="REIGN">
            REIGN
          </span>
          <span className="plaza-title-craft" data-text="CRAFT">
            CRAFT
          </span>
        </h1>

        <div className="flex w-full flex-col gap-2">
          <div className="relative h-3 w-full overflow-hidden rounded-full border-2 border-poster-wood/70 bg-parchment-dark/80 shadow-inner">
            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-poster-orange-deep via-poster-orange to-poster-gold"
              style={{ width: `${smoothedPercent}%` }}
            >
              <span
                className="absolute inset-y-0 w-1/3 bg-white/30 blur-sm"
                style={{
                  animation: 'plaza-loading-bar-sheen 1.6s linear infinite',
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
            <span className={errorMessage ? 'text-red-800' : undefined}>
              {statusMessage}
            </span>
            <span className="tabular-nums">{displayedPercentLabel}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
