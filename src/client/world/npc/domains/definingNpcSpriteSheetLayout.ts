/**
 * NPC sprite sheet layout (15×8 character-creator packs).
 *
 * @module components/world/npc/domains/definingNpcSpriteSheetLayout
 */

import type { DefiningWorldPlazaGirlSampleMotionSheetLayout } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

export const DEFINING_NPC_ASSET_BASE_URL = '/creatures/sprites/npcs' as const;

export const DEFINING_NPC_SHEET_COLUMN_COUNT = 15;
export const DEFINING_NPC_SHEET_ROW_COUNT = 8;

export type DefiningNpcLoadedMotionClipKind =
  | 'idle'
  | 'walk'
  | 'run'
  | 'attack'
  | 'takeDamage'
  | 'die';

export type DefiningNpcMotionClipKind = DefiningNpcLoadedMotionClipKind;

export const DEFINING_NPC_MOTION_SHEET_FILE_NAMES: Record<
  DefiningNpcLoadedMotionClipKind,
  readonly string[]
> = {
  idle: ['Idle.webp'],
  walk: ['Walk.webp', 'Run.webp', 'Idle.webp'],
  run: ['Run.webp', 'Walk.webp', 'Idle.webp'],
  attack: ['Attack.webp', 'Idle.webp'],
  takeDamage: ['TakeDamage.webp', 'Idle.webp'],
  die: ['Die.webp', 'TakeDamage.webp', 'Idle.webp'],
};

/** Same row order as wildlife / husky packs. */
export const DEFINING_NPC_DIRECTION_ROW_INDEX: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  number
> = {
  Right: 0,
  UpRight: 7,
  Up: 6,
  UpLeft: 5,
  Left: 4,
  DownLeft: 3,
  Down: 2,
  DownRight: 1,
};

export function definingNpcMotionSheetLayout(
  frameWidthPx: number,
  frameHeightPx: number
): DefiningWorldPlazaGirlSampleMotionSheetLayout {
  return {
    columnCount: DEFINING_NPC_SHEET_COLUMN_COUNT,
    frameCount: DEFINING_NPC_SHEET_COLUMN_COUNT,
    frameWidthPx,
    frameHeightPx,
  };
}

export const DEFINING_NPC_MOTION_FPS: Record<
  DefiningNpcMotionClipKind,
  number
> = {
  idle: 8,
  walk: 14,
  run: 18,
  attack: 16,
  takeDamage: 12,
  die: 10,
};

export function buildingNpcMotionSheetUrls(
  spriteFolder: string,
  motionKind: DefiningNpcLoadedMotionClipKind
): readonly string[] {
  const encodedFolder = spriteFolder
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  const fileNames = DEFINING_NPC_MOTION_SHEET_FILE_NAMES[motionKind] ?? [];

  return fileNames.map(
    (fileName) => `${DEFINING_NPC_ASSET_BASE_URL}/${encodedFolder}/${fileName}`
  );
}
