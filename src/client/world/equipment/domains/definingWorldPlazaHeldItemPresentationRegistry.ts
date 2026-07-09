/**
 * Declarative held-item sprite presentation for 8-direction tool sheets.
 *
 * @module components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type {
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';

export const DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL =
  '/tools-8dir' as const;

/** Cell size on all shipped tool sheets (64×128 or 64×144). */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_FRAME_SIZE_PX = 16;

/** Facing rows on tool sheets (Up-first, clockwise). */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_ROW_INDEX: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  number
> = {
  Up: 0,
  UpRight: 1,
  Right: 2,
  DownRight: 3,
  Down: 4,
  DownLeft: 5,
  Left: 6,
  UpLeft: 7,
};

export type DefiningWorldPlazaHeldItemPresentationEntry = {
  readonly sheetUrl: string;
  readonly anchorX: number;
  readonly anchorY: number;
  readonly offsetScreenPxX: number;
  readonly offsetScreenPxY: number;
  /** Multiplied by avatar effective sprite scale. */
  readonly scaleMultiplier: number;
  readonly zIndexOffset: number;
};

/**
 * Per-facing pose for the held item relative to the avatar grid anchor.
 * Offsets are avatar-frame px (multiplied by effective sprite scale).
 */
export type DefiningWorldPlazaHeldItemDirectionPose = {
  readonly offsetAvatarFramePxX: number;
  readonly offsetAvatarFramePxY: number;
  /** Draw behind the avatar body (facing-away rows). */
  readonly behindAvatar: boolean;
  /** Carry tilt so the tool reads as held, not floating upright. */
  readonly rotationRadians: number;
};

/**
 * Hand placement per facing. Right-handed carry: screen-right when facing
 * the camera, mirrored to screen-left when facing away or left.
 */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_POSE: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  DefiningWorldPlazaHeldItemDirectionPose
> = {
  Down: {
    offsetAvatarFramePxX: 17,
    offsetAvatarFramePxY: 18,
    behindAvatar: false,
    rotationRadians: 0.32,
  },
  DownRight: {
    offsetAvatarFramePxX: 21,
    offsetAvatarFramePxY: 14,
    behindAvatar: false,
    rotationRadians: 0.45,
  },
  Right: {
    offsetAvatarFramePxX: 23,
    offsetAvatarFramePxY: 10,
    behindAvatar: false,
    rotationRadians: 0.55,
  },
  UpRight: {
    offsetAvatarFramePxX: 15,
    offsetAvatarFramePxY: 6,
    behindAvatar: true,
    rotationRadians: 0.45,
  },
  Up: {
    offsetAvatarFramePxX: -15,
    offsetAvatarFramePxY: 6,
    behindAvatar: true,
    rotationRadians: -0.32,
  },
  UpLeft: {
    offsetAvatarFramePxX: -15,
    offsetAvatarFramePxY: 6,
    behindAvatar: true,
    rotationRadians: -0.45,
  },
  Left: {
    offsetAvatarFramePxX: -23,
    offsetAvatarFramePxY: 10,
    behindAvatar: false,
    rotationRadians: -0.55,
  },
  DownLeft: {
    offsetAvatarFramePxX: -21,
    offsetAvatarFramePxY: 14,
    behindAvatar: false,
    rotationRadians: -0.45,
  },
};

const DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS = {
  anchorX: 0.5,
  anchorY: 0.82,
  offsetScreenPxX: 0,
  offsetScreenPxY: 0,
  scaleMultiplier: 5.5,
  zIndexOffset: 1,
} as const;

/** One runtime PNG per visual id. */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY: Record<
  DefiningWorldPlazaHeldItemVisualId,
  DefiningWorldPlazaHeldItemPresentationEntry
> = {
  sword: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/swords.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
  },
  axe: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/axes.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxY: 2,
  },
  hoe: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/hoes.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxY: 2,
  },
  scythe: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/scythes.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxY: -2,
    scaleMultiplier: 6,
  },
  fishrod: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/fishrods.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxX: 2,
    offsetScreenPxY: 4,
    scaleMultiplier: 5,
  },
};

export type DefiningWorldPlazaHeldItemPresentation = {
  readonly visualId: DefiningWorldPlazaHeldItemVisualId;
  readonly tier: DefiningWorldPlazaHeldItemTier;
  readonly entry: DefiningWorldPlazaHeldItemPresentationEntry;
};
