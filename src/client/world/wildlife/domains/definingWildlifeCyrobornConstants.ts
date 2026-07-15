/**
 * Declarative tuning for the Cyroborn frostsink crystal wildlife.
 *
 * Cyroborn is a floating sapphire ice sphere (Cryocore palette) that keeps
 * distance and casts ice projectiles instead of melee.
 *
 * @module components/world/wildlife/domains/definingWildlifeCyrobornConstants
 */

/** Species id registered in the wildlife catalog. */
export const DEFINING_WILDLIFE_CYROBORN_SPECIES_ID = 'cyroborn' as const;

/**
 * Extra playable/wildlife status immunities beyond hazard temperature flags.
 * Crystal body has no blood — bleed stacks do not apply.
 */
export const DEFINING_WILDLIFE_CYROBORN_EXTRA_CHARACTER_IMMUNITIES = [
  'bleed',
] as const;

/** Body sprite shipped for Cyroborn (64×64 crystal orb). */
export const DEFINING_WILDLIFE_CYROBORN_BODY_SPRITE_URL =
  '/creatures/sprites/species/cyroborn/cyroborn-body.webp';

/** Hard core body radius in screen pixels. */
export const DEFINING_WILDLIFE_CYROBORN_BODY_RADIUS_PX = 10;

/** Mid crystal ring radius. */
export const DEFINING_WILDLIFE_CYROBORN_AURA_MID_RADIUS_PX = 14;

/** Outer soft aura radius. */
export const DEFINING_WILDLIFE_CYROBORN_AURA_RADIUS_PX = 20;

/** Bright cyan-white core (Cryocore highlight). */
export const DEFINING_WILDLIFE_CYROBORN_BODY_COLOR = 0xb8f0ff;

/** Deep sapphire mid fill. */
export const DEFINING_WILDLIFE_CYROBORN_MID_COLOR = 0x2f6dff;

/** Outer aura / rim. */
export const DEFINING_WILDLIFE_CYROBORN_AURA_COLOR = 0x5ad1ff;

/** Dead corpse core (no aura). */
export const DEFINING_WILDLIFE_CYROBORN_DEAD_BODY_COLOR = 0x6a7a8a;

/** Core fill alpha. */
export const DEFINING_WILDLIFE_CYROBORN_BODY_ALPHA = 1;

/** Mid ring alpha at rest. */
export const DEFINING_WILDLIFE_CYROBORN_AURA_MID_ALPHA = 0.55;

/** Outer aura alpha at rest. */
export const DEFINING_WILDLIFE_CYROBORN_AURA_OUTER_ALPHA = 0.28;

/** Pulse amplitude added to aura alphas (0..1). */
export const DEFINING_WILDLIFE_CYROBORN_AURA_PULSE_AMPLITUDE = 0.1;

/** Aura pulse period in milliseconds. */
export const DEFINING_WILDLIFE_CYROBORN_AURA_PULSE_PERIOD_MS = 2_200;

/** Base hover height above the grid anchor (screen px). */
export const DEFINING_WILDLIFE_CYROBORN_HOVER_LIFT_PX = 22;

/** Vertical bob amplitude around the hover height (screen px). */
export const DEFINING_WILDLIFE_CYROBORN_HOVER_BOB_AMPLITUDE_PX = 5;

/** Vertical bob period (ms). */
export const DEFINING_WILDLIFE_CYROBORN_HOVER_BOB_PERIOD_MS = 3_200;

/** Horizontal sway amplitude (screen px). */
export const DEFINING_WILDLIFE_CYROBORN_HOVER_SWAY_AMPLITUDE_PX = 4;

/** Horizontal sway period (ms). */
export const DEFINING_WILDLIFE_CYROBORN_HOVER_SWAY_PERIOD_MS = 5_100;

/**
 * Virtual frame height used for name-tag / speech lift math on the procedural
 * orb so tags clear the hover lift + aura.
 */
export const DEFINING_WILDLIFE_CYROBORN_PRESENTATION_FRAME_HEIGHT_PX = 112;

/** Night light footprint relative to the baked torch texture. */
export const DEFINING_WILDLIFE_CYROBORN_LIGHT_RADIUS_SCALE = 1.35;

/** Night light strength 0..1. */
export const DEFINING_WILDLIFE_CYROBORN_LIGHT_BRIGHTNESS = 0.85;

/** Cold sapphire tint for the night light hole. */
export const DEFINING_WILDLIFE_CYROBORN_LIGHT_TINT = 0x7ec8ff;

/** Light-store owner namespace for Cyroborn instances. */
export const DEFINING_WILDLIFE_CYROBORN_LIGHT_OWNER_KEY = 'wildlife-cyroborn';
