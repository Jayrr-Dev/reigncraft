export type PlazaHomeScreenCloudShape =
  | 'drift'
  | 'layer'
  | 'mist'
  | 'puff'
  | 'bank'
  | 'streak'
  | 'tower';

export type PlazaHomeScreenCloudDefinition = {
  id: string;
  shape: PlazaHomeScreenCloudShape;
  top: string;
  opacityClass: string;
  durationMs: number;
  /** 0 = off-screen right, 1 = nearly exited left */
  startProgress: number;
  /** Per-cloud size relative to the responsive sky base (default 1). */
  sizeMultiplier?: number;
};

/** Drifting cloud layer definitions for poster sky scenes (home + splash). */
export const DEFINING_PLAZA_HOME_SCREEN_CLOUD_LAYER: PlazaHomeScreenCloudDefinition[] =
  [
    {
      id: 'puff-1',
      shape: 'puff',
      top: '22%',
      opacityClass: 'opacity-75',
      durationMs: 140_000,
      startProgress: 0.12,
      sizeMultiplier: 1.25,
    },
    {
      id: 'bank-1',
      shape: 'bank',
      top: '28%',
      opacityClass: 'opacity-50',
      durationMs: 185_000,
      startProgress: 0.38,
    },
    {
      id: 'drift-1',
      shape: 'drift',
      top: '20%',
      opacityClass: 'opacity-70',
      durationMs: 95_000,
      startProgress: 0,
    },
    {
      id: 'streak-1',
      shape: 'streak',
      top: '24%',
      opacityClass: 'opacity-45',
      durationMs: 200_000,
      startProgress: 0.55,
      sizeMultiplier: 1.1,
    },
    {
      id: 'layer-1',
      shape: 'layer',
      top: '30%',
      opacityClass: 'opacity-55',
      durationMs: 130_000,
      startProgress: 0.22,
      sizeMultiplier: 1.1,
    },
    {
      id: 'tower-1',
      shape: 'tower',
      top: '24%',
      opacityClass: 'opacity-65',
      durationMs: 155_000,
      startProgress: 0,
      sizeMultiplier: 1.25,
    },
    {
      id: 'mist-1',
      shape: 'mist',
      top: '34%',
      opacityClass: 'opacity-40',
      durationMs: 160_000,
      startProgress: 0.48,
      sizeMultiplier: 0.9,
    },
    {
      id: 'drift-2',
      shape: 'drift',
      top: '22%',
      opacityClass: 'opacity-60',
      durationMs: 110_000,
      startProgress: 0.72,
      sizeMultiplier: 1.05,
    },
    {
      id: 'puff-2',
      shape: 'puff',
      top: '26%',
      opacityClass: 'opacity-55',
      durationMs: 165_000,
      startProgress: 0,
    },
    {
      id: 'layer-2',
      shape: 'layer',
      top: '22%',
      opacityClass: 'opacity-50',
      durationMs: 145_000,
      startProgress: 0.65,
      sizeMultiplier: 1.5,
    },
    {
      id: 'streak-2',
      shape: 'streak',
      top: '38%',
      opacityClass: 'opacity-35',
      durationMs: 220_000,
      startProgress: 0,
    },
    {
      id: 'mist-2',
      shape: 'mist',
      top: '32%',
      opacityClass: 'opacity-35',
      durationMs: 175_000,
      startProgress: 0.28,
    },
    {
      id: 'bank-2',
      shape: 'bank',
      top: '21%',
      opacityClass: 'opacity-42',
      durationMs: 195_000,
      startProgress: 0.82,
      sizeMultiplier: 1.25,
    },
    {
      id: 'tower-2',
      shape: 'tower',
      top: '29%',
      opacityClass: 'opacity-48',
      durationMs: 170_000,
      startProgress: 0.15,
      sizeMultiplier: 0.95,
    },
    {
      id: 'drift-3',
      shape: 'drift',
      top: '36%',
      opacityClass: 'opacity-45',
      durationMs: 125_000,
      startProgress: 0.35,
      sizeMultiplier: 0.75,
    },
    {
      id: 'mist-3',
      shape: 'mist',
      top: '44%',
      opacityClass: 'opacity-32',
      durationMs: 190_000,
      startProgress: 0.62,
      sizeMultiplier: 1.05,
    },
    {
      id: 'layer-3',
      shape: 'layer',
      top: '50%',
      opacityClass: 'opacity-38',
      durationMs: 175_000,
      startProgress: 0.18,
      sizeMultiplier: 1.15,
    },
    {
      id: 'bank-3',
      shape: 'bank',
      top: '56%',
      opacityClass: 'opacity-30',
      durationMs: 210_000,
      startProgress: 0.44,
      sizeMultiplier: 0.9,
    },
  ];
