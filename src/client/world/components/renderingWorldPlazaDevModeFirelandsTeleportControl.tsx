'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

const RENDERING_WORLD_PLAZA_DEV_MODE_WORLD_BUTTON_CLASS_NAME =
  'rounded border border-orange-300/35 bg-orange-500/15 px-2 py-1 text-left text-[11px] font-medium text-orange-100 hover:bg-orange-500/25' as const;

export type RenderingWorldPlazaDevModeFirelandsTeleportControlProps = {
  onTeleportToFirelands: () => void;
};

/**
 * Dev panel control that teleports the local player into a Firelands region.
 */
export function RenderingWorldPlazaDevModeFirelandsTeleportControl({
  onTeleportToFirelands,
}: RenderingWorldPlazaDevModeFirelandsTeleportControlProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Biome teleports
      </span>
      <button
        type="button"
        className={RENDERING_WORLD_PLAZA_DEV_MODE_WORLD_BUTTON_CLASS_NAME}
        onClick={onTeleportToFirelands}
      >
        Teleport to Firelands
      </button>
    </div>
  );
}
