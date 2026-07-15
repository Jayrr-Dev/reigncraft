/**
 * Dye colors and labels for flower-stained wood and flower patch blocks.
 *
 * @module components/world/building/domains/definingWorldPlazaFlowerDyeConstants
 */

import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import { WORLD_FLOWER_SPECIES_RARITY_REGISTRY } from '../../../../shared/worldFlowerRarity';

/** Display order matches herbarium / sprite sheet rarity table. */
export const DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER: readonly WorldFlowerSpeciesId[] =
  WORLD_FLOWER_SPECIES_RARITY_REGISTRY.map((entry) => entry.speciesId);

/** Player-facing flower names. */
export const DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID: Record<
  WorldFlowerSpeciesId,
  string
> = {
  yarrow: 'Yarrow',
  calendula: 'Calendula',
  chamomile: 'Chamomile',
  lavender: 'Lavender',
  echinacea: 'Echinacea',
  peppermint: 'Peppermint',
  rose: 'Rose',
  meadowsweet: 'Meadowsweet',
  arnica: 'Arnica',
  valerian: 'Valerian',
  foxglove: 'Foxglove',
  belladonna: 'Belladonna',
};

/**
 * Petal dye colors used for stained planks and flower patch swatches.
 * Tuned from herbarium field notes (orange calendula, purple lavender, etc.).
 */
export const DEFINING_WORLD_PLAZA_FLOWER_DYE_COLOR_BY_SPECIES_ID: Record<
  WorldFlowerSpeciesId,
  number
> = {
  yarrow: 0xf2efe4,
  calendula: 0xed8a1f,
  chamomile: 0xf0e49a,
  lavender: 0x8b6bb5,
  echinacea: 0xc45a88,
  peppermint: 0x4fa878,
  rose: 0xd23d6d,
  meadowsweet: 0xf0e6cc,
  arnica: 0xe8c01a,
  valerian: 0xc9a3b4,
  foxglove: 0xb05a9e,
  belladonna: 0x3d1f4a,
};

/** Soft ground tint under flower patch swatches. */
export const DEFINING_WORLD_PLAZA_FLOWER_PATCH_GROUND_COLOR = 0x4a7a3a;
