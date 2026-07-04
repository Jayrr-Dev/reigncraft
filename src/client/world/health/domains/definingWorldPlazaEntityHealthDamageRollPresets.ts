import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import {
  listingWorldPlazaEntityDamageRollBuffDescriptors,
  type DefiningWorldPlazaEntityBuffRollModifier,
  type DefiningWorldPlazaEntityBuffRollSide,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';

export type DefiningWorldPlazaEntityHealthDamageRollPresetModifier =
  DefiningWorldPlazaEntityBuffRollModifier;

/** @deprecated Use {@link DefiningWorldPlazaEntityBuffCategoryId} instead. */
export type DefiningWorldPlazaEntityHealthDamageRollPresetCategory =
  DefiningWorldPlazaEntityBuffCategoryId;

export type DefiningWorldPlazaEntityHealthDamageRollPresetSide =
  DefiningWorldPlazaEntityBuffRollSide;

export type DefiningWorldPlazaEntityHealthDamageRollPreset = {
  id: string;
  label: string;
  category: DefiningWorldPlazaEntityBuffCategoryId;
  side: DefiningWorldPlazaEntityHealthDamageRollPresetSide;
  description: string;
  modifiers: DefiningWorldPlazaEntityHealthDamageRollPresetModifier[];
};

/** One SD shift per tier-bias point when resolving rolls. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_TIER_BIAS_SD_SHIFT = 1;

/**
 * Damage-roll buff presets derived from the unified buff registry.
 */
export function listingWorldPlazaEntityHealthDamageRollPresetsFromBuffRegistry(): DefiningWorldPlazaEntityHealthDamageRollPreset[] {
  return listingWorldPlazaEntityDamageRollBuffDescriptors().map(
    (descriptor) => {
      if (descriptor.effect.kind !== 'damage_roll_modifiers') {
        throw new Error(
          `Expected damage_roll_modifiers buff: ${descriptor.id}`
        );
      }

      return {
        id: descriptor.id,
        label: descriptor.label,
        category: descriptor.category,
        side: descriptor.effect.side,
        description: descriptor.description,
        modifiers: [...descriptor.effect.modifiers],
      };
    }
  );
}

/** Named armour and buff presets for the statistical damage engine. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS: DefiningWorldPlazaEntityHealthDamageRollPreset[] =
  listingWorldPlazaEntityHealthDamageRollPresetsFromBuffRegistry();

export function creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
  presetId: string,
  modifierIndex: number
): string {
  return `${presetId}:${modifierIndex}`;
}

export function checkingWorldPlazaEntityHealthDamageRollPresetIsActive(
  presetId: string,
  modifierIds: readonly string[]
): boolean {
  return modifierIds.some((modifierId) =>
    modifierId.startsWith(`${presetId}:`)
  );
}

export function listingWorldPlazaEntityHealthDamageRollPresetsByCategory(
  category: DefiningWorldPlazaEntityBuffCategoryId
): DefiningWorldPlazaEntityHealthDamageRollPreset[] {
  return DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS.filter(
    (preset) => preset.category === category
  );
}
