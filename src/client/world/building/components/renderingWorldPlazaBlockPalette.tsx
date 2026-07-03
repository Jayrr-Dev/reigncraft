"use client";

import { useMemo, useState } from "react";

import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import {
  DEFINING_WORLD_BUILDING_BLOCK_SWATCH_GRID_CLASS_NAME,
  DEFINING_WORLD_BUILDING_BLOCK_SWATCH_TILE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_BLOCK_SWATCH_TILE_SELECTED_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CATEGORY_TAB_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CATEGORY_TAB_GRID_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CATEGORY_TAB_ICON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CATEGORY_TAB_ICON_SELECTED_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CATEGORY_TAB_SELECTED_CLASS_NAME,
  DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_SELECTED_BLOCK_READOUT_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import { resolvingWorldBuildingBlockPaletteSurfaceStyle } from "@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface";
import {
  listingWorldBuildingPaletteBlockDefinitionsByCategory,
  listingWorldBuildingPaletteCategories,
  resolvingWorldBuildingBlockDefinition,
} from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import { RenderingWorldBuildingBlockPaletteMaterialIcon } from "@/components/world/building/components/renderingWorldBuildingBlockPaletteMaterialIcon";
import { formattingWorldBuildingBlockSwatchColor } from "@/components/world/building/domains/formattingWorldBuildingBlockSwatchColor";
import {
  resolvingWorldBuildingBlockPaletteCategoryIcon,
  resolvingWorldBuildingBlockPaletteCategoryLabel,
} from "@/components/world/building/domains/resolvingWorldBuildingBlockPaletteIcon";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

/** Palette section title. */
const RENDERING_WORLD_PLAZA_BLOCK_PALETTE_SECTION_LABEL = "Resource" as const;

/** Palette root classes. */
const RENDERING_WORLD_PLAZA_BLOCK_PALETTE_ROOT_CLASS_NAME =
  "flex min-h-0 flex-1 flex-col gap-1.5" as const;

/** Swatch grid scroll region classes. */
const RENDERING_WORLD_PLAZA_BLOCK_PALETTE_SCROLL_CLASS_NAME =
  "min-h-0 flex-1 overflow-y-auto pr-0.5" as const;

export interface RenderingWorldPlazaBlockPaletteProps {
  selectedDefinitionId: DefiningWorldBuildingBlockDefinitionId | null;
  onSelectDefinition: (definitionId: DefiningWorldBuildingBlockDefinitionId) => void;
}

/**
 * Game-style block picker: category tabs over swatches with optional texture surfaces.
 */
export function RenderingWorldPlazaBlockPalette({
  selectedDefinitionId,
  onSelectDefinition,
}: RenderingWorldPlazaBlockPaletteProps): React.JSX.Element {
  const selectedDefinition = selectedDefinitionId
    ? resolvingWorldBuildingBlockDefinition(selectedDefinitionId)
    : null;

  const paletteCategories = useMemo(
    () => listingWorldBuildingPaletteCategories(),
    [],
  );

  const defaultCategory =
    selectedDefinition?.category ?? paletteCategories[0] ?? null;

  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  const resolvedActiveCategory =
    activeCategory !== null && paletteCategories.includes(activeCategory)
      ? activeCategory
      : defaultCategory;

  const visibleDefinitions = useMemo(() => {
    if (resolvedActiveCategory === null) {
      return [];
    }

    return listingWorldBuildingPaletteBlockDefinitionsByCategory(
      resolvedActiveCategory,
    );
  }, [resolvedActiveCategory]);

  return (
    <div className={RENDERING_WORLD_PLAZA_BLOCK_PALETTE_ROOT_CLASS_NAME}>
      <p className={DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME}>
        {RENDERING_WORLD_PLAZA_BLOCK_PALETTE_SECTION_LABEL}
      </p>

      {paletteCategories.length > 0 ? (
        <div className={DEFINING_WORLD_BUILDING_CATEGORY_TAB_GRID_CLASS_NAME}>
          {paletteCategories.map((category) => {
            const isActiveCategory = resolvedActiveCategory === category;
            const categoryLabel =
              resolvingWorldBuildingBlockPaletteCategoryLabel(category);
            const CategoryIcon =
              resolvingWorldBuildingBlockPaletteCategoryIcon(category);

            return (
              <button
                key={category}
                type="button"
                {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                title={categoryLabel}
                aria-label={`Show ${categoryLabel} resources`}
                aria-pressed={isActiveCategory}
                onClick={() => {
                  setActiveCategory(category);
                }}
                className={
                  isActiveCategory
                    ? DEFINING_WORLD_BUILDING_CATEGORY_TAB_SELECTED_CLASS_NAME
                    : DEFINING_WORLD_BUILDING_CATEGORY_TAB_CLASS_NAME
                }
              >
                <CategoryIcon
                  className={
                    isActiveCategory
                      ? DEFINING_WORLD_BUILDING_CATEGORY_TAB_ICON_SELECTED_CLASS_NAME
                      : DEFINING_WORLD_BUILDING_CATEGORY_TAB_ICON_CLASS_NAME
                  }
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={RENDERING_WORLD_PLAZA_BLOCK_PALETTE_SCROLL_CLASS_NAME}>
        <div className={DEFINING_WORLD_BUILDING_BLOCK_SWATCH_GRID_CLASS_NAME}>
          {visibleDefinitions.map((definition) => {
            const isSelected =
              selectedDefinitionId !== null &&
              selectedDefinitionId === definition.id;
            const swatchFillColor = formattingWorldBuildingBlockSwatchColor(
              definition.visualConfig.fillColor,
            );
            const swatchBorderColor = formattingWorldBuildingBlockSwatchColor(
              definition.visualConfig.strokeColor,
            );
            const paletteSurface = definition.visualConfig.paletteSurface;
            const swatchSurfaceStyle = paletteSurface
              ? resolvingWorldBuildingBlockPaletteSurfaceStyle(paletteSurface)
              : null;

            return (
              <button
                key={definition.id}
                type="button"
                {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                title={definition.name}
                aria-label={definition.name}
                aria-pressed={isSelected}
                onClick={() => {
                  onSelectDefinition(definition.id);
                }}
                style={{
                  backgroundColor: swatchSurfaceStyle ? undefined : swatchFillColor,
                  borderColor: swatchBorderColor,
                  ...swatchSurfaceStyle,
                }}
                className={`${DEFINING_WORLD_BUILDING_BLOCK_SWATCH_TILE_CLASS_NAME}${
                  isSelected
                    ? ` ${DEFINING_WORLD_BUILDING_BLOCK_SWATCH_TILE_SELECTED_CLASS_NAME}`
                    : ""
                }`}
              >
                {paletteSurface ? null : (
                  <RenderingWorldBuildingBlockPaletteMaterialIcon
                    definitionId={definition.id}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className={DEFINING_WORLD_BUILDING_SELECTED_BLOCK_READOUT_CLASS_NAME}>
        {selectedDefinition?.name ?? "None"}
      </p>
    </div>
  );
}
