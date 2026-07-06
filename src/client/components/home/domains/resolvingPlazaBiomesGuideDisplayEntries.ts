import {
  DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES,
  DEFINING_PLAZA_BIOMES_RARITY_REGISTRY,
  LABELING_PLAZA_BIOMES_UNDISCOVERED_HINT,
  LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME,
  type DefiningPlazaBiomesGuideEntry,
  type PlazaBiomesRarityId,
} from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { formattingWorldPlazaPixiColorToCssHex } from '@/components/world/domains/formattingWorldPlazaPixiColorToCssHex';

export type PlazaBiomesGuideDisplayEntry = {
  kind: DefiningWorldPlazaBiomeKind;
  icon: string;
  isExplored: boolean;
  displayName: string;
  summary: string;
  rarity: PlazaBiomesRarityId;
  rarityLabel: string;
  rarityBadgeClassName: string;
  skyBackdropClassName: string;
  groundColor: string;
};

/**
 * Merges biome catalog data with the player's explored set for the codex panel.
 *
 * @param exploredKinds - Biome kinds the player has entered.
 */
export function resolvingPlazaBiomesGuideDisplayEntries(
  exploredKinds: ReadonlySet<DefiningWorldPlazaBiomeKind>
): PlazaBiomesGuideDisplayEntry[] {
  return DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES.map(
    (entry: DefiningPlazaBiomesGuideEntry) => {
      const biomeDefinition = DEFINING_WORLD_PLAZA_BIOME_CATALOG[entry.kind];
      const isExplored = exploredKinds.has(entry.kind);
      const rarityDefinition =
        DEFINING_PLAZA_BIOMES_RARITY_REGISTRY[entry.rarity];

      return {
        kind: entry.kind,
        icon: entry.icon,
        isExplored,
        displayName: isExplored
          ? biomeDefinition.displayName
          : LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME,
        summary: isExplored
          ? entry.summary
          : LABELING_PLAZA_BIOMES_UNDISCOVERED_HINT,
        rarity: entry.rarity,
        rarityLabel: rarityDefinition.label,
        rarityBadgeClassName: rarityDefinition.badgeClassName,
        skyBackdropClassName: biomeDefinition.skyBackdropClassName,
        groundColor: formattingWorldPlazaPixiColorToCssHex(
          biomeDefinition.tileFillColor
        ),
      };
    }
  );
}

/**
 * Formats the codex menu subtitle for the Biomes section.
 *
 * @param exploredCount - Number of biomes the player has entered.
 * @param totalCount - Total number of trackable biomes.
 */
export function formattingPlazaBiomesCodexMenuDescription(
  exploredCount: number,
  totalCount: number
): string {
  if (exploredCount <= 0) {
    return 'No regions discovered yet';
  }

  if (exploredCount >= totalCount) {
    return `All ${totalCount} regions discovered`;
  }

  return `${exploredCount} of ${totalCount} regions discovered`;
}
