/**
 * Shared "expedition field gear" theme tokens for the in-game plaza HUD.
 *
 * Ties corner HUD chrome to the vintage adventure-poster palette from
 * `index.css` (parchment, ink, poster gold, deep teal) so the world overlay
 * reads as the same product as the home screen.
 *
 * @module components/world/domains/definingWorldPlazaHudThemeConstants
 */

/** Deep ink-teal glass surface for HUD panels with a faint gold trim. */
export const STYLING_WORLD_PLAZA_HUD_GLASS_SURFACE_CLASS =
  'border border-poster-gold/25 bg-poster-teal-deep/85 shadow-lg shadow-black/40 backdrop-blur-sm' as const;

/** Primary parchment-toned HUD text. */
export const STYLING_WORLD_PLAZA_HUD_TEXT_CLASS = 'text-parchment' as const;

/** Muted parchment HUD text for hints and secondary copy. */
export const STYLING_WORLD_PLAZA_HUD_TEXT_MUTED_CLASS =
  'text-parchment/70' as const;

/** Small-caps display treatment for short HUD labels (Cinzel). */
export const STYLING_WORLD_PLAZA_HUD_LABEL_CLASS =
  'font-display uppercase tracking-[0.12em]' as const;

/** Gold accent used for interactive HUD affordances. */
export const DEFINING_WORLD_PLAZA_HUD_GOLD_HEX = '#d9a441' as const;

/** Bright gold used for the local player marker and focus rings. */
export const DEFINING_WORLD_PLAZA_HUD_GOLD_BRIGHT_HEX = '#f4d35e' as const;

/** Ink-teal HUD panel fill for canvas-drawn chrome (matches glass surface). */
export const DEFINING_WORLD_PLAZA_HUD_CANVAS_PANEL_FILL_COLOR =
  'rgba(18, 36, 44, 0.72)' as const;

/** Gold-tinted border for canvas-drawn HUD chrome. */
export const DEFINING_WORLD_PLAZA_HUD_CANVAS_BORDER_COLOR =
  'rgba(217, 164, 65, 0.4)' as const;

/** Parchment label color for canvas-drawn HUD text. */
export const DEFINING_WORLD_PLAZA_HUD_CANVAS_LABEL_TEXT_COLOR =
  '#f0e2c4' as const;
