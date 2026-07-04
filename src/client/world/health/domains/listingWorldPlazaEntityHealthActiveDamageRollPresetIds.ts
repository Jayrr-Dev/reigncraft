import {
  checkingWorldPlazaEntityHealthDamageRollPresetIsActive,
  creatingWorldPlazaEntityHealthDamageRollPresetModifierId,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS,
  type DefiningWorldPlazaEntityHealthDamageRollPreset,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Returns defender preset ids currently active on the entity. */
export function listingWorldPlazaEntityHealthActiveDefenderDamageRollPresetIds(
  modifierIds: readonly string[]
): string[] {
  return DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS.filter(
    (preset) =>
      preset.side === 'defender' &&
      checkingWorldPlazaEntityHealthDamageRollPresetIsActive(
        preset.id,
        modifierIds
      )
  ).map((preset) => preset.id);
}

/** Returns attacker preset ids currently active in a modifier list. */
export function listingWorldPlazaEntityHealthActiveAttackerDamageRollPresetIds(
  modifierIds: readonly string[]
): string[] {
  return DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS.filter(
    (preset) =>
      preset.side === 'attacker' &&
      checkingWorldPlazaEntityHealthDamageRollPresetIsActive(
        preset.id,
        modifierIds
      )
  ).map((preset) => preset.id);
}

/** Toggles a preset within a flat modifier list (used for attacker simulation). */
export function togglingWorldPlazaEntityHealthDamageRollPresetInList(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[],
  preset: DefiningWorldPlazaEntityHealthDamageRollPreset
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const isActive = modifiers.some((modifier) =>
    modifier.id.startsWith(`${preset.id}:`)
  );

  if (isActive) {
    return modifiers.filter(
      (modifier) => !modifier.id.startsWith(`${preset.id}:`)
    );
  }

  const presetModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] =
    preset.modifiers.map((modifier, modifierIndex) => ({
      id: creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
        preset.id,
        modifierIndex
      ),
      kind: modifier.kind,
      value: modifier.value,
      expiresAtMs: null,
    }));

  return [...modifiers, ...presetModifiers];
}
