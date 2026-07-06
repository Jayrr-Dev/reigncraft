import {
  DEFINING_PLAZA_BIOMES_GUIDE_FORAGING_BY_KIND,
  DEFINING_PLAZA_BIOMES_GUIDE_RESOURCE_TAG_CATALOG,
  DEFINING_PLAZA_BIOMES_GUIDE_VEGETATION_TAG_CATALOG,
  type PlazaBiomesGuideResourceTagId,
  type PlazaBiomesGuideVegetationTagId,
} from '@/components/home/domains/definingPlazaBiomesGuideForagingConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

export type PlazaBiomesGuideForagingDisplayTag = {
  id: string;
  label: string;
  icon: string;
};

export type PlazaBiomesGuideForagingDisplay = {
  resources: PlazaBiomesGuideForagingDisplayTag[];
  vegetation: PlazaBiomesGuideForagingDisplayTag[];
};

function resolvingPlazaBiomesGuideResourceDisplayTag(
  tagId: PlazaBiomesGuideResourceTagId
): PlazaBiomesGuideForagingDisplayTag {
  const tag = DEFINING_PLAZA_BIOMES_GUIDE_RESOURCE_TAG_CATALOG[tagId];

  return {
    id: tagId,
    label: tag.label,
    icon: tag.icon,
  };
}

function resolvingPlazaBiomesGuideVegetationDisplayTag(
  tagId: PlazaBiomesGuideVegetationTagId
): PlazaBiomesGuideForagingDisplayTag {
  const tag = DEFINING_PLAZA_BIOMES_GUIDE_VEGETATION_TAG_CATALOG[tagId];

  return {
    id: tagId,
    label: tag.label,
    icon: tag.icon,
  };
}

/**
 * Resolves codex foraging chips for a discovered biome.
 *
 * @param kind - Biome kind from the guide catalog.
 */
export function resolvingPlazaBiomesGuideForagingDisplay(
  kind: DefiningWorldPlazaBiomeKind
): PlazaBiomesGuideForagingDisplay {
  const profile = DEFINING_PLAZA_BIOMES_GUIDE_FORAGING_BY_KIND[kind];

  return {
    resources: profile.resources.map(
      resolvingPlazaBiomesGuideResourceDisplayTag
    ),
    vegetation: profile.vegetation.map(
      resolvingPlazaBiomesGuideVegetationDisplayTag
    ),
  };
}
