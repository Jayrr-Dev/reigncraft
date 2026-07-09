/**
 * Declarative ground marker colors for farmland tile phases.
 *
 * @module components/world/farming/domains/definingWorldPlazaFarmlandGroundMarkerPresentation
 */

import type { DefiningWorldPlazaFarmlandPhase } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';

export type DefiningWorldPlazaFarmlandGroundMarkerPresentation = {
  readonly fillColor: number;
  readonly fillAlpha: number;
  readonly outlineColor: number;
  readonly outlineAlpha: number;
  readonly heightPx: number;
};

/** Isometric diamond half-width on ground (px). */
export const DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_HALF_WIDTH_PX = 14;

/** Isometric diamond half-height on ground (px). */
export const DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_HALF_HEIGHT_PX = 7;

export const DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_BY_PHASE: Record<
  DefiningWorldPlazaFarmlandPhase,
  DefiningWorldPlazaFarmlandGroundMarkerPresentation
> = {
  tilled: {
    fillColor: 0x6b4f2a,
    fillAlpha: 0.45,
    outlineColor: 0x3d2b16,
    outlineAlpha: 0.7,
    heightPx: 2,
  },
  planted: {
    fillColor: 0x4a7c3f,
    fillAlpha: 0.35,
    outlineColor: 0x2f4f28,
    outlineAlpha: 0.65,
    heightPx: 4,
  },
  growing: {
    fillColor: 0x5f9e4d,
    fillAlpha: 0.5,
    outlineColor: 0x3a6b2f,
    outlineAlpha: 0.75,
    heightPx: 8,
  },
  mature: {
    fillColor: 0xc9a227,
    fillAlpha: 0.55,
    outlineColor: 0x8a6d12,
    outlineAlpha: 0.85,
    heightPx: 12,
  },
};
