import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND = {
  SHADE_LEAN_TO: 'shade-lean-to',
  BRUSH_WINDBREAK: 'brush-windbreak',
  SCOUT_TENT: 'scout-tent',
  CLAIM_BEDROLL: 'claim-bedroll',
  SMOKE_RACK: 'smoke-rack',
} as const;

export type DefiningWorldPlazaSurvivalShelterKind =
  (typeof DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND)[keyof typeof DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND];

export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_WORLD_SPRITE_URL = {
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SHADE_LEAN_TO]:
    '/environment/sprites/utilities/survival-shade-lean-to.webp',
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.BRUSH_WINDBREAK]:
    '/environment/sprites/utilities/survival-brush-windbreak.webp',
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SCOUT_TENT]:
    '/environment/sprites/utilities/survival-scout-tent.webp',
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.CLAIM_BEDROLL]:
    '/environment/sprites/utilities/survival-claim-bedroll.webp',
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SMOKE_RACK]:
    '/environment/sprites/utilities/survival-smoke-rack.webp',
} as const satisfies Record<DefiningWorldPlazaSurvivalShelterKind, string>;

export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-survival-shelter-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_SHEET_ROW_COUNT = 1;

const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_COLUMN_BY_KIND = {
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SHADE_LEAN_TO]: 0,
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.BRUSH_WINDBREAK]: 1,
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SCOUT_TENT]: 2,
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.CLAIM_BEDROLL]: 3,
  [DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SMOKE_RACK]: 4,
} as const satisfies Record<DefiningWorldPlazaSurvivalShelterKind, number>;

export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_DISPLAY_SCALE = 0.85;
export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_FOOT_SINK_PX = 6;

export function resolvingWorldPlazaSurvivalShelterSpriteSheetIcon(
  shelterKind: DefiningWorldPlazaSurvivalShelterKind
): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_SPRITE_COLUMN_BY_KIND[shelterKind],
    rowIndex: 0,
  };
}

export function resolvingWorldPlazaSurvivalShelterKindForBlockDefinitionId(
  blockDefinitionId: string
): DefiningWorldPlazaSurvivalShelterKind | null {
  switch (blockDefinitionId) {
    case 'utility:survival-shade-lean-to':
      return DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SHADE_LEAN_TO;
    case 'utility:survival-brush-windbreak':
      return DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.BRUSH_WINDBREAK;
    case 'utility:survival-scout-tent':
      return DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SCOUT_TENT;
    case 'utility:survival-claim-bedroll':
      return DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.CLAIM_BEDROLL;
    case 'utility:survival-smoke-rack':
      return DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_KIND.SMOKE_RACK;
    default:
      return null;
  }
}
