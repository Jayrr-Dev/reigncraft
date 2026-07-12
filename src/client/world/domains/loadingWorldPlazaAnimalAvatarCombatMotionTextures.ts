/**
 * Loads animal avatar combat sheets and slices each into per-direction rows.
 *
 * @module components/world/domains/loadingWorldPlazaAnimalAvatarCombatMotionTextures
 */

import {
  resolvingWorldPlazaAnimalAvatarCombatDefinition,
  type DefiningWorldPlazaAnimalAvatarCombatDefinition,
  type DefiningWorldPlazaAnimalAvatarCombatMotionClipSuffix,
} from '@/components/world/domains/definingWorldPlazaAnimalAvatarCombatRegistry';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirectionTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import { Assets, Rectangle, Texture } from 'pixi.js';

const loadingWorldPlazaAnimalAvatarCombatMotionTexturesPromises = new Map<
  string,
  Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures>
>();

/**
 * Slices one animal combat sheet into a per-direction row texture map.
 */
function slicingWorldPlazaAnimalAvatarSheetIntoDirectionTextures(
  sheetTexture: Texture,
  combatDefinition: DefiningWorldPlazaAnimalAvatarCombatDefinition
): DefiningWorldPlazaGirlSampleWalkDirectionTextures {
  const sheetRowWidthPx =
    combatDefinition.sheetColumnCount * combatDefinition.frameSizePx;
  const directionEntries = Object.entries(
    combatDefinition.directionRowIndex
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * combatDefinition.frameSizePx,
          sheetRowWidthPx,
          combatDefinition.frameSizePx
        ),
      });

      return [direction, rowTexture] as const;
    }
  );

  return Object.fromEntries(
    directionTextureEntries
  ) as DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

/**
 * Loads one animal combat motion on first use (Attack1 melee / Attack3 roll).
 */
export function loadingWorldPlazaAnimalAvatarCombatMotionTextures(
  skinId: DefiningWorldPlazaAvatarSkinId,
  motionKind: DefiningWorldPlazaAnimalAvatarCombatMotionClipSuffix
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const cacheKey = `${skinId}:${motionKind}`;
  const cachedPromise =
    loadingWorldPlazaAnimalAvatarCombatMotionTexturesPromises.get(cacheKey);

  if (cachedPromise) {
    return cachedPromise;
  }

  const combatDefinition =
    resolvingWorldPlazaAnimalAvatarCombatDefinition(skinId);

  if (!combatDefinition) {
    return Promise.reject(
      new Error(`No animal combat definition for skin ${skinId}.`)
    );
  }

  const sheetUrls =
    motionKind === 'roll'
      ? combatDefinition.roll.sheetUrls
      : combatDefinition.melee.sheetUrls;

  const loadingPromise = (async () => {
    let lastError: unknown = null;

    for (const sheetUrl of sheetUrls) {
      try {
        const loadedTexture = await Assets.load<Texture>(sheetUrl);

        if (loadedTexture instanceof Texture) {
          return slicingWorldPlazaAnimalAvatarSheetIntoDirectionTextures(
            loadedTexture,
            combatDefinition
          );
        }
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `Animal combat sheets failed to load for ${skinId} ${motionKind}: ${sheetUrls.join(', ')} (${String(lastError)})`
    );
  })().catch((error: unknown) => {
    if (
      loadingWorldPlazaAnimalAvatarCombatMotionTexturesPromises.get(
        cacheKey
      ) === loadingPromise
    ) {
      loadingWorldPlazaAnimalAvatarCombatMotionTexturesPromises.delete(
        cacheKey
      );
    }

    throw error;
  });

  loadingWorldPlazaAnimalAvatarCombatMotionTexturesPromises.set(
    cacheKey,
    loadingPromise
  );
  return loadingPromise;
}
