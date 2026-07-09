'use client';

import { DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_OPTIONS } from '@/components/world/domains/definingWorldPlazaBiomeDevTeleportConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

const RENDERING_WORLD_PLAZA_DEV_MODE_BIOME_TELEPORT_BUTTON_CLASS_NAME =
  'rounded border border-orange-300/35 bg-orange-500/15 px-2 py-1 text-left text-[11px] font-medium text-orange-100 hover:bg-orange-500/25' as const;

export type RenderingWorldPlazaDevModeBiomeTeleportControlProps = {
  onTeleportToBiome: (biomeKind: DefiningWorldPlazaBiomeKind) => void;
};

/**
 * Dev panel control that teleports the local player to the nearest biome region.
 */
export function RenderingWorldPlazaDevModeBiomeTeleportControl({
  onTeleportToBiome,
}: RenderingWorldPlazaDevModeBiomeTeleportControlProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Biome teleports
      </span>
      <div className="grid grid-cols-2 gap-1">
        {DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_OPTIONS.map((option) => (
          <button
            key={option.kind}
            type="button"
            className={
              RENDERING_WORLD_PLAZA_DEV_MODE_BIOME_TELEPORT_BUTTON_CLASS_NAME
            }
            onClick={() => {
              onTeleportToBiome(option.kind);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
