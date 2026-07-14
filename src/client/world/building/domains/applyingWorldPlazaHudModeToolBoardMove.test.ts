import { applyingWorldPlazaHudModeToolBoardMove } from '@/components/world/building/domains/applyingWorldPlazaHudModeToolBoardMove';
import { DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID } from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';
import { DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import { normalizingWorldPlazaHudModeToolBoardLayout } from '@/components/world/building/domains/normalizingWorldPlazaHudModeToolBoardLayout';
import { resolvingWorldPlazaHudModeToolBoardDefaults } from '@/components/world/building/domains/resolvingWorldPlazaHudModeToolBoardDefaults';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaHudModeToolBoardMove', () => {
  it('moves a tool into an empty slot', () => {
    const layout = [
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
      null,
      null,
      null,
      null,
      null,
    ] as const;

    expect(applyingWorldPlazaHudModeToolBoardMove(layout, 0, 3)).toEqual([
      null,
      null,
      null,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
      null,
      null,
    ]);
  });

  it('swaps two occupied slots', () => {
    const layout = [
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT,
      null,
      null,
      null,
      null,
    ] as const;

    expect(applyingWorldPlazaHudModeToolBoardMove(layout, 0, 1)).toEqual([
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
      null,
      null,
      null,
      null,
    ]);
  });
});

describe('resolvingWorldPlazaHudModeToolBoardDefaults', () => {
  it('left-packs build tools and leaves empty slots', () => {
    expect(
      resolvingWorldPlazaHudModeToolBoardDefaults(
        DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD
      )
    ).toEqual([
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLACE,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.REMOVE,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT,
      null,
    ]);
  });

  it('left-packs claim tools and leaves empty slots', () => {
    expect(
      resolvingWorldPlazaHudModeToolBoardDefaults(
        DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM
      )
    ).toEqual([
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CLAIM,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.UNCLAIM,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVES,
      null,
      null,
    ]);
  });

  it('left-packs craft cookbooks and leaves empty slots', () => {
    const craftDefaults = resolvingWorldPlazaHudModeToolBoardDefaults(
      DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT
    );

    expect(craftDefaults.filter((slot) => slot !== null).length).toBeGreaterThan(
      0
    );
    expect(craftDefaults).toHaveLength(6);
    expect(craftDefaults.slice(-2)).toEqual([null, null]);
  });
});

describe('normalizingWorldPlazaHudModeToolBoardLayout', () => {
  it('repairs missing tools into empty slots', () => {
    expect(
      normalizingWorldPlazaHudModeToolBoardLayout(
        DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD,
        [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT, null, null]
      )
    ).toEqual([
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLACE,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.REMOVE,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
      DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS,
      null,
    ]);
  });
});
