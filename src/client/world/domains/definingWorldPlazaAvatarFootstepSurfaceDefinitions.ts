import type {
  DefiningFilmcowFootstepSurfaceDefinition,
  DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_CLIP_IDS } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * Avatar-only footstep clip pools.
 *
 * FilmCow "run" exports are long composite tracks, not single steps. Avatar
 * locomotion uses short one-shots that fit the walk/run cadence without overlap.
 *
 * Volume knobs (all optional, default 1):
 * - `volume` — whole surface
 * - `walkVolume` / `runVolume` / `landingVolume` — group
 * - `{ id, volume }` on one clip — that step only
 *
 * Final loudness = base × surface × group × clip × SFX slider.
 *
 * @module components/world/domains/definingWorldPlazaAvatarFootstepSurfaceDefinitions
 */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS: Record<
  DefiningFilmcowFootstepSurfaceKind,
  DefiningFilmcowFootstepSurfaceDefinition
> = {
  grass: {
    walkClipIds: ['grass_light_01', { id: 'grass_light_02', volume: 0.85 }],
    runClipIds: ['grass_light_01', { id: 'grass_light_02', volume: 0.85 }],
    landingClipId: { id: 'land_grass_02', volume: 1 },
    walkVolume: 1,
    runVolume: 0.9,
    landingVolume: 0.75,
  },
  forest: {
    walkClipIds: ['forest_walk_01', { id: 'forest_walk_02', volume: 0.85 }],
    runClipIds: ['grass_light_01', { id: 'grass_light_02', volume: 0.85 }],
    landingClipId: { id: 'land_grass_02', volume: 1 },
    walkVolume: 1,
    runVolume: 0.9,
    landingVolume: 0.75,
  },
  gravel: {
    walkClipIds: [
      'nox_gravel_walk_02',
      { id: 'nox_gravel_walk_03', volume: 0.85 },
      'nox_gravel_walk_04',
    ],
    runClipIds: [
      'nox_gravel_run_01',
      { id: 'nox_gravel_run_02', volume: 0.85 },
      'nox_gravel_run_03',
    ],
    landingClipId: { id: 'nox_gravel_land_02', volume: 1 },
    walkVolume: 1,
    runVolume: 0.9,
    landingVolume: 0.75,
  },
  sand: {
    walkClipIds: [
      'nox_sand_walk_01',
      { id: 'nox_sand_walk_03', volume: 0.85 },
      'nox_sand_walk_04',
    ],
    runClipIds: [
      'nox_sand_run_01',
      { id: 'nox_sand_run_02', volume: 0.85 },
      'nox_sand_run_03',
    ],
    landingClipId: { id: 'nox_sand_land_02', volume: 1 },
    walkVolume: 1,
    runVolume: 0.9,
    landingVolume: 0.75,
  },
  snow: {
    walkClipIds: [
      'nox_snow_walk_01',
      { id: 'nox_snow_walk_02', volume: 0.85 },
      'nox_snow_walk_03',
      { id: 'nox_snow_walk_04', volume: 0.85 },
    ],
    runClipIds: [
      'nox_snow_run_01',
      { id: 'nox_snow_run_02', volume: 0.85 },
      'nox_snow_run_03',
    ],
    landingClipId: { id: 'nox_snow_land_02', volume: 1 },
    walkVolume: 1,
    runVolume: 0.9,
    landingVolume: 0.75,
  },
  concrete: {
    walkClipIds: [
      'nox_rock_walk_01',
      { id: 'nox_rock_walk_02', volume: 0.85 },
      'nox_rock_walk_03',
      { id: 'nox_rock_walk_04', volume: 0.85 },
    ],
    runClipIds: [
      'nox_rock_run_01',
      { id: 'nox_rock_run_02', volume: 0.85 },
      'nox_rock_run_03',
    ],
    landingClipId: { id: 'nox_rock_land_02', volume: 1 },
    walkVolume: 1,
    runVolume: 0.9,
    landingVolume: 0.75,
  },
  mud: {
    walkClipIds: [
      'nox_mud_walk_01',
      { id: 'nox_mud_walk_02', volume: 0.85 },
      'nox_mud_walk_03',
      { id: 'nox_mud_walk_04', volume: 0.85 },
    ],
    runClipIds: [
      'nox_mud_run_01',
      { id: 'nox_mud_run_02', volume: 0.85 },
      'nox_mud_run_03',
    ],
    landingClipId: { id: 'nox_mud_land_02', volume: 1 },
    walkVolume: 1,
    runVolume: 0.9,
    landingVolume: 0.75,
  },
};

/** Short one-shots used when avatar run pools reuse walk-style clips. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_CLIP_IDS =
  DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_CLIP_IDS;
