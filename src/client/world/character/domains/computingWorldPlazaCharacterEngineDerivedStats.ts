/**
 * Derives effective character stats from a declarative definition.
 *
 * @module components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats
 */

import { DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_ATTACK_POWER,
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_DEFENSE,
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_EFFECTIVE_MAX_HEALTH,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineGrowthLaneConstants';
import type {
  ComputingWorldPlazaCharacterEngineDerivedStats,
  DefiningWorldPlazaCharacterEngineDefinition,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_RUN_SPEED_PER_SECOND,
  DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_WALK_SPEED_PER_SECOND,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import { resolvingWorldPlazaScaledAttackSpeed } from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_PER_SECOND } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';

function computingWorldPlazaCharacterEngineLevelBonus(
  perLevel: number,
  level: number,
  growthLaneLevelOffset: number
): number {
  return perLevel * (Math.max(1, level) - 1 + growthLaneLevelOffset);
}

/**
 * Returns effective stats for one character definition.
 */
export function computingWorldPlazaCharacterEngineDerivedStats(
  definition: DefiningWorldPlazaCharacterEngineDefinition
): ComputingWorldPlazaCharacterEngineDerivedStats {
  const { scaling, size, vitals, stats, locomotion, immunities } = definition;
  const level = Math.max(1, scaling.level);
  const growthLaneLevelOffset = scaling.growthLaneLevelOffset ?? 0;
  const sizeScale = Math.max(0.1, size.sizeScale);

  return {
    level,
    effectiveMaxHealth: Math.max(
      DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_EFFECTIVE_MAX_HEALTH,
      vitals.baseMaxHealth +
        computingWorldPlazaCharacterEngineLevelBonus(
          scaling.healthPerLevel,
          level,
          growthLaneLevelOffset
        )
    ),
    attackPower: Math.max(
      DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_ATTACK_POWER,
      stats.attackPower +
        computingWorldPlazaCharacterEngineLevelBonus(
          scaling.attackPerLevel,
          level,
          growthLaneLevelOffset
        )
    ),
    attackSpeed: resolvingWorldPlazaScaledAttackSpeed(
      Math.max(0.25, stats.attackSpeed)
    ),
    defense: Math.max(
      DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_DEFENSE,
      stats.defense +
        computingWorldPlazaCharacterEngineLevelBonus(
          scaling.defensePerLevel,
          level,
          growthLaneLevelOffset
        )
    ),
    sizeScale,
    heightWorldLayers:
      size.heightWorldLayers ??
      DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS * sizeScale,
    collisionRadiusGrid:
      size.collisionRadiusGrid ??
      DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID * sizeScale,
    walkSpeedGridPerSecond:
      locomotion.walkSpeedGridPerSecond ??
      DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_WALK_SPEED_PER_SECOND,
    runSpeedGridPerSecond:
      locomotion.runSpeedGridPerSecond ??
      DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_RUN_SPEED_PER_SECOND,
    jumpDistanceScale: locomotion.jumpDistanceScale ?? 1,
    healthRegenPerSecond:
      vitals.healthRegenPerSecond ??
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_PER_SECOND,
    hungerDrainMultiplier: stats.hungerDrainMultiplier,
    isLavaWalkable: immunities.includes('lava'),
  };
}

/**
 * Converts a grid-units-per-second walk/run speed to screen pixels per second.
 */
export function convertingWorldPlazaCharacterEngineGridSpeedToScreenSpeedPerSecond(
  gridSpeedPerSecond: number
): number {
  return (
    gridSpeedPerSecond *
    Math.SQRT2 *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX
  );
}
