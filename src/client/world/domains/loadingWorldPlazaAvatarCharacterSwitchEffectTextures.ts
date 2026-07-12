/**
 * Loads and caches Buff1 frame textures for the character-switch VFX.
 *
 * @module components/world/domains/loadingWorldPlazaAvatarCharacterSwitchEffectTextures
 */

import {
  DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FRAME_COUNT,
  DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_SHEET_URL,
} from '@/components/world/domains/definingWorldPlazaAvatarCharacterSwitchEffectConstants';
import { Assets, Rectangle, Texture } from 'pixi.js';

let frameTextures: readonly Texture[] | null = null;
let loadPromise: Promise<readonly Texture[]> | null = null;

function slicingWorldPlazaAvatarCharacterSwitchEffectSheet(
  sheetTexture: Texture
): readonly Texture[] {
  const frameWidth = Math.floor(
    sheetTexture.width /
      DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FRAME_COUNT
  );
  const frameHeight = sheetTexture.height;
  const frames: Texture[] = [];

  for (
    let frameIndex = 0;
    frameIndex <
    DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FRAME_COUNT;
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

/**
 * Returns cached Buff1 frames when already loaded.
 */
export function peekingWorldPlazaAvatarCharacterSwitchEffectFrameTextures():
  | readonly Texture[]
  | null {
  return frameTextures;
}

/**
 * Loads the Buff1 sheet once and returns sliced frame textures.
 */
export async function loadingWorldPlazaAvatarCharacterSwitchEffectTextures(): Promise<
  readonly Texture[]
> {
  if (frameTextures) {
    return frameTextures;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const loadedTexture = await Assets.load<Texture>(
      DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_SHEET_URL
    );

    if (!(loadedTexture instanceof Texture)) {
      throw new Error(
        `Character switch effect sheet ${DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_SHEET_URL} did not load as a Texture.`
      );
    }

    frameTextures =
      slicingWorldPlazaAvatarCharacterSwitchEffectSheet(loadedTexture);
    return frameTextures;
  })();

  try {
    return await loadPromise;
  } finally {
    loadPromise = null;
  }
}
