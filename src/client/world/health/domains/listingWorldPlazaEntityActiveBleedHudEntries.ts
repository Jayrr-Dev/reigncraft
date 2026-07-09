import {
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY,
  type DefiningWorldPlazaEntityBleedSeverity,
} from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { resolvingWorldPlazaEntityBleedStackEscalationThreshold } from '@/components/world/health/domains/resolvingWorldPlazaEntityBleedStackEscalationThreshold';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';
import { computingWorldPlazaEntityEffectRemainingSeconds } from '@/components/world/health/domains/resolvingWorldPlazaEntityEffectCountdownNowMs';

export type DefiningWorldPlazaEntityActiveBleedHudEntry = {
  id: string;
  severity: DefiningWorldPlazaEntityBleedSeverity;
  label: string;
  description: string;
  icon: MappingWorldPlazaEntityHealthFloatTextIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  expiresAtMs: number;
  remainingBleedDamage: number;
  stackCount: number;
  stackEscalationThreshold: number | null;
};

/**
 * Lists active bleed debuff HUD entries.
 */
export function listingWorldPlazaEntityActiveBleedHudEntries({
  state,
  nowMs,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
}): DefiningWorldPlazaEntityActiveBleedHudEntry[] {
  return state.bleedEffects
    .filter(
      (effect) => effect.expiresAtMs > nowMs && effect.remainingBleedDamage > 0
    )
    .map((effect) => {
      const descriptor =
        DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY[effect.severity];

      return {
        id: effect.id,
        severity: effect.severity,
        label:
          effect.stackCount > 1
            ? `${descriptor.label} x${effect.stackCount}`
            : descriptor.label,
        description: descriptor.description,
        icon: descriptor.floatIcon,
        hudIconColorClassName: descriptor.hudIconColorClassName,
        hudIconBorderClassName: descriptor.hudIconBorderClassName,
        expiresAtMs: effect.expiresAtMs,
        remainingBleedDamage: effect.remainingBleedDamage,
        stackCount: effect.stackCount,
        stackEscalationThreshold: resolvingWorldPlazaEntityBleedStackEscalationThreshold(
          effect.severity
        ),
      };
    });
}

/**
 * Computes whole seconds remaining for a timed bleed HUD entry.
 * Routes through the shared clock picker for wall vs simulation stamps.
 */
export function computingWorldPlazaEntityBleedHudRemainingSeconds(
  expiresAtMs: number,
  nowMs: number
): number {
  return computingWorldPlazaEntityEffectRemainingSeconds(expiresAtMs, nowMs);
}
