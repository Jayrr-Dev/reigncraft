/**
 * Loads Fox Peach per-direction walk and idle strips for the plaza avatar.
 *
 * Run and jump reuse the walk strips because the asset pack has no dedicated
 * motion sheets for those states.
 *
 * @module components/world/domains/loadingWorldPlazaFoxPeachCharacterTextures
 */

import {
  DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_DIRECTION_URLS,
} from "@/components/world/domains/definingWorldPlazaFoxPeachSpriteConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type {
  DefiningWorldPlazaGirlSampleCharacterTextures,
  DefiningWorldPlazaGirlSampleWalkDirectionTextures,
} from "@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures";
import { Assets, Texture } from "pixi.js";

/**
 * Loads one set of Fox Peach direction strips.
 *
 * @param directionUrls - Public URLs keyed by screen direction.
 */
async function loadingWorldPlazaFoxPeachDirectionTextures(
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
          `Fox Peach texture for ${direction} did not load as a Texture.`,
        );
      }

      return [direction, loadedTexture] as const;
    }),
  );

  return Object.fromEntries(
    loadedEntries,
  ) as DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

/**
 * Loads Fox Peach walk, run, jump, and idle direction strips for the plaza avatar.
 */
export async function loadingWorldPlazaFoxPeachCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const walk = await loadingWorldPlazaFoxPeachDirectionTextures(
    DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_DIRECTION_URLS,
  );
  const idle = await loadingWorldPlazaFoxPeachDirectionTextures(
    DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_DIRECTION_URLS,
  );

  return {
    walk,
    run: walk,
    jump: walk,
    idle,
  };
}
