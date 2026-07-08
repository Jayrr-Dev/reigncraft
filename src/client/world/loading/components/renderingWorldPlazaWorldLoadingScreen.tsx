import { resolvingWorldPlazaWorldLoadingMessageForPercent } from '@/components/world/loading/domains/definingWorldPlazaWorldLoadingMessageRegistry';

/** Ember particle layout: left offset (%), animation delay (s), duration (s). */
const RENDERING_WORLD_PLAZA_WORLD_LOADING_EMBERS: readonly {
  leftPercent: number;
  delaySeconds: number;
  durationSeconds: number;
  sizePx: number;
}[] = [
  { leftPercent: 8, delaySeconds: 0, durationSeconds: 7, sizePx: 5 },
  { leftPercent: 18, delaySeconds: 2.4, durationSeconds: 9, sizePx: 4 },
  { leftPercent: 31, delaySeconds: 1.1, durationSeconds: 6.5, sizePx: 6 },
  { leftPercent: 44, delaySeconds: 3.6, durationSeconds: 8, sizePx: 4 },
  { leftPercent: 57, delaySeconds: 0.7, durationSeconds: 7.5, sizePx: 5 },
  { leftPercent: 69, delaySeconds: 2.9, durationSeconds: 6, sizePx: 4 },
  { leftPercent: 81, delaySeconds: 1.8, durationSeconds: 8.5, sizePx: 6 },
  { leftPercent: 92, delaySeconds: 4.2, durationSeconds: 7, sizePx: 4 },
];

/** Star layout: left/top offsets (%) and twinkle delay (s). */
const RENDERING_WORLD_PLAZA_WORLD_LOADING_STARS: readonly {
  leftPercent: number;
  topPercent: number;
  delaySeconds: number;
}[] = [
  { leftPercent: 6, topPercent: 12, delaySeconds: 0 },
  { leftPercent: 16, topPercent: 28, delaySeconds: 1.2 },
  { leftPercent: 27, topPercent: 8, delaySeconds: 0.6 },
  { leftPercent: 38, topPercent: 22, delaySeconds: 1.8 },
  { leftPercent: 52, topPercent: 10, delaySeconds: 0.3 },
  { leftPercent: 63, topPercent: 30, delaySeconds: 2.1 },
  { leftPercent: 74, topPercent: 14, delaySeconds: 0.9 },
  { leftPercent: 85, topPercent: 24, delaySeconds: 1.5 },
  { leftPercent: 94, topPercent: 9, delaySeconds: 2.4 },
];

const RENDERING_WORLD_PLAZA_WORLD_LOADING_KEYFRAMES = `
@keyframes plaza-loading-spin {
  to { transform: rotate(360deg); }
}
@keyframes plaza-loading-ember-rise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  12% { opacity: 0.9; }
  100% { transform: translateY(-52vh) scale(0.4); opacity: 0; }
}
@keyframes plaza-loading-star-twinkle {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.95; }
}
@keyframes plaza-loading-bar-sheen {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
`;

export type RenderingWorldPlazaWorldLoadingScreenProps = {
  /** Overall progress from 0 to 100. */
  percentLoaded: number;
  /** Replaces the status message when the pipeline failed. */
  errorMessage?: string | null;
};

/**
 * Full-screen thematic loading screen with spinner, bar, and status text.
 */
export function RenderingWorldPlazaWorldLoadingScreen({
  percentLoaded,
  errorMessage = null,
}: RenderingWorldPlazaWorldLoadingScreenProps): React.JSX.Element {
  const clampedPercent = Math.min(100, Math.max(0, Math.round(percentLoaded)));
  const statusMessage =
    errorMessage ??
    resolvingWorldPlazaWorldLoadingMessageForPercent(clampedPercent);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #0b1026 0%, #1b2145 42%, #3b2a55 72%, #6b3b4a 100%)',
      }}
      aria-busy={errorMessage === null}
      aria-live="polite"
    >
      <style>{RENDERING_WORLD_PLAZA_WORLD_LOADING_KEYFRAMES}</style>

      {RENDERING_WORLD_PLAZA_WORLD_LOADING_STARS.map((star) => (
        <span
          key={`star-${star.leftPercent}-${star.topPercent}`}
          className="pointer-events-none absolute rounded-full bg-sky-100"
          style={{
            left: `${star.leftPercent}%`,
            top: `${star.topPercent}%`,
            width: 3,
            height: 3,
            animation: `plaza-loading-star-twinkle 2.8s ease-in-out ${star.delaySeconds}s infinite`,
          }}
        />
      ))}

      {/* Distant hill silhouettes */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            'radial-gradient(120% 90% at 18% 100%, rgba(10, 14, 32, 0.9) 0%, rgba(10, 14, 32, 0) 62%), radial-gradient(130% 100% at 82% 100%, rgba(16, 18, 38, 0.95) 0%, rgba(16, 18, 38, 0) 66%), radial-gradient(160% 110% at 50% 108%, rgba(7, 10, 24, 1) 0%, rgba(7, 10, 24, 0) 70%)',
        }}
      />

      {RENDERING_WORLD_PLAZA_WORLD_LOADING_EMBERS.map((ember) => (
        <span
          key={`ember-${ember.leftPercent}`}
          className="pointer-events-none absolute bottom-6 rounded-full"
          style={{
            left: `${ember.leftPercent}%`,
            width: ember.sizePx,
            height: ember.sizePx,
            background: 'radial-gradient(circle, #ffd28a 0%, #ff7a3c 70%)',
            boxShadow: '0 0 8px 2px rgba(255, 138, 76, 0.55)',
            animation: `plaza-loading-ember-rise ${ember.durationSeconds}s linear ${ember.delaySeconds}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-5 px-6 text-center">
        <h1
          className="text-3xl font-extrabold tracking-widest text-amber-100"
          style={{ textShadow: '0 2px 18px rgba(255, 170, 90, 0.35)' }}
        >
          REIGNCRAFT
        </h1>

        <div
          className="h-12 w-12 rounded-full border-4 border-amber-200/25 border-t-amber-300"
          style={{ animation: 'plaza-loading-spin 0.9s linear infinite' }}
          role="status"
          aria-label="Loading"
        />

        <div className="flex w-full flex-col gap-2">
          <div className="relative h-3 w-full overflow-hidden rounded-full border border-amber-200/20 bg-slate-950/60">
            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 transition-[width] duration-300 ease-out"
              style={{ width: `${clampedPercent}%` }}
            >
              <span
                className="absolute inset-y-0 w-1/3 bg-white/30 blur-sm"
                style={{
                  animation: 'plaza-loading-bar-sheen 1.6s linear infinite',
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-100/80">
            <span className={errorMessage ? 'text-red-300' : undefined}>
              {statusMessage}
            </span>
            <span className="tabular-nums">{clampedPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
