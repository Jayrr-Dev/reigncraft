/**
 * Formats character sizeScale as layers plus a real-world height translation.
 *
 * @module components/world/character/domains/resolvingWorldPlazaCharacterHeightDisplayText
 */

import {
  DEFINING_WORLD_PLAZA_CHARACTER_INCHES_PER_WORLD_LAYER,
} from '@/components/world/character/domains/definingWorldPlazaCharacterHeightDisplayConstants';

function formattingWorldPlazaCharacterHeightLayersText(
  heightWorldLayers: number
): string {
  const roundedToTenth = Math.round(heightWorldLayers * 10) / 10;
  const layersText =
    Number.isInteger(roundedToTenth) ||
    Math.abs(roundedToTenth - Math.round(roundedToTenth)) < 0.05
      ? `${Math.round(roundedToTenth)}`
      : roundedToTenth.toFixed(1);

  return `${layersText}L`;
}

function formattingWorldPlazaCharacterHeightImperialText(
  totalInches: number
): string {
  const safeInches = Math.max(1, Math.round(totalInches));
  const feet = Math.floor(safeInches / 12);
  const inches = safeInches % 12;

  return `${feet}'${inches}"`;
}

/**
 * Formats canonical collision height as `NL · feet'inches"`.
 */
export function resolvingWorldPlazaCharacterHeightDisplayText(
  heightWorldLayers: number
): string {
  const safeHeightWorldLayers = Math.max(0.1, heightWorldLayers);
  const totalInches =
    safeHeightWorldLayers *
    DEFINING_WORLD_PLAZA_CHARACTER_INCHES_PER_WORLD_LAYER;

  return `${formattingWorldPlazaCharacterHeightLayersText(safeHeightWorldLayers)} · ${formattingWorldPlazaCharacterHeightImperialText(totalInches)}`;
}
