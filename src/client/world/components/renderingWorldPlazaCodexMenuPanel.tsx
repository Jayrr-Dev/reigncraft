'use client';

/**
 * Codex section picker dropdown for the plaza action bar book button.
 *
 * @module components/world/components/renderingWorldPlazaCodexMenuPanel
 */

import { DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import { DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES,
  DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES,
} from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import { DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaLapidaryGuideConstants';
import { DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaPathologyGuideConstants';
import { DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaRecipesGuideConstants';
import { formattingPlazaBestiaryCodexMenuDescription } from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';
import { formattingPlazaBiomesCodexMenuDescription } from '@/components/home/domains/resolvingPlazaBiomesGuideDisplayEntries';
import { formattingPlazaHerbariumCodexMenuDescription } from '@/components/home/domains/resolvingPlazaHerbariumGuideDisplayEntries';
import { formattingPlazaLapidaryCodexMenuDescription } from '@/components/home/domains/resolvingPlazaLapidaryGuideDisplayEntries';
import { formattingPlazaPathologyCodexMenuDescription } from '@/components/home/domains/resolvingPlazaPathologyGuideDisplayEntries';
import { formattingPlazaRecipesCodexMenuDescription } from '@/components/home/domains/resolvingPlazaRecipesGuideDisplayEntries';
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
import {
  gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
  gettingWorldPlazaHerbariumSightedTreeVariantsSnapshot,
  subscribingWorldPlazaHerbariumDiscovery,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import {
  gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
  gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
  subscribingWorldPlazaLapidaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import {
  gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
  subscribingWorldPlazaPathologyDiscovery,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import {
  gettingWorldPlazaRecipeAttachedSnapshot,
  subscribingWorldPlazaRecipeDiscovery,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
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
 * Dropdown panel listing Guide sections below the book button.
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
  const herbariumFlowerStudyCounts = useSyncExternalStore<
    ReturnType<typeof gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot>
  >(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
    () => ({})
  );
  const sightedHerbariumTreeVariants = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumSightedTreeVariantsSnapshot,
    () => []
  );
  const lapidaryOreStudyCounts = useSyncExternalStore<
    ReturnType<typeof gettingWorldPlazaLapidaryOreStudyCountsSnapshot>
  >(
    subscribingWorldPlazaLapidaryDiscovery,
    gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
    () => ({})
  );
  const sightedLapidaryOreSpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaLapidaryDiscovery,
    gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
    () => []
  );
  const attachedRecipeIds = useSyncExternalStore(
    subscribingWorldPlazaRecipeDiscovery,
    gettingWorldPlazaRecipeAttachedSnapshot,
    () => []
  );
  const obtainedPathologyDiseaseIds = useSyncExternalStore(
    subscribingWorldPlazaPathologyDiscovery,
    gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
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

    if (optionId === 'herbarium') {
      const discoveredFlowerCount =
        DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES.filter(
          (entry) => (herbariumFlowerStudyCounts[entry.speciesId] ?? 0) > 0
        ).length;

      return formattingPlazaHerbariumCodexMenuDescription(
        discoveredFlowerCount + sightedHerbariumTreeVariants.length,
        DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES.length +
          DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES.length
      );
    }

    if (optionId === 'lapidary') {
      const discoveredOreCount =
        DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES.filter(
          (entry) =>
            (lapidaryOreStudyCounts[entry.speciesId] ?? 0) > 0 ||
            sightedLapidaryOreSpeciesIds.includes(entry.speciesId)
        ).length;

      return formattingPlazaLapidaryCodexMenuDescription(
        discoveredOreCount,
        DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES.length
      );
    }

    if (optionId === 'pathology') {
      return formattingPlazaPathologyCodexMenuDescription(
        obtainedPathologyDiseaseIds.length,
        DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES.length
      );
    }

    if (optionId === 'recipes') {
      return formattingPlazaRecipesCodexMenuDescription(
        attachedRecipeIds.length,
        DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES.length
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
