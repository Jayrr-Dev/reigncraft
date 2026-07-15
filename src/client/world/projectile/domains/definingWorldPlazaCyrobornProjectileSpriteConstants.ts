/**
 * Cyroborn ice projectile sprite sheet layout (4×1 @ 64px cells).
 *
 * @module components/world/projectile/domains/definingWorldPlazaCyrobornProjectileSpriteConstants
 */

import { DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION } from '@/components/world/domains/definingPublicSpriteAssetExtension';

export const DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_COLUMNS = 4;
export const DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_ROWS = 1;
export const DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CELL_SIZE_PX = 64;

/** Public URL for the packed Cyroborn ice projectile sheet. */
export const DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_URL = `/effects/sprites/projectiles/cyroborn-ice-projectiles${DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION}`;

export const DEFINING_WORLD_PLAZA_CYROBORN_ICE_BOLT_CLIP_ID =
  'cyroborn-ice-bolt' as const;
export const DEFINING_WORLD_PLAZA_CYROBORN_ICE_SPHERE_CLIP_ID =
  'cyroborn-ice-sphere' as const;
export const DEFINING_WORLD_PLAZA_CYROBORN_SHATTER_ORB_CLIP_ID =
  'cyroborn-shatter-orb' as const;
export const DEFINING_WORLD_PLAZA_CYROBORN_ICE_SHARD_CLIP_ID =
  'cyroborn-ice-shard' as const;

export type DefiningWorldPlazaCyrobornProjectileClipId =
  | typeof DEFINING_WORLD_PLAZA_CYROBORN_ICE_BOLT_CLIP_ID
  | typeof DEFINING_WORLD_PLAZA_CYROBORN_ICE_SPHERE_CLIP_ID
  | typeof DEFINING_WORLD_PLAZA_CYROBORN_SHATTER_ORB_CLIP_ID
  | typeof DEFINING_WORLD_PLAZA_CYROBORN_ICE_SHARD_CLIP_ID;

/** Column index in the 4×1 sheet (left → right). */
export const DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CLIP_COLUMN_INDEX: Readonly<
  Record<DefiningWorldPlazaCyrobornProjectileClipId, number>
> = {
  [DEFINING_WORLD_PLAZA_CYROBORN_ICE_BOLT_CLIP_ID]: 0,
  [DEFINING_WORLD_PLAZA_CYROBORN_ICE_SPHERE_CLIP_ID]: 1,
  [DEFINING_WORLD_PLAZA_CYROBORN_SHATTER_ORB_CLIP_ID]: 2,
  [DEFINING_WORLD_PLAZA_CYROBORN_ICE_SHARD_CLIP_ID]: 3,
};

/**
 * True when a projectile clip id has a dedicated Cyroborn ice sprite cell.
 */
export function checkingWorldPlazaCyrobornProjectileClipId(
  clipId: string
): clipId is DefiningWorldPlazaCyrobornProjectileClipId {
  return clipId in DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CLIP_COLUMN_INDEX;
}
