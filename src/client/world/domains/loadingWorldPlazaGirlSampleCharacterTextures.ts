import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_DIRECTION_URLS,
} from "@/components/world/domains/definingWorldPlazaGirlSampleIdleConstants";
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DIRECTION_URLS,
} from "@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants";
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_URLS,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import { Assets, Texture } from "pixi.js";

/** Loaded direction strip textures keyed by walk direction. */
export type DefiningWorldPlazaGirlSampleWalkDirectionTextures = Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  Texture
>;

/** Walk, run, jump, and idle direction strips for the GirlSample plaza avatar. */
export interface DefiningWorldPlazaGirlSampleCharacterTextures {
  walk: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  run: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  jump: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
  idle: DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

/**
 * Loads one set of GirlSample direction strips.
 *
 * @param directionUrls - Public URLs keyed by screen direction.
 */
async function loadingWorldPlazaGirlSampleDirectionTextures(
  directionUrls: Record<DefiningWorldPlazaGirlSampleWalkDirection, string>,
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const directionEntries = Object.entries(directionUrls) as Array<
    [DefiningWorldPlazaGirlSampleWalkDirection, string]
  >;

  const loadedEntries = await Promise.all(
    directionEntries.map(async ([direction, assetUrl]) => {
      const loadedTexture = await Assets.load<Texture>(assetUrl);

      if (!(loadedTexture instanceof Texture)) {
        throw new Error(
          `GirlSample texture for ${direction} did not load as a Texture.`,
        );
      }

      return [direction, loadedTexture] as const;
    }),
  );

  return Object.fromEntries(loadedEntries) as DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

/**
 * Loads GirlSample walk, run, jump, and idle direction strips for the plaza avatar.
 */
export async function loadingWorldPlazaGirlSampleCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const [walk, run, jump, idle] = await Promise.all([
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_URLS,
    ),
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_DIRECTION_URLS,
    ),
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DIRECTION_URLS,
    ),
    loadingWorldPlazaGirlSampleDirectionTextures(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_DIRECTION_URLS,
    ),
  ]);

  return { walk, run, jump, idle };
}
