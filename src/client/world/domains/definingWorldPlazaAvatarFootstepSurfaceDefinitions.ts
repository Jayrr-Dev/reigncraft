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
 * @module components/world/domains/definingWorldPlazaAvatarFootstepSurfaceDefinitions
 */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS: Record<
  DefiningFilmcowFootstepSurfaceKind,
  DefiningFilmcowFootstepSurfaceDefinition
> = {
  grass: {
    walkClipIds: ['grass_light_01', 'grass_light_01'],
    runClipIds: ['grass_light_01', 'grass_light_01'],
    landingClipId: 'land_grass_02',
  },
  forest: {
    walkClipIds: ['forest_walk_01', 'forest_walk_02'],
    runClipIds: ['grass_light_01', 'grass_light_02'],
    landingClipId: 'land_grass_02',
  },
  gravel: {
    walkClipIds: [
      'nox_gravel_walk_02',
      'nox_gravel_walk_03',
      'nox_gravel_walk_04',
    ],
    runClipIds: ['nox_gravel_run_01', 'nox_gravel_run_02', 'nox_gravel_run_03'],
    landingClipId: 'nox_gravel_land_02',
  },
  sand: {
    walkClipIds: ['nox_sand_walk_01', 'nox_sand_walk_03', 'nox_sand_walk_04'],
    runClipIds: ['nox_sand_run_01', 'nox_sand_run_02', 'nox_sand_run_03'],
    landingClipId: 'nox_sand_land_02',
  },
  snow: {
    walkClipIds: [
      'nox_snow_walk_01',
      'nox_snow_walk_02',
      'nox_snow_walk_03',
      'nox_snow_walk_04',
    ],
    runClipIds: ['nox_snow_run_01', 'nox_snow_run_02', 'nox_snow_run_03'],
    landingClipId: 'nox_snow_land_02',
  },
  concrete: {
    walkClipIds: [
      'nox_rock_walk_01',
      'nox_rock_walk_02',
      'nox_rock_walk_03',
      'nox_rock_walk_04',
    ],
    runClipIds: ['nox_rock_run_01', 'nox_rock_run_02', 'nox_rock_run_03'],
    landingClipId: 'nox_rock_land_02',
  },
  mud: {
    walkClipIds: [
      'nox_mud_walk_01',
      'nox_mud_walk_02',
      'nox_mud_walk_03',
      'nox_mud_walk_04',
    ],
    runClipIds: ['nox_mud_run_01', 'nox_mud_run_02', 'nox_mud_run_03'],
    landingClipId: 'nox_mud_land_02',
  },
};

/** Short one-shots used when avatar run pools reuse walk-style clips. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_CLIP_IDS =
  DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_CLIP_IDS;
