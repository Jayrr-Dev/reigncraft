/**
 * Declarative skill registry for the character engine.
 *
 * @module components/world/character/domains/definingWorldPlazaCharacterEngineSkillRegistry
 */

export type DefiningWorldPlazaCharacterEngineSkillEffect =
  | { readonly kind: 'apply_buff'; readonly buffId: string }
  | { readonly kind: 'heal'; readonly amount: number }
  | {
      readonly kind: 'damage_roll';
      readonly presetId: string;
      readonly baseExpectedDamage: number;
    };

export type DefiningWorldPlazaCharacterEngineSkillDefinition = {
  readonly skillId: string;
  readonly displayName: string;
  readonly iconName: string;
  readonly cooldownMs: number;
  readonly effect: DefiningWorldPlazaCharacterEngineSkillEffect;
};

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_MINOR_HEAL: DefiningWorldPlazaCharacterEngineSkillDefinition =
  {
    skillId: 'minor-heal',
    displayName: 'Minor Heal',
    iconName: 'mdi:heart-plus',
    cooldownMs: 8_000,
    effect: { kind: 'heal', amount: 120 },
  };

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_SWIFT_STRIDE: DefiningWorldPlazaCharacterEngineSkillDefinition =
  {
    skillId: 'swift-stride',
    displayName: 'Swift Stride',
    iconName: 'mdi:run-fast',
    cooldownMs: 15_000,
    effect: { kind: 'apply_buff', buffId: 'swift-stride-buff' },
  };

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_HEAT_WARD: DefiningWorldPlazaCharacterEngineSkillDefinition =
  {
    skillId: 'heat-ward',
    displayName: 'Heat Ward',
    iconName: 'mdi:fire-off',
    cooldownMs: 20_000,
    effect: { kind: 'apply_buff', buffId: 'heat-immunity-buff' },
  };

/** All registered character skills keyed by skill id. */
export const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_REGISTRY: Record<
  string,
  DefiningWorldPlazaCharacterEngineSkillDefinition
> = {
  'minor-heal': DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_MINOR_HEAL,
  'swift-stride': DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_SWIFT_STRIDE,
  'heat-ward': DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_HEAT_WARD,
};

/**
 * Resolves a skill definition by id.
 */
export function resolvingWorldPlazaCharacterEngineSkillDefinition(
  skillId: string
): DefiningWorldPlazaCharacterEngineSkillDefinition | null {
  return DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_SKILL_REGISTRY[skillId] ?? null;
}
