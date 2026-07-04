export type PlazaHomeScreenCloudShape =
  | 'cumulus'
  | 'stratus'
  | 'tower'
  | 'wisp'
  | 'billow'
  | 'broken'
  | 'cluster';

export type PlazaHomeScreenCloudDefinition = {
  id: string;
  shape: PlazaHomeScreenCloudShape;
  top: string;
  opacityClass: string;
  durationMs: number;
  startOffsetMs: number;
  sizeClass?: string;
};

/** Drifting cloud layer definitions for the home screen poster sky. */
export const DEFINING_PLAZA_HOME_SCREEN_CLOUD_LAYER: PlazaHomeScreenCloudDefinition[] =
  [
    {
      id: 'cumulus-1',
      shape: 'cumulus',
      top: '9%',
      opacityClass: 'opacity-85',
      durationMs: 58_000,
      startOffsetMs: 12_000,
    },
    {
      id: 'stratus-1',
      shape: 'stratus',
      top: '18%',
      opacityClass: 'opacity-70',
      durationMs: 92_000,
      startOffsetMs: 34_000,
    },
    {
      id: 'tower-1',
      shape: 'tower',
      top: '24%',
      opacityClass: 'opacity-80',
      durationMs: 74_000,
      startOffsetMs: 48_000,
    },
    {
      id: 'wisp-1',
      shape: 'wisp',
      top: '12%',
      opacityClass: 'opacity-50',
      durationMs: 118_000,
      startOffsetMs: 71_000,
    },
    {
      id: 'billow-1',
      shape: 'billow',
      top: '30%',
      opacityClass: 'opacity-75',
      durationMs: 68_000,
      startOffsetMs: 22_000,
    },
    {
      id: 'broken-1',
      shape: 'broken',
      top: '21%',
      opacityClass: 'opacity-65',
      durationMs: 105_000,
      startOffsetMs: 86_000,
    },
    {
      id: 'cluster-1',
      shape: 'cluster',
      top: '33%',
      opacityClass: 'opacity-60',
      durationMs: 82_000,
      startOffsetMs: 41_000,
    },
    {
      id: 'cumulus-2',
      shape: 'cumulus',
      top: '15%',
      opacityClass: 'opacity-55',
      durationMs: 130_000,
      startOffsetMs: 63_000,
      sizeClass: 'h-6 w-28',
    },
    {
      id: 'stratus-2',
      shape: 'stratus',
      top: '27%',
      opacityClass: 'opacity-45',
      durationMs: 145_000,
      startOffsetMs: 95_000,
      sizeClass: 'h-4 w-36',
    },
  ];
