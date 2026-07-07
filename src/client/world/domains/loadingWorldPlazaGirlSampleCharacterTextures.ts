import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DIRECTION_URLS,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_DIRECTION_URLS } from '@/components/world/domains/definingWorldPlazaGirlSampleIdleConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DIRECTION_URLS } from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_URLS,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { Assets, Texture } from 'pixi.js';

/** Loaded direction strip textures keyed by walk direction. */
export type DefiningWorldPlazaGirlSampleWalkDirectionTextures = Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  Texture
>;

/** Walk, run, jump, idle, and optional combat direction strips. */
export interface DefiningWorldPlazaGirlSampleCharacterTextures {
  walk: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  run: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  jump: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  idle: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  roll?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  melee?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  damaged?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  death?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  push?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  boost?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  block?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

/**
 * Loads one set of GirlSample direction strips.
 *
 * @param directionUrls - Public URLs keyed by screen direction.
 */
async function loadingWorldPlazaGirlSampleDirectionTextures(
  directionUrls: Record<DefiningWorldPlazaGirlSampleWalkDirection, string>
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const directionEntries = Object.entries(directionUrls) as Array<
    [DefiningWorldPlazaGirlSampleWalkDirection, string]
  >;

  const loadedEntries = await Promise.all(
    directionEntries.map(async ([direction, assetUrl]) => {
      const loadedTexture = await Assets.load<Texture>(assetUrl);

      if (!(loadedTexture instanceof Texture)) {
        throw new Error(
          `GirlSample texture for ${direction} did not load as a Texture.`
        );
      }

      return [direction, loadedTexture] as const;
    })
  );

  return Object.fromEntries(
    loadedEntries
  ) as DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

/**
 * Loads optional combat strips without failing locomotion when one set 404s.
 */
async function tryingWorldPlazaGirlSampleOptionalDirectionTextures(
  directionUrls: Record<DefiningWorldPlazaGirlSampleWalkDirection, string>
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures | undefined> {
  try {
    return await loadingWorldPlazaGirlSampleDirectionTextures(directionUrls);
  } catch {
    return undefined;
  }
}

/**
 * Loads GirlSample walk, run, jump, idle, and best-effort combat direction strips.
 */
export async function loadingWorldPlazaGirlSampleCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const [walk, run, jump, idle] = await Promise.all([
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_URLS
    ),
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_DIRECTION_URLS
    ),
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DIRECTION_URLS
    ),
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_DIRECTION_URLS
    ),
  ]);

  const [roll, melee, damaged, death, push, boost, block] = await Promise.all([
    tryingWorldPlazaGirlSampleOptionalDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DIRECTION_URLS
    ),
    tryingWorldPlazaGirlSampleOptionalDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_DIRECTION_URLS
    ),
    tryingWorldPlazaGirlSampleOptionalDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DIRECTION_URLS
    ),
    tryingWorldPlazaGirlSampleOptionalDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_DIRECTION_URLS
    ),
    tryingWorldPlazaGirlSampleOptionalDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DIRECTION_URLS
    ),
    tryingWorldPlazaGirlSampleOptionalDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_DIRECTION_URLS
    ),
    tryingWorldPlazaGirlSampleOptionalDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_DIRECTION_URLS
    ),
  ]);

  return {
    walk,
    run,
    jump,
    idle,
    roll,
    melee,
    damaged,
    death,
    push,
    boost,
    block,
  };
}
