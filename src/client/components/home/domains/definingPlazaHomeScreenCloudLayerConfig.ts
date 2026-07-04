export type PlazaHomeScreenCloudShape = 'drift' | 'layer' | 'mist';

export type PlazaHomeScreenCloudDefinition = {
  id: string;
  shape: PlazaHomeScreenCloudShape;
  top: string;
  opacityClass: string;
  durationMs: number;
  /** 0 = off-screen right, 1 = nearly exited left */
  startProgress: number;
  scaleClass?: string;
};

/** Drifting cloud layer definitions for the home screen poster sky. */
export const DEFINING_PLAZA_HOME_SCREEN_CLOUD_LAYER: PlazaHomeScreenCloudDefinition[] =
  [
    {
      id: 'drift-1',
      shape: 'drift',
      top: '10%',
      opacityClass: 'opacity-70',
      durationMs: 95_000,
      startProgress: 0,
    },
    {
      id: 'layer-1',
      shape: 'layer',
      top: '17%',
      opacityClass: 'opacity-55',
      durationMs: 130_000,
      startProgress: 0.22,
    },
    {
      id: 'mist-1',
      shape: 'mist',
      top: '13%',
      opacityClass: 'opacity-40',
      durationMs: 160_000,
      startProgress: 0.48,
      scaleClass: 'scale-90',
    },
    {
      id: 'drift-2',
      shape: 'drift',
      top: '22%',
      opacityClass: 'opacity-60',
      durationMs: 110_000,
      startProgress: 0,
    },
    {
      id: 'layer-2',
      shape: 'layer',
      top: '8%',
      opacityClass: 'opacity-50',
      durationMs: 145_000,
      startProgress: 0.65,
      scaleClass: 'scale-95',
    },
    {
      id: 'mist-2',
      shape: 'mist',
      top: '26%',
      opacityClass: 'opacity-35',
      durationMs: 175_000,
      startProgress: 0,
    },
    {
      id: 'drift-3',
      shape: 'drift',
      top: '14%',
      opacityClass: 'opacity-45',
      durationMs: 125_000,
      startProgress: 0.35,
      scaleClass: 'scale-75',
    },
  ];
