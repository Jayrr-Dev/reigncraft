import {
  DEFINING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_ICON_CUSTOM_CHEST,
  resolvingWorldBuildingBlockPaletteMaterialIcon,
  type DefiningWorldBuildingBlockPaletteMaterialCustomIconId,
} from "@/components/world/building/domains/resolvingWorldBuildingBlockPaletteMaterialIcon";
import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import { DEFINING_WORLD_BUILDING_BLOCK_SWATCH_MATERIAL_ICON_CLASS_NAME } from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import { cn } from "@/lib/utils";

/** SVG view box for custom palette material icons. */
const RENDERING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_VIEW_BOX = 24;

/** Stroke width for custom palette material icons. */
const RENDERING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_STROKE_WIDTH = 2;

export interface RenderingWorldBuildingBlockPaletteMaterialIconProps {
  /** Persisted block type id. */
  definitionId: DefiningWorldBuildingBlockDefinitionId;
  /** Optional class overrides for sizing or tint. */
  className?: string;
}

/**
 * Renders a compact custom SVG for palette swatches without a Lucide match.
 *
 * @param customIconId - Custom icon id from the material resolver.
 * @param className - Tailwind classes for size and color.
 */
function RenderingWorldBuildingBlockPaletteMaterialCustomIcon({
  customIconId,
  className,
}: {
  customIconId: DefiningWorldBuildingBlockPaletteMaterialCustomIconId;
  className: string;
}): React.JSX.Element {
  if (
    customIconId === DEFINING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_ICON_CUSTOM_CHEST
  ) {
    return (
      <svg
        viewBox={`0 0 ${RENDERING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_VIEW_BOX} ${RENDERING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_VIEW_BOX}`}
        className={className}
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth={RENDERING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="9" width="14" height="10" rx="1.5" />
        <path d="M5 12h14" />
        <path d="M9 9V7a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${RENDERING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_VIEW_BOX} ${RENDERING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_VIEW_BOX}`}
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

/**
 * Centered material glyph for a build palette color swatch.
 */
export function RenderingWorldBuildingBlockPaletteMaterialIcon({
  definitionId,
  className,
}: RenderingWorldBuildingBlockPaletteMaterialIconProps): React.JSX.Element {
  const materialIcon = resolvingWorldBuildingBlockPaletteMaterialIcon(
    definitionId,
  );
  const iconClassName = cn(
    DEFINING_WORLD_BUILDING_BLOCK_SWATCH_MATERIAL_ICON_CLASS_NAME,
    className,
  );

  if (materialIcon.kind === "custom") {
    return (
      <RenderingWorldBuildingBlockPaletteMaterialCustomIcon
        customIconId={materialIcon.customIconId}
        className={iconClassName}
      />
    );
  }

  const MaterialIcon = materialIcon.icon;

  return <MaterialIcon className={iconClassName} aria-hidden />;
}
