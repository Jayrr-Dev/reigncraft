import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DIRECTION_URLS,
  type DefiningWorldPlazaGirlSampleCombatMotionClipSuffix,
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
export type DefiningWorldPlazaGirlSampleCharacterTextures = {
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
};

/** Optional combat strips loaded after locomotion. */
export type DefiningWorldPlazaGirlSampleCombatCharacterTextures = {
  roll?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  melee?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  damaged?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  death?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  push?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  boost?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  block?: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
};

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_DIRECTION_URLS_BY_MOTION: Record<
  DefiningWorldPlazaGirlSampleCombatMotionClipSuffix,
  Record<DefiningWorldPlazaGirlSampleWalkDirection, string>
> = {
  roll: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DIRECTION_URLS,
  melee: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_DIRECTION_URLS,
  damaged: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DIRECTION_URLS,
  death: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_DIRECTION_URLS,
  push: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DIRECTION_URLS,
  boost: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_DIRECTION_URLS,
  block: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_DIRECTION_URLS,
};

const loadingWorldPlazaGirlSampleCombatMotionTexturesPromises = new Map<
  DefiningWorldPlazaGirlSampleCombatMotionClipSuffix,
  Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures>
>();

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

function checkingWorldPlazaGirlSampleCombatTexturesPresent(
  textures: DefiningWorldPlazaGirlSampleCharacterTextures
): boolean {
  return Boolean(
    textures.roll &&
    textures.melee &&
    textures.damaged &&
    textures.death &&
    textures.push &&
    textures.boost &&
    textures.block
  );
}

/**
 * Loads GirlSample walk, run, jump, and idle strips only.
 *
 * Combat strips stay deferred until first combat need so boot stays light on
 * mobile (up to 56 extra PNGs otherwise).
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

  return {
    walk,
    run,
    jump,
    idle,
  };
}

/**
 * Loads one GirlSample combat motion on first use.
 */
export function loadingWorldPlazaGirlSampleCombatMotionTextures(
  motionKind: DefiningWorldPlazaGirlSampleCombatMotionClipSuffix
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const cachedPromise =
    loadingWorldPlazaGirlSampleCombatMotionTexturesPromises.get(motionKind);

  if (cachedPromise) {
    return cachedPromise;
  }

  const loadingPromise = loadingWorldPlazaGirlSampleDirectionTextures(
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_DIRECTION_URLS_BY_MOTION[motionKind]
  ).catch((error: unknown) => {
    if (
      loadingWorldPlazaGirlSampleCombatMotionTexturesPromises.get(
        motionKind
      ) === loadingPromise
    ) {
      loadingWorldPlazaGirlSampleCombatMotionTexturesPromises.delete(
        motionKind
      );
    }

    throw error;
  });

  loadingWorldPlazaGirlSampleCombatMotionTexturesPromises.set(
    motionKind,
    loadingPromise
  );
  return loadingPromise;
}

async function tryingWorldPlazaGirlSampleCombatMotionTextures(
  motionKind: DefiningWorldPlazaGirlSampleCombatMotionClipSuffix
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures | undefined> {
  try {
    return await loadingWorldPlazaGirlSampleCombatMotionTextures(motionKind);
  } catch {
    return undefined;
  }
}

/**
 * Loads GirlSample combat direction strips (best-effort per motion).
 */
export async function loadingWorldPlazaGirlSampleCombatCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCombatCharacterTextures> {
  const [roll, melee, damaged, death, push, boost, block] = await Promise.all([
    tryingWorldPlazaGirlSampleCombatMotionTextures('roll'),
    tryingWorldPlazaGirlSampleCombatMotionTextures('melee'),
    tryingWorldPlazaGirlSampleCombatMotionTextures('damaged'),
    tryingWorldPlazaGirlSampleCombatMotionTextures('death'),
    tryingWorldPlazaGirlSampleCombatMotionTextures('push'),
    tryingWorldPlazaGirlSampleCombatMotionTextures('boost'),
    tryingWorldPlazaGirlSampleCombatMotionTextures('block'),
  ]);

  return {
    roll,
    melee,
    damaged,
    death,
    push,
    boost,
    block,
  };
}

/**
 * Attaches combat strips onto a core locomotion texture set when missing.
 */
export async function ensuringWorldPlazaGirlSampleCharacterTexturesWithCombat(
  textures: DefiningWorldPlazaGirlSampleCharacterTextures
): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  if (checkingWorldPlazaGirlSampleCombatTexturesPresent(textures)) {
    return textures;
  }

  const combatTextures =
    await loadingWorldPlazaGirlSampleCombatCharacterTextures();

  return {
    ...textures,
    ...combatTextures,
  };
}
