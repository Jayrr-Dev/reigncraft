/**
 * Declarative character engine types for plaza avatars, NPCs, and mobs.
 *
 * @module components/world/character/domains/definingWorldPlazaCharacterEngineTypes
 */

import type { DefiningWorldPlazaAvatarMotionKind } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

/** Unique character definition id (typically matches skin id for player skins). */
export type DefiningWorldPlazaCharacterEngineId = string;

/** Environmental / status immunities granted at spawn. */
export type DefiningWorldPlazaCharacterEngineImmunity =
  | 'heat'
  | 'cold'
  | 'poison'
  | 'bleed'
  | 'fall'
  | 'lava';

/** Declarative character definition consumed by movement, health, and rendering. */
export type DefiningWorldPlazaCharacterEngineDefinition = {
  readonly characterId: DefiningWorldPlazaCharacterEngineId;
  readonly displayName: string;
  readonly presentation: {
    readonly skinId: DefiningWorldPlazaAvatarSkinId;
  };
  readonly size: {
    /** 1 = normal. Multiplies sprite scale, ground shadow, lava cover, collision. */
    readonly sizeScale: number;
    /** Defaults to base player world-layer height × sizeScale when omitted. */
    readonly heightWorldLayers?: number;
    /** Defaults to base player radius × sizeScale when omitted. */
    readonly collisionRadiusGrid?: number;
  };
  readonly locomotion: {
    readonly allowedMotionKinds: readonly DefiningWorldPlazaAvatarMotionKind[];
    readonly walkSpeedGridPerSecond?: number;
    readonly runSpeedGridPerSecond?: number;
    readonly jumpDistanceScale?: number;
  };
  readonly vitals: {
    readonly baseMaxHealth: number;
    readonly healthRegenPerSecond?: number;
  };
  /**
   * Body mass in kilograms. Animals inherit wildlife `massKg`; Girl defaults
   * to the shared player reference mass when omitted.
   */
  readonly massKg?: number;
  readonly stats: {
    readonly attackPower: number;
    /** Multiplier on baseline melee swing speed (1 = default strip timing). */
    readonly attackSpeed: number;
    readonly defense: number;
    readonly hungerDrainMultiplier: number;
  };
  readonly scaling: {
    readonly level: number;
    readonly healthPerLevel: number;
    readonly attackPerLevel: number;
    readonly defensePerLevel: number;
    /**
     * Added to `(level − 1)` before per-level bonuses.
     * Unlocked animal transforms use −20 so catalog numbers are mature/parity
     * targets reached at level 21. Omit or 0 for full-power baselines (Girl).
     */
    readonly growthLaneLevelOffset?: number;
  };
  readonly immunities: readonly DefiningWorldPlazaCharacterEngineImmunity[];
  /**
   * Innate ambient comfort band (°C). When omitted, uses the global human
   * default (0–40) unless a matching wildlife species comfort entry exists.
   */
  readonly temperatureComfort?: {
    readonly comfortLowCelsius: number;
    readonly comfortHighCelsius: number;
  };
  readonly startingStatusEffectIds: readonly string[];
  readonly skillIds: readonly string[];
};

/** Effective stats after level scaling. */
export type ComputingWorldPlazaCharacterEngineDerivedStats = {
  readonly level: number;
  readonly effectiveMaxHealth: number;
  readonly attackPower: number;
  readonly attackSpeed: number;
  readonly defense: number;
  readonly sizeScale: number;
  readonly heightWorldLayers: number;
  readonly collisionRadiusGrid: number;
  readonly walkSpeedGridPerSecond: number;
  readonly runSpeedGridPerSecond: number;
  readonly jumpDistanceScale: number;
  readonly healthRegenPerSecond: number;
  readonly hungerDrainMultiplier: number;
  readonly massKg: number;
  readonly isLavaWalkable: boolean;
};
