import { peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrl } from '@/components/world/building/domains/loadingWorldPlazaBlacksmithUtilitySpriteTextures';
import {
  DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_WORLD_SPRITE_URL,
  type DefiningWorldPlazaSurvivalShelterKind,
} from '@/components/world/building/domains/definingWorldPlazaSurvivalShelterSpriteConstants';
import type { Texture } from 'pixi.js';

const textureByUrl = new Map<string, Texture>();

export function peekingWorldPlazaSurvivalShelterSpriteTextureForKind(
  shelterKind: DefiningWorldPlazaSurvivalShelterKind
): Texture | null {
  const url = DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_WORLD_SPRITE_URL[shelterKind];
  const cached = textureByUrl.get(url);

  if (cached) {
    return cached;
  }

  const texture = peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrl(url);

  if (texture) {
    textureByUrl.set(url, texture);
  }

  return texture;
}
