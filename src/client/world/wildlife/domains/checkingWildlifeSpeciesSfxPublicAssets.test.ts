import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  DEFINING_WILDLIFE_BEAST_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG,
} from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import {
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import {
  DEFINING_WILDLIFE_MIXKIT_WILD_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG,
} from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../..'
);
const publicDir = path.join(repoRoot, 'public');

function resolvingWildlifeSpeciesSfxPublicFilePath(
  baseUrl: string,
  fileName: string
): string {
  const relativePath = `${baseUrl}/${fileName}`
    .split('/')
    .filter((segment) => segment.length > 0)
    .join(path.sep);

  return path.join(publicDir, relativePath);
}

describe('checkingWildlifeSpeciesSfxPublicAssets', () => {
  it('ships every catalogued wildlife vocal clip under public/', () => {
    const missingPaths: string[] = [];

    for (const clip of Object.values(
      DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG
    )) {
      const filePath = resolvingWildlifeSpeciesSfxPublicFilePath(
        DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ASSET_BASE_URL,
        clip.fileName
      );

      if (!existsSync(filePath)) {
        missingPaths.push(path.relative(repoRoot, filePath));
      }
    }

    for (const clip of Object.values(
      DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG
    )) {
      const filePath = resolvingWildlifeSpeciesSfxPublicFilePath(
        DEFINING_WILDLIFE_MIXKIT_WILD_SFX_ASSET_BASE_URL,
        clip.fileName
      );

      if (!existsSync(filePath)) {
        missingPaths.push(path.relative(repoRoot, filePath));
      }
    }

    for (const clip of Object.values(
      DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG
    )) {
      const filePath = resolvingWildlifeSpeciesSfxPublicFilePath(
        DEFINING_WILDLIFE_BEAST_SFX_ASSET_BASE_URL,
        clip.fileName
      );

      if (!existsSync(filePath)) {
        missingPaths.push(path.relative(repoRoot, filePath));
      }
    }

    expect(missingPaths).toEqual([]);
  });
});
