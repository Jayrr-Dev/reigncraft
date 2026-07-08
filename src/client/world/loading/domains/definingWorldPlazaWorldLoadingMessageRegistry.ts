/**
 * Percent-threshold status messages for the world loading screen.
 *
 * @module components/world/loading/domains/definingWorldPlazaWorldLoadingMessageRegistry
 */

/** One status line shown from `minPercent` until the next threshold. */
export type DefiningWorldPlazaWorldLoadingMessage = {
  readonly minPercent: number;
  readonly message: string;
};

/** Ordered by ascending `minPercent`; the last matching entry wins. */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MESSAGE_REGISTRY: readonly DefiningWorldPlazaWorldLoadingMessage[] =
  [
    { minPercent: 0, message: 'Waking up the world...' },
    { minPercent: 8, message: 'Unpacking the game engine...' },
    { minPercent: 20, message: 'Shaping terrain, water, and lava...' },
    { minPercent: 35, message: 'Stitching avatar sprites...' },
    { minPercent: 55, message: 'Releasing the wildlife...' },
    { minPercent: 78, message: 'Teaching the wolves to howl...' },
    { minPercent: 88, message: 'Lighting the campfires...' },
    { minPercent: 96, message: 'Opening the plaza gates...' },
  ];

/**
 * Resolves the status message for the current loading percent.
 *
 * @param percentLoaded - Overall progress from 0 to 100.
 */
export function resolvingWorldPlazaWorldLoadingMessageForPercent(
  percentLoaded: number
): string {
  let resolvedMessage =
    DEFINING_WORLD_PLAZA_WORLD_LOADING_MESSAGE_REGISTRY[0]?.message ??
    'Loading...';

  for (const entry of DEFINING_WORLD_PLAZA_WORLD_LOADING_MESSAGE_REGISTRY) {
    if (percentLoaded >= entry.minPercent) {
      resolvedMessage = entry.message;
    }
  }

  return resolvedMessage;
}
