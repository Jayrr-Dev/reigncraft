import {
  DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_CAMPFIRE,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_SPREADING,
  DEFINING_WORLD_PLAZA_FIRE_SPRITE_FRAME_COUNT,
  resolvingWorldPlazaFireFlameSheetUrl,
  resolvingWorldPlazaFireSmokeSheetUrl,
  type DefiningWorldPlazaFireIntensityTier,
} from '@/components/world/fire/domains/definingWorldPlazaFireSpriteConstants';
import { Assets, Rectangle, Texture } from 'pixi.js';

/**
 * How many fire sheets decode at once during boot. Full parallel loads of all
 * 15 sheets spike memory on mobile the same way unbounded wildlife preload did.
 */
const LOADING_WORLD_PLAZA_FIRE_SPRITE_PRELOAD_CONCURRENCY = 4;

/** Cached frame textures keyed by flame group+tier or smoke tier. */
const flameFrameCache = new Map<string, readonly Texture[]>();
const smokeFrameCache = new Map<string, readonly Texture[]>();
let preloadPromise: Promise<void> | null = null;

function buildingFireSpriteFrameCacheKey(
  prefix: string,
  groupOrTier: number,
  tier?: DefiningWorldPlazaFireIntensityTier
): string {
  return tier === undefined
    ? `${prefix}:${groupOrTier}`
    : `${prefix}:${groupOrTier}:${tier}`;
}

/**
 * Slices one horizontal sprite sheet into equal-width animation frames.
 *
 * @param sheetTexture - Loaded full sheet texture.
 */
function slicingWorldPlazaFireSheetIntoFrameTextures(
  sheetTexture: Texture
): readonly Texture[] {
  const frameWidth = Math.floor(
    sheetTexture.width / DEFINING_WORLD_PLAZA_FIRE_SPRITE_FRAME_COUNT
  );
  const frameHeight = sheetTexture.height;
  const frames: Texture[] = [];

  for (
    let frameIndex = 0;
    frameIndex < DEFINING_WORLD_PLAZA_FIRE_SPRITE_FRAME_COUNT;
    frameIndex += 1
  ) {
    frames.push(
      new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          frameIndex * frameWidth,
          0,
          frameWidth,
          frameHeight
        ),
      })
    );
  }

  return frames;
}

async function loadingWorldPlazaFireSheetFrameTextures(
  sheetUrl: string
): Promise<readonly Texture[]> {
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(`Fire sheet ${sheetUrl} did not load as a Texture.`);
  }

  return slicingWorldPlazaFireSheetIntoFrameTextures(loadedTexture);
}

/**
 * Returns cached flame frames when preload has already populated the cache.
 *
 * @param group - Flame sprite group.
 * @param tier - Intensity tier 1..5.
 */
export function peekingWorldPlazaFireFlameFrameTextures(
  group: number,
  tier: DefiningWorldPlazaFireIntensityTier
): readonly Texture[] | null {
  return (
    flameFrameCache.get(
      buildingFireSpriteFrameCacheKey('flame', group, tier)
    ) ?? null
  );
}

/**
 * Returns cached smoke frames when preload has already populated the cache.
 *
 * @param tier - Intensity tier 1..5.
 */
export function peekingWorldPlazaFireSmokeFrameTextures(
  tier: DefiningWorldPlazaFireIntensityTier
): readonly Texture[] | null {
  return (
    smokeFrameCache.get(buildingFireSpriteFrameCacheKey('smoke', tier)) ?? null
  );
}

/**
 * Returns cached flame frames for one group and intensity tier.
 *
 * @param group - Flame sprite group.
 * @param tier - Intensity tier 1..5.
 */
export async function resolvingWorldPlazaFireFlameFrameTextures(
  group: number,
  tier: DefiningWorldPlazaFireIntensityTier
): Promise<readonly Texture[]> {
  const cacheKey = buildingFireSpriteFrameCacheKey('flame', group, tier);
  const cached = flameFrameCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const frames = await loadingWorldPlazaFireSheetFrameTextures(
    resolvingWorldPlazaFireFlameSheetUrl(group, tier)
  );
  flameFrameCache.set(cacheKey, frames);

  return frames;
}

/**
 * Returns cached smoke frames for one intensity tier.
 *
 * @param tier - Intensity tier 1..5.
 */
export async function resolvingWorldPlazaFireSmokeFrameTextures(
  tier: DefiningWorldPlazaFireIntensityTier
): Promise<readonly Texture[]> {
  const cacheKey = buildingFireSpriteFrameCacheKey('smoke', tier);
  const cached = smokeFrameCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const frames = await loadingWorldPlazaFireSheetFrameTextures(
    resolvingWorldPlazaFireSmokeSheetUrl(tier)
  );
  smokeFrameCache.set(cacheKey, frames);

  return frames;
}

/**
 * Runs async load tasks with a bounded worker pool.
 */
async function loadingWorldPlazaFireSpriteTasksWithConcurrency(
  loadTasks: readonly (() => Promise<readonly Texture[]>)[],
  concurrency: number
): Promise<void> {
  let nextIndex = 0;

  async function loadingNextFireSpriteWorker(): Promise<void> {
    while (nextIndex < loadTasks.length) {
      const taskIndex = nextIndex;
      nextIndex += 1;
      await loadTasks[taskIndex]!();
    }
  }

  const workerCount = Math.min(concurrency, Math.max(loadTasks.length, 1));
  await Promise.all(
    Array.from({ length: workerCount }, () => loadingNextFireSpriteWorker())
  );
}

/**
 * Preloads all campfire, spreading, and smoke sprite tiers used in-game.
 */
export async function preloadingWorldPlazaFireSpriteTextures(): Promise<void> {
  if (preloadPromise) {
    return preloadPromise;
  }

  preloadPromise = (async () => {
    const tiers: DefiningWorldPlazaFireIntensityTier[] = [1, 2, 3, 4, 5];
    const loadTasks: Array<() => Promise<readonly Texture[]>> = [];

    for (const tier of tiers) {
      loadTasks.push(() =>
        resolvingWorldPlazaFireFlameFrameTextures(
          DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_CAMPFIRE,
          tier
        )
      );
      loadTasks.push(() =>
        resolvingWorldPlazaFireFlameFrameTextures(
          DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_SPREADING,
          tier
        )
      );
      loadTasks.push(() => resolvingWorldPlazaFireSmokeFrameTextures(tier));
    }

    await loadingWorldPlazaFireSpriteTasksWithConcurrency(
      loadTasks,
      LOADING_WORLD_PLAZA_FIRE_SPRITE_PRELOAD_CONCURRENCY
    );
  })();

  return preloadPromise;
}

/**
 * Returns true once every fire sprite tier has been cached.
 */
export function checkingWorldPlazaFireSpriteTexturesAreReady(): boolean {
  const tiers: DefiningWorldPlazaFireIntensityTier[] = [1, 2, 3, 4, 5];

  for (const tier of tiers) {
    if (
      !flameFrameCache.has(
        buildingFireSpriteFrameCacheKey(
          'flame',
          DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_CAMPFIRE,
          tier
        )
      ) ||
      !flameFrameCache.has(
        buildingFireSpriteFrameCacheKey(
          'flame',
          DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_SPREADING,
          tier
        )
      ) ||
      !smokeFrameCache.has(buildingFireSpriteFrameCacheKey('smoke', tier))
    ) {
      return false;
    }
  }

  return true;
}
