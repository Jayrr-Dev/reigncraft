'use client';

/**
 * Codex section picker dropdown for the plaza action bar book button.
 *
 * @module components/world/components/renderingWorldPlazaCodexMenuPanel
 */

import { DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import { DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import { formattingPlazaBestiaryCodexMenuDescription } from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';
import { formattingPlazaBiomesCodexMenuDescription } from '@/components/home/domains/resolvingPlazaBiomesGuideDisplayEntries';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_CODEX_MENU_OPTIONS,
  LABELING_WORLD_PLAZA_CODEX_MENU,
  STYLING_WORLD_PLAZA_CODEX_MENU_OPTION_BASE_CLASS_NAME,
  STYLING_WORLD_PLAZA_CODEX_MENU_OPTION_INACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_CODEX_MENU_PANEL_CLASS_NAME,
  type WorldPlazaCodexSectionId,
} from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  subscribingWorldPlazaBestiaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import {
  gettingWorldPlazaExploredBiomesSnapshot,
  subscribingWorldPlazaExploredBiomes,
} from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import { cn } from '@/lib/utils';
import { useSyncExternalStore } from 'react';

/** Props for {@link RenderingWorldPlazaCodexMenuPanel}. */
export type RenderingWorldPlazaCodexMenuPanelProps = {
  /** When false, renders nothing. */
  isOpen: boolean;
  /** Called when the player picks a codex section. */
  onSelectSection: (section: WorldPlazaCodexSectionId) => void;
};

/**
 * Dropdown panel listing Controls, Mechanics, Biomes, and Lore below the book button.
 */
export function RenderingWorldPlazaCodexMenuPanel({
  isOpen,
  onSelectSection,
}: RenderingWorldPlazaCodexMenuPanelProps): React.JSX.Element | null {
  const exploredBiomeKinds = useSyncExternalStore(
    subscribingWorldPlazaExploredBiomes,
    gettingWorldPlazaExploredBiomesSnapshot,
    () => []
  );
  const sightedBestiarySpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiarySightedSpeciesSnapshot,
    () => []
  );

  if (!isOpen) {
    return null;
  }

  const resolvingCodexMenuOptionDescription = (
    optionId: WorldPlazaCodexSectionId,
    description: string
  ): string => {
    if (optionId === 'biomes') {
      return formattingPlazaBiomesCodexMenuDescription(
        exploredBiomeKinds.length,
        DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES.length
      );
    }

    if (optionId === 'bestiary') {
      return formattingPlazaBestiaryCodexMenuDescription(
        sightedBestiarySpeciesIds.length,
        DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES.length
      );
    }

    return description;
  };

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={STYLING_WORLD_PLAZA_CODEX_MENU_PANEL_CLASS_NAME}
      role="menu"
      aria-label={LABELING_WORLD_PLAZA_CODEX_MENU}
    >
      {DEFINING_WORLD_PLAZA_CODEX_MENU_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="menuitem"
          onClick={() => {
            onSelectSection(option.id);
          }}
          className={cn(
            STYLING_WORLD_PLAZA_CODEX_MENU_OPTION_BASE_CLASS_NAME,
            STYLING_WORLD_PLAZA_CODEX_MENU_OPTION_INACTIVE_CLASS_NAME
          )}
        >
          <Icon icon={option.icon} className="size-3.5 shrink-0" aria-hidden />
          <span className="min-w-0">
            <span className="block text-xs font-semibold leading-tight">
              {option.label}
            </span>
            <span className="block text-[10px] font-medium leading-tight opacity-70">
              {resolvingCodexMenuOptionDescription(
                option.id,
                option.description
              )}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
