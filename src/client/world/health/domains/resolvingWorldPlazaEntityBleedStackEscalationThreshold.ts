import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_BLEEDING_COUNT,
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_HEMORRHAGING_COUNT,
} from '@/components/world/health/domains/definingWorldPlazaEntityBleedStackConstants';

/**
 * Returns the stack count required to escalate this bleed severity, if any.
 */
export function resolvingWorldPlazaEntityBleedStackEscalationThreshold(
  severity: DefiningWorldPlazaEntityBleedSeverity
): number | null {
  if (severity === 'bleeding') {
    return DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_BLEEDING_COUNT;
  }

  if (severity === 'hemorrhaging') {
    return DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_HEMORRHAGING_COUNT;
  }

  return null;
}
