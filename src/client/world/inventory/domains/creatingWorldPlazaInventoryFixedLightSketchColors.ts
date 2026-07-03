import type { RoughButtonSketchColors } from "@/lib/theme/resolvingRoughButtonPaint";
import { SG_RAW_PALETTE_FALLBACKS } from "@/lib/theme/definingSgRawPalette";

/**
 * Fixed light-mode hex colors for plaza inventory rough UI.
 * Uses {@link SG_RAW_PALETTE_FALLBACKS} so sketches and labels ignore dark mode CSS vars.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX = {
  woodBrownLight: SG_RAW_PALETTE_FALLBACKS["wood-brown-light"],
  woodBrown: SG_RAW_PALETTE_FALLBACKS["wood-brown"],
  woodBrownDark: SG_RAW_PALETTE_FALLBACKS["wood-brown-dark"],
  clayBrownLight: SG_RAW_PALETTE_FALLBACKS["clay-brown-light"],
  clayBrownDark: SG_RAW_PALETTE_FALLBACKS["clay-brown-dark"],
  cloudCreamLight: SG_RAW_PALETTE_FALLBACKS["cloud-cream-light"],
  cloudCream: SG_RAW_PALETTE_FALLBACKS["cloud-cream"],
  mossGreen: SG_RAW_PALETTE_FALLBACKS["moss-green"],
  mossGreenLight: SG_RAW_PALETTE_FALLBACKS["moss-green-light"],
  forestGreenDark: SG_RAW_PALETTE_FALLBACKS["forest-green-dark"],
} as const;

/** Dark wood frame for the inventory hotbar shell (fixed light palette). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_SKETCH_COLORS: RoughButtonSketchColors =
  {
    background: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.woodBrown,
    backgroundBase: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.woodBrownDark,
    border: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.clayBrownDark,
    text: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.cloudCreamLight,
  };

/** Beige slot fill for occupied inventory cells (fixed light palette). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SKETCH_COLORS: RoughButtonSketchColors =
  {
    background: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.cloudCream,
    backgroundBase: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.cloudCreamLight,
    border: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.woodBrown,
    text: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.woodBrownDark,
  };

/** Lighter hatch for empty inventory slots (fixed light palette). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_SKETCH_COLORS: RoughButtonSketchColors =
  {
    background: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.cloudCreamLight,
    backgroundBase: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.cloudCreamLight,
    border: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.clayBrownLight,
    text: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.woodBrownDark,
  };

/** Moss highlight when a slot is a valid drop target (fixed light palette). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_DROP_TARGET_SKETCH_COLORS: RoughButtonSketchColors =
  {
    background: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.mossGreenLight,
    backgroundBase: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.cloudCreamLight,
    border: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.mossGreen,
    text: DEFINING_WORLD_PLAZA_INVENTORY_FIXED_LIGHT_HEX.forestGreenDark,
  };
