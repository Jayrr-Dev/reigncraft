/**
 * Resolves the active frostbite stage from stack count.
 *
 * @module components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY,
  type DefiningWorldPlazaEntityFrostbiteStageDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';
import { formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine } from '@/components/world/health/domains/computingWorldPlazaFrostbiteSpeedMovementMultiplier';
import { formattingWorldPlazaFrostbiteStaminaRegenSlowHudEffectLine } from '@/components/world/health/domains/computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier';

/**
 * Highest stage whose minStacks is at or below stackCount, or null below Chilled.
 */
export function resolvingWorldPlazaEntityFrostbiteStage(
  stackCount: number
): DefiningWorldPlazaEntityFrostbiteStageDescriptor | null {
  let matched: DefiningWorldPlazaEntityFrostbiteStageDescriptor | null = null;

  for (const stage of DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY) {
    if (stackCount >= stage.minStacks) {
      matched = stage;
    }
  }

  return matched;
}

/**
 * Every stage reached at this stack count (ascending), for inherited effects.
 */
export function listingWorldPlazaEntityFrostbiteStagesReached(
  stackCount: number
): readonly DefiningWorldPlazaEntityFrostbiteStageDescriptor[] {
  return DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY.filter(
    (stage) => stackCount >= stage.minStacks
  );
}

/**
 * Maps a HUD effect line to an overlapping-stat family, or null if unique.
 * Inherited popovers keep the harshest line per family (from the highest stage
 * that defines it) plus unique lines from earlier tiers.
 */
function resolvingWorldPlazaEntityFrostbiteHudEffectLineFamily(
  line: string
): string | null {
  if (/slower walking|slower movement/.test(line)) {
    return null;
  }

  if (/less max stamina/.test(line)) {
    return 'stamina_max';
  }

  if (/slower stamina regen/.test(line)) {
    return null;
  }

  if (/shorter jump|Cannot jump/.test(line)) {
    return 'jump';
  }

  if (/less damage dealt/.test(line)) {
    return 'outgoing_damage';
  }

  if (/frost damage/.test(line)) {
    return 'frost_damage';
  }

  if (/^Confusion$/.test(line)) {
    return 'confusion';
  }

  if (/Sleep spells/.test(line)) {
    return 'sleep';
  }

  if (/Cannot heal/.test(line)) {
    return 'heal_block';
  }

  if (/Cannot move|Frozen solid/.test(line)) {
    return 'immobilize';
  }

  return null;
}

/**
 * Cumulative HUD effect lines from all reached stages.
 * Overlapping stats keep the highest-tier line only; unique prior effects stay.
 */
export function listingWorldPlazaEntityFrostbiteInheritedHudEffectLines(
  stackCount: number
): readonly string[] {
  const reached = listingWorldPlazaEntityFrostbiteStagesReached(stackCount);
  const activeStage = resolvingWorldPlazaEntityFrostbiteStage(stackCount);
  const familyLineById = new Map<string, string>();
  const uniqueLines: string[] = [];
  const seenUnique = new Set<string>();

  for (const stage of reached) {
    for (const line of stage.hudEffectLines) {
      const family = resolvingWorldPlazaEntityFrostbiteHudEffectLineFamily(line);

      if (family !== null) {
        familyLineById.set(family, line);
        continue;
      }

      if (seenUnique.has(line)) {
        continue;
      }

      seenUnique.add(line);
      uniqueLines.push(line);
    }
  }

  const familyOrder = [
    'stamina_max',
    'jump',
    'outgoing_damage',
    'frost_damage',
    'confusion',
    'sleep',
    'heal_block',
    'immobilize',
  ] as const;

  const lines: string[] = [];

  if (activeStage?.forcesImmobilize !== true) {
    const speedLine = formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(stackCount);

    if (speedLine !== null) {
      lines.push(speedLine);
    }

    const staminaRegenLine =
      formattingWorldPlazaFrostbiteStaminaRegenSlowHudEffectLine(stackCount);

    if (staminaRegenLine !== null) {
      lines.push(staminaRegenLine);
    }
  }

  for (const family of familyOrder) {
    const line = familyLineById.get(family);

    if (line !== undefined) {
      lines.push(line);
    }
  }

  lines.push(...uniqueLines);

  return lines;
}
