'use client';

import { applyingWorldPlazaCharacterEngineSkill } from '@/components/world/character/domains/applyingWorldPlazaCharacterEngineSkill';
import { resolvingWorldPlazaCharacterEngineSkillDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineSkillRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { useCallback, useRef } from 'react';

export type UsingWorldPlazaCharacterEngineSkillCooldownEntry = {
  readonly skillId: string;
  readonly remainingMs: number;
};

/**
 * Tracks per-skill cooldowns and executes skills against health state.
 */
export function usingWorldPlazaCharacterEngineSkillCooldowns(
  healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>
) {
  const cooldownUntilMsBySkillIdRef = useRef<Map<string, number>>(new Map());

  const tryUsingSkill = useCallback(
    (skillId: string, nowMs: number): boolean => {
      const skill = resolvingWorldPlazaCharacterEngineSkillDefinition(skillId);

      if (!skill) {
        return false;
      }

      const cooldownUntilMs =
        cooldownUntilMsBySkillIdRef.current.get(skillId) ?? 0;

      if (nowMs < cooldownUntilMs) {
        return false;
      }

      const currentState = healthStateRef.current;

      if (!currentState) {
        return false;
      }

      const result = applyingWorldPlazaCharacterEngineSkill(
        currentState,
        skillId,
        nowMs
      );

      if (!result.didApply) {
        return false;
      }

      healthStateRef.current = result.state;
      cooldownUntilMsBySkillIdRef.current.set(
        skillId,
        nowMs + skill.cooldownMs
      );

      return true;
    },
    [healthStateRef]
  );

  const listingSkillCooldowns = useCallback(
    (
      nowMs: number
    ): readonly UsingWorldPlazaCharacterEngineSkillCooldownEntry[] => {
      const entries: UsingWorldPlazaCharacterEngineSkillCooldownEntry[] = [];

      for (const [
        skillId,
        cooldownUntilMs,
      ] of cooldownUntilMsBySkillIdRef.current) {
        entries.push({
          skillId,
          remainingMs: Math.max(0, cooldownUntilMs - nowMs),
        });
      }

      return entries;
    },
    []
  );

  const resettingSkillCooldowns = useCallback((): void => {
    cooldownUntilMsBySkillIdRef.current.clear();
  }, []);

  return {
    tryUsingSkill,
    listingSkillCooldowns,
    resettingSkillCooldowns,
  };
}
