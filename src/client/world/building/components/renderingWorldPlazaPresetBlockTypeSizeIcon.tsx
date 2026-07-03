import type { DefiningWorldBuildingPresetBlockTypeId } from "@/components/world/building/domains/definingWorldBuildingPresetBlockTypes";
import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MAX } from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";

/** SVG view box size for preset block icons. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_VIEW_BOX = 24;

/** Horizontal half-width of the isometric top face. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_HALF_WIDTH = 5;

/** Vertical depth skew for the isometric side face. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_DEPTH = 3;

/** Base Y anchor for block icons. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_BASE_Y = 20;

/** Center X anchor for block icons. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_CENTER_X = 12;

/** Maximum icon extrusion in SVG units. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_MAX_EXTRUSION_PX = 14;

/** Minimum icon extrusion for non-tile presets. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_MIN_EXTRUSION_PX = 2.5;

/** Known preset extrusions for clearer steps at common sizes. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_EXTRUSION_BY_HEIGHT: Readonly<
  Partial<Record<number, number>>
> = {
  0: 0,
  1: 3,
  2: 5.5,
  4: 9,
  32: RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_MAX_EXTRUSION_PX,
};

/** Stroke/fill colors for preset block icons. */
const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_STROKE =
  "currentColor" as const;

const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_TOP_FILL =
  "rgba(255,255,255,0.28)" as const;

const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_FRONT_FILL =
  "rgba(255,255,255,0.14)" as const;

const RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_SIDE_FILL =
  "rgba(255,255,255,0.08)" as const;

export interface RenderingWorldPlazaPresetBlockTypeSizeIconProps {
  /** Preset id used for stable keys in lists. */
  presetBlockTypeId: DefiningWorldBuildingPresetBlockTypeId;
  /** Extrusion height (H) for the preset. */
  blockHeight: number;
  /** Optional Tailwind classes for sizing and color. */
  className?: string;
}

/**
 * Returns the drawn extrusion height in SVG units for a preset block height.
 *
 * @param blockHeight - Block extrusion height (H).
 */
function resolvingWorldPlazaPresetBlockTypeSizeIconExtrusionPx(
  blockHeight: number,
): number {
  const mappedExtrusion =
    RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_EXTRUSION_BY_HEIGHT[
      blockHeight
    ];

  if (mappedExtrusion !== undefined) {
    return mappedExtrusion;
  }

  if (blockHeight <= 0) {
    return 0;
  }

  return Math.max(
    RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_MIN_EXTRUSION_PX,
    (blockHeight / DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MAX) *
      RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_MAX_EXTRUSION_PX,
  );
}

/**
 * Simple isometric SVG icon showing preset block extrusion size.
 */
export function RenderingWorldPlazaPresetBlockTypeSizeIcon({
  presetBlockTypeId,
  blockHeight,
  className = "h-5 w-5 shrink-0 text-white/85",
}: RenderingWorldPlazaPresetBlockTypeSizeIconProps): React.JSX.Element {
  const centerX = RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_CENTER_X;
  const halfWidth = RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_HALF_WIDTH;
  const depth = RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_DEPTH;
  const baseY = RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_BASE_Y;
  const extrusionPx =
    resolvingWorldPlazaPresetBlockTypeSizeIconExtrusionPx(blockHeight);
  const topY = baseY - extrusionPx;
  const topCenterY = topY - depth;

  if (blockHeight <= 0) {
    return (
      <svg
        aria-hidden
        viewBox={`0 0 ${RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_VIEW_BOX} ${RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_VIEW_BOX}`}
        className={className}
      >
        <polygon
          points={`${centerX},${baseY - 2} ${centerX + halfWidth},${baseY} ${centerX},${baseY + 2} ${centerX - halfWidth},${baseY}`}
          fill={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_TOP_FILL}
          stroke={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_STROKE}
          strokeWidth={1.2}
        />
      </svg>
    );
  }

  const topFacePoints = [
    `${centerX},${topCenterY}`,
    `${centerX + halfWidth},${topY}`,
    `${centerX},${topY + depth}`,
    `${centerX - halfWidth},${topY}`,
  ].join(" ");

  const frontFacePoints = [
    `${centerX - halfWidth},${topY}`,
    `${centerX},${topY + depth}`,
    `${centerX},${baseY}`,
    `${centerX - halfWidth},${baseY - depth}`,
  ].join(" ");

  const sideFacePoints = [
    `${centerX},${topY + depth}`,
    `${centerX + halfWidth},${topY}`,
    `${centerX + halfWidth},${baseY - depth}`,
    `${centerX},${baseY}`,
  ].join(" ");

  return (
    <svg
      aria-hidden
      data-preset-block-type-id={presetBlockTypeId}
      viewBox={`0 0 ${RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_VIEW_BOX} ${RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_VIEW_BOX}`}
      className={className}
    >
      <polygon
        points={frontFacePoints}
        fill={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_FRONT_FILL}
        stroke={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_STROKE}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <polygon
        points={sideFacePoints}
        fill={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_SIDE_FILL}
        stroke={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_STROKE}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <polygon
        points={topFacePoints}
        fill={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_TOP_FILL}
        stroke={RENDERING_WORLD_PLAZA_PRESET_BLOCK_TYPE_SIZE_ICON_STROKE}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </svg>
  );
}
